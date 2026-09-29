# Soccer Event Analysis

An interactive Financial Data Analytics project about domestic soccer match events from Germany, England, France, Italy, and Spain.

## What is in the site?

- `index.html` is the scrollable report with headline numbers, findings, methods, and charts.
- `dashboard.html` is the filterable dashboard. It loads `data/player_season_stats.csv` in the browser.
- `assets/styles.css` contains the shared visual design.
- `assets/site.js` contains the shared CSV loader, calculations, report charts, hover tooltips, scroll reveals, goal-location pitch, and dashboard behavior.
- `assets/badges/` contains the locally stored league and club crests used in charts, tables, the scorer timeline, and the club-styled goal shirts.
- `scripts/build_data.py` creates the browser-ready player-season file from the source event files.
- `data/player_season_stats.csv` is a derived file: one row per player, team, league, and season.

## Source data

The source files are the soccer event database in the course workspace:

- `ginf.csv`: one row per match, including date, season, league, country, teams, final score, and odds.
- `events.csv`: one row per recorded match event, including shots, goals, corners, fouls, cards, and substitutions.
- `dictionary.txt`: codebook for event and shot categories.

The two source files join on `id_odsp`. The published browser file aggregates the event rows by player, team, league, and season. It counts recorded events rather than claiming to be an official appearance database. The `assists` field counts recorded goal attempts with a nonmissing assisting player in `player2`. It also includes coded goal methods, goal locations, finishing rate, and shots-on-target rate.

The source covers six seasons from 2011–2017 and five domestic leagues. The assignment requires at least five periods, so this data qualifies on the stated rubric, but it is not a 20-year source. No rows are silently dropped except events with a missing/`NA` player or missing match join.

The scorer timeline breaks the top ten into source season codes 2012–2017, displayed as 2011/12–2016/17. Champions League and national-team international goals are not available because the provided event files contain domestic league matches only.

## Rebuild the data

From this repository, run:

```bash
uv run python scripts/build_data.py --source-dir "/path/to/fda-python/soccer data"
```

The script writes `data/player_season_stats.csv` and prints row counts and date coverage.

## GitHub Pages

The site is plain HTML, CSS, and JavaScript. Enable GitHub Pages from the repository's `main` branch, root folder. The report is the landing page and links to the dashboard. Charts show hover tooltips; dashboard filters update summary cards, charts, the pitch visualization, and the table.

## Project notes

This repository is the student's own project repository and is separate from the course workspace. Add the student's name, student ID, repository URL, and live site URL to the required four-line submission file before turning in the project.
