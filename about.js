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

accountBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  dropdownMenu.classList.toggle('show');
});
window.addEventListener('click', () => {
  dropdownMenu.classList.remove('show');
});


function clearForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.reset(); // clears all form inputs to default/empty
}

// Clear forms on page load
window.addEventListener('DOMContentLoaded', () => {
  clearForm('contactForm');  // your signup form id
  clearForm('loginForm');    // your login form id
  updateDropdownMenu();      // show correct dropdown on reload
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