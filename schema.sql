-- 殭屍大逃殺後端 D1 結構（統計 + 在線；排行榜已改用 VIVERSE Leaderboard，留言板功能亦已移除）
-- 套用：wrangler d1 execute animal-survivors-db --file=./schema.sql --remote

-- 已停用：排行榜改用 VIVERSE Leaderboard，此表為排行榜功能移除後的殘留資料表，未被使用
CREATE TABLE IF NOT EXISTS runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  device_id TEXT,
  name TEXT,
  character TEXT,
  time REAL,
  kills INTEGER,
  level INTEGER,
  gold INTEGER,
  won INTEGER,
  difficulty TEXT DEFAULT 'easy',
  cheated INTEGER DEFAULT 0,
  mode TEXT DEFAULT 'story',
  score INTEGER DEFAULT 0,
  wave INTEGER DEFAULT 0,
  created_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_runs_time ON runs (time DESC);

CREATE TABLE IF NOT EXISTS stats (
  id INTEGER PRIMARY KEY,
  plays INTEGER NOT NULL DEFAULT 0,
  total_time REAL NOT NULL DEFAULT 0,
  total_kills INTEGER NOT NULL DEFAULT 0,
  peak_online INTEGER NOT NULL DEFAULT 0,
  peak_online_at INTEGER NOT NULL DEFAULT 0
);
INSERT OR IGNORE INTO stats (id, plays, total_time, total_kills) VALUES (1, 0, 0, 0);

-- 在線：進場時記錄各裝置最後時間；線上人數 = 近 3 小時內活躍的 distinct 裝置數（無心跳輪詢）
CREATE TABLE IF NOT EXISTS presence (
  device_id TEXT PRIMARY KEY,
  last_seen INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_presence_seen ON presence (last_seen);

-- 每小時線上人數（時序）：hour = floor(epochMs/3600000)，peak = 該小時內最高同時在線
CREATE TABLE IF NOT EXISTS online_hourly (
  hour INTEGER PRIMARY KEY,
  peak INTEGER NOT NULL DEFAULT 0
);

-- 留言板：全球留言
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  text TEXT,
  device_id TEXT,
  parent_id INTEGER DEFAULT 0,
  created_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_messages_id ON messages (id DESC);
