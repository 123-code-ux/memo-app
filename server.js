const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());
app.use(express.static('public'));

const db = new sqlite3.Database('./memo.db');

// テーブル作成（content + date）
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS memos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT,
      date TEXT
    )
  `);
});

// メモ取得（最新順）
app.get('/api/memos', (req, res) => {
  db.all('SELECT * FROM memos ORDER BY id DESC', (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ status: 'error' });
    }
    res.json(rows);
  });
});

// メモ保存（内容 + 日付）
app.post('/api/memos', (req, res) => {
  const { content } = req.body;
  const date = new Date().toLocaleString(); // 日付を追加
  db.run(
    'INSERT INTO memos (content, date) VALUES (?, ?)',
    [content, date],
    (err) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ status: 'error' });
      }
      res.json({ status: 'ok' });
    }
  );
});

// メモ全削除
app.delete('/api/memos', (req, res) => {
  db.run('DELETE FROM memos', (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ status: 'error' });
    }
    res.json({ status: 'ok' });
  });
});

app.listen(3000, () => {
  console.log('http://localhost:3000');
});
