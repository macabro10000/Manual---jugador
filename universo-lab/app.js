(() => {
  "use strict";
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const STORAGE_KEY = "universo_saved_v1";
  const items = [
    {id:"u1",category:"curiosidades",type:"DESCUBRIMIENTO",source:"Universo · contenido de muestra",title:"Hay lugares en la Tierra que parecen de otro planeta",description:"Una invitación a explorar fenómenos naturales sorprendentes.",image:"assets/hero-aurora.webp",symbol:"✧",duration:"3 min",url:"https://www.wikipedia.org/",label:"Explorar"},
    {id:"u2",category:"videos",type:"VIDEO",source:"YouTube · fuente externa",title:"El comportamiento animal que sorprende a los científicos",description:"Ejemplo visual para reemplazar por un video real y autorizado.",image:"assets/video-animal.webp",symbol:"▷",duration:"Short",url:"https://www.youtube.com/",label:"Ver fuente"},
    {id:"u3",category:"noticias",type:"CIENCIA",source:"Fuente de noticias · demo",title:"Un nuevo descubrimiento abre preguntas sobre el espacio",description:"Tarjeta de demostración: sustituir por noticia actual con fecha y fuente.",image:"assets/news-space.webp",symbol:"✦",duration:"4 min",url:"https://www.bbc.com/news",label:"Leer fuente"},
    {id:"u4",category:"retos",type:"RETO RÁPIDO",source:"Universo · interactivo",title:"¿Puedes resolver este patrón en 15 segundos?",description:"Una pequeña prueba para participar y compartir el resultado.",image:"assets/puzzle.webp",symbol:"▦",duration:"15 s",url:"https://neal.fun/",label:"Probar reto"},
    {id:"u5",category:"videos",type:"VIDEO",source:"TikTok · fuente externa",title:"Un instante inesperado que merece una segunda mirada",description:"Espacio de ejemplo para insertar una publicación compatible.",image:"assets/video-vertical.webp",symbol:"♪",duration:"Vertical",url:"https://www.tiktok.com/",label:"Ver fuente"},
    {id:"u6",category:"curiosidades",type:"CURIOSIDAD",source:"Universo · contenido de muestra",title:"¿Por qué vemos formas en las nubes?",description:"La mente encuentra patrones incluso en imágenes ambiguas.",image:"assets/curiosity-clouds.webp",symbol:"◌",duration:"2 min",url:"https://www.wikipedia.org/",label:"Descubrir"},
    {id:"u7",category:"noticias",type:"MUNDO",source:"BBC News · portal",title:"Las historias del mundo que vale la pena seguir",description:"La publicación final debe enlazar a un artículo concreto y fechado.",image:"assets/news-world.webp",symbol:"◉",duration:"Actualidad",url:"https://www.bbc.com/news",label:"Leer noticias"},
    {id:"u8",category:"videos",type:"VIDEO",source:"Instagram · fuente externa",title:"Ideas visuales que despiertan nuevas preguntas",description:"Tarjeta de muestra para publicaciones que permitan inserción.",image:"assets/video-ideas.webp",symbol:"◎",duration:"Clip",url:"https://www.instagram.com/",label:"Ver fuente"},
    {id:"u9",category:"curiosidades",type:"EXPLORAR",source:"Universo · contenido de muestra",title:"Cinco preguntas curiosas para cambiar de perspectiva",description:"Una buena pregunta puede abrir una cadena de descubrimientos.",image:"assets/curiosity-questions.webp",symbol:"?",duration:"5 preguntas",url:"https://www.wikipedia.org/",label:"Explorar"}
  ];
  let category = "todos";
  let search = "";
  let saved = readSaved();
  function readSaved(){try{const v=JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");return Array.isArray(v)?v:[]}catch{return[]}}
  function writeSaved(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(saved))}catch{};$("#savedCount").textContent=saved.length}
  function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
  function render(){
    let list=items.filter(item=>{
      const matchesCategory=category==="todos"||(category==="guardados"?saved.includes(item.id):item.category===category);
      const haystack=(item.title+" "+item.description+" "+item.source+" "+item.type).toLocaleLowerCase("es");
      return matchesCategory&&haystack.includes(search.toLocaleLowerCase("es"));
    });
    $("#feedTitle").textContent=category==="todos"?"Tu feed de descubrimientos":({videos:"Videos para explorar",noticias:"Noticias y actualidad",curiosidades:"Curiosidades que sorprenden",retos:"Retos rápidos",guardados:"Tus guardados"}[category]||"Descubre");
    $("#resultCount").textContent=category==="guardados"?saved.length+" guardados":"Contenido de muestra";
    $("#feedGrid").innerHTML=list.map(item=>`<article class="content-card">
      <div class="card-image"><img src="${esc(item.image)}" alt="" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.hidden=false"><div class="image-fallback" hidden>${esc(item.symbol)}</div><span class="type-tag">${esc(item.type)}</span><span class="duration">${esc(item.duration)}</span></div>
      <div class="card-body"><div class="card-meta"><span class="source"><span class="source-dot"></span>${esc(item.source)}</span><button class="save-btn ${saved.includes(item.id)?"saved":""}" data-save="${esc(item.id)}" aria-label="${saved.includes(item.id)?"Quitar de guardados":"Guardar"}">${saved.includes(item.id)?"♥":"♡"}</button></div><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p><div class="card-actions"><a class="card-link primary" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${esc(item.label)} ↗</a><button class="card-link" data-share="${esc(item.id)}">Compartir ↗</button></div></div>
    </article>`).join("");
    $("#emptyState").hidden=list.length!==0;
    $("#feedGrid").hidden=list.length===0;
    $$(".category").forEach(btn=>btn.classList.toggle("active",btn.dataset.category===category));
    $$("[data-save]").forEach(btn=>btn.addEventListener("click",()=>{const id=btn.dataset.save;saved=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id];writeSaved();render();}));
    $$("[data-share]").forEach(btn=>btn.addEventListener("click",async()=>{const item=items.find(x=>x.id===btn.dataset.share);const text=item.title+" — "+item.url;try{if(navigator.share)await navigator.share({title:item.title,text,url:item.url});else{await navigator.clipboard.writeText(text);toast("Enlace copiado para compartir.")}}catch(e){if(e.name!=="AbortError")toast("No se pudo compartir. Abre la fuente original.")}}));
  }
  function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2200)}
  $$(".category").forEach(btn=>btn.addEventListener("click",()=>{category=btn.dataset.category;render();$("#feed").scrollIntoView({behavior:"smooth",block:"start"})}));
  $("#searchInput").addEventListener("input",e=>{search=e.target.value.trim();render()});
  $("#showAll").addEventListener("click",()=>{category="todos";search="";$("#searchInput").value="";render()});
  $("#themeButton").addEventListener("click",()=>{document.body.classList.toggle("light");try{localStorage.setItem("universo_theme_v1",document.body.classList.contains("light")?"light":"dark")}catch{}});
  try{if(localStorage.getItem("universo_theme_v1")==="light")document.body.classList.add("light")}catch{}
  writeSaved();render();
})();