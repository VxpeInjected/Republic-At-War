// Lightweight interactivity for Republic At War preview site (RaW)
// - smooth scrolling for internal anchors
// - in-page slick loading overlay for external links/buttons marked with [data-external]
// - simple modal trailer handling
// - year auto-fill

document.addEventListener('DOMContentLoaded', () => {
  // fill year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // smooth scroll for nav links to anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  // overlay control
  const overlay = document.getElementById('overlay');
  const overlayText = document.getElementById('overlayText');

  function showOverlay(message = 'Engaging hyperdrive…') {
    if (!overlay) return;
    overlay.setAttribute('aria-hidden', 'false');
    overlayText && (overlayText.textContent = message);
  }
  function hideOverlay() {
    if (!overlay) return;
    overlay.setAttribute('aria-hidden', 'true');
  }

  // click handlers for any element with data-external and data-href
  document.querySelectorAll('[data-external][data-href]').forEach(el => {
    el.addEventListener('click', (e) => {
      // If element is an anchor and already has href that's external, allow default. We still intercept to show overlay.
      e.preventDefault();
      const href = el.getAttribute('data-href');
      // Custom label if present
      const label = el.getAttribute('data-label') || '';
      showOverlay(label ? `${label} — Launching…` : 'Engaging hyperdrive…');

      // small animation duration, then navigate
      // If link is same origin anchor -> smooth scroll; else navigate window.location
      const isAnchor = href && href.startsWith('#');
      const wait = 950; // ms; keeps the overlay slick but quick
      setTimeout(() => {
        if (isAnchor) {
          const id = href.slice(1);
          const target = document.getElementById(id);
          if (target) {
            target.scrollIntoView({behavior:'smooth', block:'start'});
            hideOverlay();
          } else {
            hideOverlay();
          }
        } else {
          // external — navigate after a short fade
          // open in same tab to allow Github Pages linking; adjust to open in new tab if desired
          window.location.href = href;
        }
      }, wait);
    });
  });

  // allow clicking overlay to cancel (optional)
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      // only hide if click outside the content
      if (e.target === overlay) hideOverlay();
    });
  }

  // Trailer modal
  const modal = document.getElementById('modal');
  const trailerBtn = document.getElementById('watch-trailer');
  const modalClose = modal ? modal.querySelector('.modal-close') : null;
  const trailerFrame = document.getElementById('trailerFrame');

  function openModal(trailerUrl = '') {
    if (!modal) return;
    if (trailerFrame && trailerUrl) {
      // ensure autoplay disabled unless you want autoplay — many browsers block autoplay
      trailerFrame.src = trailerUrl;
    }
    modal.setAttribute('aria-hidden', 'false');
  }
  function closeModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    if (trailerFrame) trailerFrame.src = '';
  }

  if (trailerBtn) {
    trailerBtn.addEventListener('click', () => {
      // Replace the URL below with your YouTube embed URL (recommended).
      // Example: "https://www.youtube.com/embed/VIDEO_ID?rel=0&autoplay=1"
      const demoTrailer = ''; // <-- put your embed URL here
      if (demoTrailer) openModal(demoTrailer);
      else {
        // simple feedback: show overlay then hide
        showOverlay('Preparing trailer…');
        setTimeout(hideOverlay, 800);
      }
    });
  }
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // keyboard: Esc to close modal or overlay
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      hideOverlay();
    }
  });

});
