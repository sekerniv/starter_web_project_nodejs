fetch('/hello')
  .then(response => response.text())
  .then(text => {
    document.getElementById('message').textContent = `Hello ${text}!`;
  })
  .catch(err => console.error('Error:', err));
