async function loadMemos() {
  const res = await fetch('/api/memos');
  const memos = await res.json();

  const list = document.getElementById('memoList');
  list.innerHTML = '';

  memos.forEach(memo => {
    const li = document.createElement('li');
    li.innerHTML = `${memo.name}：${memo.content}`;
    list.appendChild(li);
  });
}

async function addMemo() {
  const content = document.getElementById('memoInput').value.trim();
  const name = document.getElementById('nameInput').value.trim();

  if (!content) {
    alert('メモを入力してください');
    return;
  }

  await fetch('/api/memos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name || '匿名',
      content
    })
  });

  document.getElementById('memoInput').value = '';
  loadMemos();
}

document.getElementById('addBtn').addEventListener('click', addMemo);

loadMemos();
