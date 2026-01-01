const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// メモをメモリに保存（Render Free 対応）
let memos = [];

// メモ取得
app.get('/api/memos', (req, res) => {
  res.json(memos);
});

// メモ保存
app.post('/api/memos', (req, res) => {
  const { name, content } = req.body;

  if (!content) {
    return res.status(400).json({ error: '内容が空です' });
  }

  memos.unshift({
    name: name || '匿名',
    content,
    date: new Date().toISOString() // 日付を付与
  });

  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
