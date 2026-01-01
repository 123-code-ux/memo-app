async function loadMemos() {
  const res = await fetch('/api/memos');
  const memos = await res.json();

  const list = document.getElementById('memoList');
  list.innerHTML = '';

  memos.forEach((memo, i) => {
    const li = document.createElement('li');
    li.className = 'memo-item';
    li.style.opacity = memo.done ? '0.6' : '1';

    // チェックボックス
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = memo.done;
    checkbox.addEventListener('change', () => toggleDone(i));
    li.appendChild(checkbox);

    // 内容 div
    const contentDiv = document.createElement('div');
    contentDiv.className = 'memo-content';

    const nameStrong = document.createElement('strong');
    nameStrong.textContent = memo.name;
    contentDiv.appendChild(nameStrong);

    contentDiv.appendChild(document.createTextNode('：' + memo.content));

    const dateSpan = document.createElement('span');
    dateSpan.className = 'memo-date';
    const date = new Date(memo.createdAt);
    dateSpan.textContent = !isNaN(date) ? date.toLocaleString('ja-JP') : '';
    contentDiv.appendChild(dateSpan);

    if (memo.done) {
      const doneBySpan = document.createElement('span');
      doneBySpan.className = 'done-by';
      doneBySpan.textContent = `(完了 by ${memo.doneBy})`;
      contentDiv.appendChild(doneBySpan);
    }

    li.appendChild(contentDiv);
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

