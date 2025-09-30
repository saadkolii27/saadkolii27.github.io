/**
 * Script d'interactions pour le site Université Centrale.
 * Gestion du menu, animations au défilement, compteurs et formulaires.
 */

const numberFormatter = new Intl.NumberFormat("fr-FR");

document.addEventListener("DOMContentLoaded", () => {
  initHeaderScroll();
  initSmoothScroll();
  initIntersectionAnimations();
  initMobileMenu();
  initCounters();
  initContactForm();
  initNewsletterForm();
  initNotificationClose();
});

function initHeaderScroll() {
  const header = document.querySelector(".header");
  if (!header) return;

  const handleScroll = () => {
    const shouldStick = window.scrollY > 10;
    header.classList.toggle("scrolled", shouldStick);
  };

  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });
}

function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  if (!links.length) return;

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (!targetElement) return;

      event.preventDefault();
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });

      if (!targetElement.hasAttribute("tabindex")) {
        targetElement.setAttribute("tabindex", "-1");
      }
      targetElement.focus({ preventScroll: true });
    });
  });
}

function initIntersectionAnimations() {
  const elements = document.querySelectorAll(".fade-up");
  if (!elements.length) return;

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  elements.forEach((element) => observer.observe(element));
}

function initMobileMenu() {
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navMenu = document.querySelector(".nav-menu");

  if (!mobileMenuBtn || !navMenu) return;

  const icon = mobileMenuBtn.querySelector("i");

  const closeMenu = () => {
    navMenu.classList.remove("active");
    mobileMenuBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
    if (icon) {
      icon.classList.add("fa-bars");
      icon.classList.remove("fa-times");
    }
  };

  mobileMenuBtn.addEventListener("click", () => {
    const willOpen = !navMenu.classList.contains("active");
    navMenu.classList.toggle("active", willOpen);
    mobileMenuBtn.setAttribute("aria-expanded", String(willOpen));
    document.body.classList.toggle("menu-open", willOpen);

    if (icon) {
      icon.classList.toggle("fa-bars", !willOpen);
      icon.classList.toggle("fa-times", willOpen);
    }
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu.classList.contains("active")) {
        closeMenu();
      }
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });
}

function initCounters() {
  const counters = document.querySelectorAll(".counter[data-target]");
  if (!counters.length) return;

  if (!("IntersectionObserver" in window)) {
    counters.forEach((counter) => {
      if (!counter.dataset.animated) {
        animateCounter(counter);
        counter.dataset.animated = "true";
      }
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!entry.target.dataset.animated) {
            animateCounter(entry.target);
            entry.target.dataset.animated = "true";
          }
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.45,
    },
  );

  counters.forEach((counter) => observer.observe(counter));
}

function initContactForm() {
  const form = document.querySelector("#contact form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    showNotification(
      "Merci ! Nous reviendrons vers vous très rapidement.",
      "success",
    );
    form.reset();
  });
}

function initNewsletterForm() {
  const form = document.querySelector(".newsletter");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    showNotification(
      "Votre inscription à la newsletter est confirmée.",
      "success",
    );
    form.reset();
  });
}

function initNotificationClose() {
  document.body.addEventListener("click", (event) => {
    const closeButton = event.target.closest(".notification-close");
    if (!closeButton) return;

    const notification = closeButton.closest(".notification");
    if (notification) {
      hideNotification(notification);
    }
  });
}

function animateCounter(counter) {
  const targetValue = parseInt(counter.getAttribute("data-target"), 10);
  if (Number.isNaN(targetValue)) return;

  const duration = parseInt(counter.getAttribute("data-duration"), 10) || 2000;
  const startValue = parseInt(counter.textContent.replace(/\s/g, ""), 10) || 0;
  const startTime = performance.now();

  const step = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const currentValue = Math.round(
      startValue + (targetValue - startValue) * progress,
    );
    counter.textContent = formatNumber(currentValue);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
}

function formatNumber(value) {
  return numberFormatter.format(value);
}

function showNotification(message, type = "info", duration = 4000) {
  const notification = document.createElement("div");
  notification.classList.add("notification", `notification-${type}`);

  notification.innerHTML = `
    <div class="notification-content">
      <p>${message}</p>
      <button class="notification-close" type="button" aria-label="Fermer la notification">×</button>
    </div>
  `;

  document.body.appendChild(notification);

  requestAnimationFrame(() => {
    notification.classList.add("visible");
  });

  if (duration > 0) {
    window.setTimeout(() => hideNotification(notification), duration);
  }

  return notification;
}

function hideNotification(notification) {
  notification.classList.remove("visible");
  window.setTimeout(() => {
    notification.remove();
  }, 300);
}

window.ui = window.ui || {};
window.ui.showNotification = showNotification;
