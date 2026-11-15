// Скажу за вас — сборка предложения из картинок для взрослых с афазией.
// Два режима: «По шагам» (приложение ведёт) и «Кубики» (слова в любом порядке).

// ---------- режим «По шагам» ----------
// У каждого варианта: icon — картинка, word — что ляжет в предложение,
// next — следующий вопрос. Нет next — предложение готово.
var STEPS = {
  start: { q: "Что вы хотите сказать?", items: [
    { icon: "🙋", word: "я хочу", next: "want" },
    { icon: "🙅", word: "я не хочу", next: "dont" },
    { icon: "🤲", word: "дайте", next: "give" },
    { icon: "🆘", word: "помогите", next: "help" },
    { icon: "😟", word: "мне", next: "feel" },
    { icon: "🤕", word: "у меня болит", next: "pain" }
  ]},
  want: { q: "Что?", items: [
    { icon: "🥤", word: "пить", next: "drink" },
    { icon: "🍲", word: "есть", next: "eat" },
    { icon: "😴", word: "спать" },
    { icon: "🛏️", word: "лечь" },
    { icon: "🚽", word: "в туалет" },
    { icon: "🌳", word: "гулять" },
    { icon: "📺", word: "смотреть", next: "watch" },
    { icon: "📞", word: "позвонить", next: "call" },
    { icon: "🚿", word: "помыться" },
    { icon: "👕", word: "переодеться" }
  ]},
  // после «не хочу» глаголы в другой форме: «не хочу ложиться», а не «не хочу лечь»
  dont: { q: "Что?", items: [
    { icon: "🥤", word: "пить", next: "drink" },
    { icon: "🍲", word: "есть", next: "eat" },
    { icon: "😴", word: "спать" },
    { icon: "🛏️", word: "ложиться" },
    { icon: "🧍", word: "вставать" },
    { icon: "🌳", word: "гулять" },
    { icon: "📺", word: "смотреть", next: "watch" },
    { icon: "🚿", word: "мыться" },
    { icon: "👕", word: "переодеваться" },
    { icon: "💊", word: "пить лекарство" }
  ]},
  drink: { q: "Что пить?", items: [
    { icon: "🫖", word: "чай" },
    { icon: "💧", word: "воду" },
    { icon: "🧃", word: "сок" },
    { icon: "🥛", word: "молоко" },
    { icon: "☕", word: "кофе" },
    { icon: "🍒", word: "компот" }
  ]},
  eat: { q: "Что есть?", items: [
    { icon: "🍲", word: "суп" },
    { icon: "🥣", word: "кашу" },
    { icon: "🍞", word: "хлеб" },
    { icon: "🍎", word: "фрукты" },
    { icon: "🍪", word: "печенье" },
    { icon: "🥔", word: "картошку" }
  ]},
  watch: { q: "Что смотреть?", items: [
    { icon: "📺", word: "телевизор" },
    { icon: "📰", word: "новости" },
    { icon: "🎬", word: "фильм" },
    { icon: "⚽", word: "футбол" },
    { icon: "🖼️", word: "фотографии" }
  ]},
  call: { q: "Кому позвонить?", items: [
    { icon: "👧", word: "дочери", who: "daughter" },
    { icon: "👦", word: "сыну", who: "son" },
    { icon: "👩", word: "жене", who: "wife" },
    { icon: "👨", word: "мужу", who: "husband" },
    { icon: "🧒", word: "внукам", who: "grandkids" },
    { icon: "🤝", word: "другу", who: "friend" }
  ]},
  give: { q: "Что дать?", items: [
    { icon: "💧", word: "воду" },
    { icon: "📱", word: "телефон" },
    { icon: "👓", word: "очки" },
    { icon: "🎛️", word: "пульт" },
    { icon: "🧣", word: "плед" },
    { icon: "💊", word: "лекарство" },
    { icon: "🧥", word: "кофту" },
    { icon: "🦯", word: "трость" }
  ]},
  help: { q: "Что сделать?", items: [
    { icon: "🧍", word: "встать" },
    { icon: "🪑", word: "сесть" },
    { icon: "🛏️", word: "лечь" },
    { icon: "👕", word: "одеться" },
    { icon: "🧼", word: "умыться" },
    { icon: "🚽", word: "дойти до туалета" }
  ]},
  feel: { q: "Как вам?", items: [
    { icon: "🥶", word: "холодно" },
    { icon: "🥵", word: "жарко" },
    { icon: "😣", word: "больно" },
    { icon: "🤒", word: "плохо" },
    { icon: "🙂", word: "хорошо" },
    { icon: "😐", word: "скучно" },
    { icon: "😢", word: "грустно" },
    { icon: "😨", word: "страшно" }
  ]},
  pain: { q: "Что болит?", items: [
    { icon: "🧠", word: "голова" },
    { icon: "🫃", word: "живот" },
    { icon: "img:icons/spina.svg", word: "спина" },
    { icon: "💪", word: "рука" },
    { icon: "🦵", word: "нога" },
    { icon: "🗣️", word: "горло" },
    { icon: "🫀", word: "сердце" }
  ]}
};

// ---------- режим «Кубики» ----------
var GROUPS = [
  { name: "Кто", tone: "who", items: [
    ["🙋", "я"], ["👉", "ты"], ["👫", "мы"], ["👧", "дочь", "daughter"], ["👦", "сын", "son"],
    ["👩", "жена", "wife"], ["👨", "муж", "husband"], ["🧒", "внуки", "grandkids"], ["🤝", "друг", "friend"]
  ]},
  { name: "Действия", tone: "act", items: [
    ["🙋", "хочу"], ["🙅", "не хочу"], ["🤲", "дай"], ["🆘", "помоги"], ["🥤", "пить"],
    ["🍲", "есть"], ["😴", "спать"], ["🚶", "идти"], ["📺", "смотреть"], ["📞", "позвонить"],
    ["🧍", "встать"], ["🪑", "сесть"]
  ]},
  { name: "Предметы", tone: "obj", items: [
    ["💧", "воду"], ["🫖", "чай"], ["🍲", "суп"], ["🥣", "кашу"], ["📱", "телефон"],
    ["👓", "очки"], ["🎛️", "пульт"], ["🧣", "плед"], ["💊", "лекарство"], ["📺", "телевизор"]
  ]},
  { name: "Где и когда", tone: "place", items: [
    ["🏠", "домой"], ["🌳", "на улицу"], ["🚽", "в туалет"], ["🛏️", "в кровать"],
    ["⏰", "сейчас"], ["⏳", "потом"], ["🌅", "утром"], ["🌙", "вечером"]
  ]},
  { name: "Как", tone: "feel", items: [
    ["🥶", "холодно"], ["🥵", "жарко"], ["😣", "больно"], ["🤒", "плохо"],
    ["🙂", "хорошо"], ["➕", "ещё"], ["✋", "хватит"], ["🙏", "пожалуйста"]
  ]}
];

// ---------- фото близких ----------
// Родные выбирают фото в настройках, и оно встаёт вместо картинки.
// Фото хранятся только в этом браузере на этом устройстве и никуда не отправляются.
var PEOPLE = [
  { who: "wife", name: "Жена", icon: "👩" },
  { who: "husband", name: "Муж", icon: "👨" },
  { who: "daughter", name: "Дочь", icon: "👧" },
  { who: "son", name: "Сын", icon: "👦" },
  { who: "grandkids", name: "Внуки", icon: "🧒" },
  { who: "friend", name: "Друг", icon: "🤝" }
];
var photos = {};

function loadPhotos() {
  try { photos = JSON.parse(localStorage.getItem("skazhu-photos") || "{}") || {}; } catch (e) { photos = {}; }
}
function savePhotos() {
  try { localStorage.setItem("skazhu-photos", JSON.stringify(photos)); return true; }
  catch (e) { return false; }
}

// Фото уменьшается до квадрата 320×320 (середина кадра), чтобы занимало мало места
function photoFromFile(file) {
  return new Promise(function (resolve, reject) {
    var url = URL.createObjectURL(file);
    var img = new Image();
    img.onload = function () {
      var side = Math.min(img.naturalWidth, img.naturalHeight);
      var canvas = document.createElement("canvas");
      canvas.width = canvas.height = 320;
      canvas.getContext("2d").drawImage(img,
        (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, 320, 320);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = function () { URL.revokeObjectURL(url); reject(new Error("не картинка")); };
    img.src = url;
  });
}

// ---------- настройки ----------
var settings = { mode: "steps", rate: "slow", size: "big", lessonWho: "helper" };

function loadSettings() {
  try {
    var s = JSON.parse(localStorage.getItem("skazhu-settings") || "{}");
    if (s.mode === "steps" || s.mode === "blocks" || s.mode === "lesson") settings.mode = s.mode;
    if (s.lessonWho === "helper" || s.lessonWho === "solo") settings.lessonWho = s.lessonWho;
    if (s.rate === "slow" || s.rate === "normal") settings.rate = s.rate;
    if (s.size === "big" || s.size === "huge") settings.size = s.size;
  } catch (e) { /* без памяти браузера — настройки по умолчанию */ }
}
function saveSettings() {
  try { localStorage.setItem("skazhu-settings", JSON.stringify(settings)); } catch (e) { }
}
function applySize() { document.body.classList.toggle("huge", settings.size === "huge"); }

// ---------- голос ----------
var voice = null;
function pickVoice() {
  var voices = speechSynthesis.getVoices();
  voice = voices.filter(function (v) { return /^ru/i.test(v.lang); })[0] || null;
  // голоса иногда приходят не сразу: предупреждаем, только когда список уже есть
  document.getElementById("novoice").hidden = !!voice || voices.length === 0;
}
// after = true — сказать после того, что уже звучит (не перебивая)
function say(text, after) {
  if (!text || !("speechSynthesis" in window)) return;
  if (!after) speechSynthesis.cancel();
  var u = new SpeechSynthesisUtterance(text);
  u.lang = "ru-RU";
  if (voice) u.voice = voice;
  u.rate = settings.rate === "slow" ? 0.75 : 1;
  speechSynthesis.speak(u);
}

// ---------- предложение ----------
var sentence = []; // [{ icon, word }]
var wordsEl = document.getElementById("words");

function sentenceText() {
  var t = sentence.map(function (w) { return w.word; }).join(" ");
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : "";
}
function renderSentence() {
  wordsEl.innerHTML = "";
  sentence.forEach(function (w) {
    var chip = el("span", "chip");
    chip.appendChild(iconNode(w.icon, "chip-icon", w.who));
    chip.appendChild(el("span", null, w.word));
    wordsEl.appendChild(chip);
  });
  wordsEl.classList.remove("flash");
  void wordsEl.offsetWidth;
  if (sentence.length) wordsEl.classList.add("flash");
}
function addWord(icon, word, who) { sentence.push({ icon: icon, word: word, who: who }); renderSentence(); }

// ---------- общие кусочки ----------
var main = document.getElementById("main");

function el(tag, cls, text) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}
// Картинка — фото близкого (если родные его выбрали), эмодзи или свой рисунок "img:путь.svg"
function iconNode(icon, cls, who) {
  var span = el("span", cls);
  span.setAttribute("aria-hidden", "true");
  if (who && photos[who]) {
    var photo = el("img", "photo");
    photo.src = photos[who];
    photo.alt = "";
    span.appendChild(photo);
  } else if (icon.indexOf("img:") === 0) {
    var img = el("img", "pic");
    img.src = icon.slice(4);
    img.alt = "";
    span.appendChild(img);
  } else {
    span.textContent = icon;
  }
  return span;
}

function card(icon, label, onClick, cls, who) {
  var b = el("button", "card" + (cls ? " " + cls : ""));
  b.type = "button";
  b.appendChild(iconNode(icon, "icon", who));
  b.appendChild(el("span", "label", label));
  b.addEventListener("click", onClick);
  return b;
}

// ---------- «По шагам» ----------
var path = [];       // пройденные вопросы
var finished = false;

function stepStart() { path = ["start"]; finished = false; showStep(); }

function showStep() {
  main.innerHTML = "";
  var step = STEPS[path[path.length - 1]];
  main.appendChild(el("h2", "question", step.q));
  var grid = el("div", "grid");
  step.items.forEach(function (it) {
    grid.appendChild(card(it.icon, it.word, function () {
      addWord(it.icon, it.word, it.who);
      if (it.next) { path.push(it.next); showStep(); }
      else showDone();
    }, "tone-step", it.who));
  });
  main.appendChild(grid);
}

function showDone() {
  finished = true;
  // само ничего не говорим: звук только по кнопке «Сказать»
  main.innerHTML = "";
  var box = el("div", "done");
  box.appendChild(el("p", "done-mark", "✅"));
  box.appendChild(el("h2", "question", "Готово!"));
  box.appendChild(el("p", "done-hint", "Нажмите «Сказать» или покажите родным."));
  var again = el("button", "big speak", "🔊 Сказать");
  again.type = "button";
  again.addEventListener("click", function () { say(sentenceText()); });
  var fresh = el("button", "big plain", "Новое предложение");
  fresh.type = "button";
  fresh.addEventListener("click", function () { sentence = []; renderSentence(); stepStart(); });
  box.appendChild(again);
  box.appendChild(fresh);
  main.appendChild(box);
}

// «Убрать» возвращает на тот вопрос, где было выбрано убранное слово
function stepBack() {
  if (finished) finished = false;
  else if (path.length > 1) path.pop();
  showStep();
}

// ---------- «Кубики» ----------
var groupIndex = 0;

function showBlocks() {
  main.innerHTML = "";
  var tabs = el("div", "groups");
  GROUPS.forEach(function (g, i) {
    var b = el("button", "group tone-" + g.tone + (i === groupIndex ? " on" : ""), g.name);
    b.type = "button";
    b.addEventListener("click", function () { groupIndex = i; showBlocks(); });
    tabs.appendChild(b);
  });
  main.appendChild(tabs);
  var g = GROUPS[groupIndex];
  var grid = el("div", "grid");
  g.items.forEach(function (it) {
    grid.appendChild(card(it[0], it[1], function () { addWord(it[0], it[1], it[2]); }, "tone-" + g.tone, it[2]));
  });
  main.appendChild(grid);
}

// ---------- выбор задания и переключение режимов ----------
var MODES = [
  { id: "lesson", icon: "🎓", title: "Учим", sub: "урок: что значит каждый значок" },
  { id: "steps", icon: "👣", title: "По шагам", sub: "приложение ведёт, вопрос за вопросом" },
  { id: "blocks", icon: "🧩", title: "Кубики", sub: "слова в любом порядке" }
];

var titleEl = document.getElementById("mode-title");

function resetScreen() {
  sentence = [];
  renderSentence();
  document.body.classList.remove("solo-run");
  if (typeof lesson !== "undefined") lesson = null; // урок закрывается при смене задания
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  window.scrollTo(0, 0);
}

// Отдельный экран при открытии: три большие кнопки. После выбора остаётся только задание.
function showChooser() {
  resetScreen();
  document.body.classList.add("choosing");
  document.body.classList.remove("in-lesson");
  titleEl.textContent = "Выберите задание";
  main.innerHTML = "";
  var list = el("div", "chooser");
  MODES.forEach(function (m) {
    var b = el("button", "choice");
    b.type = "button";
    b.appendChild(el("span", "choice-icon", m.icon)).setAttribute("aria-hidden", "true");
    var t = el("span", "choice-text");
    t.appendChild(el("span", "choice-title", m.title));
    t.appendChild(el("span", "choice-sub", m.sub));
    b.appendChild(t);
    b.addEventListener("click", function () { setMode(m.id); });
    list.appendChild(b);
  });
  main.appendChild(list);
}

function setMode(mode) {
  settings.mode = mode;
  saveSettings();
  resetScreen();
  document.body.classList.remove("choosing");
  // в уроке не нужны «Да / Нет» и полоска предложения
  document.body.classList.toggle("in-lesson", mode === "lesson");
  titleEl.textContent = MODES.filter(function (m) { return m.id === mode; })[0].title;
  if (mode === "steps") stepStart();
  else if (mode === "blocks") { groupIndex = 0; showBlocks(); }
  else showLessonStart();
}

// «← Назад» в шапке — к выбору задания
document.getElementById("home").addEventListener("click", showChooser);

// ---------- кнопки над экраном ----------
document.querySelectorAll(".answer").forEach(function (b) {
  b.addEventListener("click", function () { say(b.getAttribute("data-say")); });
});
document.getElementById("speak").addEventListener("click", function () { say(sentenceText()); });
document.getElementById("clear").addEventListener("click", function () {
  sentence = [];
  renderSentence();
  if (settings.mode === "steps") stepStart();
});
document.getElementById("undo").addEventListener("click", function () {
  if (!sentence.length) return;
  sentence.pop();
  renderSentence();
  if (settings.mode === "steps") stepBack();
});

// ---------- окно настроек ----------
var dialog = document.getElementById("settings");
document.getElementById("gear").addEventListener("click", function () {
  ["rate", "size"].forEach(function (name) {
    var input = dialog.querySelector('input[name="' + name + '"][value="' + settings[name] + '"]');
    if (input) input.checked = true;
  });
  dialog.showModal();
});
dialog.addEventListener("change", function (e) {
  if (!e.target.name) return;
  settings[e.target.name] = e.target.value;
  saveSettings();
  applySize();
});

// ---------- фото близких в настройках ----------
var peopleEl = document.getElementById("people");

// после смены фото перерисовываем то, что сейчас на экране
function refreshScreen() {
  renderSentence();
  // на выборе задания и в уроке перерисовывать нечего (урок обновится на следующей карточке)
  if (document.body.classList.contains("choosing") || settings.mode === "lesson") return;
  if (settings.mode === "blocks") showBlocks();
  else if (!finished) showStep();
}

function setPhoto(who, file) {
  return photoFromFile(file).then(function (data) {
    var old = photos[who];
    photos[who] = data;
    if (!savePhotos()) {
      if (old) photos[who] = old; else delete photos[who];
      alert("Не хватило места в памяти браузера. Попробуйте убрать другое фото.");
    }
    renderPeople();
    refreshScreen();
  }, function () {
    alert("Это не похоже на фотографию. Выберите другой файл.");
  });
}

function renderPeople() {
  peopleEl.innerHTML = "";
  PEOPLE.forEach(function (p) {
    var row = el("div", "person");
    row.appendChild(iconNode(p.icon, "person-pic", p.who));
    row.appendChild(el("span", "person-name", p.name));

    var pick = el("label", "person-btn", photos[p.who] ? "Другое фото" : "Выбрать фото");
    var input = el("input");
    input.type = "file";
    input.accept = "image/*";
    input.hidden = true;
    input.addEventListener("change", function () {
      if (input.files && input.files[0]) setPhoto(p.who, input.files[0]);
    });
    pick.appendChild(input);
    row.appendChild(pick);

    if (photos[p.who]) {
      var remove = el("button", "person-btn remove", "Убрать");
      remove.type = "button";
      remove.addEventListener("click", function () {
        delete photos[p.who];
        savePhotos();
        renderPeople();
        refreshScreen();
      });
      row.appendChild(remove);
    }
    peopleEl.appendChild(row);
  });
}

// ---------- запуск ----------
loadPhotos();
renderPeople();
loadSettings();
applySize();
// при открытии — отдельный экран выбора задания
showChooser();

if ("speechSynthesis" in window) {
  pickVoice();
  if (speechSynthesis.addEventListener) speechSynthesis.addEventListener("voiceschanged", pickVoice);
} else {
  document.getElementById("novoice").hidden = false;
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(function () { });
}
