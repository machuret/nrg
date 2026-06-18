/* ==========================================================================
   NRG Finance — site behaviour
   Vanilla JS, no dependencies. Calculator math mirrors the original design
   mockup (design-source/NRG Home.dc.html) exactly.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Formatting ------------------------------------------------- */
  function fmt(n) {
    return '$' + Math.round(n).toLocaleString('en-AU');
  }
  function fmtK(n) {
    if (n >= 1000000) {
      var m = (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 2).replace(/\.00$/, '');
      return '$' + m + 'M';
    }
    return '$' + Math.round(n / 1000) + 'k';
  }

  /* ---------- Loan maths (P&I monthly repayment) ------------------------- */
  function repay(P, ratePct, years) {
    var r = ratePct / 100 / 12, n = years * 12;
    if (r === 0) return P / n;
    return P * r / (1 - Math.pow(1 + r, -n));
  }

  /* ---------- Savings + borrowing-power calculator ----------------------- */
  function initCalc(root) {
    var tabs = root.querySelectorAll('[data-tab]');
    var panels = root.querySelectorAll('[data-panel]');

    function setOut(key, value) {
      var nodes = root.querySelectorAll('[data-out="' + key + '"]');
      for (var i = 0; i < nodes.length; i++) nodes[i].textContent = value;
    }
    function val(field) {
      var el = root.querySelector('[data-field="' + field + '"]');
      return el ? parseFloat(el.value) : 0;
    }

    function recompute() {
      var bal = val('bal'), curRate = val('curRate'), nrgRate = val('nrgRate');
      var income = val('income'), expenses = val('expenses'), deposit = val('deposit');

      // --- savings ---
      var curM = repay(bal, curRate, 25);
      var newM = repay(bal, nrgRate, 25);
      var monthly = Math.max(curM - newM, 0);

      // --- borrowing power ---
      var netMonthly = (income * 0.74) / 12;
      var surplus = Math.max(netMonthly - expenses, 0) * 0.9;
      var aR = (nrgRate + 3) / 100 / 12, aN = 30 * 12;
      var borrow = aR === 0 ? surplus * aN : surplus * (1 - Math.pow(1 + aR, -aN)) / aR;

      setOut('balLabel', fmtK(bal));
      setOut('curRateLabel', curRate.toFixed(2) + '%');
      setOut('nrgRateLabel', nrgRate.toFixed(2) + '%');
      setOut('incomeLabel', fmtK(income));
      setOut('expensesLabel', fmt(expenses));
      setOut('depositLabel', fmtK(deposit));

      setOut('monthlySaving', fmt(monthly));
      setOut('yearSaving', fmt(monthly * 12));
      setOut('fiveYearSaving', fmt(monthly * 60));
      setOut('borrowAmount', fmtK(borrow));
      setOut('propertyValue', fmtK(borrow + deposit));
    }

    function showTab(name) {
      for (var i = 0; i < tabs.length; i++) {
        tabs[i].setAttribute('aria-selected', String(tabs[i].getAttribute('data-tab') === name));
      }
      for (var j = 0; j < panels.length; j++) {
        panels[j].classList.toggle('is-hidden', panels[j].getAttribute('data-panel') !== name);
      }
    }

    for (var t = 0; t < tabs.length; t++) {
      (function (tab) {
        tab.addEventListener('click', function () { showTab(tab.getAttribute('data-tab')); });
      })(tabs[t]);
    }

    var sliders = root.querySelectorAll('[data-field]');
    for (var s = 0; s < sliders.length; s++) {
      sliders[s].addEventListener('input', recompute);
    }

    recompute();
  }

  /* ---------- Mobile navigation ------------------------------------------ */
  function initNav() {
    var header = document.querySelector('.site-header');
    var toggle = document.querySelector('.nav-toggle');
    if (!header || !toggle) return;

    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    // close the drawer when a link is tapped
    var nav = header.querySelector('.nav');
    if (nav) {
      nav.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
          header.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  /* ---------- Contact form (front-end only) ------------------------------ */
  function initForm() {
    var form = document.querySelector('[data-contact-form]');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('[data-form-status]');
      if (status) {
        status.hidden = false;
        status.textContent =
          'Thanks — your message is ready to send. (This demo form needs a backend or form service wired up before it delivers email.)';
        status.focus && status.focus();
      }
      // Fallback: open the visitor's mail client with the details prefilled.
      try {
        var data = new FormData(form);
        var body =
          'Name: ' + (data.get('name') || '') + '\n' +
          'Phone: ' + (data.get('phone') || '') + '\n' +
          'Email: ' + (data.get('email') || '') + '\n' +
          'Help with: ' + (data.get('topic') || '') + '\n\n' +
          (data.get('message') || '');
        var href = 'mailto:admin@nrgwealthservices.com.au?subject=' +
          encodeURIComponent('Website enquiry — ' + (data.get('topic') || 'General')) +
          '&body=' + encodeURIComponent(body);
        window.location.href = href;
      } catch (err) { /* no-op */ }
    });
  }

  /* ---------- Scroll reveal ---------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll('[data-reveal]');
    if (!items.length || !('IntersectionObserver' in window)) {
      for (var i = 0; i < items.length; i++) items[i].classList.add('reveal');
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    for (var j = 0; j < items.length; j++) io.observe(items[j]);
  }

  /* ---------- Boot ------------------------------------------------------- */
  function boot() {
    var calcs = document.querySelectorAll('[data-calc]');
    for (var i = 0; i < calcs.length; i++) initCalc(calcs[i]);
    initNav();
    initForm();
    initReveal();
    // stamp current year wherever needed
    var years = document.querySelectorAll('[data-year]');
    for (var y = 0; y < years.length; y++) years[y].textContent = String(new Date().getFullYear());
  }

  if (document.readyState !== 'loading') boot();
  else document.addEventListener('DOMContentLoaded', boot);
})();
