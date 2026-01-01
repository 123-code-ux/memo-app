// メモを読み込んで表示
async function loadMemos() {
  const res = await fetch('/api/memos');
  const memos = await res.json();

  const list = document.getElementById('memoList');
  list.innerHTML = '';

  memos.forEach((memo, i) => {
    const li = document.createElement('li');
    li.className = 'memo-item';
    li.style.opacity = memo.done ? '0.6' : '1';

    const date = new Date(memo.createdAt);
    const dateStr = !isNaN(date) ? date.toLocaleString('ja-JP') : '';

    // チェックボックス作成
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = memo.done;
    checkbox.addEventListener('change', () => toggleDone(i));

    // メモ内容
    const content = document.createElement('span');
    content.className = 'memo-content';
    content.innerHTML = `
      <strong>${memo.name}</strong>：${memo.content}
      <span class="memo-date">${dateStr}</span>
      ${memo.done ? `<span class="done-by">(完了 by ${memo.doneBy})</span>` : ''}
    `;

    li.appendChild(checkbox);
    li.appendChild(content);
    list.appendChild(li);
  });
}

// メモ追加
async function addMemo() {
  const content = document.getElementById('memoInput').value.trim();
  const name = document.getElementById('nameInput').value.trim();
  if (!content) return alert('メモを入力してください');

  await fetch('/api/memos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name || '匿名', content })
  });

  document.getElementById('memoInput').value = '';
  loadMemos();
}

// 完了状態切替
async function toggleDone(index) {
  const user = document.getElementById('nameInput').value.trim() || '匿名';
  await fetch('/api/memos/done', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ index, user })
  });
  loadMemos();
}

// ボタンにイベントを登録
document.getElementById('addBtn').addEventListener('click', addMemo);

// 初回ロード
loadMemos();
