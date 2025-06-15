document.getElementById('helloBtn').addEventListener('click', async function () {
  findClosest();
  const name = document.getElementById('textField').value;
  const response = await fetch('/hello?name=' + name);
  const text = await response.text();
  document.getElementById('message').textContent = text;
});

var button = document.getElementById('incrementBtn');
button.addEventListener('click', async function () {
  const res = await fetch('/increment', { method: 'POST' });
  const val = await res.text();
  button.textContent = val;
});

async function findClosest() {
  if (!navigator.geolocation) {
    console.error('Geolocation is not supported by this browser.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      await showResultsForLocation(latitude, longitude);
    },
    async (error) => {
      console.error('Geolocation error:', error);
      alert(`Error ${error.code}: ${error.message} — showing results for default location.`);
      await showResultsForLocation(32.0640029, 34.7740735); // Default: Tel Aviv
    }
  );

  async function showResultsForLocation(latitude, longitude) {
    const isResident = document.getElementById('residentCheckbox').checked;

    const response = await fetch('/nearbyParkingLots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latitude, longitude, isResident })
    });

    const locations = await response.json();
    const list = document.getElementById('parkingLots');
    list.innerHTML = '';

    locations.forEach(loc => {
      const [price12, price24, price48] = loc.prices;
      const li = document.createElement('li');
      li.textContent = `${loc.name} — 12h: ₪${price12}, 24h: ₪${price24}, 48h: ₪${price48}`;
      list.appendChild(li);
    });
  }
}
