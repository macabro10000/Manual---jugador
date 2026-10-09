(() => {
  "use strict";
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const STORAGE_KEY = "universo_saved_v1";
  let items = [];
  let category = "todos";
  let search = "";
  let saved = readSaved();
  function readSaved(){try{const v=JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");return Array.isArray(v)?v:[]}catch{return[]}}
  function writeSaved(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(saved))}catch{};$("#savedCount").textContent=saved.length}
  function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
  function render(){
    let list=items.filter(item=>{
      const matchesCategory=category==="todos"||(category==="guardados"?saved.includes(item.id):item.category===category);
      const haystack=(item.title+" "+item.description+" "+item.sourceLabel+" "+item.contentType).toLocaleLowerCase("es");
      return matchesCategory&&haystack.includes(search.toLocaleLowerCase("es"));
    });
    $("#feedTitle").textContent=category==="todos"?"Tu feed de descubrimientos":({videos:"Videos para explorar",noticias:"Noticias y actualidad",curiosidades:"Curiosidades que sorprenden",retos:"Retos rápidos",guardados:"Tus guardados"}[category]||"Descubre");
    $("#resultCount").textContent=category==="guardados"?saved.length+" guardados":"Contenido de muestra";
    $("#feedGrid").innerHTML=list.map(item=>`<article class="content-card">
      <div class="card-image"><img src="${esc(item.image)}" alt="" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.hidden=false"><div class="image-fallback" hidden>${esc(item.symbol)}</div><span class="type-tag">${esc(item.contentType)}</span><span class="duration">${esc(item.duration)}</span></div>
      <div class="card-body"><div class="card-meta"><span class="source"><span class="source-dot"></span>${esc(item.sourceLabel)}</span><button class="save-btn ${saved.includes(item.id)?"saved":""}" data-save="${esc(item.id)}" aria-label="${saved.includes(item.id)?"Quitar de guardados":"Guardar"}">${saved.includes(item.id)?"♥":"♡"}</button></div><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p><div class="card-actions"><a class="card-link primary" href="${esc(item.canonicalUrl)}" target="_blank" rel="noopener noreferrer">${esc(item.linkLabel)} ↗</a><button class="card-link" data-share="${esc(item.id)}">Compartir ↗</button></div></div>
    </article>`).join("");
    $("#emptyState").hidden=list.length!==0;
    $("#feedGrid").hidden=list.length===0;
    $$(".category").forEach(btn=>btn.classList.toggle("active",btn.dataset.category===category));
    $$("[data-save]").forEach(btn=>btn.addEventListener("click",()=>{const id=btn.dataset.save;saved=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id];writeSaved();render();}));
    $$("[data-share]").forEach(btn=>btn.addEventListener("click",async()=>{const item=items.find(x=>x.id===btn.dataset.share);const text=item.title+" — "+item.canonicalUrl;try{if(navigator.share)await navigator.share({title:item.title,text,url:item.canonicalUrl});else{await navigator.clipboard.writeText(text);toast("Enlace copiado para compartir.")}}catch(e){if(e.name!=="AbortError")toast("No se pudo compartir. Abre la fuente original.")}}));
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
  loadContent();
})();