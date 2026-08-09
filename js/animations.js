/* =========================================================
   RRA CONSULTANCY — animations.js
   GSAP scroll reveals + hero entrance. Respects
   prefers-reduced-motion by skipping animation entirely.
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (reduceMotion || typeof gsap === "undefined") {
    /* Just make sure everything is visible and bail. */
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      el.style.opacity = 1;
      el.style.transform = "none";
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------------------------------------------------------
     Scroll-triggered reveals
     --------------------------------------------------------- */
  var revealEls = gsap.utils.toArray("[data-reveal]");
  revealEls.forEach(function (el, i) {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none none",
      },
    });
  });

  /* ---------------------------------------------------------
     Hero entrance sequence (plays once, on load)
     --------------------------------------------------------- */
  var heroCopy = document.querySelector(".hero-copy");
  var heroGraphic = document.querySelector(".hero-graphic");

  if (heroCopy) {
    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      heroCopy,
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.75 },
    ).fromTo(
      heroGraphic,
      { opacity: 0, scale: 0.96 },
      { opacity: 1, scale: 1, duration: 0.8 },
      "-=0.5",
    );

    /* line-draw elements inside the hero SVG */
    var drawEls = document.querySelectorAll(".hero-graphic [data-draw]");
    drawEls.forEach(function (path) {
      var len = path.getTotalLength ? path.getTotalLength() : 200;
      path.style.setProperty("--len", len);
      gsap.fromTo(
        path,
        { strokeDashoffset: len },
        {
          strokeDashoffset: 0,
          duration: 1.1,
          ease: "power2.inOut",
          delay: 0.6,
        },
      );
    });
  }
})();
