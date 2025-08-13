$(document).ready(function() {

  // =====================
  // ProjectSlider class
  // =====================
  class ProjectSlider {
    constructor() {
      this.$container = $('.projects-container');
      this.$section = $('.hot-projects-section');
      this.speed = 50; // pixels per second
      this.direction = 'left';
      this.isPaused = false;
      this.animationId = null;
      this.init();
    }
    init() {
      this.setupDimensions();
      this.startAnimation();
      this.bindEvents();
    }
    setupDimensions() {
      this.$container.append(this.$container.html());
      this.containerWidth = this.$container.outerWidth();
      this.sectionWidth = this.$section.width();
      this.$container.css('left', '0px');
    }
    startAnimation() {
      const self = this;
      let currentPos = 0;
      const fps = 60;
      function animate() {
        if (!self.isPaused) {
          if (self.direction === 'left') {
            currentPos -= self.speed / fps;
            if (currentPos <= -self.containerWidth / 2) currentPos = 0;
          } else {
            currentPos += self.speed / fps;
            if (currentPos >= 0) currentPos = -self.containerWidth / 2;
          }
          self.$container.css('transform', `translateX(${currentPos}px)`);
        }
        self.animationId = requestAnimationFrame(animate);
      }
      animate();
    }
    bindEvents() {
      this.$container.hover(
        () => { this.isPaused = true; },
        () => { this.isPaused = false; }
      );
    }
  }
  new ProjectSlider();

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

  // =====================
  // Navigation functions
  // =====================
  window.showHome = function(event) {
    document.getElementById('hotProjects').style.display = 'block';
    document.getElementById('home').style.display = 'block';
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
  };

  window.redirectToPage = function(page) {
    window.location.href = page;
  };

  window.scrollToContact = function(event) {
    document.getElementById('contact').scrollIntoView({behavior: 'smooth'});
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
  };

  // =====================
  // Terms & Conditions modal
  // =====================
  window.openTCModal = function() {
    document.getElementById('tcModal').style.display = 'block';
  };
  window.closeTCModal = function() {
    document.getElementById('tcModal').style.display = 'none';
  };
  window.onclick = function(event) {
    const modal = document.getElementById('tcModal');
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };

  // =====================
  // Dropdown toggle
  // =====================
  const dropdownMenu = document.querySelector('.dropdown-content');
  const accountBtnEl = document.getElementById("accountBtn");

  if (accountBtnEl) {
    accountBtnEl.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('show');
    });
  }
  window.addEventListener('click', () => {
    dropdownMenu.classList.remove('show');
  });

  // =====================
  // Form clear
  // =====================
  function clearForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    form.reset();
  }

  window.addEventListener('DOMContentLoaded', () => {
    clearForm('contactForm');
    clearForm('loginForm');
    if (typeof updateDropdownMenu === 'function') updateDropdownMenu();
  });

});
