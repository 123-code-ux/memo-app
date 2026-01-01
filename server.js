const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();

// ★ これが無かったのが原因
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

const db = new sqlite3.Database('./memo.db');

// テーブル作成
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS memos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      content TEXT
    )
  `);
});

// メモ取得
app.get('/api/memos', (req, res) => {
  db.all('SELECT * FROM memos ORDER BY id DESC', (err, rows) => {
    res.json(rows);
  });
});

// メモ保存
app.post('/api/memos', (req, res) => {
  const { name, content } = req.body;

  if (!content) {
    return res.status(400).json({ error: '内容が空です' });
  }

  db.run(
    'INSERT INTO memos (name, content) VALUES (?, ?)',
    [name || '匿名', content],
    () => res.json({ status: 'ok' })
  );
});

app.listen(3000, () => {
  console.log('Server running');
});
