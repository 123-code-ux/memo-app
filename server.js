const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());
app.use(express.static('public'));

const db = new sqlite3.Database('./memo.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS memos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author TEXT,
      content TEXT,
      created_at TEXT
    )
  `);
});

app.get('/api/memos', (req, res) => {
  db.all(
    'SELECT * FROM memos ORDER BY id DESC',
    (err, rows) => res.json(rows)
  );
});

app.post('/api/memos', (req, res) => {
  const { author, content } = req.body;
  const date = new Date().toLocaleString('ja-JP');

  db.run(
    'INSERT INTO memos (author, content, created_at) VALUES (?, ?, ?)',
    [author, content, date],
    () => res.json({ ok: true })
  );
});

app.listen(3000, () => {
  console.log('Server running');
});
