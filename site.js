/* Shared behaviour: nav scroll state + robust reveal-on-scroll.
   Content is visible by default; this only ADDS entrance animation. */
(function () {
  // Scroll progress bar
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);
  var updateBar = function () {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  };
  updateBar();
  window.addEventListener('scroll', updateBar, { passive: true });
  window.addEventListener('resize', updateBar);

  // Nav scroll state
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 24); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Entrance animations only when JS runs
  document.documentElement.classList.add('anim');

  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  var show = function (el) { el.classList.add('in'); };
  var inView = function (el) {
    var r = el.getBoundingClientRect();
    return r.top < (window.innerHeight || 800) - 30 && r.bottom > 0;
  };

  var io;
  try {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } catch (_) { reveals.forEach(show); }

  var sweep = function () {
    reveals.forEach(function (el) { if (!el.classList.contains('in') && inView(el)) show(el); });
  };
  requestAnimationFrame(function () { sweep(); requestAnimationFrame(sweep); });
  window.addEventListener('scroll', sweep, { passive: true });
  window.addEventListener('load', sweep);
  // Safety: never leave content hidden
  setTimeout(function () { reveals.forEach(show); }, 1500);
})();
