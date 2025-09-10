// ---- modal.js ----

// Show a modal by ID
function showModal(modalId) {
  document.getElementById(modalId).classList.remove('modal-hidden');
  document.getElementById(modalId).classList.add('modal-visible');
  document.body.classList.add('blurred');
  lockScroll();
}

// Hide a modal by ID, and clear form fields/messages inside it if present
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('modal-visible');
  modal.classList.add('modal-hidden');
  document.body.classList.remove('blurred');
  unlockScroll();
  // Clear specific forms when closing respective modals
  if (modalId === 'signupModal') clearForm('contactForm');
  else if (modalId === 'loginModal') clearForm('loginForm');
  else if (modalId === 'forgotPasswordModal') clearForm('forgotPasswordForm');
}

// Open the forgot password modal, close login modal if open
function openForgotPasswordModal() {
  closeModal('loginModal');
  showModal('forgotPasswordModal');
}

// Helper to reset a form and clear error/success messages in the modal
function clearForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.reset();
  // Clear error and success message inside the modal where the form resides
  const modalBox = form.closest('.modal');
  if (modalBox) {
    modalBox.querySelectorAll('.error-message, .success-message').forEach(el => el.textContent = '');
  }
}

// Clicking on overlay (modal background) closes the modal
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.modal').forEach(function(modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeModal(modal.id);
    });
  });
});


let scrollY = 0;

function lockScroll() {
  scrollY = window.scrollY || document.documentElement.scrollTop;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.classList.add('body-lock');
}

function unlockScroll() {
  document.body.classList.remove('body-lock');
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  window.scrollTo(0, scrollY);
}

