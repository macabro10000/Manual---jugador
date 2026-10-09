(() => {
  "use strict";
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const STORAGE_KEY = "universo_saved_v1";
  const TASTE_KEY = "universo_tastes_v1";
  const SIGNAL_KEY = "universo_signals_v1";
  let items = [];
  let category = "todos";
  let search = "";
  let saved = readSaved();
  let tastes = readArray(TASTE_KEY, []);
  let signals = readObject(SIGNAL_KEY, {});
  let activeImmersiveId = null;
  function readSaved(){try{const v=JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");return Array.isArray(v)?v:[]}catch{return[]}}
  function readArray(key,fallback){try{const v=JSON.parse(localStorage.getItem(key)||"null");return Array.isArray(v)?v:fallback}catch{return fallback}}
  function readObject(key,fallback){try{const v=JSON.parse(localStorage.getItem(key)||"null");return v&&typeof v==="object"&&!Array.isArray(v)?v:fallback}catch{return fallback}}
  function saveTastes(){try{localStorage.setItem(TASTE_KEY,JSON.stringify(tastes))}catch{}}
  function saveSignals(){try{localStorage.setItem(SIGNAL_KEY,JSON.stringify(signals))}catch{}}
  function signal(item,kind){if(!item)return;const s=signals[item.id]||{open:0,like:0,skip:0,save:0};s[kind]=(s[kind]||0)+1;signals[item.id]=s;saveSignals()}
  function score(item){
    const text=(item.title+" "+item.description+" "+item.category+" "+item.sourcePlatform).toLocaleLowerCase("es");
    let score=0;
    tastes.forEach(t=>{if(text.includes(t))score+=4});
    const s=signals[item.id]||{};
    score+=(s.like||0)*8+(s.open||0)*2+(s.save||0)*3-(s.skip||0)*7;
    if(saved.includes(item.id))score+=2;
    if(item.contentStatus==="verified"&&Number.isFinite(item.viralScore))score+=item.viralScore/10;
    return score;
  }
  function writeSaved(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(saved))}catch{};$("#savedCount").textContent=saved.length}
  function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
  function render(){
    let list=items.filter(item=>{
      const matchesCategory=category==="todos"||(category==="guardados"?saved.includes(item.id):item.category===category);
      const haystack=(item.title+" "+item.description+" "+item.sourceLabel+" "+item.contentType).toLocaleLowerCase("es");
      return matchesCategory&&haystack.includes(search.toLocaleLowerCase("es"));
    });
    if(category==="todos"&&search==="")list.sort((a,b)=>score(b)-score(a));
    $("#feedTitle").textContent=category==="todos"?"Tu feed de descubrimientos":({videos:"Videos para explorar",noticias:"Noticias y actualidad",curiosidades:"Curiosidades que sorprenden",retos:"Retos rápidos",guardados:"Tus guardados"}[category]||"Descubre");
    $("#resultCount").textContent=category==="guardados"?saved.length+" guardados":"Contenido de muestra";
    $("#feedGrid").innerHTML=list.map(item=>`<article class="content-card">
      <div class="card-image"><img src="${esc(item.image)}" alt="" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.hidden=false"><div class="image-fallback" hidden>${esc(item.symbol)}</div><span class="type-tag">${esc(item.contentType)}</span><span class="duration">${esc(item.duration)}</span></div>
      <div class="card-body"><div class="card-meta"><span class="source"><span class="source-dot"></span>${esc(item.sourceLabel)}</span><button class="save-btn ${saved.includes(item.id)?"saved":""}" data-save="${esc(item.id)}" aria-label="${saved.includes(item.id)?"Quitar de guardados":"Guardar"}">${saved.includes(item.id)?"♥":"♡"}</button></div><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p><div class="card-actions"><a class="card-link primary" href="${esc(item.canonicalUrl)}" target="_blank" rel="noopener noreferrer">${esc(item.linkLabel)} ↗</a><button class="card-link immersive-open" data-immersive="${esc(item.id)}">Pantalla completa ⛶</button><button class="card-link" data-share="${esc(item.id)}">Compartir ↗</button></div></div>
    </article>`).join("");
    $("#emptyState").hidden=list.length!==0;
    $("#feedGrid").hidden=list.length===0;
    $$(".category").forEach(btn=>btn.classList.toggle("active",btn.dataset.category===category));
    $$("[data-save]").forEach(btn=>btn.addEventListener("click",()=>{const id=btn.dataset.save;saved=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id];writeSaved();render();}));
    $("[data-immersive]").forEach(btn=>btn.addEventListener("click",()=>openImmersive(btn.dataset.immersive)));
    $("[data-share]").forEach(btn=>btn.addEventListener("click",async()=>{const item=items.find(x=>x.id===btn.dataset.share);signal(item,"open");const text=item.title+" — "+item.canonicalUrl;try{if(navigator.share)await navigator.share({title:item.title,text,url:item.canonicalUrl});else{await navigator.clipboard.writeText(text);toast("Enlace copiado para compartir.")}}catch(e){if(e.name!=="AbortError")toast("No se pudo compartir. Abre la fuente original.")}}));
  }
  function openImmersive(id){
    const item=items.find(x=>x.id===id);if(!item)return;
    activeImmersiveId=id;signal(item,"open");
    $("#immersiveTitle").textContent=item.title;
    $("#immersiveDescription").textContent=item.description;
    $("#immersiveTags").innerHTML=[item.category,item.sourceLabel,item.contentStatus==="demo"?"Ejemplo de demostración":"Fuente verificada"].map(t=>"<span>"+esc(t)+"</span>").join("");
    $("#immersiveSource").href=item.canonicalUrl;
    $("#immersiveLike").classList.toggle("liked",Boolean((signals[id]||{}).like));
    $("#immersiveLike").textContent=(signals[id]||{}).like?"♥ Me interesa":"♡ Me interesa";
    $("#immersive").hidden=false;document.body.classList.add("immersive-open");
  }
  function closeImmersive(){$("#immersive").hidden=true;document.body.classList.remove("immersive-open");activeImmersiveId=null;render()}
  $("#immersiveClose").addEventListener("click",closeImmersive);
  $("#immersive").addEventListener("click",e=>{if(e.target.id==="immersive")closeImmersive()});
  $("#immersiveLike").addEventListener("click",()=>{
    const item=items.find(x=>x.id===activeImmersiveId);if(!item)return;
    const s=signals[item.id]||{open:0,like:0,skip:0,save:0};
    s.like=s.like?0:1;signals[item.id]=s;saveSignals();
    $("#immersiveLike").classList.toggle("liked",Boolean(s.like));
    $("#immersiveLike").textContent=s.like?"♥ Te interesa":"♡ Me interesa";
    toast(s.like?"Lo tendremos en cuenta para personalizar tu universo.":"Preferencia retirada.");
  });
  $("#immersiveSkip").addEventListener("click",()=>{
    const current=items.find(x=>x.id===activeImmersiveId);if(!current)return;
    signal(current,"skip");
    const next=items.filter(x=>x.id!==current.id).sort((a,b)=>score(b)-score(a))[0];
    if(next)openImmersive(next.id);else toast("No hay más contenido en esta muestra.");
  });
  function setupTastes(){
    $("#tasteMenu input[type=checkbox]").forEach(input=>input.checked=tastes.includes(input.value));
    const toggle=$("#tasteToggle"),menu=$("#tasteMenu");
    toggle.addEventListener("click",()=>{menu.hidden=!menu.hidden;toggle.setAttribute("aria-expanded",String(!menu.hidden))});
    $("#tasteClose").addEventListener("click",()=>{menu.hidden=true;toggle.setAttribute("aria-expanded","false")});
    $("#tasteApply").addEventListener("click",()=>{
      tastes=$("#tasteMenu input:checked").map(input=>input.value);saveTastes();
      menu.hidden=true;toggle.setAttribute("aria-expanded","false");category="todos";render();
      toast(tastes.length?"Tu universo se ajustó a "+tastes.length+" gustos.":"Se mostrarán todos los temas.");
    });
  }
  function moveRail(direction){
    const rail=$("#feedGrid");
    const card=rail.querySelector(".content-card");
    if(!card)return;
    const gap=parseFloat(getComputedStyle(rail).gap)||16;
    rail.scrollBy({left:direction*(card.getBoundingClientRect().width+gap),behavior:"smooth"});
  }
  $("#railPrev")?.addEventListener("click",()=>moveRail(-1));
  $("#railNext")?.addEventListener("click",()=>moveRail(1));
  function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2200)}
  $$(".category").forEach(btn=>btn.addEventListener("click",()=>{category=btn.dataset.category;render();$("#feed").scrollIntoView({behavior:"smooth",block:"start"})}));
  $("#searchInput").addEventListener("input",e=>{search=e.target.value.trim();render()});
  $("#showAll").addEventListener("click",()=>{category="todos";search="";$("#searchInput").value="";render()});
  $("#themeButton").addEventListener("click",()=>{document.body.classList.toggle("light");try{localStorage.setItem("universo_theme_v1",document.body.classList.contains("light")?"light":"dark")}catch{}});
  try{if(localStorage.getItem("universo_theme_v1")==="light")document.body.classList.add("light")}catch{}
  async function loadContent(){
    try{
      const response=await fetch("./content.json",{cache:"no-store"});
      if(!response.ok)throw new Error("HTTP "+response.status);
      const data=await response.json();
      if(!data||!Array.isArray(data.items))throw new Error("Formato de catálogo inválido");
      items=data.items.filter(item=>item&&typeof item.id==="string"&&typeof item.title==="string"&&typeof item.canonicalUrl==="string");
      render();
    }catch(error){
      $("#resultCount").textContent="Catálogo no disponible";
      $("#feedGrid").hidden=true;
      $("#emptyState").hidden=false;
      toast("No se pudo cargar el catálogo. Recarga la página e inténtalo de nuevo.");
      console.error("UNIVERSO: error al cargar content.json",error);
    }
  }
  writeSaved();
  setupTastes();
  loadContent();
})();