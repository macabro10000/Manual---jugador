(() => {
  "use strict";
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const KEYS = {saved:"universo_saved_v1", tastes:"universo_tastes_v1", signals:"universo_signals_v1"};
  const CATEGORIES = ["principal","descubrimientos","guardados"];
  const NAMES = {principal:"Principal",descubrimientos:"Noticias y descubrimientos",guardados:"Guardados"};
  const TOPICS = {
    ciencia:["ciencia","espacio","científico","naturaleza","descubrimiento","astronomía"],
    humor:["humor","gracioso","risa","comedia","divertido"],
    animales:["animal","animales","perro","gato","fauna"],
    tecnologia:["tecnología","tecnologia","robot","inteligencia artificial","digital"],
    mundo:["mundo","país","países","actualidad","historia","noticia"],
    deportes:["deporte","deportes","fútbol","baloncesto","atleta"],
    musica:["música","musica","canción","cantante","concierto"],
    curiosidades:["curiosidad","curiosidades","sorprendente","pregunta"]
  };
  let items=[], category="principal", search="", saved=readArray(KEYS.saved), tastes=readArray(KEYS.tastes), signals=readObject(KEYS.signals), drawerOpen=false;
  function readArray(k){try{const v=JSON.parse(localStorage.getItem(k)||"[]");return Array.isArray(v)?v:[]}catch{return []}}
  function readObject(k){try{const v=JSON.parse(localStorage.getItem(k)||"{}");return v&&typeof v==="object"&&!Array.isArray(v)?v:{}}catch{return {}}}
  function persist(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
  function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
  function norm(v){return String(v||"").toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g,"")}
  function searchable(item){return norm([item.title,item.description,item.category,item.sourceLabel,item.contentType,...(item.tags||[])].join(" "))}
  function score(item){let n=0;const text=searchable(item);tastes.forEach(t=>{if((TOPICS[t]||[t]).some(word=>text.includes(norm(word))))n+=4});const s=signals[item.id]||{};return n+(s.like?8:0)+(s.open||0)*1.5+(s.save||0)*3-(s.skip||0)*7+(saved.includes(item.id)?3:0)}
  function safeUrl(value){try{const u=new URL(value);return u.protocol==="https:"?u.href:""}catch{return ""}}
  function matches(item){if(category==="guardados")return saved.includes(item.id);if(category==="principal")return true;return ["noticias","ciencia","tecnologia","mundo","curiosidades","animales","deportes","musica","humor"].includes(norm(item.category))||norm(item.category)==="descubrimientos"}
  function render(){
    updateCategory();
    let list=items.filter(x=>matches(x)&&searchable(x).includes(norm(search))).sort((a,b)=>score(b)-score(a));
    $("#savedCount").textContent=String(saved.length);
    $$(".menu-chip").forEach(btn=>btn.classList.toggle("active",btn.dataset.category===category));
    $("#feedStatus").textContent=list.length?"DESCUBRIMIENTOS":"CATÁLOGO EN PREPARACIÓN";
    if(!list.length){
      $("#storyFeed").innerHTML='<section class="empty-state discover-empty"><span class="empty-symbol">✦</span><h2>'+esc(category==="guardados"?"Tus historias guardadas aparecerán aquí":search?"No encontramos resultados":"Estamos preparando tu portada")+'</h2><p>'+esc(search?"Prueba otra palabra.":"UNIVERSO tendrá noticias importantes, ciencia, tecnología, naturaleza y curiosidades en tarjetas dentro de esta pantalla. Estamos incorporando fuentes verificables; no mostraremos titulares inventados.")+'</p>'+(category!=="principal"?'<button type="button" id="goHome">Ir a Principal</button>':'<span class="empty-note">PRINCIPAL · NOTICIAS · CIENCIA · CURIOSIDADES</span>')+'</section>';
      $("#goHome")?.addEventListener("click",()=>setCategory("principal"));
      return;
    }
    $("#storyFeed").innerHTML=list.map((item,i)=>{
      const sig=signals[item.id]||{};
      const image=item.image?'<img class="story-image" src="'+esc(item.image)+'" alt="" loading="lazy" onerror="this.hidden=true">':'';
      const url=safeUrl(item.canonicalUrl);
      const source=esc(item.sourceLabel||"Fuente verificada");
      const date=item.publishedAt?'<time>'+esc(item.publishedAt)+'</time>':"";
      const link=url?'<a class="story-action primary" href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">Leer fuente ↗</a>':"";
      return '<article class="story-card discover-card" data-story="'+esc(item.id)+'">'+image+'<div class="story-fallback" '+(image?'hidden':'')+'>'+esc(item.symbol||"✦")+'</div><div class="story-content"><div class="story-source"><span class="source-dot"></span>'+source+' '+date+'</div><h2>'+esc(item.title)+'</h2><p>'+esc(item.description)+'</p><div class="story-tags"><span>'+esc(item.category||"descubrimiento")+'</span><span>'+esc(item.contentType||"LECTURA")+'</span></div><div class="story-actions"><button class="story-action '+(sig.like?"liked":"")+'" data-like="'+esc(item.id)+'">'+(sig.like?"♥ Me interesa":"♡ Me interesa")+'</button><button class="story-action '+(saved.includes(item.id)?"saved":"")+'" data-save="'+esc(item.id)+'">'+(saved.includes(item.id)?"♥ Guardado":"＋ Guardar")+'</button>'+link+'</div></div></article>';
    }).join("");
    $$("[data-like]").forEach(btn=>btn.addEventListener("click",()=>{const id=btn.dataset.like;const sig=signals[id]||{};sig.like=sig.like?0:1;signals[id]=sig;persist(KEYS.signals,signals);render()}));
    $$("[data-save]").forEach(btn=>btn.addEventListener("click",()=>{const id=btn.dataset.save;saved=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id];persist(KEYS.saved,saved);render()}));
  }
  function updateCategory(){const label=$("#topCategoryName");if(label)label.textContent=NAMES[category]||NAMES.principal;document.title="UNIVERSO — "+(NAMES[category]||NAMES.principal);$$(".menu-chip").forEach(b=>b.setAttribute("aria-current",b.dataset.category===category?"page":"false"))}
  function setCategory(next){if(!CATEGORIES.includes(next))return;category=next;render();$("#storyFeed").scrollTo({top:0,behavior:"smooth"})}
  function openDrawer(){drawerOpen=true;$("#drawerBody").hidden=false;$("#drawerToggle").setAttribute("aria-expanded","true");$("#handleLabel").textContent="CERRAR MENÚ";$("#bottomDrawer").classList.add("expanded")}
  function closeDrawer(){drawerOpen=false;$("#drawerBody").hidden=true;$("#drawerToggle").setAttribute("aria-expanded","false");$("#handleLabel").textContent="MENÚ · TOCA PARA EXPLORAR";$("#bottomDrawer").classList.remove("expanded")}
  $("#drawerToggle").addEventListener("click",()=>drawerOpen?closeDrawer():openDrawer());
  $("#drawerClose").addEventListener("click",closeDrawer);
  $$(".menu-chip").forEach(btn=>btn.addEventListener("click",()=>{setCategory(btn.dataset.category);closeDrawer()}));
  $("#searchToggle").addEventListener("click",()=>{const p=$("#searchPanel");p.hidden=!p.hidden;if(!p.hidden)$("#searchInput").focus()});
  $("#searchClose").addEventListener("click",()=>{search="";$("#searchInput").value="";$("#searchPanel").hidden=true;render()});
  $("#searchInput").addEventListener("input",e=>{search=e.target.value.trim();render()});
  $$("#drawerBody input[type=checkbox]").forEach(input=>{input.checked=tastes.includes(input.value);input.addEventListener("change",()=>{tastes=$$("#drawerBody input[type=checkbox]:checked").map(x=>x.value);persist(KEYS.tastes,tastes);render()})});
  $("#storyFeed").addEventListener("click",e=>{const card=e.target.closest("[data-story]");if(card&& !e.target.closest("button,a")){const sig=signals[card.dataset.story]||{};sig.open=(sig.open||0)+1;signals[card.dataset.story]=sig;persist(KEYS.signals,signals)}});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(drawerOpen)closeDrawer();else $("#searchPanel").hidden=true}});
  async function loadContent(){try{const r=await fetch("./content.json",{cache:"no-store"});if(!r.ok)throw Error("HTTP "+r.status);const data=await r.json();if(!data||!Array.isArray(data.items))throw Error("Formato de catálogo inválido");const seen=new Set();items=data.items.filter(x=>x&&typeof x.id==="string"&&typeof x.title==="string"&&x.contentStatus!=="demo"&&!seen.has(x.id)&&seen.add(x.id));render()}catch(error){$("#storyFeed").innerHTML='<section class="empty-state"><span class="empty-symbol">!</span><h2>No pudimos cargar las noticias</h2><p>Comprueba la conexión e inténtalo de nuevo.</p><button type="button" id="retryLoad">Reintentar</button></section>';$("#retryLoad").addEventListener("click",loadContent);console.error("UNIVERSO catalog error",error)}}
  loadContent();
})();