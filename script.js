/* ===================================================================
   FMIPA – Fakultas Ilmu Komputer & Matematika
   script.js – Main JavaScript
   =================================================================== */

// -------------------------------------------------------------------
// 1. INIT AOS (Animate On Scroll)
// -------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {

  AOS.init({
    duration: 750,       // default animation duration (ms)
    easing: 'ease-out-cubic',
    once: true,          // animate only the first time element is visible
    offset: 60,          // trigger 60px before element enters viewport
  });

  // -------------------------------------------------------------------
  // 2. NAVBAR – scroll behavior
  // -------------------------------------------------------------------
  const navbar = document.getElementById('mainNavbar');

  function handleNavbarScroll () {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // run once on load

  // -------------------------------------------------------------------
  // 3. ACTIVE NAV LINK – highlight the section in viewport
  // -------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id], .hero-section[id]');
  const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle)');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href === '#' + entry.target.id) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    { rootMargin: '-30% 0px -60% 0px' }
  );

  sections.forEach((sec) => sectionObserver.observe(sec));

  // -------------------------------------------------------------------
  // 4. BACK TO TOP button
  // -------------------------------------------------------------------
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // -------------------------------------------------------------------
  // 5. SMOOTH SCROLL for anchor links
  // -------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      // Close mobile navbar if open
      const navbarCollapse = document.getElementById('navbarContent');
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) bsCollapse.hide();
      }

      const navbarHeight = navbar ? navbar.offsetHeight : 0;
      const elementPosition = target.getBoundingClientRect().top + window.scrollY;
      const offsetPosition  = elementPosition - navbarHeight - 8;

      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    });
  });

  // -------------------------------------------------------------------
  // 6. COUNTER ANIMATION – for stat numbers
  // -------------------------------------------------------------------
  function animateCounter (el, target, duration) {
    let start    = 0;
    const step   = target / (duration / 16); // 60fps approx
    const timer  = setInterval(() => {
      start += step;
      if (start >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(start);
      }
    }, 16);
  }

  // Observe the about section to trigger counters
  const statMahasiswa = document.getElementById('statMahasiswa');
  const statProdi     = document.getElementById('statProdi');

  if (statMahasiswa && statProdi) {
    const counterObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(statMahasiswa, 365, 1800);
            animateCounter(statProdi, 23, 1400);
            obs.disconnect(); // fire only once
          }
        });
      },
      { threshold: 0.3 }
    );
    counterObserver.observe(document.querySelector('.section-about') || document.body);
  }

  // -------------------------------------------------------------------
  // 7. CONTACT FORM – simple toast notification
  // -------------------------------------------------------------------
  window.handleContactForm = function (e) {
    e.preventDefault();
    const toast = document.getElementById('toastNotify');
    if (!toast) return;

    // Show toast
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3800);

    // Reset form
    e.target.reset();
  };

  // -------------------------------------------------------------------
  // 8. NAVBAR MOBILE – custom toggler animation
  // -------------------------------------------------------------------
  const toggler  = document.querySelector('.custom-toggler');
  const navMenu  = document.getElementById('navbarContent');

  if (toggler && navMenu) {
    navMenu.addEventListener('show.bs.collapse', () => toggler.classList.add('open'));
    navMenu.addEventListener('hide.bs.collapse', () => toggler.classList.remove('open'));
  }

  // -------------------------------------------------------------------
  // 9. BERITA CAROUSEL controls wired to Bootstrap carousel
  // -------------------------------------------------------------------
  const beritaCarousel = document.getElementById('beritaCarousel');
  const beritaBtns     = document.querySelectorAll('.berita-btn');

  if (beritaCarousel && beritaBtns.length) {
    beritaBtns.forEach((btn) => {
      btn.addEventListener('click', function () {
        const slide = this.getAttribute('data-bs-slide');
        const carousel = bootstrap.Carousel.getOrCreateInstance(beritaCarousel);
        if (slide === 'prev') carousel.prev();
        else carousel.next();
      });
    });
  }

  // -------------------------------------------------------------------
  // 10. HERO CAROUSEL – pause on hover
  // -------------------------------------------------------------------
  const heroCarousel = document.getElementById('heroCarousel');
  if (heroCarousel) {
    const bsHero = bootstrap.Carousel.getOrCreateInstance(heroCarousel);

    heroCarousel.addEventListener('mouseenter', () => bsHero.pause());
    heroCarousel.addEventListener('mouseleave', () => bsHero.cycle());
  }

  // -------------------------------------------------------------------
  // 11. MITRA CARDS – subtle tilt effect on hover (mouse tracking)
  // -------------------------------------------------------------------
  document.querySelectorAll('.mitra-card').forEach((card) => {
    card.addEventListener('mousemove', function (e) {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left; // mouse X inside card
      const y      = e.clientY - rect.top;  // mouse Y inside card
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -6;  // max ±6deg
      const rotateY = ((x - cx) / cx) *  6;

      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.03)`;
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

  // -------------------------------------------------------------------
  // 12. KOMPETENSI CARDS – hover glow matching card color
  // -------------------------------------------------------------------
  document.querySelectorAll('.kompetensi-card').forEach((card) => {
    const iconWrap = card.querySelector('.kompetensi-icon-wrap');
    if (!iconWrap) return;

    const color = getComputedStyle(iconWrap).getPropertyValue('--card-color').trim();

    card.addEventListener('mouseenter', function () {
      if (color) {
        card.style.boxShadow = `0 20px 48px rgba(0,0,0,.10), 0 0 0 1px ${color}, 0 0 32px ${color}18`;
      }
    });
    card.addEventListener('mouseleave', function () {
      card.style.boxShadow = '';
    });
  });

  // -------------------------------------------------------------------
  // 13. TYPING EFFECT – hero title animated text (slide 1 only)
  // -------------------------------------------------------------------
  // Small staggered reveal on first hero slide active
  function heroEntrance () {
    const activeSlide = document.querySelector('.carousel-item.active .hero-content');
    if (!activeSlide) return;

    const badge = activeSlide.querySelector('.hero-badge');
    const title = activeSlide.querySelector('.hero-title');
    const desc  = activeSlide.querySelector('.hero-desc');
    const acts  = activeSlide.querySelector('.hero-actions');

    [badge, title, desc, acts].forEach((el, i) => {
      if (!el) return;
      el.style.opacity    = '0';
      el.style.transform  = 'translateY(28px)';
      el.style.transition = `opacity .7s ease ${i * 0.15}s, transform .7s ease ${i * 0.15}s`;
      requestAnimationFrame(() => {
        el.style.opacity   = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  }

  if (heroCarousel) {
    heroCarousel.addEventListener('slid.bs.carousel', heroEntrance);
  }
  heroEntrance(); // trigger on page load

  // -------------------------------------------------------------------
  // 14. SCROLL PROGRESS INDICATOR – thin bar at top
  // -------------------------------------------------------------------
  const progressBar = document.createElement('div');
  progressBar.id = 'scrollProgress';
  Object.assign(progressBar.style, {
    position: 'fixed',
    top:      '0',
    left:     '0',
    height:   '3px',
    width:    '0%',
    background: 'linear-gradient(90deg, #2563eb, #f97316)',
    zIndex:   '9999',
    transition: 'width .08s linear',
    borderRadius: '0 2px 2px 0',
  });
  document.body.prepend(progressBar);

  window.addEventListener('scroll', function () {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress.toFixed(2) + '%';
  }, { passive: true });

}); // end DOMContentLoaded