async function loadMemos() {
  const res = await fetch('/api/memos');
  const memos = await res.json();

  const list = document.getElementById('memoList');
  list.innerHTML = '';

  memos.forEach(memo => {
    const li = document.createElement('li');
    li.textContent = memo.content;
    list.appendChild(li);
  });
}

async function addMemo() {
  const input = document.getElementById('memoInput');
  const content = input.value.trim();
  if (!content) return;

  await fetch('/api/memos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });

  input.value = '';
  loadMemos();
}

// 初回読み込み
loadMemos();
