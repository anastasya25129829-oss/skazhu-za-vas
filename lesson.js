// Урок «Учим значки»: сначала знакомимся со значками, потом находим картинку по слову.
// Два варианта: «Вместе с помощником» (объясняет логопед или родные)
// и «Сам» (приложение само говорит, что делать, и показывает ответ после двух ошибок).
// Берёт из app.js: say, el, iconNode, settings, saveSettings, setMode, main.

// Слова в уроке — в начальной форме («вода», а не «воду»): так проще запомнить значок.
var LESSONS = [
  { name: "Начало фразы", icon: "🙋", items: [
    ["🙋", "я хочу"], ["🙅", "я не хочу"], ["🤲", "дайте"], ["🆘", "помогите"], ["😟", "мне"], ["🤕", "у меня болит"]
  ]},
  { name: "Питьё", icon: "🥤", items: [
    ["🫖", "чай"], ["💧", "вода"], ["🧃", "сок"], ["🥛", "молоко"], ["☕", "кофе"], ["🍒", "компот"]
  ]},
  { name: "Еда", icon: "🍲", items: [
    ["🍲", "суп"], ["🥣", "каша"], ["🍞", "хлеб"], ["🍎", "фрукты"], ["🍪", "печенье"], ["🥔", "картошка"]
  ]},
  { name: "Дела", icon: "🛏️", items: [
    ["🥤", "пить"], ["🍲", "есть"], ["😴", "спать"], ["🛏️", "лечь"], ["🚽", "в туалет"],
    ["🌳", "гулять"], ["📺", "смотреть"], ["📞", "позвонить"], ["🚿", "помыться"], ["👕", "переодеться"]
  ]},
  { name: "Помощь", icon: "🆘", items: [
    ["🧍", "встать"], ["🪑", "сесть"], ["🛏️", "лечь"], ["👕", "одеться"], ["🧼", "умыться"], ["🚽", "дойти до туалета"]
  ]},
  { name: "Вещи", icon: "📱", items: [
    ["💧", "вода"], ["📱", "телефон"], ["👓", "очки"], ["🎛️", "пульт"], ["🧣", "плед"],
    ["💊", "лекарство"], ["🧥", "кофта"], ["🦯", "трость"]
  ]},
  { name: "Тело", icon: "🧠", items: [
    ["🧠", "голова"], ["🫃", "живот"], ["img:icons/spina.svg", "спина"], ["💪", "рука"],
    ["🦵", "нога"], ["🗣️", "горло"], ["🫀", "сердце"]
  ]},
  { name: "Чувства", icon: "🙂", items: [
    ["🥶", "холодно"], ["🥵", "жарко"], ["😣", "больно"], ["🤒", "плохо"],
    ["🙂", "хорошо"], ["😐", "скучно"], ["😢", "грустно"], ["😨", "страшно"]
  ]},
  { name: "Где и когда", icon: "🏠", items: [
    ["🏠", "домой"], ["🌳", "на улицу"], ["🚽", "в туалет"], ["🛏️", "в кровать"],
    ["⏰", "сейчас"], ["⏳", "потом"], ["🌅", "утром"], ["🌙", "вечером"]
  ]},
  { name: "Люди", icon: "👪", items: [
    ["👩", "жена", "wife"], ["👨", "муж", "husband"], ["👧", "дочь", "daughter"],
    ["👦", "сын", "son"], ["🧒", "внуки", "grandkids"], ["🤝", "друг", "friend"]
  ]}
];

var lesson = null; // { topic, who, phase: "learn" | "quiz", i, order, wrong, locked }

function isSolo() { return lesson && lesson.who === "solo"; }

function shuffle(list) {
  var a = list.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

// Защита от двойного нажатия: после смены экрана полсекунды нажатия не считаются
function lockTaps(ms) {
  lesson.lockedUntil = Date.now() + (ms || 500);
}
function tapsLocked() { return lesson && Date.now() < lesson.lockedUntil; }

function bigButton(text, cls, onClick) {
  var b = el("button", "big " + cls, text);
  b.type = "button";
  b.addEventListener("click", onClick);
  return b;
}

// ---------- первый экран урока: кто занимается и какая тема ----------

function showLessonStart() {
  lesson = null;
  document.body.classList.remove("solo-run");
  main.innerHTML = "";
  main.appendChild(el("h2", "question", "Учим значки"));

  main.appendChild(el("p", "lesson-label", "Кто занимается?"));
  var who = el("div", "who-pick");
  [
    { id: "helper", icon: "🤝", title: "Вместе с помощником", sub: "логопед или родные рядом и объясняют" },
    { id: "solo", icon: "🙋", title: "Сам", sub: "приложение подсказывает и показывает ответ" }
  ].forEach(function (o) {
    var b = el("button", "who" + (settings.lessonWho === o.id ? " on" : ""));
    b.type = "button";
    b.appendChild(el("span", "who-icon", o.icon)).setAttribute("aria-hidden", "true");
    var t = el("span", "who-text");
    t.appendChild(el("span", "who-title", o.title));
    t.appendChild(el("span", "who-sub", o.sub));
    b.appendChild(t);
    b.addEventListener("click", function () {
      settings.lessonWho = o.id;
      saveSettings();
      showLessonStart();
    });
    who.appendChild(b);
  });
  main.appendChild(who);

  main.appendChild(el("p", "lesson-label", "Выберите тему"));
  var grid = el("div", "grid");
  LESSONS.forEach(function (topic) {
    grid.appendChild(card(topic.icon, topic.name, function () { startLesson(topic); }, "tone-step"));
  });
  main.appendChild(grid);
}

function startLesson(topic) {
  lesson = { topic: topic, who: settings.lessonWho, phase: "learn", i: 0, wrong: 0, lockedUntil: 0 };
  // в варианте «Сам» прячем переключатель режимов и настройки, чтобы случайно не уйти
  document.body.classList.toggle("solo-run", isSolo());
  showLearn();
}

// ---------- шапка урока: выход и счётчик ----------

function lessonHeader(progress) {
  var bar = el("div", "lesson-bar");
  var exit;
  if (isSolo()) {
    // выход в два нажатия, чтобы не выйти случайно
    exit = el("button", "lesson-exit", "✕ Выйти");
    var armed = false, timer = null;
    exit.addEventListener("click", function () {
      if (armed) { clearTimeout(timer); speechSynthesis && speechSynthesis.cancel(); showLessonStart(); return; }
      armed = true;
      exit.textContent = "Нажмите ещё раз";
      exit.classList.add("armed");
      timer = setTimeout(function () { armed = false; exit.textContent = "✕ Выйти"; exit.classList.remove("armed"); }, 3000);
    });
  } else {
    exit = el("button", "lesson-exit", "← Темы");
    exit.addEventListener("click", function () { showLessonStart(); });
  }
  exit.type = "button";
  bar.appendChild(exit);
  bar.appendChild(el("span", "lesson-title", lesson.topic.name));
  bar.appendChild(el("span", "lesson-count", progress));
  return bar;
}

// ---------- шаг 1: смотрим и слушаем ----------

// Картинка появилась — сразу звучит только слово, без инструкций.
// «🔊 Послушать» повторяет. Это единственное место, где приложение говорит само.
function showLearn() {
  var items = lesson.topic.items;
  var it = items[lesson.i];
  main.innerHTML = "";
  main.appendChild(lessonHeader((lesson.i + 1) + " из " + items.length));
  main.appendChild(el("p", "lesson-step", "Смотрим и слушаем"));

  var big = el("div", "learn-card");
  big.appendChild(iconNode(it[0], "learn-icon", it[2]));
  big.appendChild(el("span", "learn-word", it[1]));
  main.appendChild(big);

  var row = el("div", "lesson-buttons");
  row.appendChild(bigButton("🔊 Послушать", "plain", function () { say(it[1]); }));
  var last = lesson.i === items.length - 1;
  row.appendChild(bigButton(last ? "Проверим себя →" : "Дальше →", "speak", function () {
    if (tapsLocked()) return;
    if (last) startQuiz();
    else { lesson.i++; showLearn(); }
  }));
  main.appendChild(row);

  say(it[1]);
  lockTaps();
  window.scrollTo(0, 0);
}

// ---------- шаг 2: найди картинку ----------

function startQuiz() {
  lesson.phase = "quiz";
  lesson.order = shuffle(lesson.topic.items);
  lesson.i = 0;
  showQuiz();
}

function showQuiz() {
  var it = lesson.order[lesson.i];
  lesson.wrong = 0;
  var others = shuffle(lesson.topic.items.filter(function (x) { return x[1] !== it[1] && x[0] !== it[0]; })).slice(0, 2);
  var options = shuffle([it].concat(others));

  main.innerHTML = "";
  main.appendChild(lessonHeader((lesson.i + 1) + " из " + lesson.order.length));
  main.appendChild(el("p", "lesson-step", "Найдите картинку"));

  // кнопка со словом: нажал — слово звучит
  var ask = el("button", "quiz-word");
  ask.type = "button";
  ask.appendChild(el("span", null, "🔊 "));
  ask.appendChild(el("span", null, it[1]));
  ask.addEventListener("click", function () { say(it[1]); });
  main.appendChild(ask);
  // подсказки в варианте «Сам» — текстом, без голоса
  var note = el("p", "lesson-note", "");
  lesson.note = note;

  var grid = el("div", "quiz-grid");
  var cards = [];
  options.forEach(function (opt) {
    var b = el("button", "quiz-card");
    b.type = "button";
    b.setAttribute("aria-label", "картинка");
    b.appendChild(iconNode(opt[0], "quiz-icon", opt[2]));
    b.addEventListener("click", function () {
      if (tapsLocked() || lesson.answered) return;
      if (opt === it) answerRight(b, it);
      else answerWrong(b, it, cards);
    });
    cards.push({ btn: b, item: opt });
    grid.appendChild(b);
  });
  main.appendChild(grid);
  main.appendChild(note);

  if (!isSolo()) {
    var row = el("div", "lesson-buttons");
    row.appendChild(bigButton("💡 Подсказка", "plain", function () { showAnswer(cards, it, false); }));
    row.appendChild(bigButton("Пропустить →", "plain", function () { if (!tapsLocked()) nextQuiz(); }));
    main.appendChild(row);
  }

  lesson.answered = false;
  lockTaps();
  window.scrollTo(0, 0);
}

function answerRight(btn, it) {
  lesson.answered = true;
  btn.classList.add("right");
  if (lesson.note) lesson.note.textContent = "👍 Верно!";
  // переходим дальше, только если человек за это время не вышел и не пропустил вопрос
  var same = lesson, index = lesson.i;
  setTimeout(function () {
    if (lesson === same && lesson.phase === "quiz" && lesson.i === index) nextQuiz();
  }, 1300);
}

function answerWrong(btn, it, cards) {
  btn.classList.remove("shake");
  void btn.offsetWidth;
  btn.classList.add("shake");
  lesson.wrong++;
  // «Сам»: после двух ошибок приложение показывает верную картинку
  if (isSolo()) {
    if (lesson.wrong >= 2) showAnswer(cards, it);
    else lesson.note.textContent = "Попробуйте ещё";
  }
}

function showAnswer(cards, it) {
  cards.forEach(function (c) { if (c.item === it) c.btn.classList.add("hint"); });
  if (lesson.note) lesson.note.textContent = "Вот эта картинка — нажмите на неё";
}

function nextQuiz() {
  if (!lesson) return;
  lesson.i++;
  if (lesson.i < lesson.order.length) showQuiz();
  else showLessonDone();
}

// ---------- конец урока ----------

function showLessonDone() {
  var topic = lesson.topic;
  main.innerHTML = "";
  var box = el("div", "done");
  box.appendChild(el("p", "done-mark", "🌟"));
  box.appendChild(el("h2", "question", "Вы хорошо поработали!"));
  box.appendChild(el("p", "done-hint", "Тема «" + topic.name + "» пройдена."));
  box.appendChild(bigButton("Ещё раз", "speak", function () { startLesson(topic); }));
  box.appendChild(bigButton("Другая тема", "plain", showLessonStart));
  main.appendChild(box);
  document.body.classList.remove("solo-run");
  window.scrollTo(0, 0);
}
