const memoList = document.getElementById('memo-list');
const memoForm = document.getElementById('memo-form');
const memoInput = document.getElementById('memo-input');

// メモ取得
async function loadMemos() {
  const res = await fetch('/api/memos');
  const memos = await res.json();

  memoList.innerHTML = '';

  memos.forEach(memo => {
    const li = document.createElement('li');
    li.className = 'memo-item';

    const date = memo.created_at
      ? new Date(memo.created_at).toLocaleString()
      : '';

    li.innerHTML = `
      <div class="memo-content">${memo.content}</div>
      <div class="memo-date">${date}</div>
    `;

    memoList.appendChild(li);
  });
}

// メモ送信
memoForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const content = memoInput.value.trim();
  if (!content) return;

  await fetch('/api/memos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content })
  });

  memoInput.value = '';
  loadMemos(); // 即時反映
});

// 初期表示
loadMemos();
