document.getElementById('helloBtn').addEventListener('click', async function () {
  const name = document.getElementById('textField').value;
  const response = await fetch('/hello?name=' + name);
  const text = await response.text();
  document.getElementById('message').textContent = text;
});

document.getElementById('incrementBtn').addEventListener('click', async function () {
  const res = await fetch('/increment', { method: 'POST' });
  const val = await res.text();
  this.textContent = `Visits: ${val}`;
});

document.getElementById('searchBtn').addEventListener('click', findClosest);

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
      alert(`Error ${error.code}: ${error.message} — showing default location`);
      await showResultsForLocation(32.0640029, 34.7740735);
    }
  );
}

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
    li.className = 'list-group-item';

    li.innerHTML = `
  <div class="d-flex justify-content-between align-items-start">
    <div>
      <h5 class="mb-1">
        <i class="bi bi-p-circle-fill me-2 text-primary"></i>${loc.name}
      </h5>
      <p class="mb-1 text-muted">
        <i class="bi bi-signpost-2-fill me-1"></i>${loc.distanceText}
      </p>
      <p class="mb-0">
        <i class="bi bi-clock-fill me-1"></i>
        12h: ₪${price12},
        24h: ₪${price24},
        48h: ₪${price48}
      </p>
    </div>
    <a href="https://waze.com/ul?ll=${loc.location._latitude},${loc.location._longitude}&navigate=yes" target="_blank" class="btn btn-outline-primary btn-sm mt-1">
      <i class="bi bi-geo-alt-fill"></i> Waze
    </a>
  </div>
`;

    li.addEventListener('click', () => {
      alert(`Selected ${loc.name}`);
    });

    list.appendChild(li);
  });
}
