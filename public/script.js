async function loadMemos() {
  const res = await fetch('/api/memos');
  const memos = await res.json();

  const list = document.getElementById('memoList');
  list.innerHTML = '';

  memos.forEach((memo, i) => {
    const li = document.createElement('li');
    li.className = 'memo-item';

    const date = new Date(memo.createdAt);
    const dateStr = !isNaN(date) ? date.toLocaleString('ja-JP') : '';

    li.innerHTML = `
      <input type="checkbox" disabled>
      <span class="memo-content">
        <strong>${memo.name}</strong>：${memo.content}
        <span class="memo-date">${dateStr}</span>
      </span>
    `;
    list.appendChild(li);
  });
}

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

document.getElementById('addBtn').addEventListener('click', addMemo);
loadMemos();
