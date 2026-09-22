/* INDEPENDENT HERO + MOBILE NAV CONTROLS */
document.addEventListener("DOMContentLoaded", () => {
  const line1 = document.getElementById("heroTypingLine1");
  const line2 = document.getElementById("heroTypingLine2");

  const startHeroTyping = (lang = "en") => {
    const firstEl = document.getElementById("heroTypingLine1");
    const secondEl = document.getElementById("heroTypingLine2");
    if (!firstEl || !secondEl) return;

    const phrases = {
      en: ["Find a Job in Your Own City,", "For the People of Siliguri."],
      bn: ["নিজের শহরে চাকরি খুঁজুন,", "শিলিগুড়ির মানুষের জন্য।"],
      hi: ["अपने शहर में नौकरी खोजें,", "सिलीगुड़ी के लोगों के लिए।"]
    };
    const [first, second] = phrases[lang] || phrases.en;

    firstEl.textContent = "";
    secondEl.textContent = "";
    let i = 0, j = 0, phase = 0;

    const tick = () => {
      if (phase === 0) {
        if (i <= first.length) {
          firstEl.textContent = first.slice(0, i++);
          setTimeout(tick, 70);
          return;
        }
        phase = 1; setTimeout(tick, 350); return;
      }
      if (phase === 1) {
        if (j <= second.length) {
          secondEl.textContent = second.slice(0, j++);
          setTimeout(tick, 60);
          return;
        }
        phase = 2; setTimeout(tick, 2000); return;
      }
      if (phase === 2) {
        if (j >= 0) {
          secondEl.textContent = second.slice(0, j--);
          setTimeout(tick, 35);
          return;
        }
        phase = 3; setTimeout(tick, 150); return;
      }
      if (phase === 3) {
        if (i >= 0) {
          firstEl.textContent = first.slice(0, i--);
          setTimeout(tick, 35);
          return;
        }
        phase = 0; i = 0; j = 0; tick();
      }
    };
    tick();
  };

  // Hero typing is controlled by the FINAL HERO + LANGUAGE CONTROLLER below.

  if (window.matchMedia("(max-width: 900px)").matches) {
    const header = document.querySelector(".site-header");
    const bottomNav = document.getElementById("mobileBottomNav");
    let lastY = window.scrollY || 0;
    let direction = 0, headerTimer = null, bottomTimer = null;

    window.addEventListener("scroll", () => {
      const y = window.scrollY || 0;
      const delta = y - lastY;
      if (Math.abs(delta) < 2) return;
      lastY = y;
      clearTimeout(headerTimer);
      clearTimeout(bottomTimer);

      if (y <= 8) {
        direction = 0;
        header?.classList.remove("mobile-scroll-hide");
        bottomNav?.classList.remove("mobile-bottom-hide");
      } else if (delta < 0) {
        direction = -1;
        header?.classList.add("mobile-scroll-hide");
        bottomNav?.classList.remove("mobile-bottom-hide");
        headerTimer = setTimeout(() => {
          if (direction === -1) header?.classList.remove("mobile-scroll-hide");
        }, 2000);
      } else {
        direction = 1;
        header?.classList.remove("mobile-scroll-hide");
        bottomNav?.classList.add("mobile-bottom-hide");
        bottomTimer = setTimeout(() => {
          if (direction === 1) bottomNav?.classList.remove("mobile-bottom-hide");
        }, 1000);
      }
    }, {passive:true});
  }

  // Clicked mobile menu item changes colour so the selected item is obvious.
  document.querySelectorAll("#mobileBottomNav .mobile-nav-item").forEach(item => {
    item.addEventListener("click", () => {
      document.querySelectorAll("#mobileBottomNav .mobile-nav-item").forEach(x => x.classList.remove("active"));
      item.classList.add("active");
    });
  });

  const account = document.querySelector("#mobileBottomNav .mobile-account");
  account?.addEventListener("toggle", () => {
    const summary = account.querySelector("summary");
    summary?.classList.toggle("active", account.open);
  });
});

document.addEventListener("DOMContentLoaded", async () => {
  const sb = window.LocalJobHubSupabase || window.supabase.createClient(window.LOCALJOBHUB_SUPABASE_URL, window.LOCALJOBHUB_SUPABASE_KEY);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
  const defaultImage = "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=700&q=80";

  async function getUser() { const {data} = await sb.auth.getUser(); return data.user || null; }
  async function getProfile() { const u=await getUser(); if(!u) return null; const {data}=await sb.from("profiles").select("*").eq("id",u.id).maybeSingle(); return data; }

  async function loadApprovedJobs() {
    const {data,error}=await sb.from("jobs").select("*").eq("status","approved").order("created_at",{ascending:false});
    return error ? [] : (data || []);
  }
  async function loadExternalJobs() {
    const {data,error}=await sb.from("external_jobs").select("*").order("source_checked_at",{ascending:false}).limit(30);
    return !error && data?.length ? data : [];
  }

  const jobImageByType = [
    {keys:["delivery boy","delivery partner","delivery executive","delivery"], url:"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=82"},
    {keys:["sales executive","field sales","sales"], url:"https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=82"},
    {keys:["cashier","retail"], url:"https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=82"},
    {keys:["electrical","electronics","technician","electrician"], url:"https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=82"},
    {keys:["receptionist","front desk","hotel"], url:"https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=82"},
    {keys:["back office","computer","office"], url:"https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=82"}
  ];
  function jobImage(job){
    const hay=(job.title+" "+(job.category||"")+" "+(job.company||"")).toLowerCase();
    return (jobImageByType.find(x=>x.keys.some(k=>hay.includes(k)))||jobImageByType[5]).url;
  }

  function renderJobs(list) {
    const grid=document.querySelector("#jobGrid"); if(!grid) return;
    if(!list.length){grid.innerHTML='<div class="panel"><b>No jobs found.</b><p>Try another search.</p></div>';return;}
    grid.innerHTML=list.slice(0,8).map(j => {
      const external=Boolean(j.source_name);
      const actionClass=external ? "source-btn" : "apply-btn";
      const actionText=external ? "View Source" : "Apply";
      const badge=external ? "Source listing" : "LocalJobHub approved";
      const source=external ? '<small class="external-source">Source: '+esc(j.source_name)+'</small>' : "";
      return '<article class="job-card"><div class="job-photo" style="background-image:url('+jobImage(j)+')"><span class="verified-badge">'+badge+'</span></div><div class="job-body"><h3 class="job-title-visible">'+esc(j.title)+'</h3><p class="company">'+esc(j.company)+'</p><p>⌖ '+esc(j.location)+'</p><p>💼 '+esc(j.experience || "Not specified")+'</p><div class="job-meta"><b>'+esc(j.salary || "Salary not disclosed")+'</b><span>'+esc(j.job_type || j.type || "Full Time")+'</span></div><div class="job-buttons"><button class="btn btn-primary '+actionClass+'" data-id="'+esc(j.id)+'">'+actionText+'</button><button class="btn btn-outline details-btn" data-id="'+esc(j.id)+'">Details</button></div>'+source+'</div></article>';
    }).join("");
  }

  const results=await Promise.all([loadApprovedJobs(),loadExternalJobs()]);
  let allJobs=[...results[0],...results[1]];
  renderJobs(allJobs);

  document.querySelector("#jobSearch")?.addEventListener("submit", e => {
    e.preventDefault();
    const keyword=(document.querySelector("#keyword")?.value || "").toLowerCase().trim();
    const location=(document.querySelector("#location")?.value || "").toLowerCase().trim();
    renderJobs(allJobs.filter(j => {
      const text=(j.title+" "+j.company+" "+(j.category||"")+" "+(j.experience||"")).toLowerCase();
      return (!keyword || text.includes(keyword)) && (!location || String(j.location||"").toLowerCase().includes(location));
    }));
    document.querySelector("#jobs")?.scrollIntoView({behavior:"smooth"});
  });

  document.querySelectorAll("[data-category]").forEach(a => a.addEventListener("click", () => {
    const keyword=document.querySelector("#keyword"); if(keyword) keyword.value=a.dataset.category;
    document.querySelector("#jobSearch")?.dispatchEvent(new Event("submit",{cancelable:true}));
  }));

  document.querySelectorAll("[data-location-filter]").forEach(card => {
    const run=() => {
      const selected=card.dataset.locationFilter.toLowerCase();
      const aliases = {
        "siliguri":["siliguri"],
        "matigara":["matigara"],
        "sevoke road":["sevoke","sevoke road"],
        "bagdogra":["bagdogra"]
      };
      const terms=aliases[selected]||[selected];
      const filtered=allJobs.filter(j => terms.some(t=>String(j.location||"").toLowerCase().includes(t)));
      renderJobs(filtered);
      document.querySelector("#jobs")?.scrollIntoView({behavior:"smooth"});
    };
    card.addEventListener("click",run);
    card.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();run();}});
  });
  document.querySelector("#showAllJobs")?.addEventListener("click", e => {e.preventDefault();renderJobs(allJobs);document.querySelector("#jobs")?.scrollIntoView({behavior:"smooth"})});

  const language=document.querySelector("#languageSelect");
  if(language){const saved=localStorage.getItem("localjobs_language")||"en";if([...language.options].some(o=>o.value===saved))language.value=saved;language.addEventListener("change",e=>localStorage.setItem("localjobs_language",e.target.value));}
  const more=document.querySelector("#moreConsultancyBtn"), area=document.querySelector("#moreConsultancyArea");
  if(more&&area)more.addEventListener("click",()=>{const show=area.classList.toggle("show");more.textContent=show?"Hide Consultancies ↑":"More Consultancies →";});
  const menu=document.querySelector("#menuBtn"), nav=document.querySelector("#mainNav");
  if(menu&&nav)menu.addEventListener("click",()=>nav.classList.toggle("open"));

  document.addEventListener("click", async e => {
    const source=e.target.closest(".source-btn"), apply=e.target.closest(".apply-btn"), details=e.target.closest(".details-btn");
    if(source){const job=allJobs.find(x=>x.id===source.dataset.id);if(job?.source_url)window.open(job.source_url,"_blank","noopener");return;}
    if(apply){const u=await getUser();if(!u){location.href="login.html?next=index.html";return;}const p=await getProfile();if(!p||p.role!=="seeker"){alert("Please login with a Job Seeker account.");return;}const r=await sb.from("job_applications").insert({job_id:apply.dataset.id,seeker_id:u.id});alert(r.error?(r.error.code==="23505"?"You already applied for this job.":r.error.message):"Application submitted successfully.");}
    if(details){const job=allJobs.find(x=>x.id===details.dataset.id);if(job)alert(job.title+"\n"+job.company+"\n"+job.location+"\n"+(job.salary||"Salary not disclosed")+"\n\n"+(job.description||"For source listings, use View Source to apply."));}
  });

  document.querySelectorAll("[data-register-role]").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll("[data-register-role]").forEach(x=>x.classList.remove("active"));button.classList.add("active");
    document.querySelector("#registerRole").value=button.dataset.registerRole;
    document.querySelector("#seekerFields")?.classList.toggle("hidden",button.dataset.registerRole!=="seeker");
    document.querySelector("#employerFields")?.classList.toggle("hidden",button.dataset.registerRole!=="employer");
  }));

  document.querySelector("#registerForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    const role=document.querySelector("#registerRole").value,name=document.querySelector("#regName").value.trim(),email=document.querySelector("#regEmail").value.trim(),password=document.querySelector("#regPassword").value;
    if(password!==document.querySelector("#regConfirm").value){alert("Passwords do not match.");return;}
    const phone=document.querySelector("#regMobile")?.value.trim()||"";
    const jobLocation=document.querySelector("#regLocation")?.value.trim()||"";
    const skills=document.querySelector("#regSkills")?.value.trim()||"";
    const qualification=document.querySelector("#regQualification")?.value.trim()||"";
    const experience=document.querySelector("#regExperience")?.value.trim()||"";
    const companyDetails=document.querySelector("#regCompanyDetails")?.value.trim()||"";
    try {
      const r=await sb.auth.signUp({
        email,
        password,
        options:{data:{full_name:name,role,phone,mobile:phone,location:jobLocation,skills,qualification,experience,company_details:companyDetails}}
      });
      if(r.error){alert("Registration failed: "+r.error.message);return;}
      if(!r.data?.user){alert("Registration failed: Supabase did not return a user.");return;}
      alert(r.data.session
        ? "Account created successfully. You can login now."
        : "Account created successfully. Check your email for confirmation, then login.");
      window.location.href="login.html";
    } catch(err) {
      alert("Registration failed: "+(err?.message||String(err)));
    }
  });

  document.querySelector("#loginForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    const r=await sb.auth.signInWithPassword({email:document.querySelector("#loginId").value.trim(),password:document.querySelector("#loginPassword").value});
    if(r.error){alert(r.error.message);return;}
    const p=await getProfile();
    location.href=p?.role==="admin"?"admin.html":p?.role==="employer"?"employer-dashboard.html":"seeker-dashboard.html";
  });
});

/* FINAL HERO + LANGUAGE CONTROLLER */
document.addEventListener("DOMContentLoaded", () => {
  let heroRun = 0;

  const heroSequences = {
    en: [
      {lines:["Find Your Job in Siliguri","For the People of Siliguri."], repeat:3},
      {lines:["Best Job Provider Consultancy,","Local Job Provider Company."], repeat:1}
    ],
    bn: [
      {lines:["শিলিগুড়িতে নিজের চাকরি খুঁজুন","শিলিগুড়ির মানুষের জন্য।"], repeat:3},
      {lines:["সেরা চাকরি প্রদানকারী কনসালটেন্সি,","স্থানীয় চাকরি প্রদানকারী কোম্পানি।"], repeat:1}
    ],
    hi: [
      {lines:["सिलीगुड़ी में अपनी नौकरी खोजें","सिलीगुड़ी के लोगों के लिए।"], repeat:3},
      {lines:["सर्वश्रेष्ठ जॉब प्रोवाइडर कंसल्टेंसी,","स्थानीय जॉब प्रोवाइडर कंपनी।"], repeat:1}
    ]
  };

  const ensureHero = () => {
    const h1 = document.querySelector(".hero-copy h1");
    if (!h1) return null;
    if (!h1.querySelector("#heroTypingLine1") || !h1.querySelector("#heroTypingLine2")) {
      h1.innerHTML = '<span id="heroTypingLine1" class="hero-typing-line hero-typing-line1"></span><span id="heroTypingLine2" class="hero-typing-line hero-typing-line2"></span>';
    }
    return h1;
  };

  const startHero = (lang = "en") => {
    const h1 = ensureHero();
    const firstEl = document.getElementById("heroTypingLine1");
    const secondEl = document.getElementById("heroTypingLine2");
    if (!h1 || !firstEl || !secondEl) return;

    h1.classList.add("hero-typing-fixed");
    const run = ++heroRun;
    const sequence = heroSequences[lang] || heroSequences.en;
    let sequenceIndex = 0;
    let repeatCount = 0;
    let lineIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const tick = () => {
      if (run !== heroRun) return;

      const current = sequence[sequenceIndex];
      const line1 = current.lines[0];
      const line2 = current.lines[1];
      h1.setAttribute("aria-label", line1 + " " + line2);

      if (!deleting) {
        firstEl.textContent = line1.slice(0, lineIndex === 0 ? charIndex : line1.length);
        secondEl.textContent = line2.slice(0, lineIndex === 1 ? charIndex : 0);

        const activeLine = lineIndex === 0 ? line1 : line2;
        if (charIndex < activeLine.length) {
          charIndex++;
          setTimeout(tick, 105);
          return;
        }

        if (lineIndex === 0) {
          lineIndex = 1;
          charIndex = 0;
          setTimeout(tick, 250);
          return;
        }

        setTimeout(() => {
          if (run !== heroRun) return;
          deleting = true;
          lineIndex = 1;
          charIndex = line2.length;
          tick();
        }, 3000);
        return;
      }

      if (lineIndex === 1) {
        secondEl.textContent = line2.slice(0, charIndex);
        if (charIndex > 0) {
          charIndex--;
          setTimeout(tick, 30);
          return;
        }
        lineIndex = 0;
        charIndex = line1.length;
        setTimeout(tick, 80);
        return;
      }

      firstEl.textContent = line1.slice(0, charIndex);
      if (charIndex > 0) {
        charIndex--;
        setTimeout(tick, 30);
        return;
      }

      deleting = false;
      repeatCount++;
      if (repeatCount >= current.repeat) {
        repeatCount = 0;
        sequenceIndex = (sequenceIndex + 1) % sequence.length;
      }
      lineIndex = 0;
      charIndex = 0;
      setTimeout(tick, 250);
    };

    firstEl.textContent = "";
    secondEl.textContent = "";
    tick();
  };

  window.LocalJobHubStartHeroTyping = startHero;

  const getLang = () => localStorage.getItem("localjobhub_language") || "en";
  const syncLanguage = lang => {
    const main = document.getElementById("languageSelect");
    const mobile = document.getElementById("mobileLanguageSelect");
    if (main) main.value = lang;
    if (mobile) mobile.value = lang;
  };

  const applyFinalLanguage = lang => {
    if (!heroSequences[lang]) lang = "en";
    localStorage.setItem("localjobhub_language", lang);
    syncLanguage(lang);
    if (typeof window.applyLanguage === "function") window.applyLanguage(lang);
    startHero(lang);
  };

  const main = document.getElementById("languageSelect");
  const mobile = document.getElementById("mobileLanguageSelect");

  if (main) main.addEventListener("change", () => {
    const lang = main.value;
    applyFinalLanguage(lang);
  });

  if (mobile) mobile.addEventListener("change", () => {
    const lang = mobile.value;
    syncLanguage(lang);
    if (main) main.dispatchEvent(new Event("change", {bubbles:true}));
    else applyFinalLanguage(lang);
    const details = mobile.closest("details");
    if (details) setTimeout(() => { details.open = false; }, 0);
  });

  const account = document.querySelector("#mobileBottomNav .mobile-account");
  account?.addEventListener("toggle", () => {
    const summary = account.querySelector("summary");
    summary?.classList.toggle("active", account.open);
  });

  const h1 = ensureHero();
  if (h1) {
    const observer = new MutationObserver(() => {
      if (!h1.querySelector("#heroTypingLine1") || !h1.querySelector("#heroTypingLine2")) {
        startHero(getLang());
      }
    });
    observer.observe(h1, {childList:true, subtree:true});
  }

  syncLanguage(getLang());
  startHero(getLang());
});
