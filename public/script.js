async function loadMemos() {
  const res = await fetch('/api/memos');
  const memos = await res.json();
  const list = document.getElementById('memoList');
  list.innerHTML = '';

  memos.forEach((memo, i) => {
    const div = document.createElement('div');
    div.className = 'memo-row';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = memo.done;
    checkbox.addEventListener('change', () => toggleDone(i));
    div.appendChild(checkbox);

    const contentDiv = document.createElement('div');
    contentDiv.className = 'memo-content';

    contentDiv.innerHTML = `<span class="memo-name">${memo.name}</span>：${memo.content}
      <span class="memo-date">${new Date(memo.createdAt).toLocaleString('ja-JP')}</span>
      ${memo.done ? `<span class="done-by">(完了 by ${memo.doneBy})</span>` : ''}`;

    div.appendChild(contentDiv);
    list.appendChild(div);
  });
}

async function addMemo() {
  const name = document.getElementById('nameInput').value.trim() || '匿名';
  const content = document.getElementById('memoInput').value.trim();
  if (!content) return alert('メモを入力してください');

  await fetch('/api/memos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, content })
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
