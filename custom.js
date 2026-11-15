// «Свои карточки»: родные добавляют в категорию своё фото с подписью.
// Карточка появляется во всех трёх заданиях, подпись звучит голосом.
// Хранятся только в браузере на этом телефоне (localStorage) и никуда не отправляются.
// Берёт из app.js: el, photoFromFile, refreshScreen, PEOPLE-логику согласования.

// step — вопросы «По шагам», group — группа «Кубиков», lesson — тема урока.
// hint — подсказка, в какой форме писать подпись (приложение читает её как есть).
var CUSTOM_CATS = [
  { id: "drink",  name: "Питьё",       steps: ["drink"],        group: "Предметы",    lesson: "Питьё",
    hint: "Как во фразе «Я хочу пить …»", example: "кисель" },
  { id: "eat",    name: "Еда",         steps: ["eat"],          group: "Предметы",    lesson: "Еда",
    hint: "Как во фразе «Я хочу есть …»", example: "кашу" },
  { id: "do",     name: "Дела",        steps: ["want", "dont"], group: "Действия",    lesson: "Дела",
    hint: "Как во фразе «Я хочу …»", example: "рисовать" },
  { id: "help",   name: "Помощь",      steps: ["help"],         group: "Действия",    lesson: "Помощь",
    hint: "Как во фразе «Помогите …»", example: "причесаться" },
  { id: "things", name: "Вещи",        steps: ["give"],         group: "Предметы",    lesson: "Вещи",
    hint: "Как во фразе «Дайте …»", example: "расчёску" },
  { id: "body",   name: "Тело",        steps: ["pain"],         group: null,          lesson: "Тело",
    hint: "Как во фразе «У меня болит …»", example: "колено" },
  { id: "feel",   name: "Чувства",     steps: ["feel"],         group: "Как",         lesson: "Чувства",
    hint: "Как во фразе «Мне …»", example: "тревожно" },
  { id: "where",  name: "Где и когда", steps: [],               group: "Где и когда", lesson: "Где и когда",
    hint: "Как во фразе «Я хочу идти …»", example: "в сад" },
  { id: "people", name: "Люди",        steps: ["call"],         group: "Кто",         lesson: "Люди",
    hint: "Имя или кто это", example: "Галя",
    dat: { label: "Кому позвонить", hint: "Как во фразе «Я хочу позвонить …»", example: "Гале" } }
];

var customs = []; // [{ id, cat, word, dat, photo }]

function loadCustoms() {
  try { customs = JSON.parse(localStorage.getItem("skazhu-custom") || "[]") || []; } catch (e) { customs = []; }
}
function saveCustoms() {
  try { localStorage.setItem("skazhu-custom", JSON.stringify(customs)); return true; }
  catch (e) { return false; }
}

function catById(id) { return CUSTOM_CATS.filter(function (c) { return c.id === id; })[0]; }
function cardsOf(catIds) { return customs.filter(function (c) { return catIds.indexOf(c.cat) >= 0; }); }

// ---------- что добавить в задания ----------

// «По шагам»: свои карточки в конце вопроса, на них фраза заканчивается
function customForStep(stepKey) {
  var ids = CUSTOM_CATS.filter(function (c) { return c.steps.indexOf(stepKey) >= 0; })
    .map(function (c) { return c.id; });
  return cardsOf(ids).map(function (c) {
    return { icon: c.photo, word: c.cat === "people" ? (c.dat || c.word) : c.word };
  });
}

// «Кубики»: [картинка, слово]
function customForGroup(groupName) {
  var ids = CUSTOM_CATS.filter(function (c) { return c.group === groupName; })
    .map(function (c) { return c.id; });
  return cardsOf(ids).map(function (c) { return [c.photo, c.word]; });
}

// урок: [картинка, слово]
function customForLesson(topicName) {
  var ids = CUSTOM_CATS.filter(function (c) { return c.lesson === topicName; })
    .map(function (c) { return c.id; });
  return cardsOf(ids).map(function (c) { return [c.photo, c.word]; });
}

// согласование в «Кубиках»: «Галя хочу пить» → «Галя хочет пить», «Галя холодно» → «Гале холодно»
function customPerson(word) {
  var c = customs.filter(function (x) { return x.cat === "people" && x.word === word; })[0];
  return c ? { want: "хочет", dat: c.dat || c.word, callable: true } : null;
}

// ---------- раздел «Свои карточки» в настройках ----------

var customEl = document.getElementById("customs");
var customState = { cat: "drink", editing: null, photo: null };

function renderCustoms() {
  var st = customState;
  var cat = catById(st.cat);
  customEl.innerHTML = "";

  // выбор категории
  var pick = el("label", "custom-field");
  pick.appendChild(el("span", "custom-label", "Категория"));
  var select = el("select", "custom-select");
  CUSTOM_CATS.forEach(function (c) {
    var o = el("option", null, c.name + (cardsOf([c.id]).length ? " (" + cardsOf([c.id]).length + ")" : ""));
    o.value = c.id;
    if (c.id === st.cat) o.selected = true;
    select.appendChild(o);
  });
  select.addEventListener("change", function () {
    customState = { cat: select.value, editing: null, photo: null };
    renderCustoms();
  });
  pick.appendChild(select);
  customEl.appendChild(pick);

  // карточки этой категории
  var list = cardsOf([st.cat]);
  if (!list.length) customEl.appendChild(el("p", "hint", "В этой категории своих карточек пока нет."));
  list.forEach(function (c) {
    var row = el("div", "person custom-row");
    var thumb = el("img", "custom-thumb");
    thumb.src = c.photo;
    thumb.alt = "";
    row.appendChild(thumb);
    row.appendChild(el("span", "person-name", c.word + (c.cat === "people" && c.dat ? " · " + c.dat : "")));
    var edit = el("button", "person-btn", "Изменить");
    edit.type = "button";
    edit.addEventListener("click", function () {
      customState = { cat: st.cat, editing: c.id, photo: c.photo };
      renderCustoms();
    });
    var remove = el("button", "person-btn remove", "Убрать");
    remove.type = "button";
    remove.addEventListener("click", function () {
      if (!confirm("Убрать карточку «" + c.word + "»?")) return;
      customs = customs.filter(function (x) { return x.id !== c.id; });
      saveCustoms();
      customState = { cat: st.cat, editing: null, photo: null };
      renderCustoms();
      refreshScreen();
    });
    row.appendChild(edit);
    row.appendChild(remove);
    customEl.appendChild(row);
  });

  // форма: новая карточка или изменение
  var editing = st.editing ? customs.filter(function (x) { return x.id === st.editing; })[0] : null;
  var form = el("div", "custom-form");
  form.appendChild(el("p", "custom-title", editing ? "Изменить карточку" : "Новая карточка"));

  var photoRow = el("div", "custom-photo-row");
  var preview = el("div", "custom-preview");
  if (st.photo) {
    var img = el("img", "custom-thumb big");
    img.src = st.photo;
    img.alt = "";
    preview.appendChild(img);
  } else {
    preview.appendChild(el("span", "custom-nophoto", "📷"));
  }
  photoRow.appendChild(preview);
  var choose = el("label", "person-btn", st.photo ? "Другое фото" : "Выбрать фото");
  var file = el("input");
  file.type = "file";
  file.accept = "image/*";
  file.hidden = true;
  file.addEventListener("change", function () {
    if (!file.files || !file.files[0]) return;
    var keepWord = word.value, keepDat = dat ? dat.value : "";
    photoFromFile(file.files[0]).then(function (data) {
      customState.photo = data;
      renderCustoms();
      document.getElementById("custom-word").value = keepWord;
      if (dat) document.getElementById("custom-dat").value = keepDat;
    }, function () { showError("Это не похоже на фотографию. Выберите другой файл."); });
  });
  choose.appendChild(file);
  photoRow.appendChild(choose);
  form.appendChild(photoRow);

  var word = textField(form, "custom-word", "Подпись", cat.hint + ", например: " + cat.example,
    cat.example, editing ? editing.word : "");
  var dat = null;
  if (cat.dat) {
    dat = textField(form, "custom-dat", cat.dat.label, cat.dat.hint + ", например: " + cat.dat.example,
      cat.dat.example, editing ? (editing.dat || "") : "");
  }

  var error = el("p", "custom-error", "");
  error.id = "custom-error";
  form.appendChild(error);
  function showError(text) { error.textContent = text; }

  var buttons = el("div", "custom-buttons");
  var save = el("button", "person-btn", "Сохранить");
  save.type = "button";
  save.addEventListener("click", function () {
    var w = word.value.trim();
    var d = dat ? dat.value.trim() : "";
    if (!customState.photo) { showError("Выберите фото."); return; }
    if (!w) { showError("Напишите подпись — её приложение будет говорить."); word.focus(); return; }
    if (dat && !d) { showError("Напишите, как сказать «позвонить кому»."); dat.focus(); return; }
    var before = customs.slice();
    var card = { id: editing ? editing.id : "c" + Date.now(), cat: st.cat, word: w, dat: d, photo: customState.photo };
    if (editing) customs = customs.map(function (x) { return x.id === editing.id ? card : x; });
    else customs.push(card);
    if (!saveCustoms()) {
      customs = before;
      showError("Не хватило места в памяти телефона. Уберите какую-нибудь карточку.");
      return;
    }
    customState = { cat: st.cat, editing: null, photo: null };
    renderCustoms();
    refreshScreen();
    var done = document.getElementById("custom-error");
    if (done) { done.textContent = "Сохранено ✓"; done.classList.add("ok"); }
  });
  buttons.appendChild(save);
  if (editing || st.photo) {
    var cancel = el("button", "person-btn remove", "Отмена");
    cancel.type = "button";
    cancel.addEventListener("click", function () {
      customState = { cat: st.cat, editing: null, photo: null };
      renderCustoms();
    });
    buttons.appendChild(cancel);
  }
  form.appendChild(buttons);
  customEl.appendChild(form);

  // убираем ошибку, как только человек начал исправлять
  [word, dat].forEach(function (f) {
    if (f) f.addEventListener("input", function () { error.textContent = ""; error.classList.remove("ok"); });
  });
}

function textField(parent, id, label, hint, placeholder, value) {
  var wrap = el("label", "custom-field");
  wrap.appendChild(el("span", "custom-label", label));
  wrap.appendChild(el("span", "custom-hint", hint));
  var input = el("input", "custom-input");
  input.type = "text";
  input.id = id;
  input.placeholder = placeholder;
  input.value = value;
  input.autocomplete = "off";
  // Enter не должен закрывать окно настроек
  input.addEventListener("keydown", function (e) { if (e.key === "Enter") e.preventDefault(); });
  wrap.appendChild(input);
  parent.appendChild(wrap);
  return input;
}

loadCustoms();
renderCustoms();
