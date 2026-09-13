/* =========================================================
   LOCALJOBHUB - APP.JS
   Demo/localStorage version
   ========================================================= */

(function () {
  "use strict";

  /* =========================================================
     STORAGE KEYS
     ========================================================= */

  const JOBS_KEY = "localjobhub_jobs";
  const USER_KEY = "localjobhub_user";
  const LOGIN_KEY = "localjobhub_logged_in";
  const ROLE_KEY = "localjobhub_role";
  const APPLICATIONS_KEY = "localjobhub_applications";

  /* =========================================================
     DEMO JOBS
     ========================================================= */

  const demoJobs = [
    {
      id: "demo-1",
      title: "Security Guard",
      company: "ABC Consultancy",
      location: "Siliguri",
      category: "Security",
      salary: "₹14,000 - ₹18,000",
      jobType: "Full Time",
      experience: "0-2 Years",
      qualification: "10th Pass",
      deadline: "",
      skills: "Security, Guard, Night Shift",
      description:
        "Security guard required for a reputed organization in Siliguri.",
      image:
        "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=900&q=80",
      verified: true,
      owner: "demo@localjobhub.com",
      createdAt: Date.now() - 600000
    },
    {
      id: "demo-2",
      title: "Computer Operator",
      company: "Unique Consultancy",
      location: "Pradhan Nagar, Siliguri",
      category: "Computer",
      salary: "₹10,000 - ₹15,000",
      jobType: "Full Time",
      experience: "0-1 Year",
      qualification: "12th / Computer Course",
      deadline: "",
      skills: "MS Office, Typing, Computer",
      description:
        "Computer operator required. Basic computer knowledge and typing skills preferred.",
      image:
        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=80",
      verified: true,
      owner: "demo@localjobhub.com",
      createdAt: Date.now() - 500000
    },
    {
      id: "demo-3",
      title: "Delivery Boy",
      company: "Fast Track Consultancy",
      location: "Matigara",
      category: "Delivery",
      salary: "₹12,000 - ₹16,000",
      jobType: "Full Time",
      experience: "0-2 Years",
      qualification: "10th Pass",
      deadline: "",
      skills: "Driving, Delivery",
      description:
        "Delivery executives required for local delivery operations.",
      image:
        "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=900&q=80",
      verified: true,
      owner: "demo@localjobhub.com",
      createdAt: Date.now() - 400000
    },
    {
      id: "demo-4",
      title: "Receptionist",
      company: "North Bengal Consultancy",
      location: "Sevoke Road",
      category: "Retail",
      salary: "₹12,000 - ₹16,000",
      jobType: "Full Time",
      experience: "0-2 Years",
      qualification: "12th Pass",
      deadline: "",
      skills: "Communication, Reception, Computer",
      description:
        "Receptionist required for a reputed company. Good communication skills required.",
      image:
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80",
      verified: true,
      owner: "demo@localjobhub.com",
      createdAt: Date.now() - 300000
    },
    {
      id: "demo-5",
      title: "Electrician",
      company: "TechPoint Services",
      location: "Bagdogra",
      category: "Technician",
      salary: "₹15,000 - ₹22,000",
      jobType: "Full Time",
      experience: "1-3 Years",
      qualification: "ITI / Equivalent",
      deadline: "",
      skills: "Electrical, Wiring, Maintenance",
      description:
        "Experienced electrician required for residential and commercial work.",
      image:
        "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80",
      verified: true,
      owner: "demo@localjobhub.com",
      createdAt: Date.now() - 200000
    },
    {
      id: "demo-6",
      title: "Hotel Staff",
      company: "Hillside Hotel",
      location: "Siliguri",
      category: "Hotel",
      salary: "₹11,000 - ₹15,000",
      jobType: "Full Time",
      experience: "0-2 Years",
      qualification: "10th / 12th Pass",
      deadline: "",
      skills: "Hospitality, Customer Service",
      description:
        "Hotel staff required for front office and general hotel operations.",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
      verified: true,
      owner: "demo@localjobhub.com",
      createdAt: Date.now() - 100000
    }
  ];

  /* =========================================================
     BASIC HELPERS
     ========================================================= */

  function $(selector, parent) {
    return (parent || document).querySelector(selector);
  }

  function $$(selector, parent) {
    return Array.from((parent || document).querySelectorAll(selector));
  }

  function escapeHTML(value) {
    if (value === null || value === undefined) return "";

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getJobs() {
    try {
      const saved = localStorage.getItem(JOBS_KEY);

      if (saved) {
        const jobs = JSON.parse(saved);

        if (Array.isArray(jobs) && jobs.length > 0) {
          return jobs;
        }
      }
    } catch (error) {
      console.error("Could not load jobs:", error);
    }

    localStorage.setItem(JOBS_KEY, JSON.stringify(demoJobs));
    return demoJobs;
  }

  function saveJobs(jobs) {
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  }

  function getUser() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || "null");
    } catch (error) {
      return null;
    }
  }

  function getApplications() {
    try {
      return JSON.parse(
        localStorage.getItem(APPLICATIONS_KEY) || "[]"
      );
    } catch (error) {
      return [];
    }
  }

  function saveApplications(applications) {
    localStorage.setItem(
      APPLICATIONS_KEY,
      JSON.stringify(applications)
    );
  }

  function isLoggedIn() {
    return localStorage.getItem(LOGIN_KEY) === "true";
  }

  /* =========================================================
     INITIALIZE DEMO DATA
     ========================================================= */

  function initializeJobs() {
    const existing = localStorage.getItem(JOBS_KEY);

    if (!existing) {
      saveJobs(demoJobs);
    }
  }

  /* =========================================================
     JOB CARD
     ========================================================= */

  function createJobCard(job) {
    const image =
      job.image ||
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80";

    return `
      <article class="job-card">

        <div class="job-photo">
          <img
            src="${escapeHTML(image)}"
            alt="${escapeHTML(job.title)}"
            loading="lazy"
          >
        </div>

        <div class="job-body">

          <div class="job-card-top">

            <div>
              <h3>${escapeHTML(job.title)}</h3>

              <p class="job-company">
                ${escapeHTML(job.company || "Local Employer")}
              </p>
            </div>

            ${
              job.verified
                ? `<span class="verified-badge">✓ Verified</span>`
                : ""
            }

          </div>

          <div class="job-meta">

            <span>
              📍 ${escapeHTML(job.location || "Siliguri")}
            </span>

            <span>
              💰 ${escapeHTML(job.salary || "Salary Negotiable")}
            </span>

            <span>
              💼 ${escapeHTML(job.jobType || "Full Time")}
            </span>

            <span>
              🏷️ ${escapeHTML(job.category || "Other")}
            </span>

          </div>

          ${
            job.description
              ? `
                <p class="job-description">
                  ${escapeHTML(job.description)}
                </p>
              `
              : ""
          }

          <div class="job-buttons">

            <button
              type="button"
              class="btn primary-btn apply-job-btn"
              data-job-id="${escapeHTML(job.id)}"
            >
              Apply Now
            </button>

            <button
              type="button"
              class="btn secondary-btn details-job-btn"
              data-job-id="${escapeHTML(job.id)}"
            >
              Details
            </button>

          </div>

        </div>

      </article>
    `;
  }

  /* =========================================================
     RENDER JOBS
     ========================================================= */

  function renderJobs(list) {
    const grid = $("#jobGrid");

    if (!grid) return;

    const jobs = Array.isArray(list) ? list : getJobs();

    if (jobs.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <h3>No jobs found</h3>
          <p>Try another keyword or location.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = jobs
      .slice(0, 12)
      .map(createJobCard)
      .join("");

    attachJobButtons();
  }

  /* =========================================================
     JOB SEARCH
     ========================================================= */

  function searchJobs(keyword, location, category) {
    const jobs = getJobs();

    const key = String(keyword || "")
      .trim()
      .toLowerCase();

    const loc = String(location || "")
      .trim()
      .toLowerCase();

    const cat = String(category || "")
      .trim()
      .toLowerCase();

    const filtered = jobs.filter(function (job) {
      const searchable = [
        job.title,
        job.company,
        job.location,
        job.category,
        job.salary,
        job.jobType,
        job.skills,
        job.description
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesKeyword =
        !key || searchable.includes(key);

      const matchesLocation =
        !loc ||
        String(job.location || "")
          .toLowerCase()
          .includes(loc);

      const matchesCategory =
        !cat ||
        cat === "all" ||
        String(job.category || "")
          .toLowerCase()
          .includes(cat);

      return (
        matchesKeyword &&
        matchesLocation &&
        matchesCategory
      );
    });

    renderJobs(filtered);

    return filtered;
  }

  function initializeSearch() {
    const form = $("#jobSearch");

    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const keywordInput = $("#keyword", form);
      const locationInput = $("#location", form);

      const keyword = keywordInput
        ? keywordInput.value
        : "";

      const location = locationInput
        ? locationInput.value
        : "";

      searchJobs(keyword, location, "");

      const jobsSection =
        $("#jobs") ||
        $("#latestJobs") ||
        $("#jobGrid");

      if (jobsSection) {
        jobsSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  }

  /* =========================================================
     CATEGORY FILTER
     ========================================================= */

  function initializeCategories() {
    const categoryLinks = $$(
      '[data-category], .category-card, .category-item'
    );

    categoryLinks.forEach(function (element) {
      element.addEventListener("click", function (event) {
        const category =
          element.dataset.category ||
          element.getAttribute("data-category") ||
          element.textContent.trim();

        if (!category) return;

        event.preventDefault();

        const results = searchJobs("", "", category);

        const grid = $("#jobGrid");

        if (grid) {
          grid.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }

        if (results.length === 0) {
          console.log(
            "No jobs found for category:",
            category
          );
        }
      });
    });
  }

  /* =========================================================
     APPLY JOB
     ========================================================= */

  function applyForJob(jobId) {
    const jobs = getJobs();

    const job = jobs.find(function (item) {
      return String(item.id) === String(jobId);
    });

    if (!job) return;

    if (!isLoggedIn()) {
      const goLogin = confirm(
        "Please login as a job seeker to apply.\n\nDo you want to login now?"
      );

      if (goLogin) {
        window.location.href = "login.html";
      }

      return;
    }

    const role =
      localStorage.getItem(ROLE_KEY) ||
      "";

    if (role !== "seeker") {
      alert(
        "Please login with a Job Seeker account to apply for jobs."
      );
      return;
    }

    const applications = getApplications();

    const alreadyApplied = applications.some(function (item) {
      return String(item.jobId) === String(job.id);
    });

    if (alreadyApplied) {
      alert("You have already applied for this job.");
      return;
    }

    const user = getUser();

    applications.push({
      id:
        "application-" +
        Date.now() +
        "-" +
        Math.random()
          .toString(36)
          .substring(2, 8),
      jobId: job.id,
      title: job.title,
      company: job.company,
      status: "Applied",
      applicant:
        user && user.email
          ? user.email
          : "",
      createdAt: Date.now()
    });

    saveApplications(applications);

    alert(
      "Application submitted successfully for " +
        job.title +
        "."
    );
  }

  /* =========================================================
     JOB DETAILS
     ========================================================= */

  function showJobDetails(jobId) {
    const job = getJobs().find(function (item) {
      return String(item.id) === String(jobId);
    });

    if (!job) return;

    const message = [
      job.title,
      "",
      "Company: " + (job.company || "Local Employer"),
      "Location: " + (job.location || "Siliguri"),
      "Salary: " + (job.salary || "Negotiable"),
      "Job Type: " + (job.jobType || "Full Time"),
      "Experience: " + (job.experience || "Not specified"),
      "Qualification: " +
        (job.qualification || "Not specified"),
      "",
      "Required Skills:",
      job.skills || "Not specified",
      "",
      "Description:",
      job.description || "No description available."
    ].join("\n");

    alert(message);
  }

  function attachJobButtons() {
    $$(".apply-job-btn").forEach(function (button) {
      button.addEventListener("click", function () {
        applyForJob(button.dataset.jobId);
      });
    });

    $$(".details-job-btn").forEach(function (button) {
      button.addEventListener("click", function () {
        showJobDetails(button.dataset.jobId);
      });
    });
  }

  /* =========================================================
     MOBILE MENU
     ========================================================= */

  function initializeMobileMenu() {
    const menuBtn = $("#menuBtn");
    const mainNav = $("#mainNav");

    if (!menuBtn || !mainNav) return;

    menuBtn.addEventListener("click", function () {
      mainNav.classList.toggle("active");
      menuBtn.classList.toggle("active");
    });

    $$("#mainNav a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("active");
        menuBtn.classList.remove("active");
      });
    });
  }

  /* =========================================================
     LANGUAGE SYSTEM
     ========================================================= */

  function getTranslationObject(language) {
    if (
      typeof window.translations === "undefined"
    ) {
      return null;
    }

    return (
      window.translations[language] ||
      window.translations.en ||
      null
    );
  }

  function getNestedValue(object, path) {
    if (!object || !path) return null;

    return path
      .split(".")
      .reduce(function (current, key) {
        if (
          current &&
          Object.prototype.hasOwnProperty.call(
            current,
            key
          )
        ) {
          return current[key];
        }

        return null;
      }, object);
  }

  function applyTranslations(language) {
    const dictionary =
      getTranslationObject(language);

    if (!dictionary) return;

    $$("[data-i18n]").forEach(function (element) {
      const key = element.dataset.i18n;

      const value =
        getNestedValue(dictionary, key);

      if (
        value !== null &&
        value !== undefined &&
        value !== ""
      ) {
        element.textContent = value;
      }
    });

    $$("[data-i18n-placeholder]").forEach(
      function (element) {
        const key =
          element.dataset.i18nPlaceholder;

        const value =
          getNestedValue(dictionary, key);

        if (
          value !== null &&
          value !== undefined
        ) {
          element.placeholder = value;
        }
      }
    );

    document.documentElement.lang =
      language === "bn"
        ? "bn"
        : language === "hi"
        ? "hi"
        : "en";
  }

  function initializeLanguage() {
    const select = $("#languageSelect");

    if (!select) return;

    const savedLanguage =
      localStorage.getItem(
        "localjobhub_language"
      ) || "en";

    if (
      Array.from(select.options).some(
        function (option) {
          return option.value === savedLanguage;
        }
      )
    ) {
      select.value = savedLanguage;
    }

    applyTranslations(savedLanguage);

    select.addEventListener("change", function () {
      const language = select.value || "en";

      localStorage.setItem(
        "localjobhub_language",
        language
      );

      applyTranslations(language);
    });
  }

  /* =========================================================
     LOGIN
     ========================================================= */

  function initializeLogin() {
    const form = $("#loginForm");

    if (!form) return;

    let selectedRole =
      localStorage.getItem(ROLE_KEY) ||
      "seeker";

    const roleButtons = $$(
      "[data-role]",
      form.parentElement || document
    );

    function setRole(role) {
      selectedRole = role;

      localStorage.setItem(
        ROLE_KEY,
        selectedRole
      );

      $$("[data-role]").forEach(function (button) {
        button.classList.toggle(
          "active",
          button.dataset.role === role
        );
      });
    }

    $$("[data-role]").forEach(function (button) {
      button.addEventListener("click", function () {
        setRole(button.dataset.role);
      });
    });

    setRole(selectedRole);

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const idInput = $("#loginId", form);
      const passwordInput =
        $("#loginPassword", form);

      const loginId = idInput
        ? idInput.value.trim()
        : "";

      const password = passwordInput
        ? passwordInput.value
        : "";

      if (!loginId || !password) {
        alert(
          "Please enter your login ID and password."
        );
        return;
      }

      const user = getUser();

      /*
       * Demo login:
       * Any non-empty ID/password is accepted.
       * If a registered user exists, its role is used.
       */

      let role = selectedRole;

      if (
        user &&
        user.email &&
        loginId.toLowerCase() ===
          user.email.toLowerCase()
      ) {
        role = user.role || selectedRole;
      }

      localStorage.setItem(
        LOGIN_KEY,
        "true"
      );

      localStorage.setItem(
        ROLE_KEY,
        role
      );

      alert("Login successful.");

      if (role === "employer") {
        window.location.href =
          "employer-dashboard.html";
      } else {
        window.location.href =
          "seeker-dashboard.html";
      }
    });
  }

  /* =========================================================
     REGISTER
     ========================================================= */

  function initializeRegister() {
    const form = $("#registerForm");

    if (!form) return;

    let selectedRole =
      $("#registerRole", form)?.value ||
      "seeker";

    function setRegisterRole(role) {
      selectedRole = role;

      const hiddenRole =
        $("#registerRole", form);

      if (hiddenRole) {
        hiddenRole.value = role;
      }

      $$("[data-register-role]").forEach(
        function (button) {
          button.classList.toggle(
            "active",
            button.dataset.registerRole === role
          );
        }
      );

      const seekerFields =
        $("#seekerFields");

      const employerFields =
        $("#employerFields");

      if (seekerFields) {
        seekerFields.style.display =
          role === "seeker"
            ? ""
            : "none";
      }

      if (employerFields) {
        employerFields.style.display =
          role === "employer"
            ? ""
            : "none";
      }
    }

    $$("[data-register-role]").forEach(
      function (button) {
        button.addEventListener(
          "click",
          function () {
            setRegisterRole(
              button.dataset.registerRole
            );
          }
        );
      }
    );

    setRegisterRole(selectedRole);

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const name =
        $("#regName", form)?.value.trim() || "";

      const email =
        $("#regEmail", form)?.value.trim() || "";

      const mobile =
        $("#regMobile", form)?.value.trim() || "";

      const location =
        $("#regLocation", form)?.value.trim() ||
        "";

      const password =
        $("#regPassword", form)?.value || "";

      const confirmPassword =
        $("#regConfirm", form)?.value || "";

      if (
        !name ||
        !email ||
        !mobile ||
        !location ||
        !password ||
        !confirmPassword
      ) {
        alert(
          "Please fill in all required fields."
        );
        return;
      }

      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }

      if (password.length < 6) {
        alert(
          "Password should be at least 6 characters."
        );
        return;
      }

      const user = {
        name: name,
        email: email,
        mobile: mobile,
        location: location,
        role: selectedRole,
        createdAt: Date.now()
      };

      /*
       * Employer company name can be taken from
       * an employer field if present.
       */

      const employerInputs =
        $("#employerFields")
          ? $$(
              "input, textarea, select",
              $("#employerFields")
            )
          : [];

      if (
        selectedRole === "employer" &&
        employerInputs.length > 0
      ) {
        user.company =
          employerInputs[0].value.trim() ||
          name;
      }

      localStorage.setItem(
        USER_KEY,
        JSON.stringify(user)
      );

      localStorage.setItem(
        ROLE_KEY,
        selectedRole
      );

      localStorage.setItem(
        LOGIN_KEY,
        "true"
      );

      alert(
        "Registration successful."
      );

      if (selectedRole === "employer") {
        window.location.href =
          "employer-dashboard.html";
      } else {
        window.location.href =
          "seeker-dashboard.html";
      }
    });
  }

  /* =========================================================
     EMPLOYER DASHBOARD
     ========================================================= */

  function initializeEmployerDashboard() {
    const form = $("#postJobForm");

    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      /*
       * Original employer-dashboard.html does not
       * require IDs on every field.
       *
       * We read the controls in their original order.
       */

      const twoCol =
        $(".two-col", form);

      const controls =
        twoCol
          ? $$(
              "input, select, textarea",
              twoCol
            )
          : [];

      const title =
        controls[0]?.value.trim() || "";

      const category =
        controls[1]?.value.trim() || "";

      const location =
        controls[2]?.value.trim() || "";

      const salary =
        controls[3]?.value.trim() || "";

      const jobType =
        controls[4]?.value.trim() ||
        "Full Time";

      const experience =
        controls[5]?.value.trim() || "";

      const qualification =
        controls[6]?.value.trim() || "";

      const deadline =
        controls[7]?.value.trim() || "";

      const outsideControls =
        $$(
          "input, select, textarea",
          form
        );

      /*
       * Required Skills and Description are after
       * the two-column section in the original HTML.
       */

      let skills = "";
      let description = "";

      if (outsideControls.length > controls.length) {
        const remaining =
          outsideControls.slice(
            controls.length
          );

        if (remaining[0]) {
          skills =
            remaining[0].value.trim();
        }

        if (remaining[1]) {
          description =
            remaining[1].value.trim();
        }
      }

      if (!title || !category || !location) {
        alert(
          "Please fill in Job Title, Category and Location."
        );
        return;
      }

      const user = getUser();

      const company =
        user && user.company
          ? user.company
          : user && user.name
          ? user.name
          : "Local Employer";

      const owner =
        user && user.email
          ? user.email
          : "employer@localjobhub.com";

      const newJob = {
        id:
          "job-" +
          Date.now() +
          "-" +
          Math.random()
            .toString(36)
            .substring(2, 8),

        title: title,
        company: company,
        location: location,
        category: category,
        salary: salary,
        jobType: jobType,
        experience: experience,
        qualification: qualification,
        deadline: deadline,
        skills: skills,
        description: description,

        image:
          "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80",

        verified: false,
        owner: owner,
        createdAt: Date.now()
      };

      const jobs = getJobs();

      jobs.unshift(newJob);

      saveJobs(jobs);

      alert(
        "Job posted successfully!\n\nThe new job will now appear on the homepage."
      );

      form.reset();

      /*
       * If a job grid exists on the same page,
       * update it immediately.
       */

      renderJobs();
    });
  }

  /* =========================================================
     LOGOUT
     ========================================================= */

  function initializeLogout() {
    $$(
      "#logoutBtn, .logout-btn, [data-logout]"
    ).forEach(function (button) {
      button.addEventListener("click", function () {
        localStorage.removeItem(
          LOGIN_KEY
        );

        localStorage.removeItem(
          ROLE_KEY
        );

        window.location.href =
          "login.html";
      });
    });
  }

  /* =========================================================
     LOGIN STATE / NAVIGATION
     ========================================================= */

  function updateAuthLinks() {
    const loggedIn = isLoggedIn();
    const role =
      localStorage.getItem(ROLE_KEY);

    $$(
      '[href="login.html"]'
    ).forEach(function (link) {
      if (
        loggedIn &&
        role
      ) {
        if (
          link.textContent
            .toLowerCase()
            .includes("login")
        ) {
          link.textContent =
            role === "employer"
              ? "Dashboard"
              : "Dashboard";

          link.href =
            role === "employer"
              ? "employer-dashboard.html"
              : "seeker-dashboard.html";
        }
      }
    });
  }

  /* =========================================================
     DASHBOARD USER INFO
     ========================================================= */

  function updateUserInfo() {
    const user = getUser();

    if (!user) return;

    $$(
      "[data-user-name]"
    ).forEach(function (element) {
      element.textContent =
        user.name || "";
    });

    $$(
      "[data-user-email]"
    ).forEach(function (element) {
      element.textContent =
        user.email || "";
    });

    $$(
      "[data-user-mobile]"
    ).forEach(function (element) {
      element.textContent =
        user.mobile || "";
    });

    $$(
      "[data-user-location]"
    ).forEach(function (element) {
      element.textContent =
        user.location || "";
    });
  }

  /* =========================================================
     STATS
     ========================================================= */

  function updateStats() {
    const jobs = getJobs();

    const jobCount =
      jobs.length;

    /*
     * Demo stats intentionally keep the
     * reference-style large numbers.
     */

    const stats = {
      jobs: Math.max(
        1250,
        jobCount
      ),
      consultancies: 85,
      seekers: 12000
    };

    $$("[data-stat]").forEach(
      function (element) {
        const type =
          element.dataset.stat;

        if (
          Object.prototype.hasOwnProperty.call(
            stats,
            type
          )
        ) {
          element.textContent =
            stats[type].toLocaleString(
              "en-IN"
            );
        }
      }
    );
  }

  /* =========================================================
     NAVIGATION ANCHOR CLOSE
     ========================================================= */

  function initializeSmoothLinks() {
    $$('a[href^="#"]').forEach(
      function (link) {
        link.addEventListener(
          "click",
          function (event) {
            const targetId =
              link.getAttribute("href");

            if (
              !targetId ||
              targetId === "#"
            ) {
              return;
            }

            const target =
              $(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });
          }
        );
      }
    );
  }

  /* =========================================================
     EMPLOYER PANEL BUTTONS
     ========================================================= */

  function initializeEmployerPanels() {
    $$("[data-panel]").forEach(
      function (button) {
        button.addEventListener(
          "click",
          function () {
            const panel =
              button.dataset.panel;

            /*
             * Post New Job is the only panel
             * currently handled by the original HTML.
             */

            if (panel === "postJob") {
              const form =
                $("#postJobForm");

              if (form) {
                form.scrollIntoView({
                  behavior: "smooth",
                  block: "start"
                });
              }
            }
          }
        );
      }
    );
  }

  /* =========================================================
     QUERY PARAMETER FOR REGISTER ROLE
     ========================================================= */

  function initializeRegisterQuery() {
    if (
      !window.location.pathname
        .toLowerCase()
        .includes("register")
    ) {
      return;
    }

    const params =
      new URLSearchParams(
        window.location.search
      );

    const type =
      params.get("type");

    if (
      type === "employer" ||
      type === "seeker"
    ) {
      const button =
        $(
          `[data-register-role="${type}"]`
        );

      if (button) {
        button.click();
      }
    }
  }

  /* =========================================================
     PREVENT BROKEN IMAGE ICONS
     ========================================================= */

  function initializeImageFallback() {
    document.addEventListener(
      "error",
      function (event) {
        const target =
          event.target;

        if (
          target &&
          target.tagName === "IMG"
        ) {
          target.src =
            "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80";
        }
      },
      true
    );
  }

  /* =========================================================
     START APPLICATION
     ========================================================= */

  document.addEventListener(
    "DOMContentLoaded",
    function () {
      initializeJobs();

      renderJobs();

      initializeSearch();

      initializeCategories();

      initializeMobileMenu();

      initializeLanguage();

      initializeLogin();

      initializeRegister();

      initializeRegisterQuery();

      initializeEmployerDashboard();

      initializeEmployerPanels();

      initializeLogout();

      updateAuthLinks();

      updateUserInfo();

      updateStats();

      initializeSmoothLinks();

      initializeImageFallback();
    }
  );
})();
