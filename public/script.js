document.getElementById('helloBtn').addEventListener('click', async function() {
  const name = document.getElementById('textField').value;
  const response = await fetch('/hello?name=' + name);
  const text = await response.text();
  document.getElementById('message').textContent = text;
});

var button = document.getElementById('incrementBtn');
button.addEventListener('click', async function() {
  const res = await fetch('/increment', { method: 'POST' });
  const val = await res.text();
  button.textContent = val;
});

