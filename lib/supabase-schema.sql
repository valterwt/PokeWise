-- PokeWise Database Schema
-- Run this in your Supabase SQL editor

-- Users table (extends Supabase auth.users)
create table if not exists public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  email text unique not null,
  avatar text,
  created_at timestamptz default now() not null
);

alter table public.users enable row level security;

create policy "Users can view all profiles" on public.users
  for select using (true);

create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.users
  for insert with check (auth.uid() = id);

-- Cards table
create table if not exists public.cards (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  card_name text not null,
  front_image_url text not null,
  back_image_url text,
  created_at timestamptz default now() not null
);

alter table public.cards enable row level security;

create policy "Cards are viewable by everyone" on public.cards
  for select using (true);

create policy "Users can insert own cards" on public.cards
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own cards" on public.cards
  for delete using (auth.uid() = user_id);

-- Grades table
create table if not exists public.grades (
  id uuid default gen_random_uuid() primary key,
  card_id uuid references public.cards(id) on delete cascade not null unique,
  overall numeric(3,1) not null,
  centering numeric(3,1) not null,
  corners numeric(3,1) not null,
  edges numeric(3,1) not null,
  surface numeric(3,1) not null,
  summary text not null,
  recommendation text not null,
  created_at timestamptz default now() not null
);

alter table public.grades enable row level security;

create policy "Grades are viewable by everyone" on public.grades
  for select using (true);

create policy "Service role can insert grades" on public.grades
  for insert with check (true);

-- Newsletter posts table
create table if not exists public.newsletter (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  body text not null,
  before_image_url text,
  after_image_url text,
  published_at timestamptz default now() not null
);

alter table public.newsletter enable row level security;

create policy "Newsletter is viewable by everyone" on public.newsletter
  for select using (true);

-- Subscribers table
create table if not exists public.subscribers (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  subscribed_at timestamptz default now() not null
);

alter table public.subscribers enable row level security;

create policy "Subscribers can insert own email" on public.subscribers
  for insert with check (true);

-- User credits / subscription table
create table if not exists public.user_credits (
  user_id               uuid references public.users(id) on delete cascade primary key,
  free_grades_used      int  default 0 not null,
  paid_credits          int  default 0 not null,
  stripe_customer_id    text,
  stripe_subscription_id text,
  subscription_status   text default 'none' not null, -- 'none' | 'active' | 'cancelled'
  updated_at            timestamptz default now() not null
);

alter table public.user_credits enable row level security;

create policy "Users can view own credits" on public.user_credits
  for select using (auth.uid() = user_id);

create policy "Service role can manage credits" on public.user_credits
  for all using (true);

-- RPC: atomically add paid credits
create or replace function add_grade_credits(p_user_id uuid, p_credits int)
returns void language plpgsql security definer as $$
begin
  insert into public.user_credits (user_id, paid_credits)
  values (p_user_id, p_credits)
  on conflict (user_id) do update
    set paid_credits = public.user_credits.paid_credits + p_credits,
        updated_at   = now();
end;
$$;

-- RPC: consume one grade credit (returns false if no credits available)
create or replace function consume_grade_credit(p_user_id uuid)
returns boolean language plpgsql security definer as $$
declare
  v_row public.user_credits%rowtype;
begin
  select * into v_row from public.user_credits where user_id = p_user_id for update;

  -- Pro subscriber: unlimited
  if v_row.subscription_status = 'active' then
    return true;
  end if;

  -- Has paid credits
  if v_row.paid_credits > 0 then
    update public.user_credits
      set paid_credits = paid_credits - 1, updated_at = now()
      where user_id = p_user_id;
    return true;
  end if;

  -- Free tier (3 grades)
  if v_row.free_grades_used < 3 then
    update public.user_credits
      set free_grades_used = free_grades_used + 1, updated_at = now()
      where user_id = p_user_id;
    return true;
  end if;

  -- First time user — create row and use first free grade
  if v_row.user_id is null then
    insert into public.user_credits (user_id, free_grades_used)
    values (p_user_id, 1)
    on conflict (user_id) do nothing;
    return true;
  end if;

  return false;
end;
$$;

-- Storage bucket for card images
insert into storage.buckets (id, name, public)
values ('cards', 'cards', true)
on conflict do nothing;

create policy "Anyone can view card images" on storage.objects
  for select using (bucket_id = 'cards');

create policy "Authenticated users can upload card images" on storage.objects
  for insert with check (bucket_id = 'cards' and auth.role() = 'authenticated');

-- Seed newsletter with sample data
insert into public.newsletter (title, body, before_image_url, after_image_url, published_at)
values
  (
    'Week 1 — First Attempt: Steam Treatment on a Bent Charizard',
    'This week we tried our first restoration attempt using a steam iron method on a heavily bent Base Set Charizard. The card had significant warping along the top edge — a common issue with cards stored improperly for decades. We used a low-heat iron with a damp cloth barrier and achieved about 70% improvement. The warp reduced significantly but a slight curve remains. Surface was not damaged. Grade improved from 4.2 to 6.1 according to the AI. We will try a weighted press method next week to push further.',
    null,
    null,
    now() - interval '7 days'
  ),
  (
    'Week 2 — Weighted Press Results and Edge Cleaning',
    'Following up from last week''s steam treatment — we placed the Charizard under 10kg of books for 5 days at room temperature. The results were better than expected: the remaining curve is almost gone. Separately we tested a soft microfiber edge cleaning technique on a scratched Blastoise. Light circular motions with a lens cloth removed surface oxidation but did not affect the deeper scratches. Grades: Charizard moved from 6.1 to 7.4. Blastoise from 3.8 to 4.5. Lesson: edge cleaning works on oxidation, not scratches.',
    null,
    null,
    now() - interval '3 days'
  ),
  (
    'Week 3 — Failure Report: Acetone Attempt Gone Wrong',
    'Honest failure report this week. We attempted to use diluted acetone to remove a stubborn sticker residue from a 1st Edition Venusaur surface. The result was immediate surface damage — the acetone stripped part of the card''s finish and left a dull patch. This technique should never be used on Pokémon cards. The card is now ungraduable from a surface perspective. We are documenting this so no one else makes the same mistake. Some restorations are not worth attempting if the risk of further damage is high.',
    null,
    null,
    now()
  );
