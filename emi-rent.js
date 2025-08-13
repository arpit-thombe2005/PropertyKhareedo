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

$(function () {
  // --- Tab Button and Element References ---
  const emiBtn  = $('#emiTab');
  const rentBtn = $('#rentTab');
  const slider  = $('.slider-bg');
  const emiPane = $('#emiPane');
  const rentPane = $('#rentPane');
  const emiChartContainer = $('#emiChartContainer');
  const emiResult = $('#emiResult');
  const rentResult = $('#rentResult');
  
  // ---- Utility: Clear all fields/results in a pane ---
  function clearEmiForm() {
    $('#emiAmount, #emiRate, #emiYears').val('');
    emiResult.empty();
    emiChartContainer.removeClass('visible');
    // Reset Pie Chart
    if (window.emiChart) {
      emiChart.data.datasets[0].data = [1, 1];
      emiChart.update();
    }
  }
  function clearRentForm() {
    $('#rentAmount, #rentMonths, #rentIncrement').val('');
    rentResult.empty();
  }

  // ---- TABS SIDESLIDE LOGIC + ERASE INACTIVE FORM ----
  emiBtn.on('click', function () {
    if (emiBtn.hasClass('active')) return;
    emiBtn.addClass('active'); rentBtn.removeClass('active');
    emiPane.addClass('active').slideDown(220); rentPane.removeClass('active').slideUp(220);
    slider.css('left', "2.5px");
    // Erase ALL Rent fields/results
    clearRentForm();
  });

  rentBtn.on('click', function () {
    if (rentBtn.hasClass('active')) return;
    rentBtn.addClass('active'); emiBtn.removeClass('active');
    rentPane.addClass('active').slideDown(220); emiPane.removeClass('active').slideUp(220);
    slider.css('left', "calc(50% + 2.5px)");
    // Erase ALL EMI fields/results
    clearEmiForm();
  });

  // ---- PIE CHART INIT FOR EMI ----
  let emiChart;
  const ctx = document.getElementById('emiPieChart').getContext('2d');
  emiChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Principal', 'Interest'],
      datasets: [{
        data: [1, 1],
        backgroundColor: ['#667eea', '#764ba2'],
        borderColor: '#fff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { size: 14 } }
        },
        tooltip: { enabled: true }
      }
    }
  });

  // ---- EMI CALCULATION ----
  $('#calcEmi').on('click', function () {
    const amount = parseFloat($('#emiAmount').val()) || 0;
    const rate = (parseFloat($('#emiRate').val()) || 0) / 12 / 100;
    const years = parseInt($('#emiYears').val()) || 0;
    const months = years * 12;
    let result = "Fill all fields for EMI calculation.";
    if (amount > 0 && rate > 0 && years > 0) {
      const emi = amount * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1);
      const total = emi * months;
      const interest = total - amount;
      result =
        `Monthly EMI: <b>₹${emi.toLocaleString(undefined, {maximumFractionDigits: 0})}</b><br>` +
        `Total Payable: ₹${total.toLocaleString(undefined, {maximumFractionDigits: 0})}<br>` +
        `Total Interest: ₹${interest.toLocaleString(undefined, {maximumFractionDigits: 0})}`;

      emiChart.data.datasets[0].data = [amount, interest];
      emiChart.update();

      emiChartContainer.addClass('visible');
    } else {
      emiChart.data.datasets[0].data = [1,1];
      emiChart.update();
      emiChartContainer.removeClass('visible');
    }
    emiResult.html(result);
  });

  // ---- RENT CALCULATION with Annual Increment ----
  $('#calcRent').on('click', function () {
    const base = parseFloat($('#rentAmount').val()) || 0;
    const months = parseInt($('#rentMonths').val()) || 0;
    const inc = parseFloat($('#rentIncrement').val()) || 0;
    let result = "Fill all fields for rent calculation.";
    if (base > 0 && months > 0) {
      let total = 0;
      let rent = base;
      for(let m=1; m<=months; m++) {
        total += rent;
        if(m % 12 === 0 && inc > 0) rent += rent * (inc/100);
      }
      result = `Total Rent${inc>0?` <small>(with ${inc}% annual increment)</small>`:''}: <b>₹${total.toLocaleString()}</b>`;
    }
    rentResult.html(result);
  });

  // On initial load, ensure correct tab, only EMI visible, pie chart hidden, results cleared
  emiBtn.addClass('active');
  rentBtn.removeClass('active');
  emiPane.addClass('active').show();
  rentPane.removeClass('active').hide();
  emiChartContainer.removeClass('visible');
  emiResult.empty();
  rentResult.empty();
});

function checkLoginStatus() {
  const isLoggedIn = localStorage.getItem('isloggedIn') === 'true';
  const blurOverlay = document.getElementById('blur-overlay');
  const mainCalcBox = document.querySelector('.main-calc-container');
  if (!isLoggedIn) {
    blurOverlay.classList.remove('hidden');
    mainCalcBox.classList.add('blurred');
  } else {
    blurOverlay.classList.add('hidden');
    mainCalcBox.classList.remove('blurred');
  }
}
// Run blur logic on page load and after each login/logout
window.addEventListener('DOMContentLoaded', checkLoginStatus);

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