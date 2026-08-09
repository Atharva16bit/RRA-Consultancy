/* =========================================================
   RRA CONSULTANCY — main.js
   Navigation, services selector, FAQ accordion
   ========================================================= */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");
  document.body.classList.remove("no-js");

  /* ---------------------------------------------------------
     NAVBAR: scroll state + mobile toggle
     --------------------------------------------------------- */
  var navbar = document.getElementById("navbar");
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");

  function onScroll() {
    if (window.scrollY > 12) {
      navbar.classList.add("is-scrolled");
    } else {
      navbar.classList.remove("is-scrolled");
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!open));
      navLinks.classList.toggle("is-open", !open);
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navToggle.setAttribute("aria-expanded", "false");
        navLinks.classList.remove("is-open");
      });
    });
  }

  /* ---------------------------------------------------------
     SERVICES DATA (single source, used by both the desktop
     selector panel and the mobile accordion)
     --------------------------------------------------------- */
  var SERVICES = {
    gst: {
      title: "GST Services",
      blurb: "Assistance with registration, returns, and the ongoing documentation GST compliance requires.",
      items: [
        "GST Registration",
        "GST Return Assistance",
        "GST Compliance",
        "GST Documentation",
        "GST Guidance"
      ]
    },
    tax: {
      title: "Income Tax",
      blurb: "Support with filing, documentation, and understanding what applies to your specific situation.",
      items: [
        "Income Tax Return Assistance",
        "Tax Documentation",
        "Tax Compliance Guidance"
      ]
    },
    accounting: {
      title: "Accounting",
      blurb: "Keeping your financial records organized and up to date.",
      items: [
        "Bookkeeping",
        "Accounting Assistance",
        "Financial Records"
      ]
    },
    licenses: {
      title: "Licenses & Registrations",
      blurb: "Help navigating the government licensing and registration process for your business.",
      items: [
        "Government License Assistance",
        "Business Licenses",
        "Registration Assistance",
        "Documentation"
      ]
    },
    compliance: {
      title: "Business Compliance",
      blurb: "Ongoing support to help keep your business formally compliant.",
      items: [
        "Compliance Assistance",
        "Regulatory Documentation",
        "Business Formalities"
      ]
    }
  };

  var SERVICE_ORDER = ["gst", "tax", "accounting", "licenses", "compliance"];

  function renderDetail(key) {
    var data = SERVICES[key];
    var detail = document.getElementById("serviceDetail");
    if (!detail || !data) return;

    var itemsHtml = data.items.map(function (item, i) {
      var n = String(i + 1).padStart(2, "0");
      return '<li><span class="num">' + n + "</span><span>" + item + "</span></li>";
    }).join("");

    detail.innerHTML =
      '<div class="service-detail-head">' +
        '<h3 class="h3">' + data.title + "</h3>" +
        '<p class="body">' + data.blurb + "</p>" +
      "</div>" +
      '<ul class="service-items">' + itemsHtml + "</ul>";
  }

  var tabs = document.querySelectorAll(".service-tab");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");
      renderDetail(tab.getAttribute("data-service"));
    });
  });
  if (tabs.length) renderDetail("gst");

  /* Mobile accordion build (from the same SERVICES data) */
  var accordionWrap = document.getElementById("serviceAccordion");
  if (accordionWrap) {
    accordionWrap.innerHTML = SERVICE_ORDER.map(function (key, i) {
      var data = SERVICES[key];
      var n = String(i + 1).padStart(2, "0");
      var itemsHtml = data.items.map(function (item) {
        return "<li>" + item + "</li>";
      }).join("");
      return (
        '<div class="faq-item service-acc-item">' +
          '<button class="faq-q" aria-expanded="false">' +
            '<span><span class="tab-index" style="color:var(--secondary);margin-right:8px;">' + n + "</span>" + data.title + "</span>" +
            '<span class="icon">+</span>' +
          "</button>" +
          '<div class="faq-a"><ul class="service-items" style="padding-top:4px;">' + itemsHtml + "</ul></div>" +
        "</div>"
      );
    }).join("");
  }

  /* ---------------------------------------------------------
     FAQ DATA + accordion (shared build/behavior function
     handles both FAQ and the mobile service accordion above)
     --------------------------------------------------------- */
  var FAQS = [
    {
      q: "What GST services do you provide?",
      a: "We assist with GST registration, return filing support, ongoing compliance, and the documentation GST requires."
    },
    {
      q: "Do you assist with GST registration?",
      a: "Yes — we guide you through the registration process and help prepare the required documentation."
    },
    {
      q: "Do you assist with income tax returns?",
      a: "Yes, we help with income tax return filing, documentation, and compliance guidance for individuals and businesses."
    },
    {
      q: "Can you help with government licenses?",
      a: "Yes — we assist with business licenses, registrations, and the associated documentation."
    },
    {
      q: "Do you provide accounting services?",
      a: "Yes, including bookkeeping, accounting assistance, and keeping your financial records organized."
    },
    {
      q: "What documents are required?",
      a: "This depends on the specific service. Get in touch and we'll let you know exactly what's needed for your situation."
    },
    {
      q: "How can I contact RRA Consultancy?",
      a: "Call or WhatsApp +91 70490 13530, or email RRAConsultancyBPL@gmail.com. See the Contact section for all options."
    },
    {
      q: "Where is RRA Consultancy located?",
      a: "6/7 Basant Kunj Colony, Ayodhya Bypass Road, Bhopal, Madhya Pradesh."
    }
  ];

  var faqList = document.getElementById("faqList");
  if (faqList) {
    faqList.innerHTML = FAQS.map(function (f) {
      return (
        '<div class="faq-item">' +
          '<button class="faq-q" aria-expanded="false">' +
            "<span>" + f.q + "</span>" +
            '<span class="icon">+</span>' +
          "</button>" +
          '<div class="faq-a"><p class="body">' + f.a + "</p></div>" +
        "</div>"
      );
    }).join("");
  }

  /* Delegated accordion toggle — works for FAQ + mobile service accordion */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".faq-q");
    if (!btn) return;
    var item = btn.closest(".faq-item");
    var answer = item.querySelector(".faq-a");
    var isOpen = item.classList.contains("is-open");

    /* close siblings within the same list */
    var parent = item.parentElement;
    parent.querySelectorAll(".faq-item.is-open").forEach(function (openItem) {
      if (openItem !== item) {
        openItem.classList.remove("is-open");
        openItem.querySelector(".faq-q").setAttribute("aria-expanded", "false");
        openItem.querySelector(".faq-a").style.maxHeight = null;
      }
    });

    if (isOpen) {
      item.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      answer.style.maxHeight = null;
    } else {
      item.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  });

  /* ---------------------------------------------------------
     PROCESS: highlight step on hover (desktop) — purely
     decorative state, degrades fine without it
     --------------------------------------------------------- */
  var steps = document.querySelectorAll(".process-step");
  steps.forEach(function (step) {
    step.addEventListener("mouseenter", function () {
      steps.forEach(function (s) { s.classList.remove("is-active"); });
      step.classList.add("is-active");
    });
  });
})();
