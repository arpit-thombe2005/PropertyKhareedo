// ---- login.js ----

document.addEventListener('DOMContentLoaded', () => {

  /*** 1. Password toggle for login ***/
  const loginTogglePassword = document.getElementById('loginTogglePassword');
  const loginPassword = document.getElementById('loginPassword');
  if (loginTogglePassword && loginPassword) {
    loginTogglePassword.addEventListener('click', () => {
      const type = loginPassword.getAttribute('type') === 'password' ? 'text' : 'password';
      loginPassword.setAttribute('type', type);
      loginTogglePassword.textContent = type === 'password' ? '🙈' : '🙉';
    });
  }

  /*** 2. LOGIN FORM: Submit handler ***/
  const loginForm = document.getElementById('loginForm');
  const loginErrorMessage = document.getElementById('signupErrorMessage');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      loginErrorMessage.textContent = '';

      const $loginBtn = $('.submit-btn', loginForm);
      showLoadingDots($loginBtn);

      const username = loginForm.username.value.trim();
      const password = loginForm.password.value;

      if (!username || !password) {
        loginErrorMessage.textContent = 'Please enter both username and password.';
        hideLoadingDots($loginBtn);
        return;
      }

      try {
        const response = await fetch('login.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const result = await response.json();
        hideLoadingDots($loginBtn);

        if (response.ok && result.message === 'Login successful') {
          localStorage.setItem('isloggedIn', 'true');
          window.location.href = 'homepage.html';
        } else {
          loginErrorMessage.textContent = result.error || 'Invalid username or password.';
        }
      } catch (error) {
        console.error('Login error:', error);
        loginErrorMessage.textContent = 'Server error. Please try again later.';
        hideLoadingDots($loginBtn);
      }
    });
  }

  /*** 3. FORGOT PASSWORD FORM: Submit handler ***/
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');
if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const usernameOrEmail = e.target.fpUsername.value.trim();
        const errorDiv = document.getElementById('forgotPasswordError');
        const successDiv = document.getElementById('forgotPasswordSuccess');
        errorDiv.textContent = '';
        successDiv.textContent = '';

        // ✅ Button loading dots (like Login)
        const $forgotBtn = $('.submit-btn', forgotPasswordForm);
        showLoadingDots($forgotBtn);

        try {
            const resp = await fetch('forgot-password.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usernameOrEmail })
            });
            const result = await resp.json();

            if (resp.ok && result.message) {
                successDiv.textContent = result.message;
                successDiv.classList.add('success-visible'); // will add style in Step 2
            } else {
                errorDiv.textContent = result.error || 'Unable to send reset email.';
            }
        } catch (error) {
            errorDiv.textContent = 'Server error. Please try again later.';
        }

        // ✅ Remove loading dots after request finishes
        hideLoadingDots($forgotBtn);
    });
}

  /*** 4. RESET PASSWORD: Show modal if token present in URL ***/
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  if (token) {
    showModal('resetPasswordModal');
    document.getElementById('resetToken').value = token;
    // Optional: remove token from address bar
    // history.replaceState({}, document.title, window.location.pathname);
  }

  /*** 5. RESET PASSWORD FORM: Submit handler ***/
  const resetPasswordForm = document.getElementById('resetPasswordForm');
  if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const password = resetPasswordForm.password.value;
      const confirmPassword = resetPasswordForm.confirmPassword.value;
      const token = resetPasswordForm.token.value;

      const errorDiv = document.getElementById('resetPasswordError');
      const successDiv = document.getElementById('resetPasswordSuccess');
      errorDiv.textContent = '';
      successDiv.textContent = '';

      if (password !== confirmPassword) {
        errorDiv.textContent = "Passwords do not match.";
        return;
      }
      if (password.length < 6) {
        errorDiv.textContent = "Password must be at least 6 characters.";
        return;
      }
      
      try {
        const resp = await fetch('reset-password.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, password })
        });
        const result = await resp.json();
        if (resp.ok && result.message) {
    successDiv.textContent = result.message;
    successDiv.classList.add('success-visible');

    // ✅ Also show browser alert for visibility
    alert("✅ Your password has been changed successfully!");

    resetPasswordForm.reset();
    setTimeout(() => closeModal('resetPasswordModal'), 3000);

    // Optional: redirect to login modal automatically
    setTimeout(() => {
         showModal('loginModal');
     }, 3000);

} else {
    errorDiv.textContent = result.error || 'Unable to reset password.';
}
      } catch (err) {
        errorDiv.textContent = 'Server error. Please try again later.';
      }
    });
  }
});

/*** 6. Button loading animation helpers ***/
function showLoadingDots($button) {
  $button.prop('disabled', true);
  $button.data('original-html', $button.html());
  $button.html('<span class="button-loading-dots"><span>•</span><span>•</span><span>•</span></span>');
}

function hideLoadingDots($button) {
  $button.prop('disabled', false);
  const originalHtml = $button.data('original-html');
  if (originalHtml !== undefined) {
    $button.html(originalHtml);
  }
}
