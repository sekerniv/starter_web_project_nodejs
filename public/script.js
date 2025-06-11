fetch('/hello')
  .then(function(response) {
    return response.text();
  })
  .then(function(text) {
    document.getElementById('message').textContent = 'Hello ' + text + '!';
  });

var button = document.getElementById('incrementBtn');
button.addEventListener('click', function() {
  fetch('/increment', { method: 'POST' })
    .then(function(res) {
      return res.text();
    })
    .then(function(val) {
      button.textContent = val;
    });
});
