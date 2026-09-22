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

  function startTyping() {
    const line1=document.querySelector("#heroTypingLine1"), line2=document.querySelector("#heroTypingLine2");
    if(!line1 || !line2) return;
    const first="Find local jobs that match", second="your skills in Siliguri.";
    let i=0,j=0,phase=0;
    function tick() {
      if(phase===0){ if(i<=first.length){line1.textContent=first.slice(0,i++);return setTimeout(tick,70)} phase=1;return setTimeout(tick,350); }
      if(phase===1){ if(j<=second.length){line2.textContent=second.slice(0,j++);return setTimeout(tick,60)} phase=2;return setTimeout(tick,3000); }
      if(phase===2){ if(j>=0){line2.textContent=second.slice(0,j--);return setTimeout(tick,35)} phase=3;return setTimeout(tick,250); }
      if(i>=0){line1.textContent=first.slice(0,i--);return setTimeout(tick,35)}
      line1.textContent="";line2.textContent="";i=0;j=0;phase=0;setTimeout(tick,500);
    }
    tick();
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

  startTyping();
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