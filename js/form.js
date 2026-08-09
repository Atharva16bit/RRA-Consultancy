(function () {
  "use strict";

  var form = document.getElementById("enquiryForm");
  if (!form) return;

  // Your Formspree endpoint — submissions go to whatever email
  // you set as the recipient when you created this form.
  var ENDPOINT = "https://formspree.io/f/xyegkvar";

  var successBox = document.getElementById("formSuccess");
  var submitBtn = form.querySelector('button[type="submit"]');
  var submitBtnDefaultText = submitBtn ? submitBtn.textContent : "";

  var validators = {
    name: function (v) {
      return v.trim().length > 1;
    },
    phone: function (v) {
      return /^[6-9]\d{9}$/.test(v.trim().replace(/\s+/g, ""));
    },
    email: function (v) {
      return v.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
    },
    service: function (v) {
      return v.trim() !== "";
    },
    message: function (v) {
      return v.trim().length > 3;
    },
  };

  function setFieldState(field, isValid) {
    var row = field.closest(".form-row");
    if (!row) return;
    row.classList.toggle("has-error", !isValid);
  }

  function validateField(field) {
    var name = field.name;
    var validator = validators[name];
    if (!validator) return true;
    var isValid = validator(field.value);
    setFieldState(field, isValid);
    return isValid;
  }

  /* Validate on blur for a calmer experience than on every keystroke */
  form.querySelectorAll("input, select, textarea").forEach(function (field) {
    field.addEventListener("blur", function () {
      validateField(field);
    });
    field.addEventListener("input", function () {
      var row = field.closest(".form-row");
      if (row && row.classList.contains("has-error")) validateField(field);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var fields = Array.prototype.slice.call(
      form.querySelectorAll("input, select, textarea"),
    );
    var allValid = fields.reduce(function (acc, field) {
      var ok = validateField(field);
      return acc && ok;
    }, true);

    if (!allValid) {
      var firstError = form.querySelector(
        ".form-row.has-error input, .form-row.has-error select, .form-row.has-error textarea",
      );
      if (firstError) firstError.focus();
      if (successBox) successBox.classList.remove("is-visible");
      return;
    }

    submitForm(form);
  });

  function setSubmitting(isSubmitting) {
    if (!submitBtn) return;
    submitBtn.disabled = isSubmitting;
    submitBtn.textContent = isSubmitting ? "Sending…" : submitBtnDefaultText;
  }

  function showError(message) {
    if (!successBox) return;
    successBox.textContent =
      message ||
      "Something went wrong sending your enquiry. Please try WhatsApp, call, or email us directly using the details above.";
    successBox.classList.remove("is-success");
    successBox.classList.add("is-visible", "is-error");
    successBox.setAttribute("tabindex", "-1");
    successBox.focus();
  }

  function showSuccess() {
    if (!successBox) return;
    successBox.textContent =
      "Thanks — your enquiry has been sent. We'll get back to you shortly.";
    successBox.classList.remove("is-error");
    successBox.classList.add("is-visible", "is-success");
    successBox.setAttribute("tabindex", "-1");
    successBox.focus();
  }

  function submitForm(formEl) {
    setSubmitting(true);

    fetch(ENDPOINT, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(formEl),
    })
      .then(function (response) {
        if (response.ok) {
          showSuccess();
          formEl.reset();
        } else {
          return response.json().then(function (data) {
            var msg =
              data && data.errors && data.errors.length
                ? data.errors
                    .map(function (e) {
                      return e.message;
                    })
                    .join(", ")
                : null;
            showError(msg);
          });
        }
      })
      .catch(function () {
        showError();
      })
      .finally(function () {
        setSubmitting(false);
      });
  }
})();
