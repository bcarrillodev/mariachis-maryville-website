document.addEventListener("DOMContentLoaded", () => {
  // --- Mobile Menu Logic ---
  const hamburger = document.querySelector(".hamburger-menu");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });

    // Close menu when a link is clicked
    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
      });
    });
  }

  // --- Hero Slideshow Logic ---
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;
  const slideInterval = 5000;

  function ensureSlideBackground(slide) {
    if (!slide) return;

    // OPTIMIZATION: If the slide already has an <img> tag (like our LCP slide),
    // stop here. Don't try to add a background image too.
    if (slide.querySelector("img")) return;

    const bg = slide.getAttribute("data-bg");
    if (bg && !slide.style.backgroundImage) {
      slide.style.backgroundImage = `url('${bg}')`;
      // Clean up DOM
      slide.removeAttribute("data-bg");
    }
  }

  function nextSlide() {
    slides[currentSlide].classList.remove("active");

    // Wrap around logic
    currentSlide = (currentSlide + 1) % slides.length;

    // Lazy load the NEXT image right before showing it
    ensureSlideBackground(slides[currentSlide]);

    slides[currentSlide].classList.add("active");
  }

  // Start auto-cycle
  if (slides.length > 0) {
    // CRITICAL CHANGE: We do NOT run ensureSlideBackground(slides[0])
    // because Slide 0 is already loaded via your <img fetchpriority="high"> tag.

    // Only preload the *second* slide so it's ready when the animation starts
    if (slides[1]) ensureSlideBackground(slides[1]);

    // Use your smart delay logic to keep the main thread free for LCP
    requestAnimationFrame(() => {
      setTimeout(() => {
        setInterval(nextSlide, slideInterval);
      }, 800);
    });
  }

  // --- Sticky Header Shadow on Scroll ---
  const nav = document.querySelector(".sticky-nav");
  if (nav) {
    window.addEventListener("scroll", () => {
      nav.classList.toggle("scrolled", window.scrollY > 10);
    });
  }

  // --- Dynamic Hours Display ---
  const hoursDisplay = document.getElementById("hours-display");
  if (hoursDisplay) {
    const now = new Date();
    const restaurantTime = new Date(
      now.toLocaleString("en-US", { timeZone: "America/Chicago" }),
    );
    const day = restaurantTime.getDay();
    let todayHours = "";

    if (day === 0) {
      // Sunday
      todayHours = "12 p.m. - 9 p.m.";
    } else if (day >= 1 && day <= 4) {
      // Mon-Thu
      todayHours = "11 a.m. - 9 p.m.";
    } else {
      // Fri-Sat
      todayHours = "11 a.m. - 10 p.m.";
    }

    hoursDisplay.textContent = todayHours;
  }

  // --- Menu Carousel Navigation ---
  const carousel = document.querySelector(".carousel-container");
  const prevBtn = document.querySelector(".carousel-nv-btn.prev");
  const nextBtn = document.querySelector(".carousel-nv-btn.next");

  if (carousel && prevBtn && nextBtn) {
    // Scroll amount: width of card + gap approx 300 + 32 = 332
    const scrollAmount = 330;

    prevBtn.addEventListener("click", () => {
      carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });

    nextBtn.addEventListener("click", () => {
      carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });
  }

  // --- Lazy-load reCAPTCHA only when contact form is near/used ---
  const contactForm = document.querySelector(
    '.contact-form[data-netlify="true"]',
  );
  if (contactForm) {
    let recaptchaLoaded = false;
    let formObserver = null;

    const loadRecaptcha = () => {
      if (recaptchaLoaded) return;
      recaptchaLoaded = true;

      const script = document.createElement("script");
      script.src = "https://www.google.com/recaptcha/api.js";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      if (formObserver) {
        formObserver.disconnect();
      }
    };

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    
    if (submitBtn) {
      submitBtn.addEventListener("mouseover", loadRecaptcha, { once: true });
      submitBtn.addEventListener("focus", loadRecaptcha, { once: true });
    }

    contactForm.addEventListener("focusin", loadRecaptcha, { once: true });
    contactForm.addEventListener("pointerdown", loadRecaptcha, { once: true });
    contactForm.addEventListener("touchstart", loadRecaptcha, { once: true, passive: true });

    if ("IntersectionObserver" in window) {
      formObserver = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            loadRecaptcha();
          }
        },
        { rootMargin: "300px 0px" },
      );
      formObserver.observe(contactForm);
    }
  }
});
