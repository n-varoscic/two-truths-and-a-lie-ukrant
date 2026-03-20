# Two Truths and a Lie - UKrant Edition

An interactive browser-based quiz game built around real headlines from [UKrant](https://ukrant.nl/?lang=en), the independent newspaper of the University of Groningen. Players are shown three headlines - two real, one fabricated - and must identify the lie.

---

## 📄 Project description

This project scrapes article headlines from UKrant across two categories: **news** and **background**. The scraped headlines are saved to a JSON file. A second JSON file contains fabricated headlines generated to match the style and tone of each category. The game loads both files and presents players with three headlines per round - two real, one fake - across 10 rounds.

---

## 📦 Dependencies

To run the web scraping code, make sure you have Python 3.8 or higher installed. Then install the required packages:

```bash
pip install -r requirements.txt
```

> Chrome must be installed on your machine — the scraper uses ChromeDriver via `webdriver-manager`, which downloads the correct driver automatically.

---

## 📁 Repository structure

```
TWO-TRUTHS-AND-A-LIE-UKRANT/
├── data/
│   ├── ukrant_headlines.json         # Real scraped headlines (news + background)
│   └── ukrant_fake_headlines.json    # Fabricated headlines (news + background)
├── static/
│   ├── game.js                       # All game logic
│   └── style.css                     # All styling
├── web_scraping/
│   ├── __init__.py
│   └── scrape.py                     # Scraping logic as a reusable module
├── ukrant_quiz.html                  # Game UI (structure only)
├── app.py                            # Local server to serve the game
├── run_ukrant_scraping.ipynb         # Notebook to run the scraper
├── requirements.txt                  # Requirements to run the scraping code
└── README.md
```

### Modules

#### Web Scraping (`web_scraping/scrape.py`)
Purpose: Scrapes headlines from the UKrant website using Selenium and BeautifulSoup.

- `scrape_ukrant_category(url, category)`: Scrapes all headlines from a given UKrant category page.
  - Input: `url` (the category page URL), `category` (string label, either `"news"` or `"background"`)
  - Output: List of dictionaries with `title`, `url`, and `category`
  - Automatically clicks "Load More" until all articles on the page are loaded before scraping

#### Game Logic (`static/game.js`)
Purpose: Loads headline data and runs the quiz game in the browser.

- Fetches both JSON files on page load
- `loadRound()`: Picks 2 real and 1 fake headline, shuffles them, and renders the cards
- `guess(index)`: Handles player input, reveals correct/incorrect answers, updates score and streak
- `nextRound()`: Advances to the next round or triggers the end screen
- `showEndScreen()`: Displays the final score and rating
- `resetGame()`: Resets all state and starts a new game

### Notebooks

- `run_ukrant_scraping.ipynb` → Runs the scraping modules and saves output to `data/ukrant_headlines.json`

### Data files

| File | Description |
|------|-------------|
| `data/ukrant_headlines.json` | Real headlines scraped from ukrant.nl |
| `data/ukrant_fake_headlines.json` | ~970 fabricated headlines, created using claude.ai |

Both files share the same structure:

```json
[
  {
    "title": "Headline text here",
    "url": "https://ukrant.nl/...",
    "category": "news"
  }
]
```

> The `url` field is omitted from fake headlines since they are fabricated.

---

## 🚀 How to run the game

The game loads data via `fetch()`, so it must be served through a local server.

1. Open a terminal in the project root folder
2. Run:

```bash
python app.py
```

3. The game will open automatically in your browser at `http://localhost:8000`
4. Press `Ctrl+C` in the terminal to stop the server

> If the browser does not open automatically, navigate to `http://localhost:8000/ukrant_quiz.html` manually.

---

## 🔄 How to re-run the scraper

If you want to refresh the real headlines with the latest articles from UKrant:

1. Open `run_ukrant_scraping.ipynb`
2. Run all cells
3. This will overwrite `data/ukrant_headlines.json` with freshly scraped headlines

> The fake headlines file (`data/ukrant_fake_headlines.json`) is static and does not need to be regenerated when re-scraping.

---

## 🎮 How to play

- Each round shows three headlines — two real, one fake
- Click the headline you think is the lie
- The game reveals which headlines were true and which one was fake
- The game continues for 10 rounds, after which you receive a final score and a rating
- Use **Next Round** to continue and **Start Over** to reset at any time
