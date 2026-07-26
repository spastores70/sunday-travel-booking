// ── Travelpayouts marker ──────────────────────────────────────────────────────
// Replace YOUR_MARKER with your actual Travelpayouts marker ID
// Found at: travelpayouts.com → Account → Marker
var TP_MARKER = '738364';

// ── Mobile nav ───────────────────────────────────────────────────────────────
function toggleMenu() {
  var menu = document.querySelector('.menu');
  var btn = document.getElementById('hamburger');
  var isOpen = menu.classList.toggle('open');
  btn.innerHTML = isOpen ? '&#10005;' : '&#9776;';
  btn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.menu a, .menu button').forEach(function (item) {
    item.addEventListener('click', function () {
      var menu = document.querySelector('.menu');
      var btn = document.getElementById('hamburger');
      if (menu && menu.classList.contains('open')) {
        menu.classList.remove('open');
        if (btn) { btn.innerHTML = '&#9776;'; }
      }
    });
  });

  updateNavForUser();
});

// ── Login / Sign Up modal ────────────────────────────────────────────────────
function openModal() {
  var menu = document.querySelector('.menu');
  var hamburger = document.getElementById('hamburger');
  if (menu && menu.classList.contains('open')) {
    menu.classList.remove('open');
    if (hamburger) hamburger.innerHTML = '&#9776;';
  }
  switchModalTab('login');
  document.getElementById('loginModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('loginModal').style.display = 'none';
}

function switchModalTab(tab) {
  var isLogin = tab === 'login';
  document.getElementById('modal-login-form').style.display  = isLogin ? '' : 'none';
  document.getElementById('modal-signup-form').style.display = isLogin ? 'none' : '';
  document.getElementById('tab-login').classList.toggle('active', isLogin);
  document.getElementById('tab-signup').classList.toggle('active', !isLogin);
  document.getElementById('loginError')  && (document.getElementById('loginError').textContent  = '');
  document.getElementById('signupError') && (document.getElementById('signupError').textContent = '');
}

function handleLogin() {
  var email    = (document.getElementById('loginEmail').value    || '').trim();
  var password =  document.getElementById('loginPassword').value || '';
  var error    =  document.getElementById('loginError');

  if (!email || !password) { error.textContent = 'Please enter your email and password.'; return; }

  var users = JSON.parse(localStorage.getItem('std_users') || '{}');
  if (!users[email]) { error.textContent = 'No account found. Please sign up first.'; return; }
  if (users[email].pw !== btoa(password)) { error.textContent = 'Incorrect password.'; return; }

  localStorage.setItem('std_session', JSON.stringify({ email: email, name: users[email].name }));
  error.textContent = '';
  closeModal();
  updateNavForUser();
}

function handleSignup() {
  var name     = (document.getElementById('signupName').value     || '').trim();
  var email    = (document.getElementById('signupEmail').value    || '').trim();
  var password =  document.getElementById('signupPassword').value || '';
  var error    =  document.getElementById('signupError');

  if (!name || !email || !password) { error.textContent = 'Please fill in all fields.'; return; }
  if (password.length < 6)          { error.textContent = 'Password must be at least 6 characters.'; return; }
  if (!/\S+@\S+\.\S+/.test(email))  { error.textContent = 'Please enter a valid email address.'; return; }

  var users = JSON.parse(localStorage.getItem('std_users') || '{}');
  if (users[email]) { error.textContent = 'An account with this email already exists.'; return; }

  users[email] = { name: name, pw: btoa(password) };
  localStorage.setItem('std_users', JSON.stringify(users));
  localStorage.setItem('std_session', JSON.stringify({ email: email, name: name }));

  error.textContent = '';
  closeModal();
  updateNavForUser();
}

function handleLogout() {
  localStorage.removeItem('std_session');
  updateNavForUser();
}

function updateNavForUser() {
  var user    = JSON.parse(localStorage.getItem('std_session') || 'null');
  var loginBtn = document.querySelector('.menu button[onclick="openModal()"]');
  if (!loginBtn) return;
  if (user) {
    loginBtn.textContent = (user.name.split(' ')[0]) + ' ▾';
    loginBtn.setAttribute('onclick', '');
    loginBtn.addEventListener('click', function handler() {
      if (confirm('Log out of Sunday Travel Deals?')) {
        handleLogout();
        loginBtn.removeEventListener('click', handler);
      }
    });
  } else {
    loginBtn.textContent = 'Login / Sign Up';
    loginBtn.setAttribute('onclick', 'openModal()');
  }
}

// ── Carousel ──────────────────────────────────────────────────────────────────
function moveSlide(direction) {
  var track = document.getElementById('carouselTrack');
  track.scrollLeft += direction * 330;
}

// ── Hotel search → Klook via Travelpayouts affiliate link ────────────────────
var TP_HOTEL_URL = 'https://tp.media/r?campaign_id=137&marker=738364&p=4110&trs=539166&u=https%3A%2F%2Fklook.com';

// ── Hotels and accommodations through Klook / Travelpayouts ─────────────────

// Keep the affiliate link exactly as provided by Travelpayouts.
var TP_KLOOK_URL =
  'https://tp.media/r?campaign_id=137&marker=738364&p=4110&trs=539166&u=';

/**
 * Opens Klook through the user's Travelpayouts affiliate tracking link.
 */
function openKlookHotelSearch(destination, checkIn, checkOut, guests) {
  var klookUrl = new URL('https://www.klook.com/hotels/');

  /*
   * Klook may not recognize every custom search parameter.
   * The destination is included when possible, while the affiliate redirect
   * still sends visitors through the approved Travelpayouts tracking link.
   */
  if (destination) {
    klookUrl.searchParams.set('query', destination);
  }

  if (checkIn) {
    klookUrl.searchParams.set('checkin', checkIn);
  }

  if (checkOut) {
    klookUrl.searchParams.set('checkout', checkOut);
  }

  if (guests) {
    klookUrl.searchParams.set('guests', guests);
  }

  var affiliateUrl =
    TP_KLOOK_URL + encodeURIComponent(klookUrl.toString());

  window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Validates hotel search information.
 */
function validateHotelSearch(destination, checkIn, checkOut) {
  if (!destination) {
    alert('Please enter a destination.');
    return false;
  }

  if (!checkIn || !checkOut) {
    alert('Please select your check-in and check-out dates.');
    return false;
  }

  var checkInDate = new Date(checkIn + 'T00:00:00');
  var checkOutDate = new Date(checkOut + 'T00:00:00');

  if (checkOutDate <= checkInDate) {
    alert('Check-out must be later than check-in.');
    return false;
  }

  return true;
}

// ── Hotels via Booking.com (CJ affiliate) ────────────────────────────────────
// CJ deep-link: append the destination URL, URL-encoded, to `?url=` and CJ
// redirects through the approved tracking link before landing on booking.com.
var CJ_BOOKING_URL = 'https://www.kqzyfj.com/click-101807185-17288984?url=';

function openBookingHotelSearch(destination, checkIn, checkOut, guests) {
  var bookingUrl = new URL('https://www.booking.com/searchresults.html');

  if (destination) {
    bookingUrl.searchParams.set('ss', destination);
  }

  if (checkIn) {
    bookingUrl.searchParams.set('checkin', checkIn);
  }

  if (checkOut) {
    bookingUrl.searchParams.set('checkout', checkOut);
  }

  if (guests) {
    bookingUrl.searchParams.set('group_adults', guests);
  }

  var affiliateUrl = CJ_BOOKING_URL + encodeURIComponent(bookingUrl.toString());

  window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Hotels page search. provider is 'klook' (default) or 'booking'.
 */
function searchHotelsPage(event, provider) {
  if (event) {
    event.preventDefault();
  }

  var destinationInput = document.getElementById('hDest');
  var checkInInput = document.getElementById('hCheckIn');
  var checkOutInput = document.getElementById('hCheckOut');
  var guestsInput = document.getElementById('hGuests');
  var status = document.getElementById('hotelSearchStatus');

  if (
    !destinationInput ||
    !checkInInput ||
    !checkOutInput ||
    !guestsInput
  ) {
    console.error('Hotel page search fields were not found.');

    if (status) {
      status.textContent =
        'The hotel search form could not be loaded. Please refresh the page.';
    }

    return;
  }

  var destination = destinationInput.value.trim();
  var checkIn = checkInInput.value;
  var checkOut = checkOutInput.value;
  var guests = guestsInput.value;

  if (!validateHotelSearch(destination, checkIn, checkOut)) {
    return;
  }

  if (provider === 'booking') {
    if (status) {
      status.textContent = 'Opening available accommodations through Booking.com...';
    }

    openBookingHotelSearch(destination, checkIn, checkOut, guests);
  } else {
    if (status) {
      status.textContent = 'Opening available accommodations through Klook...';
    }

    openKlookHotelSearch(destination, checkIn, checkOut, guests);
  }
}
/**
 * Fills the hotel search with a featured destination
 * and moves the visitor back to the search form.
 */
function searchDestination(destination) {
  var destinationInput = document.getElementById('hDest');
  var searchForm = document.getElementById('hotelPageSearchForm');

  if (!destinationInput || !searchForm) {
    console.error('Hotel destination search form was not found.');
    return;
  }

  destinationInput.value = destination;

  searchForm.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });

  window.setTimeout(function () {
    destinationInput.focus();
  }, 500);
}document.addEventListener('DOMContentLoaded', function () {
  var checkInInput = document.getElementById('hCheckIn');
  var checkOutInput = document.getElementById('hCheckOut');

  if (!checkInInput || !checkOutInput) {
    return;
  }

  var today = new Date();
  var tomorrow = new Date(today);
  var dayAfterTomorrow = new Date(today);

  tomorrow.setDate(today.getDate() + 1);
  dayAfterTomorrow.setDate(today.getDate() + 2);

  var todayString = formatHotelDate(today);
  var tomorrowString = formatHotelDate(tomorrow);
  var dayAfterTomorrowString = formatHotelDate(dayAfterTomorrow);

  checkInInput.min = todayString;
  checkOutInput.min = tomorrowString;

  if (!checkInInput.value) {
    checkInInput.value = tomorrowString;
  }

  if (!checkOutInput.value) {
    checkOutInput.value = dayAfterTomorrowString;
  }

  checkInInput.addEventListener('change', function () {
    if (!checkInInput.value) {
      return;
    }

    var selectedCheckIn = new Date(
      checkInInput.value + 'T00:00:00'
    );

    selectedCheckIn.setDate(
      selectedCheckIn.getDate() + 1
    );

    var minimumCheckout = formatHotelDate(selectedCheckIn);

    checkOutInput.min = minimumCheckout;

    if (
      !checkOutInput.value ||
      checkOutInput.value <= checkInInput.value
    ) {
      checkOutInput.value = minimumCheckout;
    }
  });
});

function formatHotelDate(date) {
  var year = date.getFullYear();
  var month = String(date.getMonth() + 1).padStart(2, '0');
  var day = String(date.getDate()).padStart(2, '0');

  return year + '-' + month + '-' + day;
}

// ── Flight search → Aviasales via Travelpayouts, or Booking.com Flights via CJ
var TP_FLIGHT_BASE = 'https://tp.media/r?campaign_id=100&marker=738364&p=4114&trs=539166&u=';

// Booking.com Flights uses free-text city/airport names here since this form
// has no IATA code lookup; treat params as best-effort, same as Aviasales above.
function openBookingFlightSearch(from, to, depart, returnDate, pax) {
  var bookingFlightUrl = new URL('https://www.booking.com/flights/index.html');

  bookingFlightUrl.searchParams.set('type', returnDate ? 'ROUNDTRIP' : 'ONEWAY');
  if (from)       bookingFlightUrl.searchParams.set('from', from);
  if (to)         bookingFlightUrl.searchParams.set('to', to);
  if (depart)     bookingFlightUrl.searchParams.set('depart', depart);
  if (returnDate) bookingFlightUrl.searchParams.set('return', returnDate);
  if (pax)        bookingFlightUrl.searchParams.set('adults', pax);

  var affiliateUrl = CJ_BOOKING_URL + encodeURIComponent(bookingFlightUrl.toString());

  window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
}

function searchFlightsPage(provider) {
  var from       = document.getElementById('fFrom').value.trim();
  var to         = document.getElementById('fTo').value.trim();
  var depart     = document.getElementById('fDepart').value;
  var returnDate = document.getElementById('fReturn').value;
  var pax        = document.getElementById('fPax').value;

  if (!from || !to) { alert('Please enter origin and destination.'); return; }

  if (provider === 'booking') {
    openBookingFlightSearch(from, to, depart, returnDate, pax);
    return;
  }

  var aviasalesParams = new URLSearchParams({ origin: from, destination: to, adults: pax });
  if (depart)     aviasalesParams.set('depart_date', depart);
  if (returnDate) aviasalesParams.set('return_date', returnDate);

  window.open(TP_FLIGHT_BASE + encodeURIComponent('https://aviasales.com/search?' + aviasalesParams.toString()), '_blank');
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
  var dest = (document.getElementById('cruiseDest').value || '').trim().toLowerCase();

  var slugs = {
    'caribbean':     'caribbean-cruises',
    'bahamas':       'bahamas-cruises',
    'mediterranean': 'mediterranean-cruises',
    'alaska':        'alaska-cruises',
    'europe':        'europe-cruises',
    'bermuda':       'bermuda-cruises',
    'mexico':        'mexico-cruises',
    'hawaii':        'hawaii-cruises',
    'canada':        'canada-new-england-cruises',
    'miami':         'caribbean-cruises',
    'florida':       'caribbean-cruises',
  };

  var slug = null;
  for (var key in slugs) {
    if (dest.indexOf(key) !== -1) { slug = slugs[key]; break; }
  }

  window.open('https://www.cruisedirect.com/' + (slug || ''), '_blank');
}

// ── Contact form ──────────────────────────────────────────────────────────────
function sendMessage(event) {
  event.preventDefault();
  document.getElementById('formStatus').textContent = 'Thank you! Your message has been received.';
}