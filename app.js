/* =========================================
   LOCAL JOBS - MAIN APP
   Plain HTML + CSS + JavaScript
========================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* =========================================
     LANGUAGE SYSTEM
  ========================================= */

  const LANGUAGE_KEY = "localjobs_language";

  let currentLanguage =
    localStorage.getItem(LANGUAGE_KEY) || "en";

  function getTranslation(key) {

    if (
      window.translations &&
      window.translations[currentLanguage] &&
      window.translations[currentLanguage][key]
    ) {
      return window.translations[currentLanguage][key];
    }

    if (
      window.translations &&
      window.translations.en &&
      window.translations.en[key]
    ) {
      return window.translations.en[key];
    }

    return key;
  }


  function changeLanguage(language) {

    if (!window.translations[language]) {
      return;
    }

    currentLanguage = language;

    localStorage.setItem(
      LANGUAGE_KEY,
      language
    );

    document.documentElement.lang =
      language === "bn" ? "bn" : "en";

    applyTranslations();

    updateLanguageButtons();
  }


  function applyTranslations() {

    const elements =
      document.querySelectorAll("[data-i18n]");

    elements.forEach(function (element) {

      const key =
        element.getAttribute("data-i18n");

      const translated =
        getTranslation(key);

      element.textContent = translated;
    });


    const placeholders =
      document.querySelectorAll(
        "[data-i18n-placeholder]"
      );

    placeholders.forEach(function (element) {

      const key =
        element.getAttribute(
          "data-i18n-placeholder"
        );

      element.placeholder =
        getTranslation(key);
    });


    const titles =
      document.querySelectorAll(
        "[data-i18n-title]"
      );

    titles.forEach(function (element) {

      const key =
        element.getAttribute(
          "data-i18n-title"
        );

      element.title =
        getTranslation(key);
    });
  }


  function updateLanguageButtons() {

    const buttons =
      document.querySelectorAll(
        "[data-language]"
      );

    buttons.forEach(function (button) {

      const language =
        button.getAttribute(
          "data-language"
        );

      if (language === currentLanguage) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
  }


  document.addEventListener(
    "click",
    function (event) {

      const languageButton =
        event.target.closest(
          "[data-language]"
        );

      if (!languageButton) {
        return;
      }

      event.preventDefault();

      const language =
        languageButton.getAttribute(
          "data-language"
        );

      changeLanguage(language);
    }
  );


  /* =========================================
     LANGUAGE SELECTION SCREEN
  ========================================= */

  const languageScreen =
    document.querySelector(
      "#languageScreen"
    );

  const continueButton =
    document.querySelector(
      "#continueLanguage"
    );

  const savedLanguage =
    localStorage.getItem(
      LANGUAGE_KEY
    );


  if (
    languageScreen &&
    !savedLanguage
  ) {

    languageScreen.style.display =
      "flex";
  }


  if (continueButton) {

    continueButton.addEventListener(
      "click",
      function () {

        const selectedLanguage =
          document.querySelector(
            'input[name="language"]:checked'
          );

        if (
          selectedLanguage &&
          selectedLanguage.value
        ) {

          changeLanguage(
            selectedLanguage.value
          );
        }

        if (languageScreen) {

          languageScreen.style.display =
            "none";
        }
      }
    );
  }


  /* =========================================
     FIND A JOB BUTTON
  ========================================= */

  document.addEventListener(
    "click",
    function (event) {

      const button =
        event.target.closest(
          "[data-action='find-job']"
        );

      if (!button) {
        return;
      }

      event.preventDefault();

      const target =
        button.getAttribute(
          "data-target"
        ) || "jobs.html";

      window.location.href =
        target;
    }
  );


  /* =========================================
     POST A JOB BUTTON
  ========================================= */

  document.addEventListener(
    "click",
    function (event) {

      const button =
        event.target.closest(
          "[data-action='post-job']"
        );

      if (!button) {
        return;
      }

      event.preventDefault();

      const target =
        button.getAttribute(
          "data-target"
        ) || "employer-register.html";

      window.location.href =
        target;
    }
  );


  /* =========================================
     LOGIN BUTTON
  ========================================= */

  document.addEventListener(
    "click",
    function (event) {

      const button =
        event.target.closest(
          "[data-action='login']"
        );

      if (!button) {
        return;
      }

      event.preventDefault();

      const target =
        button.getAttribute(
          "data-target"
        ) || "login.html";

      window.location.href =
        target;
    }
  );


  /* =========================================
     REGISTER BUTTON
  ========================================= */

  document.addEventListener(
    "click",
    function (event) {

      const button =
        event.target.closest(
          "[data-action='register']"
        );

      if (!button) {
        return;
      }

      event.preventDefault();

      const target =
        button.getAttribute(
          "data-target"
        ) || "register.html";

      window.location.href =
        target;
    }
  );


  /* =========================================
     POPULAR SEARCHES
  ========================================= */

  document.addEventListener(
    "click",
    function (event) {

      const searchButton =
        event.target.closest(
          "[data-search]"
        );

      if (!searchButton) {
        return;
      }

      const search =
        searchButton.getAttribute(
          "data-search"
        );

      const input =
        document.querySelector(
          "#jobSearch"
        );

      if (input) {

        input.value = search;

        input.focus();
      }
    }
  );


  /* =========================================
     JOB SEARCH
  ========================================= */

  const searchForm =
    document.querySelector(
      "#jobSearchForm"
    );

  if (searchForm) {

    searchForm.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();

        const input =
          document.querySelector(
            "#jobSearch"
          );

        const search =
          input
            ? input.value.trim()
            : "";

        const params =
          new URLSearchParams();

        if (search) {
          params.set(
            "search",
            search
          );
        }

        window.location.href =
          "jobs.html?" +
          params.toString();
      }
    );
  }


  /* =========================================
     MOBILE MENU
  ========================================= */

  const menuButton =
    document.querySelector(
      "#menuToggle"
    );

  const mobileMenu =
    document.querySelector(
      "#mobileMenu"
    );

  if (
    menuButton &&
    mobileMenu
  ) {

    menuButton.addEventListener(
      "click",
      function () {

        mobileMenu.classList.toggle(
          "open"
        );

        const expanded =
          mobileMenu.classList.contains(
            "open"
          );

        menuButton.setAttribute(
          "aria-expanded",
          expanded
            ? "true"
            : "false"
        );
      }
    );
  }


  /* =========================================
     DEMO JOB COUNTERS
  ========================================= */

  const demoData = {

    jobs: 0,

    consultancies: 0,

    locations: 0,

    applications: 0

  };


  const counterMap = {

    jobs:
      "[data-counter='jobs']",

    consultancies:
      "[data-counter='consultancies']",

    locations:
      "[data-counter='locations']",

    applications:
      "[data-counter='applications']"

  };


  Object.keys(counterMap)
    .forEach(function (key) {

      const element =
        document.querySelector(
          counterMap[key]
        );

      if (element) {

        element.textContent =
          demoData[key] + "+";
      }
    });


  /* =========================================
     INITIALIZE
  ========================================= */

  document.documentElement.lang =
    currentLanguage === "bn"
      ? "bn"
      : "en";

  applyTranslations();

  updateLanguageButtons();

});
