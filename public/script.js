async function loadMemos() {
  const res = await fetch('/api/memos');
  const memos = await res.json();

  const list = document.getElementById('memoList');
  list.innerHTML = '';

  memos.forEach(memo => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="memo-header">
        <span class="author">${memo.author}</span>
        <span class="date">${memo.created_at}</span>
      </div>
      <div class="content">${memo.content}</div>
    `;
    list.appendChild(li);
  });
}

async function addMemo() {
  const author = document.getElementById('authorInput').value || '匿名';
  const content = document.getElementById('memoInput').value;

  if (!content.trim()) return;

  await fetch('/api/memos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ author, content })
  });

  document.getElementById('memoInput').value = '';
  loadMemos();
}

document.getElementById('addBtn').addEventListener('click', addMemo);

loadMemos();
