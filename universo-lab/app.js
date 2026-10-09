(() => {
  "use strict";
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const KEYS = {saved:"universo_saved_v2", tastes:"universo_tastes_v2", signals:"universo_signals_v2"};
  const CATEGORIES = ["principal","descubrimientos","estados","guardados"];
  const SWIPE_ORDER = ["descubrimientos","principal","estados"];
  const NAMES = {principal:"Principal · Videos",descubrimientos:"Noticias",estados:"Estados",guardados:"Guardados"};
  const TOPICS = {
    economia:["economía","economia","mercado","dinero","empresa","finanzas"],
    entretenimiento:["entretenimiento","cine","actor","actriz","música","musica","famoso","serie"],
    ciencia:["ciencia","espacio","científico","naturaleza","descubrimiento","astronomía"],
    tecnologia:["tecnología","tecnologia","robot","inteligencia artificial","digital"],
    mundo:["mundo","país","países","actualidad","historia","noticia"],
    virales:["viral","virales","tendencia","popular"]
  };
  let items=[], localVideos=[], category="principal", newsFilter="todos", search="", saved=readArray(KEYS.saved), tastes=readArray(KEYS.tastes), signals=readObject(KEYS.signals), drawerOpen=false;
  function readArray(k){try{const v=JSON.parse(localStorage.getItem(k)||"[]");return Array.isArray(v)?v:[]}catch{return []}}
  function readObject(k){try{const v=JSON.parse(localStorage.getItem(k)||"{}");return v&&typeof v==="object"&&!Array.isArray(v)?v:{}}catch{return {}}}
  function persist(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
  function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
  function norm(v){return String(v||"").toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g,"")}
  function searchable(item){return norm([item.title,item.description,item.category,item.sourceLabel,item.contentType,...(item.tags||[])].join(" "))}
  function score(item){let n=0;const text=searchable(item);tastes.forEach(t=>{if((TOPICS[t]||[t]).some(word=>text.includes(norm(word))))n+=4});const s=signals[item.id]||{};return n+(s.like?8:0)+(s.open||0)*1.5+(s.save||0)*3-(s.skip||0)*7+(saved.includes(item.id)?3:0)}
  function safeUrl(value){try{const u=new URL(value);return u.protocol==="https:"?u.href:""}catch{return ""}}
  function isNews(item){return ["noticias","economia","entretenimiento","ciencia","tecnologia","tecnología","mundo","curiosidades","animales","deportes","musica","música","humor","descubrimientos","virales"].includes(norm(item.category))}
  const NEWS_FILTERS=[["todos","Todos"],["economia","Economía"],["entretenimiento","Entretenimiento"],["ciencia","Ciencia"],["tecnologia","Tecnología"],["mundo","Mundo"],["virales","Virales"]];
  function itemMatchesFilter(item){
    if(newsFilter==="todos")return true;
    const text=searchable(item), cat=norm(item.category);
    if(newsFilter==="virales")return cat==="virales"||cat==="viral"||(item.tags||[]).some(t=>["viral","virales","tendencia"].includes(norm(t)));
    return cat===newsFilter||(TOPICS[newsFilter]||[]).some(word=>text.includes(norm(word)));
  }
  function filterBar(){
    return '<nav class="news-filter-rail" aria-label="Filtrar noticias">'+NEWS_FILTERS.map(([id,label])=>'<button type="button" class="news-filter '+(newsFilter===id?'active':'')+'" data-news-filter="'+id+'" aria-pressed="'+(newsFilter===id?'true':'false')+'">'+label+'</button>').join("")+'</nav>';
  }
  function newsTimestamp(item){const value=item.addedAt||item.publishedAt;const time=Date.parse(value||"");return Number.isFinite(time)?time:0}
  function isFreshNews(item,now=Date.now()){const added=newsTimestamp(item);return added>0&&now-added<24*60*60*1000}
  function filteredItems(){
    const now=Date.now();
    let list=items.filter(x=>category==="guardados"?saved.includes(x.id):isNews(x)&&category==="descubrimientos"&&isFreshNews(x,now)&&itemMatchesFilter(x));
    list=list.filter(x=>searchable(x).includes(norm(search)));
    return list.sort((a,b)=>newsTimestamp(b)-newsTimestamp(a)||score(b)-score(a));
  }
  function render(){
    updateCategory();
    $("#savedCount").textContent=String(saved.length);
    $$(".menu-chip").forEach(btn=>btn.classList.toggle("active",btn.dataset.category===category));
    const feed=$("#storyFeed");
    feed.className="story-feed "+(category==="principal"?"video-mode":category==="estados"?"states-mode":category==="descubrimientos"?"news-mode":"saved-mode");
    if(category==="principal"){renderVideos();return}
    if(category==="estados"){renderStates();return}
    const list=filteredItems();
    $("#feedStatus").textContent=list.length?"ACTUALIDAD":"FUENTES POR CONECTAR";
    if(!list.length){
      const title=search?"No encontramos resultados":category==="guardados"?"Tus guardados aparecerán aquí":"Noticias en preparación";
      const desc=search?"Prueba otra palabra.":category==="guardados"?"Guarda noticias para encontrarlas rápidamente.":"Aquí aparecerán noticias actuales de economía, entretenimiento, ciencia, tecnología, mundo y tendencias. Cada tarjeta tendrá resumen breve, fecha y enlace a la fuente. Aún falta conectar fuentes reales.";
      feed.innerHTML=(category==="descubrimientos"?filterBar():"")+'<section class="empty-state discover-empty"><span class="empty-symbol">▤</span><h2>'+esc(title)+'</h2><p>'+esc(desc)+'</p>'+(category!=="descubrimientos"?'<button type="button" id="goNews">Ver noticias</button>':'<span class="empty-note">SIN NOTICIAS INVENTADAS · FUENTES VERIFICABLES</span>')+'</section>';
      $("#goNews")?.addEventListener("click",()=>setCategory("descubrimientos"));
      return;
    }
    feed.innerHTML=list.map(item=>{
      const sig=signals[item.id]||{};
      const image=item.image?'<img class="story-image" src="'+esc(item.image)+'" alt="" loading="lazy" onerror="this.hidden=true">':'';
      const url=safeUrl(item.canonicalUrl);
      const source=esc(item.sourceLabel||"Fuente");
      const date=item.publishedAt?'<time>'+esc(item.publishedAt)+'</time>':"";
      const link=url?'<a class="story-action primary" href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">Ver noticia original ↗</a>':"";
      return '<article class="story-card discover-card" data-story="'+esc(item.id)+'">'+image+'<div class="story-fallback" '+(image?'hidden':'')+'>▤</div><div class="story-content"><div class="story-source"><span class="source-dot"></span>'+source+' '+date+'</div><h2>'+esc(item.title)+'</h2><p>'+esc(item.description)+'</p><div class="story-tags"><span>'+esc(item.category||"noticias")+'</span><span>RESUMEN VERIFICADO</span></div><div class="story-actions"><button type="button" class="story-action" data-speak="'+esc(item.id)+'">▶ Escuchar</button><button class="story-action '+(sig.like?"liked":"")+'" data-like="'+esc(item.id)+'">'+(sig.like?"♥ Me interesa":"♡ Me interesa")+'</button><button class="story-action '+(saved.includes(item.id)?"saved":"")+'" data-save="'+esc(item.id)+'">'+(saved.includes(item.id)?"♥ Guardado":"＋ Guardar")+'</button>'+link+'</div></div></article>';
    }).join("");
    $("[data-speak]").forEach(btn=>btn.addEventListener("click",()=>{
      const item=items.find(x=>x.id===btn.dataset.speak);
      if(!item)return;
      if(!("speechSynthesis" in window)||!("SpeechSynthesisUtterance" in window)){toast("Este navegador no permite lectura en voz alta");return}
      if(window.speechSynthesis.speaking){window.speechSynthesis.cancel();if(btn.dataset.speaking==="true"){btn.dataset.speaking="false";btn.textContent="▶ Escuchar";return}}
      $("[data-speak]").forEach(b=>{b.dataset.speaking="false";b.textContent="▶ Escuchar"});
      const utterance=new SpeechSynthesisUtterance(item.title+". "+item.description);
      utterance.lang="es-CO";utterance.rate=0.96;
      btn.dataset.speaking="true";btn.textContent="Ⅱ Detener";
      utterance.onend=utterance.onerror=()=>{btn.dataset.speaking="false";btn.textContent="▶ Escuchar"};
      window.speechSynthesis.speak(utterance);
    }));
    $("[data-news-filter]").forEach(btn=>btn.addEventListener("click",()=>{newsFilter=btn.dataset.newsFilter;render();$("#storyFeed").scrollTo({top:0,behavior:"smooth"})}));
    $("[data-like]").forEach(btn=>btn.addEventListener("click",()=>{const id=btn.dataset.like;const sig=signals[id]||{};sig.like=sig.like?0:1;signals[id]=sig;persist(KEYS.signals,signals);render()}));
    $$("[data-save]").forEach(btn=>btn.addEventListener("click",()=>{const id=btn.dataset.save;saved=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id];persist(KEYS.saved,saved);render()}));
  }
  function renderVideos(){
    $("#feedStatus").textContent=localVideos.length?"PRUEBA LOCAL":"VIDEOS PROPIOS";
    if(!localVideos.length){
      $("#storyFeed").innerHTML='<section class="empty-state video-empty"><span class="empty-symbol">▶</span><h2>Nuestros videos</h2><p>Esta es la pantalla principal de UNIVERSO. Para probar la reproducción, elige dos o tres videos que ya tengas en tu teléfono. Se reproducirán aquí solo como prueba local; todavía no estarán publicados para otras personas.</p><label class="pick-videos" for="localVideoPicker">Elegir videos del teléfono</label><input id="localVideoPicker" class="file-picker" type="file" accept="video/*" multiple><small class="empty-note">PRUEBA LOCAL · NO SE SUBE NADA A INTERNET</small></section>';
      $("#localVideoPicker")?.addEventListener("change",handleLocalVideos);
      return;
    }
    $("#storyFeed").innerHTML=localVideos.map((v,i)=>'<article class="local-video-card" data-local-video="'+i+'"><video src="'+v.url+'" controls playsinline muted loop preload="metadata"></video><div class="local-video-caption"><strong>'+esc(v.name)+'</strong><span>Video de prueba '+(i+1)+' de '+localVideos.length+'</span></div></article>').join("")+'<div class="add-video-row"><label class="pick-videos" for="localVideoPicker">Añadir o cambiar videos</label><input id="localVideoPicker" class="file-picker" type="file" accept="video/*" multiple><small>Solo se prueban en este teléfono; no son publicaciones públicas.</small></div>';
    $("#localVideoPicker")?.addEventListener("change",handleLocalVideos);
  }
  function handleLocalVideos(event){
    const files=[...(event.target.files||[])].filter(f=>f.type.startsWith("video/")).slice(0,3);
    localVideos.forEach(v=>URL.revokeObjectURL(v.url));
    localVideos=files.map(file=>({name:file.name,url:URL.createObjectURL(file)}));
    render();
    if(!files.length)toast("No se seleccionaron archivos de video");
    else toast("Listos "+files.length+" videos para probar en este teléfono");
  }
  function renderStates(){
    $("#feedStatus").textContent="ESTADOS";
    $("#storyFeed").innerHTML='<section class="empty-state states-empty"><span class="empty-symbol">◉</span><h2>Estados de la comunidad</h2><p>Aquí podrás ver estados de otras personas y publicar los tuyos. Primero estamos preparando la pantalla; para compartir estados entre usuarios hará falta crear cuentas y conectar almacenamiento.</p><button type="button" id="statePlan">Entendido</button><small class="empty-note">ESTADOS · PUBLICACIONES VERTICALES</small></section>';
    $("#statePlan")?.addEventListener("click",()=>toast("La pantalla de estados queda preparada para la siguiente etapa"));
  }
  function toast(message){const t=$("#toast");t.textContent=message;t.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove("show"),2300)}
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
  $("#storyFeed").addEventListener("click",e=>{const card=e.target.closest("[data-story]");if(card&&!e.target.closest("button,a")){const sig=signals[card.dataset.story]||{};sig.open=(sig.open||0)+1;signals[card.dataset.story]=sig;persist(KEYS.signals,signals)}});
  // Evita cambiar de pantalla con movimientos diagonales o desplazamientos pequeños.
  let touchStart=null;
  $("#storyFeed").addEventListener("touchstart",e=>{
    if(e.touches.length!==1){touchStart=null;return}
    if(e.target.closest("button,a,input,video,.news-filter-rail")){touchStart=null;return}
    touchStart={x:e.touches[0].clientX,y:e.touches[0].clientY};
  },{passive:true});
  $("#storyFeed").addEventListener("touchend",e=>{
    if(!touchStart||!e.changedTouches.length)return;
    const dx=e.changedTouches[0].clientX-touchStart.x;
    const dy=e.changedTouches[0].clientY-touchStart.y;
    touchStart=null;
    if(Math.abs(dx)<100||Math.abs(dx)<Math.abs(dy)*1.8)return;
    const index=SWIPE_ORDER.indexOf(category);if(index<0)return;
    const next=dx<0?index+1:index-1;
    if(next>=0&&next<SWIPE_ORDER.length)setCategory(SWIPE_ORDER[next]);
  },{passive:true});
  $("#storyFeed").addEventListener("touchcancel",()=>{touchStart=null},{passive:true});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(drawerOpen)closeDrawer();else $("#searchPanel").hidden=true}});
  async function loadContent(){try{const r=await fetch("./content.json",{cache:"no-store"});if(!r.ok)throw Error("HTTP "+r.status);const data=await r.json();if(!data||!Array.isArray(data.items))throw Error("Formato de catálogo inválido");const seen=new Set();items=data.items.filter(x=>x&&typeof x.id==="string"&&typeof x.title==="string"&&x.contentStatus!=="demo"&&!seen.has(x.id)&&seen.add(x.id));render()}catch(error){items=[];render();console.error("UNIVERSO catalog error",error)}}
  loadContent();
})();