const currentYear = document.querySelector("#year");
const revealItems = document.querySelectorAll(".reveal");
const slides = document.querySelectorAll(".project-slide");
const previousButton = document.querySelector(".slider-prev");
const nextButton = document.querySelector(".slider-next");
const currentSlideLabel = document.querySelector(".progress-current");
const progressBar = document.querySelector(".progress-track i");
const contactForm = document.querySelector("#contact-form");
const themeToggle = document.querySelector("#theme-toggle");
const themeStorageKey = "portfolio-theme";

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";

  if (themeToggle instanceof HTMLButtonElement) {
    themeToggle.setAttribute("aria-label", isDark ? "라이트 모드로 전환" : "다크 모드로 전환");
    themeToggle.setAttribute("aria-pressed", String(isDark));
    const icon = themeToggle.querySelector(".theme-toggle-icon");
    if (icon) icon.textContent = isDark ? "☀" : "☾";
  }
}

const savedTheme = localStorage.getItem(themeStorageKey);
applyTheme(savedTheme === "dark" ? "dark" : "light");

themeToggle?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  localStorage.setItem(themeStorageKey, nextTheme);
});

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

let activeSlide = 0;

function showSlide(index) {
  if (!slides.length) return;
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active-slide", slideIndex === activeSlide);
  });
  if (currentSlideLabel) currentSlideLabel.textContent = String(activeSlide + 1).padStart(2, "0");
  if (progressBar) progressBar.style.width = `${((activeSlide + 1) / slides.length) * 100}%`;
}

previousButton?.addEventListener("click", () => showSlide(activeSlide - 1));
nextButton?.addEventListener("click", () => showSlide(activeSlide + 1));
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") showSlide(activeSlide - 1);
  if (event.key === "ArrowRight") showSlide(activeSlide + 1);
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (contactForm instanceof HTMLFormElement) {
  const contactFields = contactForm.querySelectorAll("input[required], textarea[required]");
  const formStatus = contactForm.querySelector("#contact-form-status");
  const requiredMessages = {
    name: "이름을 입력해 주세요.",
    email: "이메일 주소를 입력해 주세요.",
    message: "메시지를 입력해 주세요."
  };

  function setFieldError(field, message) {
    const errorElement = contactForm.querySelector(`#${field.id}-error`);
    if (!errorElement) return;

    errorElement.textContent = message;
    errorElement.hidden = !message;
    field.setAttribute("aria-invalid", String(Boolean(message)));
  }

  contactFields.forEach((field) => {
    field.addEventListener("input", () => {
      setFieldError(field, "");
      if (formStatus) formStatus.textContent = "";
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let firstInvalidField = null;
    contactFields.forEach((field) => {
      let errorMessage = "";
      if (!field.value.trim()) {
        errorMessage = requiredMessages[field.name] || "필수 항목을 입력해 주세요.";
      } else if (field.type === "email" && field.validity.typeMismatch) {
        errorMessage = "올바른 이메일 주소를 입력해 주세요.";
      }

      setFieldError(field, errorMessage);
      if (errorMessage && !firstInvalidField) firstInvalidField = field;
    });

    if (firstInvalidField) {
      if (formStatus) formStatus.textContent = "입력 항목을 확인해 주세요.";
      firstInvalidField.focus();
      return;
    }

    if (formStatus) {
      formStatus.textContent = "입력 내용이 확인되었습니다. 실제 이메일은 전송되지 않았습니다.";
    }
  });
}
