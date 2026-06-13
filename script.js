// ── Travelpayouts marker ──────────────────────────────────────────────────────
// Replace YOUR_MARKER with your actual Travelpayouts marker ID
// Found at: travelpayouts.com → Account → Marker
var TP_MARKER = 'YOUR_MARKER';

// ── Mobile nav ───────────────────────────────────────────────────────────────
function toggleMenu() {
  var menu = document.querySelector('.menu');
  var btn = document.getElementById('hamburger');
  var isOpen = menu.classList.toggle('open');
  btn.innerHTML = isOpen ? '&#10005;' : '&#9776;';
  btn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.menu a').forEach(function (link) {
    link.addEventListener('click', function () {
      var menu = document.querySelector('.menu');
      var btn = document.getElementById('hamburger');
      if (menu && menu.classList.contains('open')) {
        menu.classList.remove('open');
        if (btn) { btn.innerHTML = '&#9776;'; }
      }
    });
  });
});

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

// ── Hotel search → Booking.com ───────────────────────────────────────────────
// Booking.com is globally accessible. For affiliate tracking, add your
// Booking.com AID from Travelpayouts (Tools → Programs → Booking.com).
var BOOKING_AID = 'YOUR_BOOKING_AID'; // replace with your Booking.com AID

function searchHotels() {
  var dest = document.getElementById('hotelDest').value.trim();
  var checkIn = document.getElementById('checkIn').value;
  var checkOut = document.getElementById('checkOut').value;
  var guests = document.getElementById('guests').value;

  if (!dest) {
    alert('Please enter a destination.');
    return;
  }

  var params = new URLSearchParams({ ss: dest, group_adults: guests });
  if (checkIn)  params.set('checkin', checkIn);
  if (checkOut) params.set('checkout', checkOut);
  if (BOOKING_AID !== 'YOUR_BOOKING_AID') params.set('aid', BOOKING_AID);

  window.open('https://www.booking.com/searchresults.html?' + params.toString(), '_blank');
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

// ── Car search → RentalCars / Discover Cars ───────────────────────────────────
function searchCars() {
  var pickup = document.getElementById('carPickup').value.trim();
  var pickupDate = document.getElementById('carPickupDate').value;
  var returnDate = document.getElementById('carReturnDate').value;

  if (!pickup) { alert('Please enter a pickup location.'); return; }

  var params = new URLSearchParams({ prefloc: pickup, pName: pickup });
  if (pickupDate) params.set('pu', pickupDate);
  if (returnDate) params.set('do', returnDate);

  window.open('https://www.rentalcars.com/?' + params.toString(), '_blank');
}

// ── Tours search → Viator ─────────────────────────────────────────────────────
function searchTours() {
  var dest = document.getElementById('tourDest').value.trim();
  if (!dest) { alert('Please enter a destination.'); return; }
  window.open('https://www.viator.com/search/' + encodeURIComponent(dest), '_blank');
}

// ── Cruise search → CruiseDirect ─────────────────────────────────────────────
function searchCruises() {
  var dest     = document.getElementById('cruiseDest').value.trim();
  var month    = document.getElementById('cruiseMonth').value;
  var duration = document.getElementById('cruiseDuration').value;

  var params = new URLSearchParams();
  if (dest)     params.set('destination', dest);
  if (month)    params.set('month', month);
  if (duration) params.set('duration', duration);

  window.open('https://www.cruisedirect.com/results?' + params.toString(), '_blank');
}

// ── Contact form ──────────────────────────────────────────────────────────────
function sendMessage(event) {
  event.preventDefault();
  document.getElementById('formStatus').textContent = 'Thank you! Your message has been received.';
}
