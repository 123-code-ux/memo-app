const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(express.json());
app.use(express.static("public"));

const db = new sqlite3.Database("./memo.db");

// テーブル作成
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS memos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT
    )
  `);
});

// メモ取得
app.get("/api/memos", (req, res) => {
  db.all("SELECT * FROM memos ORDER BY id DESC", (err, rows) => {
    res.json(rows);
  });
});

// メモ追加
app.post("/api/memos", (req, res) => {
  const { content } = req.body;
  db.run(
    "INSERT INTO memos (content) VALUES (?)",
    [content],
    () => res.json({ status: "ok" })
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
