// DOM elements
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const phoneInput = document.getElementById('phone');
const altPhoneInput = document.getElementById('altPhone');
const form = document.getElementById('contactForm');

// Password requirements elements
const requirements = {
    length: document.getElementById('length'),
    uppercase: document.getElementById('uppercase'),
    lowercase: document.getElementById('lowercase'),
    number: document.getElementById('number'),
    special: document.getElementById('special')
};

// Password toggle functionality with monkey emojis
if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        
        // Toggle monkey emojis
        if (type === 'password') {
            this.innerHTML = '🙈'; // See-no-evil monkey for hidden password
        } else {
            this.innerHTML = '🙉'; // Monkey face for visible password
        }
    });
}

// Password validation in real-time
if (passwordInput) {
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        
        // Check length (at least 7 characters)
        const hasLength = password.length >= 7;
        updateRequirement(requirements.length, hasLength);
        
        // Check for uppercase letter
        const hasUppercase = /[A-Z]/.test(password);
        updateRequirement(requirements.uppercase, hasUppercase);
        
        // Check for lowercase letter
        const hasLowercase = /[a-z]/.test(password);
        updateRequirement(requirements.lowercase, hasLowercase);
        
        // Check for number
        const hasNumber = /\d/.test(password);
        updateRequirement(requirements.number, hasNumber);
        
        // Check for special character
        const hasSpecial = /[\W_]/.test(password);
        updateRequirement(requirements.special, hasSpecial);
    });
}

// Update requirement styling
function updateRequirement(element, isValid) {
    if (element) {
        if (isValid) {
            element.classList.add('valid');
        } else {
            element.classList.remove('valid');
        }
    }
}

// Phone number input restrictions (only integers)
function restrictToIntegers(input) {
    if (!input) return;
    
    input.addEventListener('input', function(e) {
        // Remove any non-digit characters
        this.value = this.value.replace(/\D/g, '');
        // Limit to 10 digits
        if (this.value.length > 10) {
            this.value = this.value.slice(0, 10);
        }
    });
    
    // Prevent non-numeric input
    input.addEventListener('keypress', function(e) {
        const char = String.fromCharCode(e.which);
        if (!/[0-9]/.test(char)) {
            e.preventDefault();
        }
    });
    
    // Prevent paste of non-numeric content
    input.addEventListener('paste', function(e) {
        e.preventDefault();
        const paste = (e.clipboardData || window.clipboardData).getData('text');
        const numericPaste = paste.replace(/\D/g, '').slice(0, 10);
        this.value = numericPaste;
    });
}

// Apply phone number restrictions
restrictToIntegers(phoneInput);
restrictToIntegers(altPhoneInput);

// Form submission handling
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const $submitBtn = $('.submit-btn', form);
        
        // Validate password meets all requirements
        const password = passwordInput.value;
        const isValidPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{7,}$/.test(password);
        
        if (!isValidPassword) {
            alert('Please ensure your password meets all requirements.');
            passwordInput.focus();
            return;
        }
        
        // Validate phone numbers
        const phone = phoneInput.value;
        const altPhone = altPhoneInput.value;
        
        if (phone.length !== 10) {
            alert('Phone number must be exactly 10 digits.');
            phoneInput.focus();
            return;
        }
        
        if (altPhone && altPhone.length !== 10) {
            alert('Alternate phone number must be exactly 10 digits or left empty.');
            altPhoneInput.focus();
            return;
        }
        
        // If all validations pass
        console.log('Form Data:', {
            fname: document.getElementById('fname').value,
            mname: document.getElementById('mname').value,
            lname: document.getElementById('lname').value,
            email: document.getElementById('email').value,
            password: password,
            gender: document.getElementById('gender').value,
            phone: phone,
            alternatePhone: altPhone
        });

        showLoadingDots($submitBtn);

        fetch('registration.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            fname: document.getElementById('fname').value,
            mname: document.getElementById('mname').value,
            lname: document.getElementById('lname').value,
            email: document.getElementById('email').value,
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
            gender: document.getElementById('gender').value,
            phone: document.getElementById('phone').value,
            altPhone: document.getElementById('altPhone').value
        })
    })
    
    .then(async response => {
    hideLoadingDots($submitBtn);

    if (!response.ok) {
        // Try to parse error message from server
        let errorText = await response.text();
        try {
            const errorJson = JSON.parse(errorText);
            alert(errorJson.error || `Server error: ${response.status}`);
        } catch {
            alert(`Server error: ${response.status} ${response.statusText}`);
        }
        return;
    }

    let data;
    try {
        data = await response.json();
    } catch (jsonError) {
        alert("Invalid JSON response from server.");
        return;
    }

    if (data.message) {
        alert(data.message);
        // localStorage.setItem('issignedUp', 'true');
        
        // alert('Registration successful.');
        closeModal('signupModal');
        showModal('loginModal');

    } else if (data.error) {
        alert("Registration failed: " + data.error);
    } else {
        alert("Unexpected server response.");
    }
})
.catch(err => {
    hideLoadingDots($submitBtn);
    alert('Network or server error: ' + err.message);
});

    });
}

// new things

function updateDropdownMenu() {
  const isloggedIn = localStorage.getItem('isloggedIn') === 'true';
  document.getElementById('loggedOutMenu').style.display = isloggedIn ? 'none' : 'block';
  document.getElementById('loggedInMenu').style.display = isloggedIn ? 'block' : 'none';
}
window.addEventListener('DOMContentLoaded', updateDropdownMenu);



// Show loading animation on a button: disables button & replaces content with animated dots
function showLoadingDots($button) {
  $button.prop('disabled', true);
  $button.data('original-html', $button.html());  // Save original content
  $button.html('<span class="button-loading-dots"><span>•</span><span>•</span><span>•</span></span>');
}

// Hide loading animation on a button: restores original content and enables button
function hideLoadingDots($button) {
  $button.prop('disabled', false);
  const originalHtml = $button.data('original-html');
  if (originalHtml !== undefined) {
    $button.html(originalHtml);
  }
}

const signoutBtn = document.getElementById('signoutBtn');
if (signoutBtn) {
  signoutBtn.addEventListener('click', function() {
    localStorage.setItem('isloggedIn', 'false');
    updateDropdownMenu();
    // Optionally, redirect user after sign out
     window.location.href = 'homepage.html';
  });
}


