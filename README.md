# PokeWise
AI grading and full community for PokeWise.

---

## Setup Guide

Follow these steps to get PokeWise running locally.

---

### Step 1 — Install Node.js
Download and install Node.js (v18 or higher) from [nodejs.org](https://nodejs.org).

Verify installation:
```bash
node -v
npm -v
```

---

### Step 2 — Clone the repository
```bash
git clone https://github.com/valterwt/PokeWise.git
cd PokeWise
```

---

### Step 3 — Install dependencies
```bash
npm install
```

---

### Step 4 — Get your Anthropic API key
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign in or create a free account
3. In the left sidebar, click **API Keys**
4. Click **Create Key**, give it a name (e.g. `pokewise-dev`)
5. Copy the key — it starts with `sk-ant-...`

> Keep this key safe. Never share it or commit it to version control.

---

### Step 5 — Pokémon TCG API key (optional)
The Pokémon TCG API works without an API key. You can skip this step entirely and the app will still function — you just get a lower rate limit (100 requests/day vs 20,000/day with a key).

**To use it without a key:** leave `POKEMON_TCG_API_KEY` out of your `.env.local` file entirely.

**If you do want a key later:**
1. Go to [pokemontcg.io](https://pokemontcg.io)
2. Click **Sign Up** and create an account
3. After logging in, go to your dashboard and copy your **API Key**

> For local development and testing, skipping the key is the easiest option.

---

### Step 6 — Create your environment file
In the root of the project, create a file named `.env.local`:
```bash
touch .env.local
```

---

### Step 7 — Add your API keys to `.env.local`
Open `.env.local` and add the following:
```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
# POKEMON_TCG_API_KEY=your-pokemon-tcg-key-here  ← optional, remove the # if you have one
```

Only `ANTHROPIC_API_KEY` is required. The Pokémon TCG key can be left out.

---

### Step 8 — Verify `.env.local` is in `.gitignore`
Make sure your `.env.local` file is listed in `.gitignore` so your keys are never committed:
```
.env.local
```

---

### Step 9 — Run the project
```bash
npm run dev
```

Then open your browser and go to:
```
http://localhost:3000
```

---

### Step 10 — Create an account
Once the app loads:
1. Click **Sign Up** in the top right corner
2. Enter your email and a password
3. Confirm your email if prompted

---

### Step 11 — Navigate to Restoring Cards Daily
From the main navigation, click **Restoring Cards Daily**.

This section is your day-to-day hub for card restoration — a living log of techniques, experiments, and honest results from real restorers in the community.

---

### Step 12 — Subscribe to the Weekly Letter
The **Weekly Letter** is a curated digest sent every week covering everything that happened in the Restoring Cards Daily section that week.

To subscribe:
1. Click **Subscribe to Weekly Letter** on the Restoring Cards Daily page
2. Enter your email address
3. Choose your digest preference — **Full** (everything) or **Highlights only**
4. Click **Subscribe**

You will receive your first letter at the end of the current week.

---

### Step 13 — Read this week's letter
Each weekly letter is also published on-site so you can browse past issues without needing to be subscribed.

From the Restoring Cards Daily page:
1. Click **Weekly Letters** in the sidebar
2. Select the current week's issue (shown at the top)
3. Each letter is broken into sections:

| Section | What it covers |
|---|---|
| **This Week's Topic** | The focused restoration method or card type the community worked on |
| **New Methods Tried** | Techniques tested for the first time — what was used and how |
| **Results & Grades** | Before/after comparisons with AI grading scores |
| **Failures & Lessons** | Honest write-ups of what didn't work and why |
| **Community Picks** | Top restorations voted on by the community this week |
| **Next Week's Focus** | A preview of the upcoming topic so you can prepare |

---

### Step 14 — Log your own restoration
1. On the Restoring Cards Daily page, click **Log a Restoration**
2. Upload before and after photos of your card
3. Fill in:
   - **Method used** (e.g. steam treatment, surface clean, sleeve press)
   - **Products used** (brands, tools)
   - **Time taken**
   - **Your notes** — what worked, what didn't, what you'd do differently
4. Click **Submit** — your log will be reviewed and may be featured in that week's letter

---

### Step 15 — Submit a Pokémon card for AI grading
1. From the home page, click **Grade a Card**
2. Search for your card by name (e.g. `Charizard`) or upload an image
3. Select the correct card from the results
4. Click **Submit for Grading**

The AI will return:
- **Condition grade** (e.g. Mint, Near Mint, Lightly Played)
- **Estimated value range**
- **Detailed notes** on wear, centering, and surface quality

---

### Step 16 — Explore the community
- Browse other users' graded and restored cards in the **Community Feed**
- Follow collectors and restoration enthusiasts
- Comment on logs and weekly letters
- Compare your collection with the community leaderboard

---

### Step 17 — Add cards to your collection
1. After grading, click **Add to Collection**
2. Your card will appear in your personal **Collection** page
3. Track your collection's total estimated value over time

---

## Environment Variables Reference

| Variable | Description | Where to get it |
|---|---|---|
| `ANTHROPIC_API_KEY` | Claude AI API key for card grading | [console.anthropic.com](https://console.anthropic.com) |
| `POKEMON_TCG_API_KEY` | Pokémon TCG card database | [pokemontcg.io](https://pokemontcg.io) |

---

## Troubleshooting

**App won't start / missing environment variables**
Make sure `.env.local` exists in the project root and contains both API keys.

**AI grading returns an error**
Double-check your `ANTHROPIC_API_KEY` is correct and has not expired or been revoked.

**Card not found in search**
Try a different spelling or use the card set number. The Pokémon TCG database may not have every card.

---

## License
See [LICENSE](./LICENSE).
