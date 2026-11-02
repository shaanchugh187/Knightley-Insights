# Knightly Analytics

*Think Smarter. Play Better.*

Chess game analytics that runs entirely in your browser. Upload or paste PGN files (Lichess, Chess.com or any standard export), or import a public Lichess account by username, and explore how you actually perform.

<!-- ADD AFTER DEPLOYING: **Live demo:** https://your-app.vercel.app -->
<!-- ADD: a screenshot of your OWN real stats, e.g. ![Dashboard](docs/screenshot.png) -->

## What it shows

- **Results** by colour, time control, opponent rating and how games end (mate, resignation, timeout, draw)
- **Win rate and score**, both shown, because win rate alone makes a draw look like a loss
- **Opening performance** with click-to-drill-down: pick an opening and every chart filters to it
- **Rating history** per time control. Bullet, blitz and rapid are separate rating scales and are never merged
- **Filters** for time control, colour, result, date range and rated games
- **CSV export** of the filtered games

## Privacy

There is no server, no account and no tracking. Games are parsed in the browser and stored in IndexedDB on your device. Nothing is uploaded anywhere. The optional Lichess import reads only public games through Lichess's public API and never asks for a password or token.

## Tech stack

React 19, TypeScript, Vite, Tailwind CSS 4, Recharts, Dexie (IndexedDB), Lucide icons, Vitest.

## Run it locally

```bash
npm install
npm run dev      # development server
npm test         # 31 unit tests
npm run build    # production build in dist/
```

## How it works

```
PGN text / Lichess API  ->  Game objects  ->  IndexedDB  ->  filters  ->  stats functions  ->  charts
```

Every source is converted into one small `Game` shape, so adding a new importer never touches the statistics or the charts.

| File | Job |
|---|---|
| `src/analytics/types.ts` | The `Game` and `Filters` shapes everything shares |
| `src/analytics/pgn.ts` | Splits multi-game PGN, reads headers, guesses which player is you |
| `src/analytics/lichess.ts` | Streams games from the public Lichess export (NDJSON) |
| `src/analytics/stats.ts` | All statistics as pure functions with no React or network code |
| `src/analytics/storage.ts` | Saves games in the browser, de-duplicated by game id |
| `src/components/` | Import panels, filters, charts, opening table |

## Design decisions

- **Local-first, no backend.** Analytics needs the user's games, not a server. Keeping everything in the browser makes it private by construction and free to host.
- **Pure, tested statistics.** `stats.ts` and `pgn.ts` have no side effects, which is why they are covered by unit tests (31 in total).
- **No misleading numbers.** Groups with fewer than 5 games are marked "low sample" instead of showing a confident percentage.
- **Relative opponent bands.** Opponents are grouped by how they compare with your rating at the time ("within 100 points"), which is more meaningful than absolute rating buckets.
- **Speed from time control.** Speed is derived as base seconds + 40 x increment, which follows Lichess's classification.
- **Duplicates are impossible by design.** The Lichess game id is the storage key, so importing the same game twice, even once by PGN and once by username, keeps one copy.

## Definitions

- **Win rate** = wins / games
- **Score** = (wins + 0.5 x draws) / games
- **Game length** is counted in full moves from the main line of the PGN, ignoring comments, variations and annotations

## Known limitations

- Chess.com PGNs contain an ECO code but no opening name, so their openings appear as "Unknown opening".
- Chess.com PGNs do not say whether a game was rated, so every game counts as rated unless the Event says "casual".
- Games need a date, both ratings, a result and a time control. Other games are skipped, and the app reports how many and why.
- Only standard chess from the normal starting position is supported.

## Roadmap

Planned, not implemented:

- Accuracy, average centipawn loss and blunder counts, using Stockfish running in the browser
- Tactical and endgame performance breakdowns

## License

Add a license file before sharing the code publicly. MIT is a common choice for portfolio projects.
