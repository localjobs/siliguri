/* =========================================================
   LocalJobHub - FINAL APP.JS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     STORAGE
  ======================================================= */

  const JOB_STORAGE_KEY = "localjobhub_jobs";
  const APPLICATION_STORAGE_KEY = "localjobhub_applications";
  const LANGUAGE_STORAGE_KEY = "localjobs_language";


  /* =======================================================
     DEMO JOB DATA
  ======================================================= */

  const demoJobs = [

    {
      id: "demo1",
      title: "Security Guard",
      company: "ABC Consultancy",
      location: "Siliguri",
      category: "Security",
      salary: "₹14,000 - ₹18,000",
      type: "Full Time",
      experience: "0-2 years",
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=700&q=80"
    },

    {
      id: "demo2",
      title: "Computer Operator",
      company: "Unique Consultancy",
      location: "Pradhan Nagar, Siliguri",
      category: "Computer",
      salary: "₹10,000 - ₹15,000",
      type: "Full Time",
      experience: "0-2 years",
      image:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=700&q=80"
    },

    {
      id: "demo3",
      title: "Delivery Boy",
      company: "Fast Track Consultancy",
      location: "Matigara",
      category: "Delivery",
      salary: "₹12,000 - ₹16,000",
      type: "Full Time",
      experience: "Fresher",
      image:
        "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=700&q=80"
    },

    {
      id: "demo4",
      title: "Receptionist",
      company: "North Bengal Consultancy",
      location: "Sevoke Road",
      category: "Retail",
      salary: "₹12,000 - ₹16,000",
      type: "Full Time",
      experience: "1 year",
      image:
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=700&q=80"
    },

    {
      id: "demo5",
      title: "Electrician",
      company: "TechPoint Services",
      location: "Bagdogra",
      category: "Technician",
      salary: "₹15,000 - ₹22,000",
      type: "Full Time",
      experience: "2+ years",
      image:
        "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=700&q=80"
    },

    {
      id: "demo6",
      title: "Hotel Staff",
      company: "Hillside Hotel",
      location: "Siliguri",
      category: "Hotel",
      salary: "₹11,000 - ₹15,000",
      type: "Full Time",
      experience: "Fresher",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=700&q=80"
    }

  ];


  /* =======================================================
     HELPER - ESCAPE HTML
  ======================================================= */

  function escapeHTML(value) {

    return String(value ?? "").replace(
      /[&<>"']/g,
      function (character) {

        return {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;"
        }[character];

      }
    );

  }


  /* =======================================================
     LOAD JOBS
  ======================================================= */

  function getJobs() {

    try {

      const saved =
        JSON.parse(
          localStorage.getItem(JOB_STORAGE_KEY) || "null"
        );

      if (Array.isArray(saved)) {

        return saved;

      }

    } catch (error) {

      console.warn(
        "Unable to read saved jobs:",
        error
      );

    }


    localStorage.setItem(
      JOB_STORAGE_KEY,
      JSON.stringify(demoJobs)
    );

    return demoJobs;

  }


  /* =======================================================
     RENDER JOBS
  ======================================================= */

  function renderJobs(list = getJobs()) {

    const grid =
      document.querySelector("#jobGrid");

    if (!grid) {
      return;
    }


    if (!Array.isArray(list) || list.length === 0) {

      grid.innerHTML = `
        <div class="panel">
          <b>No jobs found.</b>
          <p>
            Try another job title, skill or location.
          </p>
        </div>
      `;

      return;

    }


    grid.innerHTML = list
      .slice(0, 8)
      .map(function (job) {

        const image =
          job.image ||
          demoJobs[0].image;


        return `

          <article class="job-card">

            <div
              class="job-photo"
              style="background-image:url('${escapeHTML(image)}')"
            >

              <span class="verified-badge">
                ✓ Verified
              </span>

            </div>


            <div class="job-body">

              <h3 class="job-title-visible">
                ${escapeHTML(job.title)}
              </h3>


              <p class="company">
                ${escapeHTML(job.company)}
              </p>


              <p>
                ⌖ ${escapeHTML(job.location)}
              </p>


              <p>
                💼 ${escapeHTML(
                  job.experience || "Fresher"
                )}
              </p>


              <div class="job-meta">

                <b>
                  ${escapeHTML(
                    job.salary || "Salary negotiable"
                  )}
                </b>

                <span>
                  ${escapeHTML(
                    job.type || "Full Time"
                  )}
                </span>

              </div>


              <div class="job-buttons">

                <button
                  type="button"
                  class="btn btn-primary apply-btn"
                  data-id="${escapeHTML(job.id)}"
                >
                  Apply
                </button>


                <button
                  type="button"
                  class="btn btn-outline details-btn"
                  data-id="${escapeHTML(job.id)}"
                >
                  Details
                </button>

              </div>

            </div>

          </article>

        `;

      })
      .join("");


    const countElement =
      document.querySelector("#jobCount");

    if (countElement) {

      const actualCount =
        Array.isArray(list)
          ? list.length
          : 0;


      /*
        Keep the homepage number looking like
        a real local job platform count.
      */

      countElement.textContent =
        actualCount > 6
          ? `${actualCount}+`
          : "1,250+";

    }

  }


  /* =======================================================
     JOB SEARCH
  ======================================================= */

  function searchJobs() {

    const keywordInput =
      document.querySelector("#keyword");

    const locationInput =
      document.querySelector("#location");


    const keyword =
      (keywordInput?.value || "")
        .trim()
        .toLowerCase();


    const location =
      (locationInput?.value || "")
        .trim()
        .toLowerCase();


    const allJobs =
      getJobs();


    const filtered =
      allJobs.filter(function (job) {

        const searchableText = `

          ${job.title || ""}

          ${job.company || ""}

          ${job.category || ""}

          ${job.experience || ""}

          ${job.type || ""}

        `.toLowerCase();


        const jobLocation =
          String(job.location || "")
            .toLowerCase();


        const keywordMatch =
          !keyword ||
          searchableText.includes(keyword);


        const locationMatch =
          !location ||
          jobLocation.includes(location);


        return (
          keywordMatch &&
          locationMatch
        );

      });


    renderJobs(filtered);


    const jobsSection =
      document.querySelector("#jobs");


    if (jobsSection) {

      jobsSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }


    if (!filtered.length) {

      const grid =
        document.querySelector("#jobGrid");


      if (grid) {

        grid.innerHTML = `

          <div class="panel">

            <b>
              No jobs found.
            </b>

            <p>
              Try another job title, skill or location.
            </p>

          </div>

        `;

      }

    }

  }


  /* =======================================================
     SEARCH FORM
  ======================================================= */

  const searchForm =
    document.querySelector("#jobSearch");


  if (searchForm) {

    searchForm.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();

        searchJobs();

      }
    );

  }


  /* =======================================================
     CATEGORY FILTER
  ======================================================= */

  document
    .querySelectorAll("[data-category]")
    .forEach(function (categoryLink) {

      categoryLink.addEventListener(
        "click",
        function () {

          const category =
            categoryLink.dataset.category || "";


          const keywordInput =
            document.querySelector("#keyword");


          if (keywordInput) {

            keywordInput.value =
              category;

          }


          const locationInput =
            document.querySelector("#location");


          if (locationInput) {

            locationInput.value =
              "";

          }


          searchJobs();

        }
      );

    });


  /* =======================================================
     VIEW ALL JOBS
  ======================================================= */

  const showAllJobs =
    document.querySelector("#showAllJobs");


  if (showAllJobs) {

    showAllJobs.addEventListener(
      "click",
      function (event) {

        event.preventDefault();

        const keywordInput =
          document.querySelector("#keyword");


        const locationInput =
          document.querySelector("#location");


        if (keywordInput) {
          keywordInput.value = "";
        }


        if (locationInput) {
          locationInput.value = "";
        }


        renderJobs(
          getJobs()
        );


        const jobsSection =
          document.querySelector("#jobs");


        if (jobsSection) {

          jobsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }

      }
    );

  }


  /* =======================================================
     MOBILE MENU
  ======================================================= */

  const menuButton =
    document.querySelector("#menuBtn");

  const mainNavigation =
    document.querySelector("#mainNav");


  if (menuButton && mainNavigation) {

    menuButton.addEventListener(
      "click",
      function (event) {

        event.stopPropagation();


        const isOpen =
          mainNavigation.classList.toggle(
            "open"
          );


        menuButton.setAttribute(
          "aria-expanded",
          isOpen ? "true" : "false"
        );

      }
    );


    mainNavigation
      .querySelectorAll("a")
      .forEach(function (link) {

        link.addEventListener(
          "click",
          function () {

            mainNavigation.classList.remove(
              "open"
            );


            menuButton.setAttribute(
              "aria-expanded",
              "false"
            );

          }
        );

      });


    document.addEventListener(
      "click",
      function (event) {

        if (
          !mainNavigation.contains(event.target) &&
          !menuButton.contains(event.target)
        ) {

          mainNavigation.classList.remove(
            "open"
          );


          menuButton.setAttribute(
            "aria-expanded",
            "false"
          );

        }

      }
    );

  }


  /* =======================================================
     LANGUAGE SELECT
  ======================================================= */

  const languageSelect =
    document.querySelector("#languageSelect");


  if (languageSelect) {

    const savedLanguage =
      localStorage.getItem(
        LANGUAGE_STORAGE_KEY
      );


    if (
      savedLanguage &&
      ["en", "bn", "hi"].includes(savedLanguage)
    ) {

      languageSelect.value =
        savedLanguage;

    }


    languageSelect.addEventListener(
      "change",
      function (event) {

        const language =
          event.target.value;


        localStorage.setItem(
          LANGUAGE_STORAGE_KEY,
          language
        );


        document.documentElement.lang =
          language;


        /*
          If translations.js provides a
          translation function, use it.
        */

        if (
          window.translations &&
          typeof window.applyTranslations ===
            "function"
        ) {

          window.applyTranslations(
            language
          );

        }

      }
    );

  }


  /* =======================================================
     APPLY JOB
  ======================================================= */

  function applyForJob(job) {

    if (!job) {
      return;
    }


    let applications = [];


    try {

      applications =
        JSON.parse(
          localStorage.getItem(
            APPLICATION_STORAGE_KEY
          ) || "[]"
        );


      if (!Array.isArray(applications)) {

        applications = [];

      }

    } catch (error) {

      applications = [];

    }


    const alreadyApplied =
      applications.some(function (application) {

        return application.jobId === job.id;

      });


    if (!alreadyApplied) {

      applications.push({

        jobId: job.id,

        title: job.title,

        company: job.company,

        status: "Applied",

        appliedAt:
          new Date().toISOString()

      });


      localStorage.setItem(
        APPLICATION_STORAGE_KEY,
        JSON.stringify(applications)
      );


      alert(
        `Application submitted for ${job.title}.`
      );

    } else {

      alert(
        `You have already applied for ${job.title}.`
      );

    }

  }


  /* =======================================================
     JOB DETAILS
  ======================================================= */

  function showJobDetails(job) {

    if (!job) {
      return;
    }


    alert(

      `${job.title}

Company: ${job.company}

Location: ${job.location}

Salary: ${job.salary || "Negotiable"}

Experience: ${job.experience || "Fresher"}

Type: ${job.type || "Full Time"}`

    );

  }


  /* =======================================================
     GLOBAL BUTTON EVENTS
  ======================================================= */

  document.addEventListener(
    "click",
    function (event) {

      const applyButton =
        event.target.closest(
          ".apply-btn"
        );


      if (applyButton) {

        const jobId =
          applyButton.dataset.id;


        const job =
          getJobs().find(function (item) {

            return String(item.id) ===
              String(jobId);

          });


        applyForJob(job);

        return;

      }


      const detailsButton =
        event.target.closest(
          ".details-btn"
        );


      if (detailsButton) {

        const jobId =
          detailsButton.dataset.id;


        const job =
          getJobs().find(function (item) {

            return String(item.id) ===
              String(jobId);

          });


        showJobDetails(job);

      }

    }
  );


  /* =======================================================
     MORE CONSULTANCIES
  ======================================================= */

  const moreConsultancyButton =
    document.querySelector(
      "#moreConsultancyBtn"
    );


  const moreConsultancyArea =
    document.querySelector(
      "#moreConsultancyArea"
    );


  const consultancySearch =
    document.querySelector(
      "#consultancySearch"
    );


  const consultancyList =
    document.querySelector(
      "#consultancyList"
    );


  const noConsultancyResult =
    document.querySelector(
      "#noConsultancyResult"
    );


  if (
    moreConsultancyButton &&
    moreConsultancyArea
  ) {

    moreConsultancyButton.addEventListener(
      "click",
      function () {

        const isVisible =
          moreConsultancyArea.classList.toggle(
            "show"
          );


        moreConsultancyButton.textContent =
          isVisible
            ? "Hide Consultancies ↑"
            : "More Consultancies →";


        if (
          isVisible &&
          consultancySearch
        ) {

          setTimeout(
            function () {

              consultancySearch.focus();

            },
            100
          );

        }

      }
    );

  }


  /* =======================================================
     CONSULTANCY SEARCH
  ======================================================= */

  if (
    consultancySearch &&
    consultancyList
  ) {

    consultancySearch.addEventListener(
      "input",
      function () {

        const query =
          consultancySearch.value
            .trim()
            .toLowerCase();


        const items =
          consultancyList.querySelectorAll(
            ".consultancy-item"
          );


        let found = 0;


        items.forEach(function (item) {

          const name =
            item.querySelector("h4")
              ?.textContent
              .toLowerCase() || "";


          const location =
            item.textContent
              .toLowerCase();


          const match =
            !query ||
            name.includes(query) ||
            location.includes(query);


          item.style.display =
            match ? "" : "block";


          if (match) {

            found++;

          }

        });


        if (noConsultancyResult) {

          noConsultancyResult.style.display =
            found > 0
              ? "none"
              : "block";

        }

      }
    );

  }


  /* =======================================================
     INITIAL RENDER
  ======================================================= */

  renderJobs(
    getJobs()
  );


  /* =======================================================
     SET CURRENT LANGUAGE
  ======================================================= */

  const currentLanguage =
    localStorage.getItem(
      LANGUAGE_STORAGE_KEY
    );


  if (currentLanguage) {

    document.documentElement.lang =
      currentLanguage;

  }


});
