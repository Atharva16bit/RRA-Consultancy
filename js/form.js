(function () {
  "use strict";

  var form = document.getElementById("enquiryForm");
  if (!form) return;

  var successBox = document.getElementById("formSuccess");

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

    handleSubmit(collectFormData(form));
  });

  function collectFormData(formEl) {
    var data = {};
    new FormData(formEl).forEach(function (value, key) {
      data[key] = value;
    });
    return data;
  }
  function handleSubmit(data) {
    if (successBox) {
      successBox.classList.add("is-visible");
      successBox.setAttribute("tabindex", "-1");
      successBox.focus();
    }
    form.reset();
  }
})();
