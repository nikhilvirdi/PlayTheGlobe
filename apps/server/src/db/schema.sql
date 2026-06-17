-- SurrealDB Schema Definition for PlayTheGlobe

-- 1. Users table
DEFINE TABLE users SCHEMAFULL;
DEFINE FIELD username ON TABLE users TYPE string ASSERT $value != NONE AND string::len($value) > 0;
DEFINE INDEX unique_username ON TABLE users COLUMNS username UNIQUE;
DEFINE FIELD password_hash ON TABLE users TYPE string;
DEFINE FIELD created_at ON TABLE users TYPE datetime DEFAULT time::now();
DEFINE FIELD total_points ON TABLE users TYPE int DEFAULT 0;
DEFINE FIELD current_streak ON TABLE users TYPE int DEFAULT 0;
DEFINE FIELD best_streak ON TABLE users TYPE int DEFAULT 0;
DEFINE FIELD countries_collected ON TABLE users TYPE array DEFAULT [];
DEFINE FIELD season_points ON TABLE users TYPE int DEFAULT 0;

-- 2. Leaderboard view
-- global_score formula: (best_streak * 100) + total_points + (countries_collected_count * 50)
DEFINE TABLE leaderboard AS
  SELECT
    username,
    total_points,
    best_streak,
    array::len(countries_collected) AS countries_collected_count,
    (best_streak * 100) + total_points + (array::len(countries_collected) * 50) AS global_score
  FROM users;

-- 3. Game sessions table
DEFINE TABLE game_sessions SCHEMAFULL;
DEFINE FIELD user_id ON TABLE game_sessions TYPE record<users>;
DEFINE FIELD mode ON TABLE game_sessions TYPE string;
DEFINE FIELD country_code ON TABLE game_sessions TYPE string;
DEFINE FIELD hints_used ON TABLE game_sessions TYPE int DEFAULT 0;
DEFINE FIELD points_earned ON TABLE game_sessions TYPE int DEFAULT 0;
DEFINE FIELD won ON TABLE game_sessions TYPE bool DEFAULT false;
DEFINE FIELD created_at ON TABLE game_sessions TYPE datetime DEFAULT time::now();

-- 4. Country mastery table
DEFINE TABLE country_mastery SCHEMAFULL;
DEFINE FIELD user_id ON TABLE country_mastery TYPE record<users>;
DEFINE FIELD country_code ON TABLE country_mastery TYPE string;
DEFINE FIELD correct_count ON TABLE country_mastery TYPE int DEFAULT 0;
DEFINE FIELD hints_used_total ON TABLE country_mastery TYPE int DEFAULT 0;
DEFINE FIELD mastery_tier ON TABLE country_mastery TYPE string ASSERT $value INSIDE ['bronze', 'silver', 'gold', 'platinum'];

-- 5. Seasons table
DEFINE TABLE seasons SCHEMAFULL;
DEFINE FIELD season_number ON TABLE seasons TYPE int;
DEFINE FIELD start_date ON TABLE seasons TYPE datetime;
DEFINE FIELD end_date ON TABLE seasons TYPE datetime;
DEFINE FIELD active ON TABLE seasons TYPE bool DEFAULT false;

-- 6. Season scores table
DEFINE TABLE season_scores SCHEMAFULL;
DEFINE FIELD user_id ON TABLE season_scores TYPE record<users>;
DEFINE FIELD season_id ON TABLE season_scores TYPE record<seasons>;
DEFINE FIELD points ON TABLE season_scores TYPE int DEFAULT 0;
DEFINE FIELD streak ON TABLE season_scores TYPE int DEFAULT 0;
DEFINE FIELD rank ON TABLE season_scores TYPE int;

-- 7. Duels table
DEFINE TABLE duels SCHEMAFULL;
DEFINE FIELD challenger_id ON TABLE duels TYPE record<users>;
DEFINE FIELD opponent_id ON TABLE duels TYPE record<users>;
DEFINE FIELD country_code ON TABLE duels TYPE string;
DEFINE FIELD winner_id ON TABLE duels TYPE record<users> | null;
DEFINE FIELD status ON TABLE duels TYPE string ASSERT $value INSIDE ['pending', 'active', 'complete'];
DEFINE FIELD created_at ON TABLE duels TYPE datetime DEFAULT time::now();

-- 8. Daily Gauntlet table
DEFINE TABLE gauntlet_daily SCHEMAFULL;
DEFINE FIELD date ON TABLE gauntlet_daily TYPE string;
DEFINE INDEX unique_date ON TABLE gauntlet_daily COLUMNS date UNIQUE;
DEFINE FIELD countries ON TABLE gauntlet_daily TYPE array;

-- 9. Gauntlet Scores table
DEFINE TABLE gauntlet_scores SCHEMAFULL;
DEFINE FIELD user_id ON TABLE gauntlet_scores TYPE record<users>;
DEFINE FIELD date ON TABLE gauntlet_scores TYPE string;
DEFINE FIELD points ON TABLE gauntlet_scores TYPE int DEFAULT 0;
DEFINE FIELD completed ON TABLE gauntlet_scores TYPE bool DEFAULT false;
