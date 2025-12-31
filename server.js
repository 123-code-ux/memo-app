const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const db = new sqlite3.Database('./memo.db');

// テーブル作成
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS memos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT,
      content TEXT,
      created_at TEXT
    )
  `);
});

// メモ取得
app.get('/api/memos', (req, res) => {
  db.all(
    'SELECT * FROM memos ORDER BY id DESC',
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});

// メモ追加
app.post('/api/memos', (req, res) => {
  const { type, content } = req.body;
  const createdAt = new Date().toLocaleString('ja-JP');

  db.run(
    'INSERT INTO memos (type, content, created_at) VALUES (?, ?, ?)',
    [type, content, createdAt],
    () => res.json({ status: 'ok' })
  );
});

app.listen(3000, () => {
  console.log('Server started');
});
