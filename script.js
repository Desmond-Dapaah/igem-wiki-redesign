/*
  ╔══════════════════════════════════════════════════════════╗
  ║     LAYER 3 — JAVASCRIPT  (The Behaviour / Interaction)  ║
  ║  This file controls everything that MOVES or RESPONDS.   ║
  ╚══════════════════════════════════════════════════════════╝

  WHAT JAVASCRIPT DOES HERE:
  ───────────────────────────
  1. Sticky nav — adds .scrolled class when user scrolls
  2. Hero zoom — adds .loaded class on window load
  3. Hamburger menu — toggles mobile nav open/closed
  4. Scroll reveal — watches elements, adds .visible when they enter view
  5. Floating particles — dynamically creates particle elements
  6. 3D tilt effect — cards follow mouse cursor in 3D
  7. Ripple click effect — water ripple on reference logo clicks
*/


/* ═══════════════════════════════════════════════════
   1. STICKY NAVIGATION
   Listens for scroll events. When user scrolls more
   than 60px down, adds .scrolled class to the nav.
   CSS uses that class to show the dark background.
═══════════════════════════════════════════════════ */
const nav = document.getElementById('mainNav');

window.addEventListener('scroll', () => {
  // classList.toggle(className, condition)
  // adds class if condition=true, removes if condition=false
  nav.classList.toggle('scrolled', window.scrollY > 60);
});


/* ═══════════════════════════════════════════════════
   2. HERO IMAGE ZOOM ON LOAD
   The hero background starts slightly zoomed in (scale 1.08).
   Once the page fully loads, we add .loaded which CSS
   transitions back to scale(1) over 10 seconds — Ken Burns effect.
═══════════════════════════════════════════════════ */
window.addEventListener('load', () => {
  document.getElementById('heroBg').classList.add('loaded');
});


/* ═══════════════════════════════════════════════════
   3. HAMBURGER MOBILE MENU
   Clicking the hamburger button toggles:
   - .open on the hamburger (CSS animates lines into X)
   - .open on the mobile menu (CSS shows the overlay)
   - overflow:hidden on body (prevents page scrolling behind menu)
═══════════════════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');

  // Prevent body scrolling when menu is open
  const isOpen = mobileMenu.classList.contains('open');
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Called by onclick="closeMobile()" on each mobile menu link
function closeMobile() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}


/* ═══════════════════════════════════════════════════
   4. SCROLL REVEAL — IntersectionObserver
   This is the engine behind all the scroll animations.

   HOW IT WORKS:
   - We select all elements with animation classes
   - We create an "observer" that watches them
   - When an element enters the viewport (is visible),
     the observer adds the .visible class
   - CSS transitions then animate from the start state to end state
   - We "unobserve" after triggering (animation runs once)

   IntersectionObserver is better than scroll events because:
   - It doesn't fire on every scroll tick (more performant)
   - The browser handles the detection efficiently
═══════════════════════════════════════════════════ */

// Select ALL elements that have any animation class
const animElements = document.querySelectorAll(
  '.anim-fade-up, .anim-scale-in, .anim-slide-left, ' +
  '.anim-slide-right, .anim-flip, .anim-rotate-in, .anim-blur-in'
);

// Create the observer
const revealObserver = new IntersectionObserver((entries) => {
  // entries = array of observed elements that changed visibility
  entries.forEach(entry => {
    if (entry.isIntersecting) {       // element entered the viewport
      entry.target.classList.add('visible');  // CSS animation triggers
      revealObserver.unobserve(entry.target); // stop watching it
    }
  });
}, {
  threshold: 0.1  // trigger when 10% of element is visible
});

// Tell the observer to watch each element
animElements.forEach(el => revealObserver.observe(el));


/* ═══════════════════════════════════════════════════
   5. FLOATING PARTICLES in Bio-Cement section
   We dynamically CREATE <div> elements in JavaScript
   and add them to the .particles container.
   CSS @keyframes floatUp animates them rising up.
   Each particle gets random: size, position, speed, delay.
═══════════════════════════════════════════════════ */
const particleContainer = document.getElementById('particles');

for (let i = 0; i < 18; i++) {
  const particle = document.createElement('div');  // create a new <div>
  particle.className = 'particle';                 // give it the CSS class

  const size = Math.random() * 14 + 5; // random size: 5px to 19px

  // Set inline styles using cssText (like writing CSS directly on the element)
  particle.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${Math.random() * 100}%;
    animation-duration: ${Math.random() * 14 + 10}s;
    animation-delay: ${Math.random() * -20}s;
  `;

  particleContainer.appendChild(particle); // add to the DOM
}


/* ═══════════════════════════════════════════════════
   6. 3D TILT EFFECT on solution cards
   When you move your mouse over a card, it tilts in 3D
   to follow your cursor position.

   HOW IT WORKS:
   - Get mouse position relative to the card
   - Convert to -0.5 to +0.5 range (0 = center)
   - Apply rotateX and rotateY transforms
   - On mouseleave, reset the transform
═══════════════════════════════════════════════════ */
document.querySelectorAll('.sol-card').forEach(card => {

  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect(); // card's position/size on screen
    const x = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 to +0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5; // -0.5 to +0.5

    // rotateX tilts up/down, rotateY tilts left/right
    card.style.transform = `translateY(-10px) scale(1.02) rotateX(${-y * 10}deg) rotateY(${x * 10}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = ''; // reset to CSS default
  });

});


/* ═══════════════════════════════════════════════════
   7. RIPPLE CLICK EFFECT on reference logos
   When you click a reference logo, a circular ripple
   expands outward from where you clicked.

   HOW IT WORKS:
   - On click, create a <span> element
   - Position it where the mouse clicked
   - CSS @keyframes expands it and fades it out
   - Remove from DOM after animation completes
═══════════════════════════════════════════════════ */

// First, inject the keyframe animation into the page
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes rippleAnim {
    to { transform: scale(1); opacity: 0; }
  }
`;
document.head.appendChild(rippleStyle);

// Add click handler to each reference item
document.querySelectorAll('.ref-item').forEach(item => {
  item.addEventListener('click', function(e) {

    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;

    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      width: ${size}px;
      height: ${size}px;
      left: ${e.clientX - rect.left - size/2}px;
      top: ${e.clientY - rect.top  - size/2}px;
      background: rgba(79, 179, 212, 0.25);
      transform: scale(0);
      animation: rippleAnim 0.5s ease forwards;
    `;

    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600); // clean up after animation
  });
});
