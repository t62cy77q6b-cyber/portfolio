(function () {
  const pages = document.querySelectorAll('.page');
  const navDropdown = document.querySelector('.nav-dropdown');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelectorAll('.nav-dropdown a');
  const viewerImg = document.getElementById('viewer-img');
  const thumbs = document.querySelectorAll('.thumb');

  // --- Routing ---
  function showPage(hash) {
    const id = hash.replace('#', '') || 'home';
    pages.forEach(function (p) {
      if (p.id === id) {
        p.hidden = false;
        p.style.display = '';
      } else {
        p.hidden = true;
        p.style.display = 'none';
      }
    });
  }

  function onHashChange() {
    showPage(location.hash);
    closeNav();
    var id = location.hash.replace('#', '') || 'home';
    if (id === 'home') {
      startSlideshow();
    } else {
      stopSlideshow();
    }
  }

  window.addEventListener('hashchange', onHashChange);

  // Initial route
  if (!location.hash) {
    location.hash = '#home';
  } else {
    showPage(location.hash);
  }

  // --- Nav dropdown ---
  function closeNav() {
    navDropdown.classList.remove('open');
    navDropdown.setAttribute('aria-hidden', 'true');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  function toggleNav() {
    var isOpen = navDropdown.classList.toggle('open');
    navDropdown.setAttribute('aria-hidden', !isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  }

  navToggle.addEventListener('click', function (e) {
    e.stopPropagation();
    toggleNav();
  });

  document.addEventListener('click', function (e) {
    if (!navDropdown.contains(e.target) && e.target !== navToggle) {
      closeNav();
    }
  });

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeNav();
    });
  });

  // --- Slideshow ---
  var slides = document.querySelectorAll('.slide');
  var slideIndex = 0;
  var slideshowTimer = null;

  function nextSlide() {
    slides[slideIndex].classList.remove('active');
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].classList.add('active');
  }

  function startSlideshow() {
    if (!slideshowTimer) {
      slideshowTimer = setInterval(nextSlide, 3500);
    }
  }

  function stopSlideshow() {
    clearInterval(slideshowTimer);
    slideshowTimer = null;
  }

  // Start slideshow if on home page
  if (!location.hash || location.hash === '#home') {
    startSlideshow();
  }

  // --- Gallery ---
  var currentIndex = 0;
  var thumbArray = Array.from(thumbs);

  function selectThumb(index) {
    if (index < 0 || index >= thumbArray.length) return;
    currentIndex = index;

    thumbArray.forEach(function (t) { t.classList.remove('active'); });
    thumbArray[index].classList.add('active');

    var filename = thumbArray[index].getAttribute('data-img');
    viewerImg.classList.add('loading');
    viewerImg.src = 'images/' + filename;

    // Scroll active thumb into view
    thumbArray[index].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  viewerImg.addEventListener('load', function () {
    viewerImg.classList.remove('loading');
  });

  thumbArray.forEach(function (thumb, i) {
    thumb.addEventListener('click', function () {
      selectThumb(i);
    });
  });

  // --- Keyboard navigation ---
  document.addEventListener('keydown', function (e) {
    // Only navigate when on the works page
    var worksPage = document.getElementById('works');
    if (worksPage.hidden) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      selectThumb(currentIndex + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      selectThumb(currentIndex - 1);
    }
  });
})();
