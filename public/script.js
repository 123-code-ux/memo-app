async function loadMemos() {
  const res = await fetch('/api/memos');
  const memos = await res.json();

  const list = document.getElementById('memoList');
  list.innerHTML = '';

  memos.forEach((memo, i) => {
    const date = new Date(memo.createdAt);
    const dateStr = !isNaN(date) ? date.toLocaleString('ja-JP') : '';

    const div = document.createElement('div');
    div.className = 'memo-row';
    div.innerHTML = `
      <input type="checkbox" ${memo.done ? 'checked' : ''} onchange="toggleDone(${i})">
      <div class="memo-content">
        <span class="memo-name">${memo.name}</span>：${memo.content}
        <span class="memo-date">${dateStr}</span>
        ${memo.done ? `<span class="done-by">(完了 by ${memo.doneBy})</span>` : ''}
        <button onclick="addReaction(${i})">👍 ${memo.reactions || 0}</button>
      </div>
    `;
    list.appendChild(div);
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

async function toggleDone(index) {
  const user = document.getElementById('nameInput').value.trim() || '匿名';
  await fetch('/api/memos/done', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ index, user })
  });
  loadMemos();
}

async function addReaction(index) {
  await fetch('/api/memos/react', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ index })
  });
  loadMemos();
}

document.getElementById('addBtn').addEventListener('click', addMemo);
loadMemos();
