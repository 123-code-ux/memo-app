const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const DATA_FILE = path.join(__dirname, 'memos.json');

// 初期化
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// メモ取得
app.get('/api/memos', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  res.json(data.reverse());
});

// メモ保存（日時つき）
app.post('/api/memos', (req, res) => {
  const { content } = req.body;
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

  data.push({
    content,
    date: new Date().toLocaleString()
  });

  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json({ status: 'ok' });
});

// Render用
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server started on port', PORT);
});
