"""Build the browser-ready player-season soccer dataset.

The raw source files stay outside this project repository. This script uses
DuckDB to join the match-level and event-level files and aggregate events into
one row per player/team/league/season.
"""

from __future__ import annotations

import argparse
from pathlib import Path

import duckdb


QUERY = r"""
WITH source_events AS (
    SELECT
        e.id_odsp AS match_id,
        NULLIF(NULLIF(TRIM(e.player), ''), 'NA') AS player,
        NULLIF(NULLIF(TRIM(e.player2), ''), 'NA') AS assisting_player,
        NULLIF(NULLIF(TRIM(e.event_team), ''), 'NA') AS team,
        e.event_type,
        e.event_type2,
        e.bodypart,
        e.shot_place,
        e.location,
        e.assist_method,
        e.situation,
        e.shot_outcome,
        TRY_CAST(e.is_goal AS INTEGER) AS is_goal
    FROM read_csv_auto($events, header = true, nullstr = ['NA', '']) AS e
),
joined AS (
    SELECT
        g.id_odsp AS match_id,
        CAST(g.date AS DATE) AS match_date,
        CAST(g.season AS INTEGER) AS season,
        g.league,
        g.country,
        g.ht AS home_team,
        g.at AS away_team,
        s.player,
        s.team,
        s.event_type,
        s.event_type2,
        s.bodypart,
        s.shot_place,
        s.location,
        s.assist_method,
        s.situation,
        s.shot_outcome,
        COALESCE(s.is_goal, 0) AS is_goal,
        s.assisting_player
    FROM source_events AS s
    INNER JOIN read_csv_auto($matches, header = true, nullstr = ['NA', '']) AS g
        ON s.match_id = g.id_odsp
    WHERE s.player IS NOT NULL
      AND s.team IS NOT NULL
      AND s.player NOT LIKE '%,%'
),
aggregated AS (
    SELECT
        season,
        league,
        country,
        player,
        team,
        COUNT(DISTINCT match_id) AS matches_with_events,
        COUNT(*) AS event_count,
        SUM(is_goal) AS goals,
        SUM(CASE WHEN event_type = 1 THEN 1 ELSE 0 END) AS attempts,
        SUM(CASE WHEN event_type = 1 AND shot_outcome = 1 THEN 1 ELSE 0 END) AS shots_on_target,
        SUM(CASE WHEN event_type = 1 AND shot_outcome IN (2, 3, 4) THEN 1 ELSE 0 END) AS shots_not_on_target,
        SUM(CASE WHEN event_type2 = 12 THEN 1 ELSE 0 END) AS key_passes,
        SUM(CASE WHEN event_type = 2 THEN 1 ELSE 0 END) AS corners,
        SUM(CASE WHEN event_type = 3 THEN 1 ELSE 0 END) AS fouls,
        SUM(CASE WHEN event_type = 4 THEN 1 ELSE 0 END) AS yellow_cards,
        SUM(CASE WHEN event_type = 5 THEN 1 ELSE 0 END) AS second_yellows,
        SUM(CASE WHEN event_type = 6 THEN 1 ELSE 0 END) AS red_cards,
        SUM(CASE WHEN event_type = 7 THEN 1 ELSE 0 END) AS substitutions,
        SUM(CASE WHEN event_type = 9 THEN 1 ELSE 0 END) AS offsides,
        SUM(CASE WHEN event_type = 10 THEN 1 ELSE 0 END) AS handballs,
        SUM(CASE WHEN event_type = 11 THEN 1 ELSE 0 END) AS penalties_conceded,
        SUM(CASE WHEN is_goal = 1 AND assisting_player IS NOT NULL THEN 1 ELSE 0 END) AS assists,
        SUM(CASE WHEN is_goal = 1 AND bodypart = 1 THEN 1 ELSE 0 END) AS goal_right_foot,
        SUM(CASE WHEN is_goal = 1 AND bodypart = 2 THEN 1 ELSE 0 END) AS goal_left_foot,
        SUM(CASE WHEN is_goal = 1 AND bodypart = 3 THEN 1 ELSE 0 END) AS goal_head,
        SUM(CASE WHEN is_goal = 1 AND situation = 1 THEN 1 ELSE 0 END) AS goal_open_play,
        SUM(CASE WHEN is_goal = 1 AND situation = 2 THEN 1 ELSE 0 END) AS goal_set_piece,
        SUM(CASE WHEN is_goal = 1 AND situation = 3 THEN 1 ELSE 0 END) AS goal_corner,
        SUM(CASE WHEN is_goal = 1 AND situation = 4 THEN 1 ELSE 0 END) AS goal_free_kick,
        SUM(CASE WHEN is_goal = 1 AND assist_method = 0 THEN 1 ELSE 0 END) AS goal_no_assist,
        SUM(CASE WHEN is_goal = 1 AND assist_method = 1 THEN 1 ELSE 0 END) AS goal_assisted_by_pass,
        SUM(CASE WHEN is_goal = 1 AND assist_method = 2 THEN 1 ELSE 0 END) AS goal_assisted_by_cross,
        SUM(CASE WHEN is_goal = 1 AND assist_method = 3 THEN 1 ELSE 0 END) AS goal_assisted_by_headed_pass,
        SUM(CASE WHEN is_goal = 1 AND assist_method = 4 THEN 1 ELSE 0 END) AS goal_assisted_by_through_ball
    FROM joined
    GROUP BY ALL
)
SELECT
    season,
    'Domestic leagues' AS competition_type,
    league,
    country,
    player,
    team,
    matches_with_events,
    event_count,
    goals,
    assists,
    attempts,
    shots_on_target,
    shots_not_on_target,
    key_passes,
    corners,
    fouls,
    yellow_cards,
    second_yellows,
    red_cards,
    substitutions,
    offsides,
    handballs,
    penalties_conceded,
    ROUND(goals * 1.0 / NULLIF(matches_with_events, 0), 3) AS goals_per_event_match,
    goals + assists AS goal_contributions,
    goal_right_foot,
    goal_left_foot,
    goal_head,
    goal_open_play,
    goal_set_piece,
    goal_corner,
    goal_free_kick,
    goal_no_assist,
    goal_assisted_by_pass,
    goal_assisted_by_cross,
    goal_assisted_by_headed_pass,
    goal_assisted_by_through_ball
FROM aggregated
ORDER BY season, league, team, goals DESC, player
"""


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--source-dir',
        type=Path,
        required=True,
        help='Folder containing events.csv and ginf.csv',
    )
    parser.add_argument(
        '--output',
        type=Path,
        default=Path(__file__).resolve().parents[1] / 'data' / 'player_season_stats.csv',
    )
    args = parser.parse_args()

    events = (args.source_dir / 'events.csv').resolve()
    matches = (args.source_dir / 'ginf.csv').resolve()
    if not events.exists() or not matches.exists():
        raise FileNotFoundError('source-dir must contain events.csv and ginf.csv')

    args.output.parent.mkdir(parents=True, exist_ok=True)
    events_sql = str(events).replace("'", "''")
    matches_sql = str(matches).replace("'", "''")
    query = QUERY.replace("read_csv_auto($events,", f"read_csv_auto('{events_sql}',")
    query = query.replace("read_csv_auto($matches,", f"read_csv_auto('{matches_sql}',")

    con = duckdb.connect()
    try:
        con.execute(
            f"COPY ({query}) TO ? (HEADER, DELIMITER ',')",
            [str(args.output)],
        )
    finally:
        con.close()

    check = duckdb.connect()
    try:
        row_count, first_season, last_season = check.execute(
            "SELECT COUNT(*), MIN(season), MAX(season) FROM read_csv_auto(?, header = true, quote = '\"', escape = '\"')",
            [str(args.output)],
        ).fetchone()
    finally:
        check.close()
    print(f'Wrote {row_count:,} rows to {args.output}')
    print(f'Seasons: {first_season}–{last_season}')


if __name__ == '__main__':
    main()
