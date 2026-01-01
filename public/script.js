async function loadMemos() {
  const res = await fetch('/api/memos');
  const memos = await res.json();

  const list = document.getElementById('memoList');
  list.innerHTML = '';

  memos.forEach(memo => {
    const li = document.createElement('li');
    li.textContent = `${memo.name}：${memo.content}`;
    list.appendChild(li);
  });
}

async function addMemo() {
  const content = document.getElementById('memoInput').value;
  const nameInput = document.getElementById('nameInput');
  const name = nameInput ? nameInput.value : '';

  if (!content) {
    alert('メモを入力してください');
    return;
  }

  await fetch('/api/memos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, content })
  });

  document.getElementById('memoInput').value = '';
  loadMemos();
}

loadMemos();
