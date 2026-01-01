async function loadMemos() {
  const res = await fetch('/api/memos');
  const memos = await res.json();

  const list = document.getElementById('memoList');
  list.innerHTML = '';

  memos.forEach((memo, i) => {
    const li = document.createElement('li');
    li.className = 'memo-item';
    li.style.opacity = memo.done ? '0.6' : '1';

    const contentSpan = document.createElement('span');
    contentSpan.innerHTML = `<strong>${memo.name}</strong>：${memo.content}
      <span class="memo-date">${new Date(memo.createdAt).toLocaleString('ja-JP')}</span>
      ${memo.done ? `<span class="done-by">(完了 by ${memo.doneBy})</span>` : ''}`;

    // ボタン類
    const actionDiv = document.createElement('div');
    actionDiv.className = 'action-buttons';

    const doneBtn = document.createElement('button');
    doneBtn.textContent = memo.done ? '未完了に戻す' : '完了';
    doneBtn.addEventListener('click', () => toggleDone(i));

    const likeBtn = document.createElement('button');
    likeBtn.textContent = `いいね (${memo.likes || 0})`;
    likeBtn.addEventListener('click', () => addLike(i));

    const delBtn = document.createElement('button');
    delBtn.textContent = '削除';
    delBtn.addEventListener('click', () => deleteMemo(i));

    actionDiv.appendChild(doneBtn);
    actionDiv.appendChild(likeBtn);
    actionDiv.appendChild(delBtn);

    li.appendChild(contentSpan);
    li.appendChild(actionDiv);

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

async function addLike(index) {
  await fetch('/api/memos/like', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ index })
  });
  loadMemos();
}

async function deleteMemo(index) {
  await fetch('/api/memos/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ index })
  });
  loadMemos();
}

document.getElementById('addBtn').addEventListener('click', addMemo);
loadMemos();
