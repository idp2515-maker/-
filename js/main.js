const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=t=>String(t).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const money=n=>n.toLocaleString("uk-UA")+" ₴";
// Шапка й підвал
const pages=[["index.html","Головна"],["portfolio.html","Портфоліо"],["services.html","Послуги"],["contacts.html","Контакти"]];
const cur=location.pathname.split("/").pop()||"index.html";
$("#hdr").innerHTML=`<div class="wrap"><a class="logo" href="index.html">між світлом</a>
<button class="burger" aria-label="Меню" aria-expanded="false">☰</button>
<nav>${pages.map(([h,t])=>`<a href="${h}" class="${h===cur?"on":""}">${t}</a>`).join("")}</nav>
<a class="link" href="contacts.html">Записатися на зйомку</a></div>`;
$("#ftr").innerHTML=`<div class="wrap"><div class="cols"><div><div class="logo">між світлом</div><small>Фотографії, у яких ви впізнаєте себе.</small></div>
<div><small>Заходьте на світло</small><p>Київ, Поділ<br>вул. Костянтинівська, 21<br>Щодня, 10:00–20:00 · за записом</p></div>
<div><small>Будьмо на зв’язку</small><p>hello@mizhsvitlom.studio<br>+380 67 210 18 08<br><a href="#">Instagram</a> · <a href="#">Telegram</a></p></div></div>
<div class="bot"><span>© 2026 Між світлом</span><span>Створено з увагою до справжнього</span></div></div>`;
const bg=$(".burger"),nav=$("nav");
bg.onclick=()=>{const o=nav.classList.toggle("open");bg.setAttribute("aria-expanded",o)};

// Модальне вікно (універсальне)
function modal(html,cls=""){const m=document.createElement("div");m.className="modal open";m.innerHTML=html;
 const close=()=>{m.remove();document.removeEventListener("keydown",key)};
 const key=e=>{if(e.key==="Escape")close();m.onkey&&m.onkey(e)};
 document.addEventListener("keydown",key);m.onclick=e=>{if(e.target===m||e.target.classList.contains("x"))close()};
 document.body.append(m);return m}

// Галерея + лайтбокс + фільтри
const gal=$("#gallery");
if(gal){const cats=["Усі роботи",...new Set(DB.works.map(w=>w.cat))];let list=DB.works;
 $("#tabs").innerHTML=cats.map((c,i)=>`<button class="${i?"":"on"}">${c}</button>`).join("");
 const draw=()=>{gal.innerHTML=list.map((w,i)=>`<button class="card" data-i="${i}"><img src="${w.img}" alt="${esc(w.title)}" loading="lazy"><h3>${esc(w.title)}</h3><small>${esc(w.meta)}</small></button>`).join("")};
 draw();
 $("#tabs").onclick=e=>{if(e.target.tagName!=="BUTTON")return;$$("#tabs button").forEach(b=>b.classList.remove("on"));e.target.classList.add("on");
  const c=e.target.textContent;list=c==="Усі роботи"?DB.works:DB.works.filter(w=>w.cat===c);draw()};
 gal.onclick=e=>{const c=e.target.closest(".card");if(!c)return;let i=+c.dataset.i;
  const m=modal(`<button class="x" aria-label="Закрити">×</button><button class="nv p" aria-label="Назад">‹</button><figure><img><figcaption></figcaption></figure><button class="nv n" aria-label="Далі">›</button>`);
  const show=()=>{const w=list[i];$("img",m).src=w.img;$("img",m).alt=w.title;$("figcaption",m).textContent=`${w.title} — ${w.meta} (${i+1}/${list.length})`};
  const go=d=>{i=(i+d+list.length)%list.length;show()};
  $(".p",m).onclick=()=>go(-1);$(".n",m).onclick=()=>go(1);
  m.onkey=e=>{if(e.key==="ArrowLeft")go(-1);if(e.key==="ArrowRight")go(1)};show()}}

// Послуги з бази + модальна форма
const sv=$("#services");
if(sv){sv.innerHTML=DB.services.map((s,i)=>`<div class="svc"><span class="muted">${i+1}</span><div><h3>${esc(s.name)}</h3><p class="muted">${esc(s.desc)}</p><small class="muted">${esc(s.info)}</small></div><div class="p">від ${money(s.price)}<br><button data-id="${s.id}">Забронювати</button></div></div>`).join("");
 sv.onclick=e=>{const id=e.target.dataset.id;if(!id)return;const s=DB.services.find(x=>x.id==id);
  const m=modal(`<div class="box"><button class="x" aria-label="Закрити">×</button><h3>${esc(s.name)}</h3><p class="muted" style="margin:6px 0 20px">від ${money(s.price)}</p>${formHtml(s.name)}</div>`);
  bindForm($("form",m),()=>setTimeout(()=>m.remove(),1800))}}

// Форма заявки
function formHtml(sel){return `<form novalidate><div class="ok" hidden></div>
<div class="row"><div><label>Ваше ім’я<input name="name" placeholder="Як до вас звертатися?"></label><div class="err"></div></div>
<div><label>Телефон або Telegram<input name="contact" placeholder="+380 або @username"></label><div class="err"></div></div></div>
<div><label>Яку історію хочете зберегти?<select name="service"><option value="">Оберіть формат зйомки</option>${DB.services.map(s=>`<option ${s.name===sel?"selected":""}>${esc(s.name)}</option>`).join("")}</select></label><div class="err"></div></div>
<div><label>Побажання (необов’язково)<textarea name="note" rows="2"></textarea></label></div>
<button class="btn" type="submit">Хочу на зйомку</button></form>`}
function bindForm(f,done){f.onsubmit=e=>{e.preventDefault();const d=Object.fromEntries(new FormData(f));let bad=false;
 const rules={name:v=>v.trim().length>=2||"Введіть ім’я",contact:v=>/^(\+?\d[\d\s()-]{8,}|@[\w.]{3,})$/.test(v.trim())||"Вкажіть телефон (+380…) або @username",service:v=>!!v||"Оберіть формат зйомки"};
 for(const k in rules){const r=rules[k](d[k]),el=f.elements[k].closest("div").querySelector(".err");el.textContent=r===true?"":r;if(r!==true)bad=true}
 if(bad)return;DB.bookings.add(d);f.reset();const ok=$(".ok",f);ok.hidden=false;ok.textContent=`Дякуємо, ${d.name}! Ми зв’яжемося протягом дня.`;
 done&&done();renderBookings()}}
const ff=$("#bookform");if(ff){ff.innerHTML=formHtml(new URLSearchParams(location.search).get("s")||"");bindForm($("form",ff))}

// Список заявок (з localStorage)
function renderBookings(){const l=$("#bookings");if(!l)return;const a=DB.bookings.all();
 l.innerHTML=a.length?a.map(b=>`<li><span><b>${esc(b.name)}</b> · ${esc(b.service)}<br><small class="muted">${esc(b.contact)} · ${esc(b.date)}</small></span><button data-id="${b.id}">Видалити</button></li>`).join(""):`<li class="muted">Заявок поки немає. Надішліть першу через форму вище.</li>`}
const bl=$("#bookings");if(bl){bl.onclick=e=>{if(e.target.dataset.id){DB.bookings.remove(+e.target.dataset.id);renderBookings()}};renderBookings()}

// Відгуки (слайдер)
const q=$("#quote");
if(q){let i=0;const draw=()=>{const r=DB.reviews[i];q.innerHTML=`<img src="${r.img}" alt="${esc(r.name)}"><div><blockquote>«${esc(r.text)}»</blockquote><p style="margin-top:18px"><b>${esc(r.name)}</b><br><small class="muted">${esc(r.type)}</small></p>
<div class="qnav"><button aria-label="Попередній">←</button><span>0${i+1} / 0${DB.reviews.length}</span><button aria-label="Наступний">→</button></div></div>`;
 const b=$$(".qnav button",q);b[0].onclick=()=>{i=(i+DB.reviews.length-1)%DB.reviews.length;draw()};b[1].onclick=()=>{i=(i+1)%DB.reviews.length;draw()}};draw()}

// FAQ
const fq=$("#faq");if(fq)fq.innerHTML=DB.faq.map(([a,b],i)=>`<details ${i?"":"open"}><summary>${a}</summary><p>${b}</p></details>`).join("");
$$("#faq details").forEach(d=>d.ontoggle=()=>{if(d.open)$$("#faq details").forEach(o=>o!==d&&(o.open=false))});
