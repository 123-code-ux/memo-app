const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());
app.use(express.static('public'));

const db = new sqlite3.Database('./memo.db');

// テーブル作成（家族掲示板）
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS memos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      content TEXT,
      created_at TEXT
    )
  `);
});

// メモ取得
app.get('/api/memos', (req, res) => {
  db.all(
    'SELECT * FROM memos ORDER BY id DESC',
    (err, rows) => res.json(rows)
  );
});

// メモ保存
app.post('/api/memos', (req, res) => {
  const { name, content } = req.body;
  const createdAt = new Date().toLocaleString('ja-JP');

  db.run(
    'INSERT INTO memos (name, content, created_at) VALUES (?, ?, ?)',
    [name, content, createdAt],
    () => res.json({ status: 'ok' })
  );
});

app.listen(3000, () => {
  console.log('Server running');
});
