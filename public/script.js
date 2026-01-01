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

    li.innerHTML = `
      <input type="checkbox" ${memo.done ? 'checked' : ''} onchange="toggleDone(${i})">
      <div class="memo-content">
        <strong>${memo.name}</strong>：${memo.content}
        <span class="memo-date">${dateStr}</span>
        ${memo.done ? `<span class="done-by">(完了 by ${memo.doneBy})</span>` : ''}
      </div>
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

async function toggleDone(index) {
  const user = document.getElementById('nameInput').value.trim() || '匿名';
  await fetch('/api/memos/done', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ index, user })
  });
  loadMemos();
}

document.getElementById('addBtn').addEventListener('click', addMemo);
loadMemos();
