// ── Travelpayouts marker ──────────────────────────────────────────────────────
// Replace YOUR_MARKER with your actual Travelpayouts marker ID
// Found at: travelpayouts.com → Account → Marker
var TP_MARKER = 'YOUR_MARKER';

// ── Login modal ───────────────────────────────────────────────────────────────
function openModal() {
  document.getElementById('loginModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('loginModal').style.display = 'none';
}

// ── Carousel ──────────────────────────────────────────────────────────────────
function moveSlide(direction) {
  var track = document.getElementById('carouselTrack');
  track.scrollLeft += direction * 330;
}

// ── Homepage search tabs ──────────────────────────────────────────────────────
function setSearchTab(type) {
  var hotelSearch = document.getElementById('hotelSearch');
  var flightSearch = document.getElementById('flightSearch');
  var tabHotels = document.getElementById('tab-hotels');
  var tabFlights = document.getElementById('tab-flights');

  if (!hotelSearch || !flightSearch) return;

  if (type === 'hotels') {
    hotelSearch.style.display = 'grid';
    flightSearch.style.display = 'none';
    tabHotels.classList.add('active');
    tabFlights.classList.remove('active');
  } else {
    hotelSearch.style.display = 'none';
    flightSearch.style.display = 'grid';
    tabFlights.classList.add('active');
    tabHotels.classList.remove('active');
  }
}

// ── Hotel search → Hotellook ──────────────────────────────────────────────────
function searchHotels() {
  var dest = document.getElementById('hotelDest').value.trim();
  var checkIn = document.getElementById('checkIn').value;
  var checkOut = document.getElementById('checkOut').value;
  var guests = document.getElementById('guests').value;

  if (!dest) {
    alert('Please enter a destination.');
    return;
  }

  var params = new URLSearchParams({
    destination: dest,
    adults: guests,
    checkIn: checkIn || '',
    checkOut: checkOut || '',
    marker: TP_MARKER
  });

  window.open('https://hotellook.com/hotels?' + params.toString(), '_blank');
}

// ── Flight search → Aviasales ─────────────────────────────────────────────────
function searchFlights() {
  var from = document.getElementById('flightFrom').value.trim();
  var to = document.getElementById('flightTo').value.trim();
  var date = document.getElementById('departDate').value;
  var pax = document.getElementById('passengers').value;

  if (!from || !to) {
    alert('Please enter origin and destination.');
    return;
  }

  // Aviasales deep link with marker; full IATA routing requires server-side lookup
  var params = new URLSearchParams({
    origin: from,
    destination: to,
    depart_date: date || '',
    adults: pax,
    marker: TP_MARKER
  });

  window.open('https://www.aviasales.com/search?' + params.toString(), '_blank');
}

// ── Contact form ──────────────────────────────────────────────────────────────
function sendMessage(event) {
  event.preventDefault();
  document.getElementById('formStatus').textContent = 'Thank you! Your message has been received.';
}
