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

### Step 5 — Get your Pokémon TCG API key
1. Go to [pokemontcg.io](https://pokemontcg.io)
2. Click **Sign Up** and create an account
3. After logging in, go to your dashboard and copy your **API Key**

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
POKEMON_TCG_API_KEY=your-pokemon-tcg-key-here
```

Replace the placeholder values with your actual keys.

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

### Step 11 — Submit a Pokémon card for grading
1. From the home page, click **Grade a Card**
2. Search for your card by name (e.g. `Charizard`) or upload an image
3. Select the correct card from the results
4. Click **Submit for Grading**

---

### Step 12 — View the AI grading results
After submission, the AI will analyze your card and return:
- **Condition grade** (e.g. Mint, Near Mint, Lightly Played)
- **Estimated value range**
- **Detailed notes** on wear, centering, and surface quality

---

### Step 13 — Explore the community
- Browse other users' graded cards in the **Community Feed**
- Follow collectors and comment on submissions
- Compare your collection with the community leaderboard

---

### Step 14 — Add cards to your collection
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
