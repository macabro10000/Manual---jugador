(() => {
  "use strict";
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
  const KEYS = {saved:"universo_saved_v1", tastes:"universo_tastes_v1", signals:"universo_signals_v1"};
  const TOPICS = {
    ciencia:["ciencia","espacio","científico","científicos","naturaleza","descubrimiento"],
    humor:["humor","gracioso","risa","comedia","divertido"],
    animales:["animal","animales","perro","gato","fauna","comportamiento animal"],
    tecnologia:["tecnología","tecnologia","robot","inteligencia artificial","digital"],
    mundo:["mundo","país","países","actualidad","historia"],
    deportes:["deporte","deportes","fútbol","futbol","baloncesto","atleta"],
    musica:["música","musica","canción","cancion","cantante","concierto"],
    curiosidades:["curiosidad","curiosidades","sorprendente","pregunta","formas en las nubes","parecen de otro planeta"],
    retos:["reto","retos","resolver","patrón","patron","prueba"]
  };
  let items=[], category="principal", search="", saved=readArray(KEYS.saved,[]), tastes=readArray(KEYS.tastes,[]), signals=readObject(KEYS.signals,{}), drawerOpen=false;
  function readArray(key,fallback){try{const value=JSON.parse(localStorage.getItem(key)||"null");return Array.isArray(value)?value:fallback}catch{return fallback}}
  function readObject(key,fallback){try{const value=JSON.parse(localStorage.getItem(key)||"null");return value&&typeof value==="object"&&!Array.isArray(value)?value:fallback}catch{return fallback}}
  function persist(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch{}}
  function esc(value){return String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]))}
  function normalized(value){return String(value||"").toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g,"")}
  function textOf(item){return normalized([item.title,item.description,item.category,item.sourcePlatform,item.sourceLabel,item.contentType,...(item.tags||[])].join(" "))}
  function score(item){
    const text=textOf(item);let points=0;
    tastes.forEach(taste=>{
      const terms=TOPICS[taste]||[taste];
      if(terms.some(term=>text.includes(normalized(term))))points+=4;
    });
    const s=signals[item.id]||{};
    points+=(s.like?8:0)+(s.open||0)*1.5+(s.save||0)*3-(s.skip||0)*7;
    if(saved.includes(item.id))points+=3;
    return points;
  }
  function verifiedViral(item){return item.contentStatus==="verified"&&Number.isFinite(item.viralScore)}
  function sortPrincipal(list){
    return list.sort((a,b)=>{
      const av=verifiedViral(a),bv=verifiedViral(b);
      if(av!==bv)return av?-1:1;
      if(av&&bv&&a.viralScore!==b.viralScore)return b.viralScore-a.viralScore;
      return score(b)-score(a);
    });
  }
  function categoryMatches(item){
    if(category==="principal")return true;
    if(category==="guardados")return saved.includes(item.id);
    if(["youtube","tiktok","facebook","instagram"].includes(category))return normalized(item.sourcePlatform)===category;
    return item.category===category;
  }
  function itemIsVideo(item){return ["youtube","tiktok","facebook","instagram"].includes(normalized(item.sourcePlatform))||normalized(item.contentType).includes("video")}
  function render(){
    let list=items.filter(item=>categoryMatches(item)&&textOf(item).includes(normalized(search)));
    if(category==="principal")list=sortPrincipal(list);
    else list.sort((a,b)=>score(b)-score(a));
    $("#savedCount").textContent=String(saved.length);
    $$(".menu-chip").forEach(button=>button.classList.toggle("active",button.dataset.category===category));
    $("#feedStatus").textContent=list.some(verifiedViral)?"TENDENCIAS CON MÉTRICAS DISPONIBLES":"MUESTRA · SIN MÉTRICAS VIRALES";
    if(!list.length){
      $("#storyFeed").innerHTML='<section class="empty-state"><span class="empty-symbol">✧</span><h2>'+esc(emptyTitle())+'</h2><p>'+esc(emptyMessage())+'</p><button type="button" id="clearFilter">Volver a Principal</button></section>';
      $("#clearFilter").addEventListener("click",()=>{category="principal";search="";$("#searchInput").value="";render();closeDrawer();scrollToFirst()});
      return;
    }
    $("#storyFeed").innerHTML=list.map((item,index)=>{
      const s=signals[item.id]||{};
      const isSaved=saved.includes(item.id);
      const status=verifiedViral(item)?"POPULARIDAD VERIFICADA":"EJEMPLO · NO ES TENDENCIA REAL";
      const image=item.image?'<img class="story-image" src="'+esc(item.image)+'" alt="" loading="'+(index<2?"eager":"lazy")+'" onerror="this.style.display=\'none\';this.nextElementSibling.hidden=false">':'';
      const topic=esc(item.category||"descubrimiento");
      const source=esc(item.sourceLabel||item.sourcePlatform||"Fuente");
      const href=safeUrl(item.canonicalUrl);
      const link=href?'<a class="story-action primary" href="'+esc(href)+'" target="_blank" rel="noopener noreferrer">Abrir fuente original ↗</a>':'';
      return '<article class="story-card" data-story="'+esc(item.id)+'">'+image+'<div class="story-fallback" '+(image?'hidden':'')+'>'+esc(item.symbol||"✦")+'</div><div class="story-vignette"></div><div class="story-count" aria-hidden="true">'+list.map((_,dot)=>'<span class="'+(dot===index?"active":"")+'"></span>').join("")+'</div><div class="story-content"><div class="story-source"><span class="source-dot"></span>'+source+' <span class="demo-badge">'+status+'</span></div><h1>'+esc(item.title)+'</h1><p>'+esc(item.description)+'</p><div class="story-tags"><span>'+topic+'</span><span>'+esc(item.contentType||"DESCUBRIMIENTO")+'</span>'+(item.publishedAt?'<span>'+esc(item.publishedAt)+'</span>':'')+'</div><div class="story-actions"><button class="story-action '+(s.like?"liked":"")+'" data-like="'+esc(item.id)+'">'+(s.like?"♥ Te interesa":"♡ Me interesa")+'</button><button class="story-action '+(isSaved?"saved":"")+'" data-save="'+esc(item.id)+'">'+(isSaved?"♥ Guardado":"＋ Guardar")+'</button><button class="story-action" data-next="'+esc(item.id)+'">Siguiente ↓</button>'+link+'</div></div></article>';
    }).join("");
    $$("[data-like]").forEach(button=>button.addEventListener("click",()=>{
      const id=button.dataset.like;const signal=signals[id]||{open:0,like:0,skip:0,save:0};signal.like=signal.like?0:1;signals[id]=signal;persist(KEYS.signals,signals);toast(signal.like?"Preferencia guardada":"Preferencia retirada");renderKeepPosition(id);
    }));
    $$("[data-save]").forEach(button=>button.addEventListener("click",()=>{
      const id=button.dataset.save;
      saved=saved.includes(id)?saved.filter(value=>value!==id):[...saved,id];persist(KEYS.saved,saved);
      const signal=signals[id]||{open:0,like:0,skip:0,save:0};signal.save=saved.includes(id)?1:0;signals[id]=signal;persist(KEYS.signals,signals);
      renderKeepPosition(id);
    }));
    $$("[data-next]").forEach(button=>button.addEventListener("click",()=>{
      const current=button.dataset.next;const signal=signals[current]||{open:0,like:0,skip:0,save:0};signal.skip=(signal.skip||0)+1;signals[current]=signal;persist(KEYS.signals,signals);
      const card=button.closest(".story-card");const next=card?.nextElementSibling;
      if(next)next.scrollIntoView({behavior:"smooth",block:"start"});else toast("Llegaste al final de esta selección.");
    }));
  }
  function renderKeepPosition(id){const old=$("#storyFeed [data-story='"+CSS.escape(id)+"']");const index=old?Array.from(old.parentElement.children).indexOf(old):0;render();const card=$("#storyFeed").children[Math.max(0,index)];if(card)card.scrollIntoView({behavior:"auto",block:"start"})}
  function safeUrl(value){try{const url=new URL(value);return ["https:","http:"].includes(url.protocol)?url.href:""}catch{return""}}
  function emptyTitle(){return category==="facebook"?"Facebook todavía no tiene fuentes conectadas":category==="instagram"?"Instagram todavía no tiene publicaciones conectadas":category==="youtube"?"YouTube: faltan publicaciones verificadas":category==="tiktok"?"TikTok: faltan publicaciones verificadas":category==="guardados"?"Todavía no has guardado nada":"No encontramos contenido para este filtro"}
  function emptyMessage(){return search?"Prueba con otra palabra o vuelve a Principal.":"Esta versión no inventa publicaciones. La categoría aparecerá cuando haya enlaces concretos y fuentes autorizadas disponibles."}
  function scrollToFirst(){const first=$("#storyFeed").firstElementChild;if(first)first.scrollIntoView({behavior:"smooth",block:"start"})}
  function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2100)}
  function openDrawer(){drawerOpen=true;$("#drawerBody").hidden=false;$("#drawerToggle").setAttribute("aria-expanded","true");$("#handleLabel").textContent="CERRAR MENÚ · TOCA LA RAYITA";$("#bottomDrawer").classList.add("expanded")}
  function closeDrawer(){drawerOpen=false;$("#drawerBody").hidden=true;$("#drawerToggle").setAttribute("aria-expanded","false");$("#handleLabel").textContent="MENÚ · DESLIZA O TOCA";$("#bottomDrawer").classList.remove("expanded")}
  $("#drawerToggle").addEventListener("click",()=>drawerOpen?closeDrawer():openDrawer());
  $("#drawerClose").addEventListener("click",closeDrawer);
  $$(".menu-chip").forEach(button=>button.addEventListener("click",()=>{
    category=button.dataset.category;render();closeDrawer();scrollToFirst();
  }));
  $("#searchToggle").addEventListener("click",()=>{const panel=$("#searchPanel");panel.hidden=!panel.hidden;if(!panel.hidden)$("#searchInput").focus()});
  $("#searchClose").addEventListener("click",()=>{search="";$("#searchInput").value="";$("#searchPanel").hidden=true;render()});
  $("#searchInput").addEventListener("input",event=>{search=event.target.value.trim();render()});
  $$("#drawerBody input[type=checkbox]").forEach(input=>{
    input.checked=tastes.includes(input.value);
    input.addEventListener("change",()=>{
      tastes=$$("#drawerBody input[type=checkbox]:checked").map(el=>el.value);persist(KEYS.tastes,tastes);
      if(category==="principal")render();
      toast(tastes.length?"Tus gustos están actualizados":"Se mostrarán todos los temas");
    });
  });
  document.addEventListener("keydown",event=>{if(event.key==="Escape"){if(drawerOpen)closeDrawer();else if(!$("#searchPanel").hidden)$("#searchPanel").hidden=true}});
  async function loadContent(){
    try{
      const response=await fetch("./content.json",{cache:"no-store"});
      if(!response.ok)throw new Error("HTTP "+response.status);
      const data=await response.json();
      if(!data||!Array.isArray(data.items))throw new Error("Formato de catálogo inválido");
      const seen=new Set();
      items=data.items.filter(item=>item&&typeof item.id==="string"&&typeof item.title==="string"&&typeof item.canonicalUrl==="string"&&!seen.has(item.id)&&seen.add(item.id));
      render();
    }catch(error){
      $("#storyFeed").innerHTML='<section class="empty-state"><span class="empty-symbol">!</span><h2>No pudimos cargar el catálogo</h2><p>Comprueba la conexión y vuelve a intentarlo. No se mostrará contenido inventado.</p><button type="button" id="retryLoad">Reintentar</button></section>';
      $("#retryLoad").addEventListener("click",loadContent);
      console.error("UNIVERSO: error al cargar content.json",error);
    }
  }
  loadContent();
})();