const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// メモをメモリに保存（Render Free対応）
let memos = [];

// メモ取得
app.get('/api/memos', (req, res) => {
  res.json(memos);
});

// メモ追加
app.post('/api/memos', (req, res) => {
  const { name, content } = req.body;
  if (!content) return res.status(400).json({ error: '内容が空です' });

  memos.unshift({
    name: name || '匿名',
    content,
    done: false,
    doneBy: '',
    createdAt: new Date().toISOString()
  });

  res.json({ status: 'ok' });
});

// メモ完了切替
app.post('/api/memos/done', (req, res) => {
  const { index, user } = req.body;
  if (typeof memos[index] === 'undefined') return res.status(400).json({ error: '無効なメモ' });

  memos[index].done = !memos[index].done;
  memos[index].doneBy = memos[index].done ? (user || '匿名') : '';

  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
