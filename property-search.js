document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('propertySearchForm');
  const resultsDiv = document.getElementById('propertyResults');
  const globalErrorMsg = document.getElementById('formErrorMessage');

  if (!form) {
    console.error('Search form with id="propertySearchForm" not found!');
    return;
  }
  if (!resultsDiv) {
    console.error('Results container with id="propertyResults" not found!');
    return;
  }
  if (!globalErrorMsg) {
    console.warn('Global error message element with id="formErrorMessage" not found.');
  }

  function clearFieldError(id) {
    const span = document.getElementById(id);
    const input = document.querySelector(`[name=${id.replace('Error', '')}]`) ||
      document.getElementById(id.replace('Error', ''));
    if (span) span.textContent = '';
    if (input) input.classList.remove('invalid');
  }

  function showFieldError(id, message) {
    const span = document.getElementById(id);
    const input = document.querySelector(`[name=${id.replace('Error', '')}]`) ||
      document.getElementById(id.replace('Error', ''));
    if (span) span.textContent = message;
    if (input) input.classList.add('invalid');
  }

  function escapeHtml(str = '') {
    if (typeof str !== 'string') return str;
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeJsString(str = '') {
    if (typeof str !== 'string') return str;
    return str.replace(/'/g, '\\\'').replace(/"/g, '\\\"');
  }

  function validateInputs(minPrice, maxPrice) {
    let isValid = true;
    clearFieldError('minPriceError');
    clearFieldError('maxPriceError');

    if (minPrice && isNaN(minPrice)) {
      showFieldError('minPriceError', 'Min price must be a number');
      isValid = false;
    } else if (minPrice && Number(minPrice) < 0) {
      showFieldError('minPriceError', 'Min price must be positive');
      isValid = false;
    }

    if (maxPrice && isNaN(maxPrice)) {
      showFieldError('maxPriceError', 'Max price must be a number');
      isValid = false;
    } else if (maxPrice && Number(maxPrice) < 0) {
      showFieldError('maxPriceError', 'Max price must be positive');
      isValid = false;
    }

    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
      showFieldError('maxPriceError', 'Max price must be ≥ min price');
      isValid = false;
    }

    return isValid;
  }

  function buildUrl({ city, min_price, max_price, p_type }) {
    const url = new URL('property-search.php', window.location.href);

    if (city && city.toLowerCase() !== 'all') url.searchParams.append('city', city);
    if (min_price) url.searchParams.append('min_price', min_price);
    if (max_price) url.searchParams.append('max_price', max_price);
    if (p_type && p_type.toLowerCase() !== 'all') url.searchParams.append('p_type', p_type);

    return url.toString();
  }

  function renderProperties(properties, container) {
    container.classList.remove('no-results'); // Clear previous no-results class
    container.innerHTML = '';

    if (!properties.length) {
      container.textContent = 'No properties found for the given criteria!';
      container.classList.add('no-results');
      return;
    }

    properties.forEach(p => {
      const card = document.createElement('div');
      card.className = 'property-card';

      const hasImage = p.image_url && p.image_url.trim();
      const imgHtml = hasImage
        ? `<img src="${escapeHtml(p.image_url)}" alt="Image of ${escapeHtml(p.p_name || 'property')}" style="width:100%; height:140px; object-fit:cover; border-radius:7px;" />`
        : `<span style="color:#fff; font-weight:bold;">No Image Available</span>`;

      // Build address without repeating the city if it already exists
      let addressDisplay = (p.p_address || '').trim();
      if (p.city) {
        const cityTrimmed = p.city.trim();
        if (!addressDisplay) {
          addressDisplay = cityTrimmed;
        } else if (!addressDisplay.toLowerCase().includes(cityTrimmed.toLowerCase())) {
          addressDisplay += `, ${cityTrimmed}`;
        }
      }

      // Determine status color
      let statusColor = 'green';
      if (p.status && p.status.toLowerCase() === 'sold') {
        statusColor = 'red';
      }

      // Determine button text and handler based on status
      const isSold = p.status && p.status.toLowerCase() === 'sold';
      const buttonHtml = isSold
        ? `<button class="search-btn notify-btn" onclick="notifyMe('${escapeJsString(p.p_name || '')}')">Notify Me</button>`
        : `<button class="search-btn" onclick="contactForProperty('${escapeJsString(p.p_name || '')}')">Contact Us</button>`;

      card.innerHTML = `
        <div class="property-image" style="width:100%; height:140px; background: linear-gradient(135deg, #764ba2, #667eea); border-radius: 10px; display:flex; align-items:center; justify-content:center;">
          ${imgHtml}
        </div>
        <h3>${escapeHtml(p.p_name || 'Unnamed Property')}</h3>
        <p><strong>Address:</strong> ${escapeHtml(addressDisplay)}</p>
        <p><strong>Type:</strong> ${escapeHtml(p.p_type || '')}</p>
        <p><strong>Price:</strong> ₹${p.price_lakhs !== undefined ? p.price_lakhs : 'N/A'} Lakhs</p>
        <p><strong>Status:</strong> <span style="color:${statusColor}; font-weight:bold;">${escapeHtml(p.status || 'Available')}</span></p>
        ${buttonHtml}
      `;

      container.appendChild(card);
    });
  }

  async function fetchProperties(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Server error ${response.status}: ${response.statusText}`);
    }
    const text = await response.text();
    if (!text.trim()) {
      throw new Error('Empty response from server');
    }

    // Defensive try-catch for JSON parse to capture invalid response
    try {
      return JSON.parse(text);
    } catch (error) {
      console.error('Failed parsing JSON:', error, 'Response text:', text);
      throw new Error('Invalid JSON returned from server');
    }
  }

  window.contactForProperty = function (name) {
    alert(`Thank you for your interest in ${name}. We will contact you shortly!`);
  };

  window.notifyMe = function (name) {
    alert(`You will be notified when the property "${name}" becomes available.`);
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (globalErrorMsg) globalErrorMsg.textContent = '';
    ['locationError', 'typeError', 'minPriceError', 'maxPriceError'].forEach(clearFieldError);

    const city = document.getElementById('locationInput')?.value.trim() || '';
    const p_type = document.getElementById('propertyType')?.value.trim() || '';
    const minVal = document.getElementById('minPrice')?.value.trim() || '';
    const maxVal = document.getElementById('maxPrice')?.value.trim() || '';

    if (!validateInputs(minVal, maxVal)) {
      return;
    }

    const url = buildUrl({
      city: city,
      min_price: minVal,
      max_price: maxVal,
      p_type: p_type
    });

    console.log('Fetching URL:', url);

    resultsDiv.textContent = 'Loading properties…';
    resultsDiv.classList.add('loading');

    try {
      const data = await fetchProperties(url);

      if (data.error) {
        if (globalErrorMsg) globalErrorMsg.textContent = data.error;
        resultsDiv.textContent = '';
        resultsDiv.classList.remove('loading');
        return;
      }

      renderProperties(data, resultsDiv);
    } catch (err) {
      if (globalErrorMsg) {
        globalErrorMsg.textContent = 'An error occurred while fetching properties. Please try again later.';
      }
      resultsDiv.classList.remove('loading');
      resultsDiv.textContent = '';
      console.error(err);
    } finally {
      resultsDiv.classList.remove('loading');
    }
  });
});


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
