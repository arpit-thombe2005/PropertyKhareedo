// Terms & Conditions modal open/close
function openTCModal() {
  document.getElementById('tcModal').style.display = 'block';
}
function closeTCModal() {
  document.getElementById('tcModal').style.display = 'none';
}
window.onclick = function(event) {
  const modal = document.getElementById('tcModal');
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};

// Dropdown button toggle
const dropdownMenu = document.querySelector('.dropdown-content');
const accountBtn = document.getElementById('accountBtn');

const SNOW_CONFIG = {
  initialCount: 120,
  spawnIntervalMs: 400,
  size: { min: 4, max: 12 },
  duration: { min: 8, max: 14 },
  delay: { min: 0, max: 2 },
  opacity: { min: 0.25, max: 0.65 },
  blurMax: 2
};

const randomBetween = (min, max) => Math.random() * (max - min) + min;

if (accountBtn && dropdownMenu) {
  accountBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('show');
  });
  window.addEventListener('click', () => {
    dropdownMenu.classList.remove('show');
  });
}


function clearForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.reset(); // clears all form inputs to default/empty
}

// Clear forms on page load
const bindOfferButtons = () => {
  document.querySelectorAll('.claim-offer').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();

      const isLoggedIn = localStorage.getItem('isloggedIn') === 'true';
      const offerName = button.dataset.offerName || 'this winter offer';

      if (!isLoggedIn) {
        alert('Please log in to claim this winter offer.');
        if (typeof showModal === 'function') {
          showModal('loginModal');
        }
        return;
      }

      alert(`Thank you! We will reach you shortly about ${offerName}.`);
    });
  });
};

const initSnowEffect = () => {
  const $snowLayer = $('.winter-offers .snow-layer');
  if (!$snowLayer.length) {
    return;
  }

  const spawnFlake = () => {
    const size = randomBetween(SNOW_CONFIG.size.min, SNOW_CONFIG.size.max);
    const duration = randomBetween(SNOW_CONFIG.duration.min, SNOW_CONFIG.duration.max);
    const delay = randomBetween(SNOW_CONFIG.delay.min, SNOW_CONFIG.delay.max);
    const opacity = randomBetween(SNOW_CONFIG.opacity.min, SNOW_CONFIG.opacity.max);
    const blur = randomBetween(0, SNOW_CONFIG.blurMax);
    const left = randomBetween(0, 100);

    const $flake = $('<span class="snowflake"></span>');
    $flake.css({
      left: `${left}%`,
      width: `${size}px`,
      height: `${size}px`,
      animationDuration: `${duration}s`,
      animationDelay: `${delay}s`,
      opacity,
      filter: `blur(${blur}px)`
    });

    $flake.on('animationend', () => {
      $flake.remove();
      spawnFlake();
    });

    $snowLayer.append($flake);
  };

  for (let i = 0; i < SNOW_CONFIG.initialCount; i += 1) {
    spawnFlake();
  }

  setInterval(spawnFlake, SNOW_CONFIG.spawnIntervalMs);
};

window.addEventListener('DOMContentLoaded', () => {
  clearForm('contactForm');  // your signup form id
  clearForm('loginForm');    // your login form id
  updateDropdownMenu();      // show correct dropdown on reload

  bindOfferButtons();
  initSnowEffect();
});

// =====================
  // Profile Slide-In Panel Logic
  // =====================
  const profileBtn = document.getElementById("yourProfileBtn");
  const profilePanel = document.getElementById("profilePanel");
  const profileOverlay = document.getElementById("profileOverlay");
  const closeProfileBtn = document.getElementById("closeProfileBtn");

  if (profileBtn) {
    profileBtn.addEventListener("click", function(e) {
      e.preventDefault();
      fetch('profile.php', { credentials: 'same-origin' })
        .then(res => {
          if (!res.ok) throw new Error("Not logged in");
          return res.json();
        })
        .then(user => {
          if (user.error) {
            alert(user.error);
            return;
          }
          // Fill in all profile fields
          document.getElementById('profileFname').textContent    = user.Fname || '';
          document.getElementById('profileMname').textContent    = user.Mname || '';
          document.getElementById('profileLname').textContent    = user.Lname || '';
          document.getElementById('profileEmail').textContent    = user.email || '';
          document.getElementById('profileUsername').textContent = user.username || '';
          document.getElementById('profileGender').textContent   = user.gender || '';
          document.getElementById('profilePhone').textContent    = user.phone || '';
          document.getElementById('profileAltPhone').textContent = user.altPhone || '';

          profilePanel.classList.add("active");
          profileOverlay.classList.add("active");
          document.querySelector('.dropdown-content').classList.remove('show');
        })
        .catch(err => {
          console.error(err);
          alert("Please log in to view profile.");
        });
    });
  }

  function closeProfilePanel() {
    profilePanel.classList.remove("active");
    profileOverlay.classList.remove("active");
  }
  if (closeProfileBtn) closeProfileBtn.addEventListener("click", closeProfilePanel);
  if (profileOverlay) profileOverlay.addEventListener("click", closeProfilePanel);