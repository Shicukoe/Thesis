const letterColorClasses = {
  H: "color-blue",
  O: "color-red",
  D: "color-yellow",
};

const navButtons = document.querySelectorAll(".nav-btn");
const pageSections = document.querySelectorAll(".page");

navButtons.forEach((button) => {
  const firstLetter = button.textContent.trim().charAt(0).toUpperCase();
  const colorClass = letterColorClasses[firstLetter];
  if (colorClass) {
    button.classList.add(colorClass);
  }
});

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    navButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    pageSections.forEach((section) => {
      section.classList.toggle("active", section.id === `page-${button.dataset.page}`);
    });
  });
});

const contactForm = document.getElementById("contact-form");
const nameInput = document.getElementById("contact-name");
const emailInput = document.getElementById("contact-email");
const messageInput = document.getElementById("contact-message");
const successMessage = document.getElementById("contact-form-success");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setFieldError(input, message) {
  const errorEl = document.getElementById(`${input.id}-error`);
  errorEl.textContent = message;
  input.classList.toggle("invalid", Boolean(message));
}

function validateName() {
  if (!nameInput.value.trim()) {
    setFieldError(nameInput, "Name is required.");
    return false;
  }
  setFieldError(nameInput, "");
  return true;
}

function validateEmail() {
  const value = emailInput.value.trim();
  if (!value) {
    setFieldError(emailInput, "Email is required.");
    return false;
  }
  if (!emailPattern.test(value)) {
    setFieldError(emailInput, "Enter a valid email address.");
    return false;
  }
  setFieldError(emailInput, "");
  return true;
}

function validateMessage() {
  if (!messageInput.value.trim()) {
    setFieldError(messageInput, "Message is required.");
    return false;
  }
  setFieldError(messageInput, "");
  return true;
}

emailInput.addEventListener("blur", validateEmail);
emailInput.addEventListener("input", () => {
  if (emailInput.classList.contains("invalid")) {
    validateEmail();
  }
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  successMessage.hidden = true;

  const isNameValid = validateName();
  const isEmailValid = validateEmail();
  const isMessageValid = validateMessage();

  if (!isNameValid || !isEmailValid || !isMessageValid) {
    return;
  }

  successMessage.hidden = false;
  contactForm.reset();
});
