document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Logic ---
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // --- Hero Slideshow Logic ---
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    // Start auto-cycle
    if (slides.length > 0) {
        setInterval(nextSlide, slideInterval);
    }

    // --- Sticky Header Shadow on Scroll ---
    const nav = document.querySelector('.sticky-nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) {
                nav.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            } else {
                nav.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
            }
        });
    }

    // --- Dynamic Hours Display ---
    const hoursDisplay = document.getElementById('hours-display');
    if (hoursDisplay) {
        const date = new Date();
        const day = date.getDay(); // 0 = Sunday
        let todayHours = "";

        if (day === 0) { // Sunday
            todayHours = "12 p.m. - 9 p.m.";
        } else if (day >= 1 && day <= 4) { // Mon-Thu
            todayHours = "11 a.m. - 9 p.m.";
        } else { // Fri-Sat
            todayHours = "11 a.m. - 10 p.m.";
        }

        hoursDisplay.textContent = todayHours;
    }

    // --- Menu Carousel Navigation ---
    const carousel = document.querySelector('.carousel-container');
    const prevBtn = document.querySelector('.carousel-nv-btn.prev');
    const nextBtn = document.querySelector('.carousel-nv-btn.next');

    if (carousel && prevBtn && nextBtn) {
        // Scroll amount: width of card + gap approx 300 + 32 = 332
        const scrollAmount = 330;

        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }
});
