const WA_NUMBER = "919972819131";
const SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycbzjP6oZIUV9sHXvg7vCh9kAdTzEVQlRJGfA-uN5hFI-l2TzQUekXq8R5fRV8F0Gmto5iQ/exec";
function toggleNav(){const n=document.getElementById("mainNav");const o=document.getElementById("navOverlay");const open=n&&!n.classList.contains("open");if(n)n.classList.toggle("open",open);if(o)o.classList.toggle("show",!!open);document.body.classList.toggle("nav-open",!!open)}
function closeNav(){const n=document.getElementById("mainNav");const o=document.getElementById("navOverlay");if(n)n.classList.remove("open");if(o)o.classList.remove("show");document.body.classList.remove("nav-open")}
function waLink(msg){return "https://wa.me/"+WA_NUMBER+"?text="+encodeURIComponent(msg)}
function saveToSheet(payload){
if(!SHEET_ENDPOINT)return Promise.resolve();
try{return fetch(SHEET_ENDPOINT,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain"},body:JSON.stringify(payload)}).catch(()=>{})}catch(err){return Promise.resolve()}
}
function bindQuoteForms(){
document.querySelectorAll("[data-wa-form]").forEach(f=>{
f.addEventListener("submit",e=>{
e.preventDefault();
const d=new FormData(f);
const name=(d.get("name")||"").toString();
const company=(d.get("company")||"").toString();
const service=(d.get("service")||"").toString();
const phone=(d.get("phone")||"").toString();
const message=(d.get("message")||"").toString();
const duration=(d.get("duration")||"").toString();
const btn=f.querySelector('button[type="submit"]');
if(btn){btn.disabled=true;const old=btn.textContent;btn.textContent="Sending...";setTimeout(()=>{btn.disabled=false;btn.textContent=old},2500)}
saveToSheet({timestamp:new Date().toISOString(),name:name,company:company,service:service,phone:phone,message:message,duration:duration,page:location.href});
window.open(waLink("New Enquiry - Appaji Staffing\n\nName: "+name+"\nCompany: "+company+"\nService: "+service+"\nPhone: "+phone+(duration?"\nWork Duration: "+duration:"")+"\nMessage: "+message),"_blank");
});
});
}
function bindServiceButtons(){
document.querySelectorAll("[data-service-enquire]").forEach(b=>{
b.addEventListener("click",()=>{
const s=b.getAttribute("data-service-enquire")||"General";
window.open(waLink("Hello Appaji Staffing, I need a quote for: "+s),"_blank");
});
});
}
function ensureOverlay(){
if(!document.getElementById("navOverlay")){
const d=document.createElement("div");
d.id="navOverlay";d.className="nav-overlay";
d.addEventListener("click",closeNav);
document.body.appendChild(d);
}
}
function ensureMobileBar(){
if(document.querySelector(".mobile-bar"))return;
const b=document.createElement("div");
b.className="mobile-bar";
b.innerHTML='<a class="mb-call" href="tel:+919972819131">Call</a><a class="mb-wa" href="https://wa.me/919972819131?text=Hello%20Appaji%20Staffing%2C%20I%20need%20a%20quote">WhatsApp</a><a class="mb-quote" href="contact.html">Quote</a>';
if(window.location.pathname.indexOf("/services/")>-1){
const q=b.querySelector(".mb-quote");if(q){q.setAttribute("href","../contact.html")}
}
document.body.appendChild(b);
}
function bindNav(){
const n=document.getElementById("mainNav");
if(n){n.querySelectorAll("a").forEach(a=>a.addEventListener("click",closeNav))}
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeNav()});
window.addEventListener("resize",()=>{if(window.innerWidth>=900)closeNav()});
}
function headerShadow(){
const h=document.querySelector(".header");
if(!h)return;
const on=()=>h.classList.toggle("scrolled",window.scrollY>8);
on();window.addEventListener("scroll",on,{passive:true});
}
function reveal(){
const els=document.querySelectorAll(".card,.check,.vm div,.quote,.hero-card");
els.forEach(el=>el.classList.add("reveal"));
if(!("IntersectionObserver" in window)){els.forEach(el=>el.classList.add("visible"));return}
const io=new IntersectionObserver(es=>{es.forEach(x=>{if(x.isIntersecting){x.target.classList.add("visible");io.unobserve(x.target)}})},{threshold:.08});
els.forEach(el=>io.observe(el));
}
function wrapTables(){document.querySelectorAll("table.table").forEach(t=>{if(!t.parentElement.classList.contains("table-wrap")){const w=document.createElement("div");w.className="table-wrap";t.parentNode.insertBefore(w,t);w.appendChild(t)}})}

/* FAQ Accordion Interaction */
function initFaqAccordion(){
  document.querySelectorAll(".faq-item").forEach(item => {
    const q = item.querySelector(".faq-question");
    if(!q) return;
    q.addEventListener("click", () => {
      const wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach(other => {
        if(other !== item) other.classList.remove("open");
      });
      item.classList.toggle("open", !wasOpen);
    });
  });
}

/* Gallery Category Filter */
function initGalleryFilters(){
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".gallery-card");
  if(!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const cat = btn.getAttribute("data-filter");

      cards.forEach(card => {
        const cardCat = card.getAttribute("data-category");
        if(cat === "all" || cardCat === cat){
          card.style.display = "flex";
          setTimeout(() => { card.style.opacity = "1"; card.style.transform = "none"; }, 20);
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.96)";
          setTimeout(() => { card.style.display = "none"; }, 200);
        }
      });
    });
  });
}

document.addEventListener("DOMContentLoaded",()=>{
  ensureOverlay();
  ensureMobileBar();
  bindNav();
  bindQuoteForms();
  bindServiceButtons();
  headerShadow();
  wrapTables();
  reveal();
  initFaqAccordion();
  initGalleryFilters();
  const y=document.getElementById("year");
  if(y)y.textContent=new Date().getFullYear();
});
