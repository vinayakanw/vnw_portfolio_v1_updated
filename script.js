/* VNW100 portfolio interactions (lightweight, no dependencies) */
(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const raf=f=>{let t=false;return()=>{if(!t){t=true;requestAnimationFrame(()=>{f();t=false})}}};
/* navbar + scrollspy */
const nav=$('#navbar'),secs=$$('section[id]');let clicking=false,ct;
const setActive=h=>$$('.nav-link,.mobile-nav-link').forEach(l=>l.classList.toggle('active',l.getAttribute('href')===h));
const onScroll=raf(()=>{nav.classList.toggle('scrolled',scrollY>40);if(clicking)return;
 if(innerHeight+scrollY>=document.documentElement.scrollHeight-60)return setActive('#contact');
 const p=scrollY+120;let id='home';secs.forEach(s=>{if(p>=s.offsetTop&&p<s.offsetTop+s.offsetHeight)id=s.id});setActive('#'+id)});
addEventListener('scroll',onScroll,{passive:true});onScroll();
/* mobile menu */
const hb=$('#navHamburger'),mm=$('#mobileMenu');
const closeMenu=()=>{hb.classList.remove('active');mm.classList.remove('active');document.body.style.overflow=''};
hb.addEventListener('click',()=>{hb.classList.toggle('active');mm.classList.toggle('active');document.body.style.overflow=mm.classList.contains('active')?'hidden':''});
$$('.mobile-nav-link').forEach(l=>{const h=l.getAttribute('href');if(h&&!h.startsWith('#'))l.addEventListener('click',closeMenu)});
/* smooth anchors */
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const h=a.getAttribute('href');if(h.length<2)return;const t=$(h);if(!t)return;
 e.preventDefault();closeMenu();clicking=true;clearTimeout(ct);setActive(h);
 scrollTo({top:t.getBoundingClientRect().top+scrollY-72,behavior:'smooth'});ct=setTimeout(()=>{clicking=false},850)}));
/* reveal */
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('visible');io.unobserve(x.target)}}),{threshold:.08,rootMargin:'0px 0px -40px 0px'});
$$('.reveal').forEach(el=>io.observe(el));
/* typewriter */
const tw=$('#typewriterText');
if(tw){
 const roles = [
   "Software Engineer",
   "Full-Stack Developer",
   "Backend Engineer",
   "API & Systems Developer",
   "Offensive Security Engineer",
 ];
 let r=0,c=roles[0].length,del=true;
 const tick=()=>{const cur=roles[r];c+=del?-1:1;tw.textContent=cur.slice(0,c);let d=del?40:80;
  if(!del&&c===cur.length){d=1800;del=true}else if(del&&c===0){del=false;r=(r+1)%roles.length;d=350}setTimeout(tick,d)};
 setTimeout(tick,1800)}
/* about stacking cards */
const cards=$$('.prompt-pill-card');
const stack=raf(()=>cards.forEach((c,i)=>{const top=c.getBoundingClientRect().top,n=cards[i+1];
 const covered=n&&n.getBoundingClientRect().top<=100+(i+1)*26+20,sticky=top<=100+i*26+4;
 c.classList.toggle('card-stacked-under',!!covered);c.classList.toggle('card-active-top',!covered&&sticky)}));
if(cards.length&&matchMedia('(min-width:861px)').matches){addEventListener('scroll',stack,{passive:true});stack()}
/* skills inspector-free: keyboard focus handled by CSS tooltips */
/* view more projects */
const mp=$('#moreProjects'),pg=$('#projectsGrid');
if(mp)mp.addEventListener('click',()=>{const o=pg.classList.toggle('show-extra');mp.classList.toggle('open',o);$('span',mp).textContent=o?'Show Fewer Projects':'View More Projects';
 if(o)$$('.extra-project',pg).forEach(e=>e.classList.add('visible'))});
/* lightbox */
const lb=$('#lightboxModal'),li=$('#lightboxImg');
const closeLb=()=>{lb.classList.remove('active');document.body.style.overflow='';setTimeout(()=>{li.src=''},250)};
$$('[data-cert-src]').forEach(c=>c.addEventListener('click',()=>{li.src=c.dataset.certSrc;$('#lightboxTitle').textContent=c.dataset.certTitle||'Certificate';$('#lightboxCaption').textContent=c.dataset.certCaption||'';lb.classList.add('active');document.body.style.overflow='hidden'}));
$('#lightboxCloseBtn').addEventListener('click',closeLb);lb.addEventListener('click',e=>{if(e.target===lb)closeLb()});
/* coming-soon modal */
const M={demo:['LIVE DEMO','This project is currently being updated and refined. The live demo will be available soon.','In Development'],resume:['RESUME',"Vinayaka's resume is ready to view and download at vinayakanw_resume.pdf.",'Available']};
const vm=$('#vnwModal'),closeVm=()=>{vm.classList.remove('active');vm.setAttribute('aria-hidden','true')};
$$('[data-modal]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();closeMenu();const m=M[a.dataset.modal];
 $('#vmLabel').textContent=m[0];$('#vmDesc').textContent=m[1];$('#vmStatus').textContent=m[2];vm.classList.add('active');vm.setAttribute('aria-hidden','false')}));
$('#vnwModalX').addEventListener('click',closeVm);vm.addEventListener('click',e=>{if(e.target===vm)closeVm()});
addEventListener('keydown',e=>{if(e.key==='Escape'){closeVm();closeLb();closeMenu()}});
/* toast + copy email */
const toast=$('#toastNotice'),tm=$('#toastMsg');
const say=m=>{tm.textContent=m;toast.classList.add('show');clearTimeout(say.t);say.t=setTimeout(()=>toast.classList.remove('show'),3200)};
const em=$('#contactEmailCard');
if(em){
  em.addEventListener('click',()=>{
    navigator.clipboard.writeText('vinayakanw@gmail.com').catch(()=>{});
    say('Copied vinayakanw@gmail.com to clipboard! Opening compose…');
  });
}
/* contact form -> submit directly to vinayakanw@gmail.com via FormSubmit with fallback */
window.handleContactSubmit=async e=>{
  e.preventDefault();
  const f=e.target,v=n=>(f.elements[n]?f.elements[n].value.trim():'');
  const btn=f.querySelector('button[type="submit"]')||$('#contactSubmitBtn');
  const origBtn=btn?btn.innerHTML:'';
  const name=v('name'),email=v('email'),message=v('message');
  if(!name||!email||!message){say('Please complete all fields before sending.');return}
  if(btn){btn.disabled=true;btn.innerHTML='<span>Sending Message…</span>'}
  try{
    const fd=new FormData(f);
    const res=await fetch('https://formsubmit.co/ajax/vinayakanw@gmail.com',{
      method:'POST',
      body:fd,
      headers:{'Accept':'application/json'}
    });
    if(res.ok){
      say('✓ Thank you '+name+'! Your message has been sent to Vinayaka.');
      f.reset();
      if(btn){
        btn.innerHTML='<span>✓ Message Sent!</span>';
        setTimeout(()=>{btn.disabled=false;btn.innerHTML=origBtn},3500);
      }
      return;
    }
    throw new Error('Server returned '+res.status);
  }catch(err){
    say('Opening mail composer to send directly…');
    const mailUrl='https://mail.google.com/mail/?view=cm&fs=1&to=vinayakanw@gmail.com&su='+
      encodeURIComponent('Portfolio message from '+name)+
      '&body='+encodeURIComponent(message+'\n\n— '+name+' ('+email+')');
    window.open(mailUrl,'_blank')||(location.href='mailto:vinayakanw@gmail.com?subject='+encodeURIComponent('Portfolio message from '+name)+'&body='+encodeURIComponent(message+'\n\n— '+name+' ('+email+')'));
    f.reset();
    if(btn){btn.disabled=false;btn.innerHTML=origBtn}
  }
};

/* ---- extras: progress, back-to-top, filters, intro, chatbot ---- */
const pb=$('#vnwProgress'),tp=$('#vnwTop');
const prog=raf(()=>{const h=document.documentElement.scrollHeight-innerHeight;pb.style.transform='scaleX('+(h>0?scrollY/h:0)+')';tp.classList.toggle('show',scrollY>700)});
addEventListener('scroll',prog,{passive:true});prog();tp.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
const fl=$('#projFilters');
if(fl)fl.addEventListener('click',e=>{const b=e.target.closest('.vnw-filter');if(!b)return;$$('.vnw-filter',fl).forEach(x=>x.classList.toggle('active',x===b));
 const f=b.dataset.f,all=f==='all';pg.classList.toggle('show-extra',!all||mp.classList.contains('open'));
 $$('.project-card-v2',pg).forEach(c=>{c.classList.toggle('is-hidden',!all&&!c.dataset.cat.split(' ').includes(f));c.classList.add('visible')});
 mp.parentElement.style.display=all?'':'none'});
const intro=$('#vnwIntro');
if(intro){
 {const hi=['ನಮಸ್ಕಾರ','Hello','नमस्ते','வணக்கம்','నమస్కారం','നമസ്കാരം','Hola','こんにちは','Bonjour','Welcome'];let i=0;
  const t=setInterval(()=>{i=(i+1)%hi.length;$('#vnwHi').textContent=hi[i]},280);
  document.body.style.overflow='hidden';
  const end=()=>{if(!intro.isConnected||intro.classList.contains('done'))return;clearInterval(t);intro.classList.add('done');document.body.style.overflow='';setTimeout(()=>intro.remove(),700)};
  const t0=Date.now(),MIN=2600;const go=()=>setTimeout(end,Math.max(0,MIN-(Date.now()-t0)));
  document.readyState==='complete'?go():addEventListener('load',go,{once:true});setTimeout(end,4500);intro.addEventListener('click',end)}}
/* typed terminal prompts */
const typeEl=el=>{const txt=el.dataset.t;el.textContent='';el.classList.add('typing');let n=0;const step=()=>{el.textContent=txt.slice(0,++n);if(n<txt.length)setTimeout(step,24);else el.classList.remove('typing')};step()};
const tio=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){tio.unobserve(x.target);typeEl(x.target)}}),{threshold:.6});
$$('.vnw-prompt:not(.hero-prompt)').forEach(p=>{p.dataset.t=p.textContent;p.textContent='\u00a0';p.style.minHeight='1.4em';tio.observe(p)});
const fab=$('#botFab'),box=$('#botBox'),msgs=$('#botMsgs');
const tgl=o=>{box.classList.toggle('open',o);box.setAttribute('aria-hidden',!o);fab.setAttribute('aria-expanded',o);if(o)setTimeout(()=>$('#botIn').focus(),250)};
fab.addEventListener('click',()=>tgl(!box.classList.contains('open')));$('#botX').addEventListener('click',()=>tgl(false));
const KB=[[/skill|tech|stack|know|language/,'Vinayaka works with HTML/CSS, JavaScript, React, Tailwind (frontend); Python, Node.js, Express, REST APIs, PostgreSQL, MongoDB (backend); Offensive Security (Burp Suite, Nmap, Linux, Metasploit, Wireshark, OWASP ZAP); Machine Learning, LLMs and Generative AI; plus AWS, Docker, Git and Vercel.'],
[/project|built|work|portfolio/,'He has built 8 projects, including Raksha-Vyuh (AI phishing detection), IntelliCrop (smart agriculture), Smart Student Assistant, GramAI Hub, CineSense, OmniCast, MediVerify and Mattakshra. Source code is private; live demos are coming soon.'],
[/cert|course|oracle|jp|morgan|walmart|tryhackme|nptel/,'Certifications: Oracle OCI Generative AI Professional, J.P. Morgan Software Engineering Simulation, Walmart Advanced SWE Simulation, TryHackMe Cyber Security 101, NPTEL Internet Crimes & Cyber Security, HCL GUVI STaR scholarship, and a Nestlé e-learning course.'],
[/kavalu|founder|startup|security engine/,'Vinayaka is the founder of Kavalu Labs, which provides evidence-led security testing — website security, web application and API testing, vulnerability assessment and configuration review — and built the Kavalu Security Engine. See kavalu-labs.nayaka100.in.'],
[/intern|nantech|company|work/,'Vinayaka is currently an Intern at Nantech Solutions (since September 2026, ongoing).'],
[/hack|achiev|award|top|sih|leap|belagavi|winner/,'Hackathons: LEAP Hackathon 2026 — 2nd Runner-up (Hubballi Regional Hub, IIIT Dharwad); Smart India Hackathon 2024 — National Winner; Hack2Future 2.0 — Top 10; Make for Belagavi — Top 15. He also earned the HCL GUVI STaR scholarship.'],
[/educ|college|cgpa|degree|study|b\.?tech/,'B.Tech in Computer Science, 2023 – 2027, CGPA 8.6/10.'],
[/focus|learning|goal|future|now/,'Current focus: Cloud Computing, AI Agents, RAG and Microservices. Goal: grow as a Software Engineer building reliable, real-world solutions.'],
[/resume|cv/,"You can view and download Vinayaka's resume using the Resume button in the navigation or directly at vinayakanw_resume.pdf."],
[/contact|email|mail|hire|reach|linkedin|intern/,'Email: vinayakanw@gmail.com · LinkedIn: linkedin.com/in/vinayaka-n-walishettar. He is open to internships and opportunities.'],
[/hi|hello|hey|who/,'Hi! Vinayaka N Walishettar is a Full Stack Developer building secure, scalable and AI-powered applications.']];
const ask=q=>{const m=document.createElement('div');m.className='m me';m.textContent=q;msgs.appendChild(m);
 const r=(KB.find(k=>k[0].test(q.toLowerCase()))||[0,'I can answer about skills, projects, certificates, education or contact details. Try one of those!'])[1];
 setTimeout(()=>{const b=document.createElement('div');b.className='m bot';b.textContent=r;msgs.appendChild(b);msgs.scrollTop=msgs.scrollHeight},350);msgs.scrollTop=msgs.scrollHeight};
$('#botSugg').addEventListener('click',e=>{if(e.target.tagName==='BUTTON')ask(e.target.textContent)});
$('#botForm').addEventListener('submit',e=>{e.preventDefault();const i=$('#botIn');if(i.value.trim()){ask(i.value.trim());i.value=''}});

/* ---- theme switch (White <-> Neon Black & Green) ---- */
const root=document.documentElement;
const setTheme=t=>{root.dataset.theme=t;try{localStorage.setItem('vnw-theme',t)}catch(e){}const m=document.querySelector('meta[name=theme-color]');if(m)m.content=t==='neon'?'#050806':'#f6f8f6'};
const flip=e=>{e&&e.preventDefault();setTheme(root.dataset.theme==='neon'?'white':'neon')};
$('#themeBtn').addEventListener('click',flip);$('#themeBtnM').addEventListener('click',e=>{flip(e);closeMenu()});
/* ---- skills tabs ---- */
const st=$('#skillTabs'),sm=$('#skillsMatrix');
if(st)st.addEventListener('click',e=>{const b=e.target.closest('.vnw-filter');if(!b)return;$$('.vnw-filter',st).forEach(x=>x.classList.toggle('active',x===b));
 const d=b.dataset.d;sm.classList.toggle('filtered',d!=='all');$$('.skill-domain-group',sm).forEach(g=>g.classList.toggle('is-hidden',d!=='all'&&g.dataset.domain!==d))});

/* pause infinite animations when off-screen */
const po=new IntersectionObserver(es=>es.forEach(x=>x.target.classList.toggle('is-off',!x.isIntersecting)),{rootMargin:'100px'});
$$('.vnw-marquee,.hero-portrait-stage,.vnw-intern,.vnw-fullname').forEach(el=>po.observe(el));

/* scale the timeline trace to its container (desktop/tablet) */
const stage=$('.sai-trajectory-stage');
if(stage){const wrap=document.createElement('div');wrap.className='vnw-trace-wrap';stage.parentNode.insertBefore(wrap,stage);wrap.appendChild(stage);
 const fit=()=>{if(innerWidth<=860){stage.style.transform='';wrap.style.height='';return}
  const sc=Math.min(1,wrap.parentNode.clientWidth/1200);stage.style.transform='scale('+sc+')';wrap.style.height=(stage.offsetHeight+90)*sc+'px'};
 fit();addEventListener('resize',raf(fit));}

/* skills accordion */
const groups=$$('.skill-domain-group',sm);
const open=g=>{groups.forEach(x=>{const on=x===g;x.classList.toggle('active',on);x.setAttribute('aria-expanded',on)});sm.dataset.a=groups.indexOf(g)};let hT;
groups.forEach((g,i)=>{g.tabIndex=0;g.setAttribute('role','button');g.addEventListener('click',()=>open(g));
 g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(g)}});
 g.addEventListener('mouseenter',()=>{if(matchMedia('(hover:hover) and (min-width:861px)').matches){clearTimeout(hT);hT=setTimeout(()=>open(g),90)}});g.addEventListener('mouseleave',()=>clearTimeout(hT))});
if(groups[0])open(groups[0]);



/* count-up stats */
const cio=new IntersectionObserver(es=>es.forEach(x=>{if(!x.isIntersecting)return;cio.unobserve(x.target);const el=x.target,to=+el.dataset.to,dec=+(el.dataset.dec||0),t0=performance.now(),D=1200;
 const f=t=>{const p=Math.min(1,(t-t0)/D),e=1-Math.pow(1-p,3);el.textContent=(to*e).toFixed(dec);if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)}),{threshold:.6});
$$('.cnt').forEach(e=>{e.textContent=(0).toFixed(+e.dataset.dec||0);cio.observe(e)});
/* hackathon cards: hover/tap details, zoom certificate */
const openLb=(src,t,c)=>{li.src=src;$('#lightboxTitle').textContent=t||'Certificate';$('#lightboxCaption').textContent=c||'';lb.classList.add('active');document.body.style.overflow='hidden'};
$$('.vnw-hk').forEach(card=>{const im=$('.vnw-hk-cert img',card),vb=$('.vnw-hk-v',card);
 const arm=()=>{card.classList.add('has-img');vb.hidden=false;vb.addEventListener('click',e=>{e.stopPropagation();openLb(im.currentSrc||im.src,card.dataset.t,card.dataset.c)})};
 im.addEventListener('error',()=>im.remove());if(im.complete&&im.naturalWidth)arm();else im.addEventListener('load',arm);
 card.addEventListener('click',()=>{if(matchMedia('(hover:none)').matches){$$('.vnw-hk.open').forEach(x=>x!==card&&x.classList.remove('open'));card.classList.toggle('open')}});
 card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();card.classList.toggle('open')}})});
})();