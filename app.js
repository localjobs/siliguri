document.addEventListener("DOMContentLoaded",()=>{

/* =========================================================
   HERO TYPING EFFECT - DESKTOP + MOBILE
   Types:
   Jobs in Siliguri,
   for the people of Siliguri.

   Hold 3 seconds -> delete -> repeat forever
   ========================================================= */

(function(){

  const line1 =
    document.getElementById("heroTypingLine1");

  const line2 =
    document.getElementById("heroTypingLine2");

  if(
    !line1 ||
    !line2 ||
    line1.dataset.typingStarted === "1"
  ){
    return;
  }

  line1.dataset.typingStarted = "1";

  const firstLine =
    "Jobs in Siliguri,";

  const secondLine =
    "for the people of Siliguri.";

  const totalLength =
    firstLine.length +
    secondLine.length;

  let index = 0;
  let deleting = false;


  function draw(){

    const firstCount =
      Math.min(
        index,
        firstLine.length
      );

    const secondCount =
      Math.max(
        0,
        index - firstLine.length
      );


    line1.textContent =
      firstLine.slice(
        0,
        firstCount
      );


    line2.textContent =
      secondLine.slice(
        0,
        secondCount
      );

  }


  function tick(){

    /* =========================
       TYPING
       ========================= */

    if(!deleting){

      if(index < totalLength){

        index++;

        draw();

        setTimeout(
          tick,
          65
        );

      }else{

        /* Hold complete text for 3 seconds */

        setTimeout(
          function(){

            deleting = true;

            tick();

          },
          3000
        );

      }

    }

    /* =========================
       DELETING
       ========================= */

    else{

      if(index > 0){

        index--;

        draw();

        setTimeout(
          tick,
          40
        );

      }else{

        deleting = false;

        /* Small pause before typing again */

        setTimeout(
          tick,
          350
        );

      }

    }

  }


  /* Start */

  draw();

  tick();

})();



/* =========================================================
   JOB DATA
   ========================================================= */

const KEY =
  "localjobhub_jobs";


const demoJobs = [

  {
    id:"demo1",
    title:"Security Guard",
    company:"ABC Consultancy",
    location:"Siliguri",
    category:"Security",
    salary:"₹14,000 - ₹18,000",
    type:"Full Time",
    experience:"0-2 years",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=700&q=80"
  },

  {
    id:"demo2",
    title:"Computer Operator",
    company:"Unique Consultancy",
    location:"Pradhan Nagar, Siliguri",
    category:"Computer",
    salary:"₹10,000 - ₹15,000",
    type:"Full Time",
    experience:"0-2 years",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=700&q=80"
  },

  {
    id:"demo3",
    title:"Delivery Boy",
    company:"Fast Track Consultancy",
    location:"Matigara",
    category:"Delivery",
    salary:"₹12,000 - ₹16,000",
    type:"Full Time",
    experience:"Fresher",
    image:
      "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=700&q=80"
  },

  {
    id:"demo4",
    title:"Receptionist",
    company:"North Bengal Consultancy",
    location:"Sevoke Road",
    category:"Retail",
    salary:"₹12,000 - ₹16,000",
    type:"Full Time",
    experience:"1 year",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=700&q=80"
  },

  {
    id:"demo5",
    title:"Electrician",
    company:"TechPoint Services",
    location:"Bagdogra",
    category:"Technician",
    salary:"₹15,000 - ₹22,000",
    type:"Full Time",
    experience:"2+ years",
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=700&q=80"
  },

  {
    id:"demo6",
    title:"Hotel Staff",
    company:"Hillside Hotel",
    location:"Siliguri",
    category:"Hotel",
    salary:"₹11,000 - ₹15,000",
    type:"Full Time",
    experience:"Fresher",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=700&q=80"
  }

];



/* =========================================================
   GET JOBS
   ========================================================= */

function jobs(){

  let saved =
    JSON.parse(
      localStorage.getItem(KEY) ||
      "null"
    );


  if(!Array.isArray(saved)){

    localStorage.setItem(
      KEY,
      JSON.stringify(demoJobs)
    );

    return demoJobs;

  }


  return saved;

}



/* =========================================================
   ESCAPE HTML
   ========================================================= */

function esc(s){

  return String(
    s ?? ""
  ).replace(
    /[&<>"']/g,
    m=>({

      "&":"&amp;",
      "<":"&lt;",
      ">":"&gt;",
      '"':"&quot;",
      "'":"&#039;"

    }[m])
  );

}



/* =========================================================
   RENDER JOBS
   ========================================================= */

function renderJobs(
  list = jobs()
){

  const grid =
    document.querySelector(
      "#jobGrid"
    );


  if(!grid){
    return;
  }


  if(
    !Array.isArray(list) ||
    !list.length
  ){

    grid.innerHTML =
      '<div class="panel"><b>No jobs found.</b><p>Try another job title or location.</p></div>';

    return;

  }


  grid.innerHTML =
    list
      .slice(0,8)
      .map(
        j=>`

        <article class="job-card">

          <div
            class="job-photo"
            style="background-image:url('${esc(
              j.image ||
              demoJobs[0].image
            )}')"
          >

            <span class="verified-badge">
              ✓ Verified
            </span>

          </div>


          <div class="job-body">

            <h3 class="job-title-visible">
              ${esc(
                j.title ||
                "Job Opportunity"
              )}
            </h3>


            <p class="company">
              ${esc(j.company)}
            </p>


            <p>
              ⌖ ${esc(j.location)}
            </p>


            <p>
              💼 ${esc(
                j.experience ||
                "Fresher"
              )}
            </p>


            <div class="job-meta">

              <b>
                ${esc(
                  j.salary ||
                  "Salary negotiable"
                )}
              </b>

              <span>
                ${esc(
                  j.type ||
                  "Full Time"
                )}
              </span>

            </div>


            <div class="job-buttons">

              <button
                class="btn btn-primary apply-btn"
                data-id="${esc(j.id)}"
              >
                Apply
              </button>


              <button
                class="btn btn-outline details-btn"
                data-id="${esc(j.id)}"
              >
                Details
              </button>

            </div>

          </div>

        </article>

      `
      )
      .join("");


  const count =
    document.querySelector(
      "#jobCount"
    );


  if(count){

    count.textContent =
      `${Math.max(
        1250,
        list.length
      )}+`;

  }

}



/* =========================================================
   JOB SEARCH
   ========================================================= */

function search(){

  const k =
    (
      document.querySelector(
        "#keyword"
      )?.value ||
      ""
    )
      .trim()
      .toLowerCase();


  const l =
    (
      document.querySelector(
        "#location"
      )?.value ||
      ""
    )
      .trim()
      .toLowerCase();


  const result =
    jobs().filter(
      j=>

        (
          !k ||

          `${j.title} ${j.company} ${j.category} ${j.experience}`
            .toLowerCase()
            .includes(k)

        )

        &&

        (
          !l ||

          String(
            j.location ||
            ""
          )
            .toLowerCase()
            .includes(l)

        )

    );


  renderJobs(result);


  document
    .querySelector("#jobs")
    ?.scrollIntoView({
      behavior:"smooth"
    });

}



/* =========================================================
   SEARCH FORM
   ========================================================= */

document
  .querySelector("#jobSearch")
  ?.addEventListener(
    "submit",
    e=>{

      e.preventDefault();

      search();

    }
  );



/* =========================================================
   CATEGORY SEARCH
   ========================================================= */

document
  .querySelectorAll(
    "[data-category]"
  )
  .forEach(
    a=>

      a.addEventListener(
        "click",
        ()=>{

          const v =
            a.dataset.category;


          const k =
            document.querySelector(
              "#keyword"
            );


          if(k){

            k.value = v;

          }


          search();

        }
      )
  );



/* =========================================================
   SHOW ALL JOBS
   ========================================================= */

document
  .querySelector(
    "#showAllJobs"
  )
  ?.addEventListener(
    "click",
    e=>{

      e.preventDefault();


      renderJobs();


      document
        .querySelector(
          "#jobs"
        )
        ?.scrollIntoView({
          behavior:"smooth"
        });

    }
  );



/* =========================================================
   MOBILE MENU
   ========================================================= */

const menuBtn =
  document.querySelector(
    "#menuBtn"
  );


const mainNav =
  document.querySelector(
    "#mainNav"
  );


if(
  menuBtn &&
  mainNav
){

  menuBtn.addEventListener(
    "click",
    e=>{

      e.stopPropagation();


      const isOpen =
        mainNav.classList.toggle(
          "open"
        );


      menuBtn.setAttribute(
        "aria-expanded",
        isOpen
          ? "true"
          : "false"
      );

    }
  );


  mainNav
    .querySelectorAll("a")
    .forEach(
      a=>

        a.addEventListener(
          "click",
          ()=>{

            mainNav.classList.remove(
              "open"
            );


            menuBtn.setAttribute(
              "aria-expanded",
              "false"
            );

          }
        )
    );


  document.addEventListener(
    "click",
    e=>{

      if(
        !mainNav.contains(
          e.target
        ) &&

        !menuBtn.contains(
          e.target
        )
      ){

        mainNav.classList.remove(
          "open"
        );


        menuBtn.setAttribute(
          "aria-expanded",
          "false"
        );

      }

    }
  );

}



/* =========================================================
   LANGUAGE SELECTOR
   ========================================================= */

const languageSelect =
  document.querySelector(
    "#languageSelect"
  );


if(languageSelect){

  const savedLang =
    localStorage.getItem(
      "localjobs_language"
    ) ||

    localStorage.getItem(
      "localjobhub_language"
    ) ||

    "en";


  if(
    [
      ...languageSelect.options
    ]
      .some(
        o =>
          o.value === savedLang
      )
  ){

    languageSelect.value =
      savedLang;

  }


  languageSelect.addEventListener(
    "change",
    e=>{

      localStorage.setItem(
        "localjobs_language",
        e.target.value
      );


      localStorage.setItem(
        "localjobhub_language",
        e.target.value
      );


      document.documentElement.lang =
        e.target.value;

    }
  );

}



/* =========================================================
   MORE CONSULTANCIES
   ========================================================= */

const moreBtn =
  document.querySelector(
    "#moreConsultancyBtn"
  );


const moreArea =
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


const noResult =
  document.querySelector(
    "#noConsultancyResult"
  );


if(
  moreBtn &&
  moreArea
){

  moreBtn.addEventListener(
    "click",
    ()=>{

      const show =
        moreArea.classList.toggle(
          "show"
        );


      moreBtn.textContent =
        show
          ? "Hide Consultancies ↑"
          : "More Consultancies →";


      if(show){

        consultancySearch?.focus();

      }

    }
  );

}



if(
  consultancySearch &&
  consultancyList
){

  consultancySearch.addEventListener(
    "input",
    ()=>{

      const q =
        consultancySearch
          .value
          .trim()
          .toLowerCase();


      let found = 0;


      consultancyList
        .querySelectorAll(
          ".consultancy-item"
        )
        .forEach(
          item=>{

            const name =
              item
                .querySelector(
                  "h4"
                )
                ?.textContent
                .toLowerCase() ||
              "";


            const ok =
              !q ||
              name.includes(q);


            item.style.display =
              ok
                ? ""
                : "none";


            if(ok){

              found++;

            }

          }
        );


      if(noResult){

        noResult.style.display =
          found
            ? "none"
            : "block";

      }

    }
  );

}



/* =========================================================
   APPLY / DETAILS
   ========================================================= */

document.addEventListener(
  "click",
  e=>{

    /* =========================
       APPLY
       ========================= */

    const apply =
      e.target.closest(
        ".apply-btn"
      );


    if(apply){

      const j =
        jobs().find(
          x =>
            x.id ===
            apply.dataset.id
        );


      if(j){

        let a =
          JSON.parse(
            localStorage.getItem(
              "localjobhub_applications"
            ) ||
            "[]"
          );


        if(
          !a.some(
            x =>
              x.jobId ===
              j.id
          )
        ){

          a.push({

            jobId:j.id,

            title:j.title,

            status:"Applied"

          });


          localStorage.setItem(
            "localjobhub_applications",
            JSON.stringify(a)
          );

        }


        alert(
          `Application submitted for ${j.title}.`
        );

      }

    }



    /* =========================
       DETAILS
       ========================= */

    const details =
      e.target.closest(
        ".details-btn"
      );


    if(details){

      const j =
        jobs().find(
          x =>
            x.id ===
            details.dataset.id
        );


      if(j){

        alert(
          `${j.title}\n${j.company}\n${j.location}\n${j.salary}\n${j.experience}`
        );

      }

    }

  }
);



/* =========================================================
   INITIAL JOB RENDER
   ========================================================= */

renderJobs();

});
