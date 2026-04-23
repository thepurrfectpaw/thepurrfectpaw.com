/* ============================================================
   THE PURR-FECT PAW — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ----------------------------------------------------------
     NAVBAR — scroll shadow + mobile toggle
  ---------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  });

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
  }

  // Close mobile nav on link click
  document.querySelectorAll('#mobile-nav a').forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });

  /* ----------------------------------------------------------
     ANIMATED STAT COUNTERS
  ---------------------------------------------------------- */
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var duration = 2000;
    var start = null;
    var suffix = el.getAttribute('data-suffix') || '';

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('.stat-number[data-target]');
  if (counters.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (c) { observer.observe(c); });
  }

  
  /* ----------------------------------------------------------
     PRICING TABS
  ---------------------------------------------------------- */
  var tabs = document.querySelectorAll('.pricing-tab');
  var panels = document.querySelectorAll('.pricing-panel');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = tab.getAttribute('data-tab');

      tabs.forEach(function (t) { t.classList.remove('active'); });
      panels.forEach(function (p) { p.classList.remove('active'); });

      tab.classList.add('active');
      var panel = document.getElementById('tab-' + target);
      if (panel) panel.classList.add('active');
    });
  });

  /* ----------------------------------------------------------
     REVIEWS SLIDER
  ---------------------------------------------------------- */
  var track = document.querySelector('.reviews-track');
  var cards = document.querySelectorAll('.review-card');
  var dots = document.querySelectorAll('.slider-dot');
  var prevBtn = document.getElementById('slider-prev');
  var nextBtn = document.getElementById('slider-next');

  if (track && cards.length) {
    var current = 0;
    var perView = window.innerWidth < 640 ? 1 : window.innerWidth < 900 ? 2 : 3;
    var total = Math.ceil(cards.length / perView);

    function goTo(idx) {
      current = (idx + total) % total;
      var cardEl = cards[0];
      var style = window.getComputedStyle(track);
      var gap = parseInt(style.gap || style.columnGap || '20', 10);
      var cardWidth = cardEl.getBoundingClientRect().width + gap;
      var offset = current * perView * cardWidth;
      track.style.transform = 'translateX(-' + offset + 'px)';
      dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); });
    });

    var autoSlide = setInterval(function () {
      goTo(current + 1);
    }, 6000);

    track.addEventListener('mouseenter', function () { clearInterval(autoSlide); });

    window.addEventListener('resize', function () {
      perView = window.innerWidth < 640 ? 1 : window.innerWidth < 900 ? 2 : 3;
      total = Math.ceil(cards.length / perView);
      goTo(0);
    });
  }

  /* ----------------------------------------------------------
     FAQ ACCORDION
  ---------------------------------------------------------- */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item').forEach(function (i) {
        i.classList.remove('open');
      });

      // Open clicked if it was closed
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ----------------------------------------------------------
     CONTACT FORM — basic client-side handling
     (Replace action URL with Formspree endpoint when ready)
  ---------------------------------------------------------- */
  // EmailJS
  if (typeof emailjs !== 'undefined') {
    emailjs.init('Kg2d5VZ_mDuqk7Lfa'); // ← paste your public key here
  }

  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = contactForm.querySelector('button[type="submit"]');
      var original = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      var params = {
        name:    contactForm.querySelector('#name').value,
        email:   contactForm.querySelector('#email').value,
        phone:   contactForm.querySelector('#phone').value,
        service: contactForm.querySelector('#service').value,
        message: contactForm.querySelector('#message').value
      };

      emailjs.send('service_enphpal', 'template_adppkl8', params)
        .then(function() {
          return emailjs.send('service_enphpal', 'template_k796u3p', params);
        })
        .then(function() {
          btn.textContent = 'Message Sent! ✓';
          contactForm.reset();
          setTimeout(function() {
            btn.textContent = original;
            btn.disabled = false;
          }, 3000);
        })
        .catch(function(err) {
          console.error('EmailJS error:', err);
          btn.textContent = 'Error — please call us';
          btn.disabled = false;
        });
    });
  }

  /* ----------------------------------------------------------
     SMOOTH SCROLL for all anchor links
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = link.getAttribute('href').slice(1);
      var target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        var offset = navbar ? navbar.offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.scrollY - offset - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* HERO AUTOPLAY FALLBACK */
  var heroVid = document.querySelector('#hero video');
  if (heroVid) {
    heroVid.play().catch(function() {
      heroVid.muted = true;
      heroVid.play();
    });
  }

  /* VIDEO MODAL */
  var heroThumb = document.getElementById('hero-video-thumb');
  var videoModal = document.getElementById('video-modal');
  var modalVideo = document.getElementById('modal-video');
  var modalClose = document.getElementById('modal-close');
  var modalBackdrop = document.getElementById('modal-backdrop');

  function openModal(e) {
    e.stopPropagation();
    videoModal.style.display = 'flex';
    modalVideo.currentTime = 0;
    modalVideo.play();
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    videoModal.style.display = 'none';
    modalVideo.pause();
    modalVideo.currentTime = 0;
    document.body.style.overflow = '';
  }

  if (heroThumb) heroThumb.addEventListener('click', openModal);
  if (modalClose) modalClose.addEventListener('click', function(e) { e.stopPropagation(); closeModal(); });
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
  });

  /* ----------------------------------------------------------
     PARALLAX PAW PATTERN
  ---------------------------------------------------------- */
  var parallaxSections = document.querySelectorAll('#hero, #about, #reviews, #team, #contact, #how-it-works, #area, #FAQ');
  var parallaxPanels = document.querySelectorAll('.pricing-panel');

  function updateParallax() {
    parallaxSections.forEach(function(section) {
      var before = section;
      var rect = section.getBoundingClientRect();
      var scrolled = -rect.top * 0.25;
      section.style.setProperty('--parallax-y', scrolled + 'px');
    });
    parallaxPanels.forEach(function(panel) {
      var rect = panel.getBoundingClientRect();
      var scrolled = -rect.top * 0.25;
      panel.style.setProperty('--parallax-y', scrolled + 'px');
    });
  }

  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();

  /* GALLERY SLIDERS */
  function initGallery(trackId, prevId, nextId) {
    var track = document.getElementById(trackId);
    var prev = document.getElementById(prevId);
    var next = document.getElementById(nextId);
    if (!track) return;
    var pos = 0;
    var imgs = track.querySelectorAll('img');
    var total = imgs.length;

    function getSlideWidth() {
      return imgs[0].offsetWidth + 12;
    }

    function update() {
      track.style.transform = 'translateX(-' + (pos * getSlideWidth()) + 'px)';
    }

    if (prev) prev.addEventListener('click', function() {
      pos = pos > 0 ? pos - 1 : total - 4;
      update();
    });

    if (next) next.addEventListener('click', function() {
      pos = pos < total - 4 ? pos + 1 : 0;
      update();
    });
  }

  initGallery('gallery1-track', 'gallery1-prev', 'gallery1-next');
  initGallery('gallery2-track', 'gallery2-prev', 'gallery2-next');
  /* PRICING CALCULATOR */
 function initCalc(prefix) {
    var isDogWalking = prefix === 'dw';
    var state = { duration: 25, counts: {25: 0, 31: 0, 41: 0}, pets: 'multi', payment: 'card' };
    var totalEl = document.getElementById(prefix + '-total');
    var breakdownEl = document.getElementById(prefix + '-breakdown');
    var minusBtn = document.getElementById(prefix + '-minus');
    var plusBtn = document.getElementById(prefix + '-plus');
    var countEl = document.getElementById(prefix + '-count');
    var panel = prefix === 'ps' ? document.getElementById('tab-petsitting') : document.getElementById('tab-dogwalking');
    if (!totalEl || !panel) return;

    function updateCountDisplay() {
      if (countEl) countEl.textContent = state.counts[state.duration];
    }

    function recalc() {
      var lines = [];
      var base = 0;
      var totalVisits = 0;

      [25, 31, 41].forEach(function(price) {
        var count = state.counts[price];
        if (count > 0) {
          var mins = price === 25 ? '15' : price === 31 ? '30' : '45';
          base += price * count;
          totalVisits += count;
          lines.push(count + ' × ' + mins + ' min ($' + price + '): $' + (price * count).toFixed(2));
        }
      });

      if (totalVisits === 0) {
        breakdownEl.innerHTML = '<em style="opacity:0.5">Select a visit length and add visits to calculate</em>';
        totalEl.textContent = '$0.00';
        return;
      }

      var disc = 0;
      if (state.pets === 'single') { disc += 0.10; lines.push('Single pet discount: −10%'); }
      if (isDogWalking && totalVisits >= 10) { disc += 0.05; lines.push('Daily discount (10+ walks): −5%'); }
      if (state.payment === 'cash') { disc += 0.05; lines.push('Cash discount: −5%'); }

      var totalCost = base * (1 - disc);
      var perVisit = totalCost / totalVisits;
      var label = isDogWalking ? 'walk' : 'visit';
      lines.push('Total for ' + totalVisits + ' ' + label + (totalVisits > 1 ? 's' : '') + ': $' + totalCost.toFixed(2));

      breakdownEl.innerHTML = lines.join('<br>');
      totalEl.textContent = '$' + perVisit.toFixed(2);
    }

    if (minusBtn) minusBtn.addEventListener('click', function() {
      if (state.counts[state.duration] > 0) {
        state.counts[state.duration]--;
        updateCountDisplay();
        recalc();
      }
    });

    if (plusBtn) plusBtn.addEventListener('click', function() {
      state.counts[state.duration]++;
      updateCountDisplay();
      recalc();
    });

    panel.querySelectorAll('.calc-toggle').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var calcType = btn.getAttribute('data-calc');
        var val = btn.getAttribute('data-value');
        panel.querySelectorAll('.calc-toggle[data-calc="' + calcType + '"]').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        if (calcType === 'duration') {
          state.duration = parseInt(val, 10);
          updateCountDisplay();
        } else {
          state[calcType] = val;
        }
        recalc();
      });
    });

    recalc();
  }

  initCalc('ps');
  initCalc('dw');

  /* ----------------------------------------------------------
     SCROLL TO TOP
  ---------------------------------------------------------- */
  var scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', function () {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    });
    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ----------------------------------------------------------
     DARK MODE TOGGLE
  ---------------------------------------------------------- */
  var darkToggle = document.getElementById('dark-toggle');
  var isDark = localStorage.getItem('ppaw-dark') === 'true';

  function applyDark(on) {
    document.body.classList.toggle('dark-mode', on);
    if (darkToggle) darkToggle.textContent = on ? '☀️' : '🌙';
    localStorage.setItem('ppaw-dark', on);
  }

  applyDark(isDark);

  if (darkToggle) {
    darkToggle.addEventListener('click', function () {
      applyDark(!document.body.classList.contains('dark-mode'));
    });
  }

  /* MAP SWITCHER */
  document.querySelectorAll('.map-switch-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var target = btn.getAttribute('data-map');

      document.querySelectorAll('.map-switch-btn').forEach(function(b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');

      // Desktop maps
      var wacoMap = document.getElementById('map-waco');
      var templeMap = document.getElementById('map-temple');
      if (wacoMap) wacoMap.style.display = target === 'waco' ? 'block' : 'none';
      if (templeMap) templeMap.style.display = target === 'temple' ? 'block' : 'none';

      // Mobile thumbnails
      var wacoThumb = document.getElementById('thumb-waco');
      var templeThumb = document.getElementById('thumb-temple');
      if (wacoThumb) wacoThumb.style.display = target === 'waco' ? 'block' : 'none';
      if (templeThumb) templeThumb.style.display = target === 'temple' ? 'block' : 'none';
    });
  });

  /* TEAM SLIDER */
  var teamTrack = document.querySelector('.team-track');
  var teamCards = document.querySelectorAll('.team-card');
  var teamDotsContainer = document.getElementById('team-dots');
  var teamPrev = document.getElementById('team-prev');
  var teamNext = document.getElementById('team-next');

  if (teamTrack && teamCards.length) {
    var teamCurrent = 0;
    var teamPerView = window.innerWidth < 400 ? 1 : window.innerWidth < 640 ? 2 : window.innerWidth < 900 ? 3 : 5;
    var teamTotal = Math.ceil(teamCards.length / teamPerView);

    function buildTeamDots() {
      if (!teamDotsContainer) return;
      teamDotsContainer.innerHTML = '';
      for (var i = 0; i < teamTotal; i++) {
        var dot = document.createElement('button');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Team page ' + (i + 1));
        teamDotsContainer.appendChild(dot);
        (function(idx) {
          dot.addEventListener('click', function() { goToTeam(idx); });
        })(i);
      }
    }

    function goToTeam(idx) {
      teamCurrent = (idx + teamTotal) % teamTotal;
      var cardWidth = teamCards[0].offsetWidth + 24;
      teamTrack.style.transform = 'translateX(-' + (teamCurrent * teamPerView * cardWidth) + 'px)';
      if (teamDotsContainer) {
        teamDotsContainer.querySelectorAll('.slider-dot').forEach(function(d, i) {
          d.classList.toggle('active', i === teamCurrent);
        });
      }
    }

    buildTeamDots();

    if (teamPrev) teamPrev.addEventListener('click', function() { goToTeam(teamCurrent - 1); });
    if (teamNext) teamNext.addEventListener('click', function() { goToTeam(teamCurrent + 1); });

    var teamAuto = setInterval(function() { goToTeam(teamCurrent + 1); }, 5000);
    if (teamTrack) teamTrack.addEventListener('mouseenter', function() { clearInterval(teamAuto); });

    window.addEventListener('resize', function() {
      teamPerView = window.innerWidth < 400 ? 1 : window.innerWidth < 640 ? 2 : window.innerWidth < 900 ? 3 : 5;
      teamTotal = Math.ceil(teamCards.length / teamPerView);
      buildTeamDots();
      goToTeam(0);
    });
  }
  document.querySelectorAll('.faq-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.faq-tab').forEach(function(t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      document.querySelectorAll('.faq-panel').forEach(function(p) {
        p.classList.remove('active');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      var panel = document.getElementById(tab.getAttribute('aria-controls'));
      if (panel) panel.classList.add('active');
    });
  });

  /* PHOTO LIGHTBOX */
  var photoModal = document.getElementById('photo-modal');
  var photoModalImg = document.getElementById('photo-modal-img');
  var photoModalClose = document.getElementById('photo-modal-close');

  document.querySelectorAll('.gallery-strip-track img').forEach(function(img) {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function() {
      photoModalImg.src = img.src;
      photoModalImg.alt = img.alt;
      photoModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });

  function closePhotoModal() {
    photoModal.style.display = 'none';
    document.body.style.overflow = '';
  }

  if (photoModalClose) photoModalClose.addEventListener('click', function(e) {
    e.stopPropagation();
    closePhotoModal();
  });

  if (photoModal) photoModal.addEventListener('click', function(e) {
    if (e.target !== photoModalImg) closePhotoModal();
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && photoModal.style.display === 'flex') closePhotoModal();
  });

  /* BENEFITS SLIDER DOTS (mobile) */
  var benefitsGrid = document.querySelector('.benefits-grid');
  var benefitsDots = document.getElementById('benefits-dots');

  function initBenefitsDots() {
    if (!benefitsGrid || !benefitsDots) return;
    if (window.innerWidth > 640) { benefitsDots.innerHTML = ''; return; }

    var cards = benefitsGrid.querySelectorAll('.benefit-card');
    benefitsDots.innerHTML = '';
    cards.forEach(function(_, i) {
      var dot = document.createElement('button');
      dot.className = 'benefits-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Benefit ' + (i + 1));
      benefitsDots.appendChild(dot);
      dot.addEventListener('click', function() {
        var cardWidth = cards[0].offsetWidth + 16;
        benefitsGrid.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
      });
    });

    benefitsGrid.addEventListener('scroll', function() {
      var cardWidth = cards[0].offsetWidth + 16;
      var current = Math.round(benefitsGrid.scrollLeft / cardWidth);
      benefitsDots.querySelectorAll('.benefits-dot').forEach(function(d, i) {
        d.classList.toggle('active', i === current);
      });
    });
  }

  initBenefitsDots();
  window.addEventListener('resize', initBenefitsDots);

  var benefitsPrev = document.getElementById('benefits-prev');
  var benefitsNext = document.getElementById('benefits-next');

  if (benefitsPrev && benefitsNext && benefitsGrid) {
    benefitsPrev.addEventListener('click', function() {
      var cards = benefitsGrid.querySelectorAll('.benefit-card');
      if (!cards.length) return;
      var cardWidth = cards[0].offsetWidth + 16;
      if (benefitsGrid.scrollLeft <= 10) {
        benefitsGrid.scrollTo({ left: benefitsGrid.scrollWidth, behavior: 'smooth' });
      } else {
        benefitsGrid.scrollBy({ left: -cardWidth, behavior: 'smooth' });
      }
    });
    benefitsNext.addEventListener('click', function() {
      var cards = benefitsGrid.querySelectorAll('.benefit-card');
      if (!cards.length) return;
      var cardWidth = cards[0].offsetWidth + 16;
      var maxScroll = benefitsGrid.scrollWidth - benefitsGrid.clientWidth;
      if (benefitsGrid.scrollLeft >= maxScroll - 10) {
        benefitsGrid.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        benefitsGrid.scrollBy({ left: cardWidth, behavior: 'smooth' });
      }
    });
  }
});