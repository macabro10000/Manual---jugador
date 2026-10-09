(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const STORAGE = { streak: "smartdaily_streak_v1", quiz: "smartdaily_quiz_v1", theme: "smartdaily_theme_v1", sticky: "smartdaily_sticky_closed_v1" };
  const todayKey = () => { const d = new Date(); return [d.getFullYear(), String(d.getMonth()+1).padStart(2,"0"), String(d.getDate()).padStart(2,"0")].join("-"); };
  const dayIndex = (key = todayKey()) => { const d = new Date(key + "T12:00:00"); return Math.floor(d.getTime()/86400000); };
  const dateLabel = new Intl.DateTimeFormat("es-CO", { day:"numeric", month:"long", year:"numeric" }).format(new Date());
  $("#heroDate").textContent = dateLabel;
  $("#year").textContent = new Date().getFullYear();

  let toastTimer;
  function toast(message) {
    const el = $("#toast"); el.textContent = message; el.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"), 2300);
  }
  function safeRead(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } }
  function safeWrite(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { toast("El navegador no permitió guardar este dato."); return false; } }
  function escapeHtml(value) { return String(value).replace(/[&<>"']/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[ch])); }

  // Curated, rotating offline challenge bank. Answers are educational examples, not reliable AI detection.
  const challenges = [
    {category:"ESCRITURA · NIVEL 1",title:"¿Quién lo creó?",text:"La lluvia empezó justo cuando cerré la tienda. Dejé el letrero de «vuelvo pronto» en la puerta y me quedé cinco minutos más, solo para escucharla.",answer:"human",why:"La escena concreta y cotidiana suena a experiencia personal, aunque una IA también podría escribirla. El estilo por sí solo no demuestra autoría.",hint:"Busca detalles concretos, pero recuerda que no son una prueba."},
    {category:"IDEAS · NIVEL 1",title:"¿De dónde viene esta respuesta?",text:"Para mejorar tu rutina, identifica primero una tarea prioritaria, divídela en pasos pequeños y revisa al final del día qué funcionó y qué debes ajustar.",answer:"ai",why:"La estructura general, equilibrada y orientada a instrucciones es frecuente en respuestas generadas por IA, pero una persona también puede escribir así.",hint:"Las listas ordenadas pueden ser una pista, no una certeza."},
    {category:"MICROCUENTO · NIVEL 2",title:"¿Humano o IA?",text:"Mi abuelo guardaba tornillos en frascos de mermelada. Cuando murió, encontramos uno que decía «para arreglar lo que todavía no se ha roto».",answer:"human",why:"El detalle familiar y el giro emocional se eligieron como ejemplo humano para el juego. No hay una señal lingüística capaz de confirmar el origen.",hint:"La emoción no certifica quién escribió algo."},
    {category:"PRODUCTIVIDAD · NIVEL 1",title:"Detecta el estilo",text:"Objetivo: terminar el informe. Acción: redacta un borrador de 20 minutos. Revisión: comprueba los datos y elimina lo innecesario. Resultado: una versión lista para compartir.",answer:"ai",why:"El formato etiquetado y la simetría hacen que parezca una respuesta de IA, aunque es un patrón que cualquiera puede imitar.",hint:"Observa la estructura y evita confiar en una sola pista."},
    {category:"DIÁLOGO · NIVEL 2",title:"¿Quién escribió esto?",text:"—¿Trajiste paraguas?
—No.
—Entonces hoy nos toca llegar con una historia nueva para contar.",answer:"human",why:"El diálogo breve y el remate se presentan como ejemplo humano; en la realidad, este estilo también puede ser generado artificialmente.",hint:"Una voz natural puede tener cualquier origen."},
    {category:"EXPLICACIÓN · NIVEL 1",title:"¿Respuesta generada?",text:"La fotosíntesis es el proceso por el cual las plantas convierten la energía de la luz en energía química. Utilizan agua y dióxido de carbono y liberan oxígeno como subproducto.",answer:"ai",why:"La explicación es clara y escolar, un formato común en respuestas de IA y también en libros de texto. El contenido no permite identificar con certeza a su autor.",hint:"El tono didáctico tampoco es una prueba."},
    {category:"OBSERVACIÓN · NIVEL 2",title:"La última pista",text:"Compré tres limones para la receta. Volví con dos, una bolsa de pan y una historia larguísima sobre el señor que atendía la frutería.",answer:"human",why:"La anécdota pequeña se presenta como ejemplo humano, pero una IA puede imitarla. El reto mide tu intuición, no una detección verificable.",hint:"Las pequeñas inconsistencias pueden parecer humanas."}
  ];
  const challenge = challenges[((dayIndex() % challenges.length) + challenges.length) % challenges.length];
  const challengeId = "daily-" + todayKey();
  $("#dailyNumber").textContent = "RETO #" + String(dayIndex() % 999 + 1).padStart(3,"0");
  $("#challengeCategory").textContent = challenge.category;
  $("#challengeTitle").textContent = challenge.title;
  $("#challengeText").textContent = challenge.text;
  $("#challengeHint").textContent = challenge.hint;
  const savedDaily = safeRead("smartdaily_daily_v1", {});
  let dailyAnswered = savedDaily.date === todayKey();
  let dailyChoice = dailyAnswered ? savedDaily.answer : null;
  let dailyResultShown = dailyAnswered;
  if (dailyAnswered) showDailyFeedback(savedDaily.answer, false);

  function showDailyFeedback(answer, fresh) {
    dailyChoice = answer;
    $$(".answer-button").forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.answer === answer) btn.classList.add("selected");
    });
    const correct = answer === challenge.answer;
    const fb = $("#dailyFeedback");
    fb.hidden = false;
    fb.innerHTML = "<strong>" + (correct ? "¡Bien visto!" : "Esta vez no") + "</strong><br>" + escapeHtml(challenge.why);
    $("#dailyContinue").hidden = false;
    if (fresh) safeWrite("smartdaily_daily_v1", {date:todayKey(),answer,correct});
  }
  $$(".answer-button").forEach(btn => btn.addEventListener("click", () => {
    if (dailyAnswered) return;
    dailyAnswered = true;
    showDailyFeedback(btn.dataset.answer, true);
  }));
  $("#dailyContinue").addEventListener("click", () => {
    if (dailyResultShown) { $("#dailyResult").scrollIntoView({behavior:"smooth",block:"center"}); return; }
    dailyResultShown = true;
    const record = safeRead("smartdaily_daily_v1", {});
    updateStreak();
    $("#dailyAd").hidden = false;
    const correct = record.correct === true;
    $("#dailyResult").hidden = false;
    $("#dailyResult").innerHTML = '<div class="eyebrow">TU RESULTADO DE HOY</div><div class="result-score">' + (correct ? "1 / 1" : "0 / 1") + '</div><h3>' + (correct ? "Ojo entrenado." : "La próxima puede sorprenderte.") + '</h3><p>' + escapeHtml(challenge.why) + '</p><div class="result-actions"><button class="button button-primary" id="shareDaily">Compartir resultado ↗</button><button class="text-link" id="dailyAgain">Volver a leer el reto</button></div>';
    $("#shareDaily").addEventListener("click", () => share("Mi desafío IA vs Humano en SmartDaily: " + (correct ? "acerté" : "esta vez fallé") + ". ¿Tú qué habrías respondido? " + location.href));
    $("#dailyAgain").addEventListener("click", () => $("#daily").scrollIntoView({behavior:"smooth"}));
    $("#dailyResult").scrollIntoView({behavior:"smooth",block:"center"});
  });
  function updateStreak() {
    const data = safeRead(STORAGE.streak, {count:0,lastDate:null});
    const last = data.lastDate;
    if (last !== todayKey()) {
      data.count = last && dayIndex() - dayIndex(last) === 1 ? data.count + 1 : 1;
      data.lastDate = todayKey();
      safeWrite(STORAGE.streak, data);
    }
    $("#streakCount").textContent = data.count + (data.count === 1 ? " día" : " días");
  }
  const streakData = safeRead(STORAGE.streak, {count:0,lastDate:null});
  $("#streakCount").textContent = (streakData.count || 0) + ((streakData.count || 0) === 1 ? " día" : " días");

  // Tool tabs
  $$(".tool-tab").forEach(tab => tab.addEventListener("click", () => {
    $$(".tool-tab").forEach(t => { const active = t === tab; t.classList.toggle("active", active); t.setAttribute("aria-selected", String(active)); });
    $$(".tool-panel").forEach(panel => { panel.hidden = panel.id !== "tool-" + tab.dataset.tool; });
  }));
  $("#buildPrompt").addEventListener("click", () => {
    const idea = $("#promptInput").value.trim();
    if (!idea) { toast("Escribe primero tu idea."); $("#promptInput").focus(); return; }
    const result = "Actúa como " + $("#promptRole").value.toLowerCase() + ".\n\nOBJETIVO\n" + idea + "\n\nCONTEXTO\nSi falta información esencial, haz hasta 3 preguntas concretas antes de asumir datos. No inventes cifras, fuentes ni resultados.\n\nREQUISITOS\n- Estilo: " + $("#promptTone").value.toLowerCase() + ".\n- Prioriza pasos concretos, útiles y ordenados.\n- Explica brevemente los supuestos y las limitaciones relevantes.\n- Distingue los hechos de las recomendaciones.\n\nFORMATO DE ENTREGA\n1. Respuesta principal.\n2. Pasos de acción numerados.\n3. Lista corta de comprobación para evaluar el resultado.";
    $("#promptResult").textContent = result; $("#promptOutput").hidden = false; $("#promptOutput").scrollIntoView({behavior:"smooth",block:"nearest"});
  });
  $("#cleanText").addEventListener("click", () => {
    const source = $("#textInput").value;
    if (!source.trim()) { toast("Pega algún texto antes de limpiar."); $("#textInput").focus(); return; }
    let result = source.replace(/\r\n?/g,"\n");
    if ($("#trimLines").checked) result = result.split("\n").map(line => line.replace(/[\t ]+/g," ").trim()).join("\n");
    if ($("#collapseBlank").checked) result = result.replace(/\n[\t ]*\n(?:[\t ]*\n)+/g,"\n\n");
    result = result.trim();
    $("#cleanResult").textContent = result;
    $("#textStats").textContent = source.length.toLocaleString("es-CO") + " caracteres antes · " + result.length.toLocaleString("es-CO") + " después · " + result.split(/\s+/).filter(Boolean).length.toLocaleString("es-CO") + " palabras";
    $("#textOutput").hidden = false;
  });
  $$("[data-copy]").forEach(btn => btn.addEventListener("click", async () => {
    const text = $("#" + btn.dataset.copy).textContent;
    try { await navigator.clipboard.writeText(text); toast("Copiado al portapapeles."); }
    catch { const area = document.createElement("textarea"); area.value = text; document.body.appendChild(area); area.select(); const ok = document.execCommand("copy"); area.remove(); toast(ok ? "Copiado al portapapeles." : "No se pudo copiar; selecciona el texto manualmente."); }
  }));

  function calculate() {
    const visits = Math.max(0, Math.min(100000000, Number($("#visits").value) || 0));
    const pages = Math.max(1, Math.min(100, Number($("#pagesPerVisit").value) || 1));
    const visible = Math.max(0, Math.min(100, Number($("#viewability").value) || 0)) / 100;
    const rpm = Math.max(0, Math.min(1000, Number($("#rpm").value) || 0));
    const pageViews = visits * pages;
    const impressions = pageViews * visible;
    const money = impressions / 1000 * rpm;
    $("#pageViews").textContent = Math.round(pageViews).toLocaleString("es-CO");
    $("#adViews").textContent = Math.round(impressions).toLocaleString("es-CO");
    $("#revenue").textContent = money.toLocaleString("es-CO",{style:"currency",currency:"USD",maximumFractionDigits:2});
  }
  $("#calculateMetrics").addEventListener("click", calculate);
  ["visits","pagesPerVisit","viewability","rpm"].forEach(id => $("#"+id).addEventListener("input", calculate));
  calculate();

  // Quiz: local scoring by strengths, not diagnosis.
  const quiz = [
    {q:"Cuando aparece un problema nuevo, tú…",opts:[["a","Pruebo una solución pequeña y aprendo."],["b","Busco datos y comparo opciones."],["c","Imagino una salida que nadie ha probado."],["d","Organizo los pasos y reparto prioridades."]]},
    {q:"¿Qué te da más satisfacción?",opts:[["c","Crear algo original desde cero."],["b","Encontrar el patrón que otros no vieron."],["d","Convertir el caos en un plan claro."],["a","Hacer que algo funcione de verdad."]]},
    {q:"En un equipo sueles ser quien…",opts:[["d","Alinea al grupo y mantiene el rumbo."],["a","Construye, prueba y resuelve."],["c","Propone posibilidades inesperadas."],["b","Pregunta qué evidencia tenemos."]]},
    {q:"Tienes una hora libre para aprender. Eliges…",opts:[["b","Investigar cómo funciona algo."],["c","Explorar una idea nueva."],["a","Practicar una habilidad con un proyecto."],["d","Crear un método que pueda repetir."]]},
    {q:"Ante una herramienta nueva, tu primera reacción es…",opts:[["a","Tocarla y experimentar."],["d","Entender el flujo completo."],["b","Comparar funciones y límites."],["c","Pensar en usos que nadie menciona."]]}
  ];
  const profiles = {
    a:{title:"Constructor/a",desc:"Aprendes haciendo. Tu ventaja está en convertir ideas en pruebas, prototipos y resultados concretos.",tip:"Reto para ti: termina una versión pequeña antes de añadir funciones."},
    b:{title:"Analista",desc:"Te gusta detectar patrones, contrastar información y entender qué hay detrás de una conclusión.",tip:"Reto para ti: decide qué evidencia cambiaría tu opinión."},
    c:{title:"Explorador/a creativo/a",desc:"Conectas ideas y ves posibilidades nuevas. Tu energía aparece cuando puedes imaginar y experimentar.",tip:"Reto para ti: elige una idea y conviértela en un experimento medible."},
    d:{title:"Estratega",desc:"Transformas objetivos amplios en secuencias, prioridades y sistemas que se pueden repetir.",tip:"Reto para ti: deja un margen para probar alternativas sin romper el plan."}
  };
  let quizIndex = 0, quizAnswers = [];
  const storedQuiz = safeRead(STORAGE.quiz, null);
  if (storedQuiz && storedQuiz.date === todayKey() && Array.isArray(storedQuiz.answers)) quizAnswers = storedQuiz.answers;
  function renderQuiz() {
    const q = quiz[quizIndex]; const pct = Math.round((quizIndex+1)/quiz.length*100);
    $("#quizStepLabel").textContent = "PREGUNTA " + (quizIndex+1) + " DE " + quiz.length;
    $("#quizPercent").textContent = pct + "%"; $("#quizProgress").style.width = pct + "%";
    $("#quizQuestion").textContent = q.q;
    $("#quizOptions").innerHTML = q.opts.map((o,i) => '<button class="quiz-option'+(quizAnswers[quizIndex]===o[0]?' selected':'')+'" data-value="'+o[0]+'"><span class="option-letter">'+String.fromCharCode(65+i)+'</span><span>'+escapeHtml(o[1])+'</span></button>').join("");
    $$(".quiz-option").forEach(btn => btn.addEventListener("click", () => { quizAnswers[quizIndex] = btn.dataset.value; $$(".quiz-option").forEach(b => b.classList.toggle("selected", b===btn)); $("#quizNext").disabled = false; }));
    $("#quizBack").disabled = quizIndex === 0;
    $("#quizNext").disabled = !quizAnswers[quizIndex];
    $("#quizNext").innerHTML = quizIndex === quiz.length-1 ? 'Ver mi resultado <span>↗</span>' : 'Siguiente <span>→</span>';
  }
  function showQuizResult() {
    const counts = {a:0,b:0,c:0,d:0}; quizAnswers.forEach(a => {if(counts[a]!==undefined) counts[a]++;});
    const winner = Object.keys(counts).sort((a,b) => counts[b]-counts[a])[0];
    const profile = profiles[winner];
    safeWrite(STORAGE.quiz,{date:todayKey(),answers:quizAnswers,result:winner});
    $("#quizStage").hidden = true; $(".quiz-controls").hidden = true;
    $("#quizAd").hidden = false; $("#quizResult").hidden = false;
    $("#quizResult").innerHTML = '<div class="eyebrow">TU PERFIL DIGITAL</div><div class="result-score">'+escapeHtml(profile.title)+'</div><p>'+escapeHtml(profile.desc)+'</p><div class="feedback-box">'+escapeHtml(profile.tip)+'</div><div class="result-actions"><button class="button button-primary" id="shareQuiz">Compartir mi perfil ↗</button><button class="text-link" id="restartQuiz">Volver a jugar</button></div>';
    $("#shareQuiz").addEventListener("click", () => share("Mi perfil en el quiz de SmartDaily es: "+profile.title+". "+profile.desc+" ¿Cuál es el tuyo? "+location.href));
    $("#restartQuiz").addEventListener("click", () => {quizIndex=0;quizAnswers=[];$("#quizStage").hidden=false;$(".quiz-controls").hidden=false;$("#quizResult").hidden=true;$("#quizAd").hidden=true;renderQuiz();});
  }
  $("#quizNext").addEventListener("click", () => { if (!quizAnswers[quizIndex]) return; if(quizIndex===quiz.length-1){showQuizResult();return;} quizIndex++; renderQuiz(); $("#quiz").scrollIntoView({behavior:"smooth",block:"start"}); });
  $("#quizBack").addEventListener("click", () => {if(quizIndex>0){quizIndex--;renderQuiz();}});
  if(storedQuiz && storedQuiz.date===todayKey() && storedQuiz.answers && storedQuiz.answers.length===quiz.length){quizAnswers=storedQuiz.answers;quizIndex=quiz.length-1;renderQuiz();showQuizResult();}else{renderQuiz();}

  async function share(message) {
    const payload = {title:"SmartDaily & Tools",text:message,url:location.href};
    try { if(navigator.share) await navigator.share(payload); else if(navigator.clipboard){await navigator.clipboard.writeText(message);toast("Texto para compartir copiado.");}else toast("Comparte el enlace: "+location.href); }
    catch(error) { if(error && error.name!=="AbortError") toast("No se pudo abrir compartir. Puedes copiar el enlace."); }
  }
  $("#themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    const mode = document.body.classList.contains("light-mode") ? "light" : "dark";
    try {localStorage.setItem(STORAGE.theme,mode);} catch {}
  });
  try { if(localStorage.getItem(STORAGE.theme)==="light") document.body.classList.add("light-mode"); } catch {}
  $("#closeStickyAd").addEventListener("click", () => {$("#stickyAd").hidden=true;try{localStorage.setItem(STORAGE.sticky,"1");}catch{}});
  try { if(localStorage.getItem(STORAGE.sticky)==="1") $("#stickyAd").hidden=true; } catch {}
})();