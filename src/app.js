const NOTES = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
const OPEN_STRINGS = ["E", "A", "D", "G", "B", "E"];
const DEGREE_COLORS = {
  R: "#e85d4f", "b2": "#8d6adf", 2: "#4b9fe1", "b3": "#46a77c", 3: "#46a77c",
  4: "#d89a00", "b5": "#7a6ee6", 5: "#7a6ee6", "#5": "#b35fb7",
  6: "#4b9fe1", bb7: "#7b5b35", b7: "#7b5b35", 7: "#7b5b35", 9: "#4b9fe1"
};
const DEGREE_LABELS = {
  R: "ルート", "b2": "短2度", 2: "長2度", "b3": "短3度", 3: "長3度",
  4: "完全4度", "b5": "減5度", 5: "完全5度", "#5": "増5度",
  6: "長6度", bb7: "減7度", b7: "短7度", 7: "長7度", 9: "9度"
};
const FINGER_NAMES = ["", "人", "中", "薬", "小"];
const TYPE_ORDER = ["maj", "min", "7", "maj7", "m7", "mMaj7", "m7b5", "dim", "dim7", "aug", "augMaj7", "6", "m6", "9", "m9", "sus2", "sus4", "7sus4", "add9"];
// 種類セレクタは塊で見せて走査負荷を下げる（小見出し + チップ行）
const TYPE_GROUPS = [
  { label: "よく使う", types: ["min", "7", "m7", "maj7"] },
  { label: "セブンス・6th", types: ["m7b5", "mMaj7", "dim7", "6", "m6", "7sus4"] },
  { label: "テンション", types: ["9", "m9", "add9"] },
  { label: "sus・aug・dim", types: ["sus2", "sus4", "dim", "aug", "augMaj7"] }
];
const RECENT_KEY = "chordAtlasPublicRecent";
const STOCK_KEY = "chordAtlasPublicStock";

const TYPES = {
  maj: { label: "メジャー", suffix: "", formula: ["R", "3", "5"], semis: [0, 4, 7], family: "明るく安定" },
  min: { label: "マイナー", suffix: "m", formula: ["R", "b3", "5"], semis: [0, 3, 7], family: "暗め・切なさ" },
  7: { label: "セブンス", suffix: "7", formula: ["R", "3", "5", "b7"], semis: [0, 4, 7, 10], family: "ブルース感・解決したい響き" },
  maj7: { label: "メジャーセブンス", suffix: "M7", formula: ["R", "3", "5", "7"], semis: [0, 4, 7, 11], family: "透明感・浮遊感" },
  m7: { label: "マイナーセブンス", suffix: "m7", formula: ["R", "b3", "5", "b7"], semis: [0, 3, 7, 10], family: "柔らかいマイナー" },
  mMaj7: { label: "マイナーメジャーセブンス", suffix: "mM7", formula: ["R", "b3", "5", "7"], semis: [0, 3, 7, 11], family: "不穏な主和音" },
  m7b5: { label: "マイナーセブンフラットファイブ", suffix: "m7♭5", formula: ["R", "b3", "b5", "b7"], semis: [0, 3, 6, 10], family: "不安定・次へ行きたい" },
  dim: { label: "ディミニッシュ", suffix: "dim", formula: ["R", "b3", "b5"], semis: [0, 3, 6], family: "強い緊張" },
  dim7: { label: "ディミニッシュセブンス", suffix: "dim7", formula: ["R", "b3", "b5", "bb7"], semis: [0, 3, 6, 9], family: "強い緊張・通過感" },
  aug: { label: "オーギュメント", suffix: "aug", formula: ["R", "3", "#5"], semis: [0, 4, 8], family: "浮いた増5度" },
  augMaj7: { label: "オーギュメントメジャーセブンス", suffix: "augM7", formula: ["R", "3", "#5", "7"], semis: [0, 4, 8, 11], family: "浮いた増5度・強い色彩" },
  6: { label: "シックス", suffix: "6", formula: ["R", "3", "5", "6"], semis: [0, 4, 7, 9], family: "明るい余韻" },
  m6: { label: "マイナーシックス", suffix: "m6", formula: ["R", "b3", "5", "6"], semis: [0, 3, 7, 9], family: "渋いマイナー" },
  9: { label: "ナインス", suffix: "9", formula: ["R", "3", "5", "b7", "9"], semis: [0, 4, 7, 10, 14], family: "広がるセブンス" },
  m9: { label: "マイナーナインス", suffix: "m9", formula: ["R", "b3", "5", "b7", "9"], semis: [0, 3, 7, 10, 14], family: "広がるマイナー" },
  sus2: { label: "サスツー", suffix: "sus2", formula: ["R", "2", "5"], semis: [0, 2, 7], family: "明るい保留" },
  sus4: { label: "サスフォー", suffix: "sus4", formula: ["R", "4", "5"], semis: [0, 5, 7], family: "保留・開放感" },
  "7sus4": { label: "セブンサスフォー", suffix: "7sus4", formula: ["R", "4", "5", "b7"], semis: [0, 5, 7, 10], family: "解決前の保留" },
  add9: { label: "アドナインス", suffix: "add9", formula: ["R", "3", "5", "9"], semis: [0, 4, 7, 14], family: "明るい広がり" }
};

const OPEN_SHAPES = {
  "C:maj": [[-1, 3, 2, 0, 1, 0], [0, 3, 2, 0, 1, 0], "開放C"],
  "D:maj": [[-1, -1, 0, 2, 3, 2], [0, 0, 0, 1, 3, 2], "開放D"],
  "E:maj": [[0, 2, 2, 1, 0, 0], [0, 2, 3, 1, 0, 0], "開放E"],
  "G:maj": [[3, 2, 0, 0, 0, 3], [2, 1, 0, 0, 0, 3], "開放G"],
  "A:maj": [[-1, 0, 2, 2, 2, 0], [0, 0, 1, 2, 3, 0], "開放A"],
  "C:min": [[-1, 3, 5, 5, 4, 3], [0, 1, 3, 4, 2, 1], "5弦ルート"],
  "D:min": [[-1, -1, 0, 2, 3, 1], [0, 0, 0, 2, 3, 1], "開放Dm"],
  "E:min": [[0, 2, 2, 0, 0, 0], [0, 2, 3, 0, 0, 0], "開放Em"],
  "A:min": [[-1, 0, 2, 2, 1, 0], [0, 0, 2, 3, 1, 0], "開放Am"],
  "B:min": [[-1, 2, 4, 4, 3, 2], [0, 1, 3, 4, 2, 1], "5弦ルート"],
  "C:7": [[-1, 3, 2, 3, 1, 0], [0, 3, 2, 4, 1, 0], "開放C7"],
  "D:7": [[-1, -1, 0, 2, 1, 2], [0, 0, 0, 2, 1, 3], "開放D7"],
  "E:7": [[0, 2, 0, 1, 0, 0], [0, 2, 0, 1, 0, 0], "開放E7"],
  "G:7": [[3, 2, 0, 0, 0, 1], [3, 2, 0, 0, 0, 1], "開放G7"],
  "A:7": [[-1, 0, 2, 0, 2, 0], [0, 0, 2, 0, 3, 0], "開放A7"],
  "D:maj7": [[-1, -1, 0, 2, 2, 2], [0, 0, 0, 1, 2, 3], "開放Dmaj7"],
  "E:maj7": [[0, 2, 1, 1, 0, 0], [0, 3, 1, 2, 0, 0], "開放Emaj7"],
  "A:maj7": [[-1, 0, 2, 1, 2, 0], [0, 0, 2, 1, 3, 0], "開放Amaj7"],
  "D:m7": [[-1, -1, 0, 2, 1, 1], [0, 0, 0, 2, 1, 1], "開放Dm7"],
  "E:m7": [[0, 2, 0, 0, 0, 0], [0, 2, 0, 0, 0, 0], "開放Em7"],
  "A:m7": [[-1, 0, 2, 0, 1, 0], [0, 0, 2, 0, 1, 0], "開放Am7"],
  "B:m7b5": [[-1, 2, 3, 2, 3, -1], [0, 1, 2, 1, 3, 0], "5弦ルート"],
  "C:add9": [[-1, 3, 2, 0, 3, 0], [0, 2, 1, 0, 3, 0], "開放Cadd9"],
  "D:sus4": [[-1, -1, 0, 2, 3, 3], [0, 0, 0, 1, 3, 4], "開放Dsus4"],
  "E:sus4": [[0, 2, 2, 2, 0, 0], [0, 1, 2, 3, 0, 0], "開放Esus4"],
  "A:sus4": [[-1, 0, 2, 2, 3, 0], [0, 0, 1, 2, 3, 0], "開放Asus4"]
};

const SCALE = {
  major: {
    label: "メジャー",
    semis: [0, 2, 4, 5, 7, 9, 11],
    triads: ["maj", "min", "min", "maj", "maj", "min", "dim"],
    sevenths: ["maj7", "m7", "m7", "maj7", "7", "m7", "m7b5"],
    spellings: {
      C: ["C", "D", "E", "F", "G", "A", "B"],
      D: ["D", "E", "F#", "G", "A", "B", "C#"],
      E: ["E", "F#", "G#", "A", "B", "C#", "D#"],
      F: ["F", "G", "A", "Bb", "C", "D", "E"],
      G: ["G", "A", "B", "C", "D", "E", "F#"],
      A: ["A", "B", "C#", "D", "E", "F#", "G#"],
      B: ["B", "C#", "D#", "E", "F#", "G#", "A#"],
      Eb: ["Eb", "F", "G", "Ab", "Bb", "C", "D"],
      Ab: ["Ab", "Bb", "C", "Db", "Eb", "F", "G"],
      Bb: ["Bb", "C", "D", "Eb", "F", "G", "A"]
    }
  }
};
const ROMANS_TRIAD = ["I", "ii", "iii", "IV", "V", "vi", "vii"];
const ROMANS_SEVENTH = ["Imaj7", "ii7", "iii7", "IVmaj7", "V7", "vi7", "viiø"];

const COMMON_CHORDS = [
  { root: "C", type: "maj" }, { root: "G", type: "maj" }, { root: "D", type: "maj" },
  { root: "E", type: "min" }, { root: "A", type: "min" }, { root: "D", type: "min" }
];

const state = {
  screen: "lookup",
  root: "C",
  type: "maj",
  shapeIndex: 0,
  key: "C",
  keyMode: "triad",
  selectedDegree: 0,
  keyShowShapes: true,
  pendingResultScroll: false
};

const $ = (selector) => document.querySelector(selector);

document.addEventListener("DOMContentLoaded", () => {
  initControls();
  bindEvents();
  setScreen(location.hash.replace("#", "") || "lookup");
  renderAll();
});

function initControls() {
  $("#rootChips").replaceChildren(...NOTES.map(root => chip(root, () => setChord(root, state.type))));
  $("#typeGroups").replaceChildren(...TYPE_GROUPS.map(group => {
    const wrap = document.createElement("div");
    wrap.className = "type-group";
    const label = document.createElement("div");
    label.className = "type-group-label";
    label.textContent = group.label;
    const row = document.createElement("div");
    row.className = "chip-row";
    row.append(...group.types.map(type => chip(typeLabelShort(type), () => setChord(state.root, type), `type-${type}`, TYPES[type].label)));
    wrap.append(label, row);
    return wrap;
  }));
  $("#keySelect").replaceChildren(...Object.keys(SCALE.major.spellings).map(key => option(key, key)));
  $("#keySelect").value = state.key;
  renderRecent();
}

function bindEvents() {
  window.addEventListener("hashchange", () => setScreen(location.hash.replace("#", "") || "lookup"));
  $("#chordSearch").addEventListener("input", event => {
    const parsed = parseChordName(event.target.value);
    if (parsed) setChord(parsed.root, parsed.type, { keepSearch: true });
  });
  $("#keySelect").addEventListener("change", event => {
    state.key = event.target.value;
    state.selectedDegree = 0;
    renderDiatonic();
  });
  document.querySelectorAll(".segment").forEach(button => {
    button.addEventListener("click", () => {
      state.keyMode = button.dataset.mode;
      document.querySelectorAll(".segment").forEach(item => item.classList.toggle("active", item === button));
      renderDiatonic();
    });
  });
  $("#shapeToggle")?.addEventListener("click", () => {
    state.keyShowShapes = !state.keyShowShapes;
    const button = $("#shapeToggle");
    button.classList.toggle("active", state.keyShowShapes);
    button.setAttribute("aria-pressed", String(state.keyShowShapes));
    renderDiatonic();
  });
  $("#noteInput").addEventListener("input", renderFinder);
  document.querySelectorAll("[data-note-example]").forEach(button => {
    button.addEventListener("click", () => {
      $("#noteInput").value = button.dataset.noteExample;
      renderFinder();
    });
  });
  $("#clearButton").addEventListener("click", () => {
    $("#chordSearch").value = "";
    $("#noteInput").value = "";
    clearStock();
    renderFinder();
  });
}

function setScreen(screen) {
  const normalized = ["lookup", "key", "identify", "stock"].includes(screen) ? screen : "lookup";
  state.screen = normalized;
  document.querySelectorAll(".screen").forEach(section => section.classList.remove("active"));
  $(`#${normalized}Screen`)?.classList.add("active");
  document.querySelectorAll("[data-nav]").forEach(item => item.classList.toggle("active", item.dataset.nav === normalized));
  if (normalized === "lookup" && state.pendingResultScroll) scrollLookupResultSoon();
}

function setChord(root, type, options = {}) {
  state.root = root;
  state.type = type;
  state.shapeIndex = 0;
  if (!options.keepSearch) $("#chordSearch").value = chordName(root, type);
  saveRecent(root, type);
  renderLookup();
  renderRecent();
  if (options.scroll && window.matchMedia("(max-width: 759px)").matches) {
    state.pendingResultScroll = true;
    scrollLookupResultSoon();
  }
}

function scrollLookupResultSoon() {
  if (!window.matchMedia("(max-width: 759px)").matches) {
    state.pendingResultScroll = false;
    return;
  }
  const scroll = () => {
    const result = $("#lookupResult");
    if (!result || $("#lookupScreen")?.classList.contains("active") !== true) return;
    result.scrollIntoView({ behavior: "smooth", block: "start" });
    state.pendingResultScroll = false;
  };
  requestAnimationFrame(() => requestAnimationFrame(scroll));
  setTimeout(scroll, 160);
}
function renderAll() {
  renderLookup();
  renderDiatonic();
  renderFinder();
  renderStock();
  updateStockBadge();
}

function renderLookup() {
  document.querySelectorAll("#rootChips .chip").forEach(button => button.classList.toggle("active", button.textContent === state.root));
  document.querySelectorAll("#typeGroups .chip").forEach(button => button.classList.toggle("active", button.dataset.id === `type-${state.type}`));
  const result = $("#lookupResult");
  const shapes = getChordShapes(state.root, state.type);
  const shape = shapes[state.shapeIndex] || shapes[0];
  if (!shape) {
    result.replaceChildren(empty("このコードのフォームがまだありません。"));
    return;
  }
  const top = resultTop(chordName(state.root, state.type), TYPES[state.type].family);
  top.append(stockButton(state.root, state.type));
  result.replaceChildren(
    top,
    diagramWrap(renderDiagram(shape, state.root, state.type, "large")),
    shapeTabs(shapes),
    toneRow(chordTones(state.root, state.type))
  );
}

function stockButton(root, type) {
  const stocked = isStocked(root, type);
  const button = document.createElement("button");
  button.className = "stock-add" + (stocked ? " active" : "");
  button.type = "button";
  button.textContent = stocked ? "✓ ストック済み" : "＋ ストック";
  button.addEventListener("click", () => {
    stocked ? removeStock(root, type) : addStock(root, type);
  });
  return button;
}

function renderDiatonic() {
  const grid = $("#diatonicList");
  grid.classList.toggle("hide-shapes", !state.keyShowShapes);
  const types = state.keyMode === "triad" ? SCALE.major.triads : SCALE.major.sevenths;
  const romans = state.keyMode === "triad" ? ROMANS_TRIAD : ROMANS_SEVENTH;
  const notes = SCALE.major.spellings[state.key];
  grid.replaceChildren(...notes.map((rootName, index) => {
    const root = normalizeNote(rootName);
    const type = types[index];
    const shape = bestShape(root, type, "easy");
    const card = document.createElement("button");
    card.className = "degree-card";
    card.type = "button";

    const head = document.createElement("div");
    head.className = "dc-head";
    const roman = document.createElement("span");
    roman.className = "roman";
    roman.textContent = romans[index];
    const chord = document.createElement("span");
    chord.className = "chord";
    chord.textContent = displayChordName(rootName, type);
    head.append(roman, chord);

    const tones = document.createElement("div");
    tones.className = "dc-tones";
    const toneOffsets = state.keyMode === "seventh" ? [0, 2, 4, 6] : [0, 2, 4];
    tones.textContent = toneOffsets.map(offset => notes[(index + offset) % 7]).join(" ");

    card.append(head, tones);
    if (state.keyShowShapes && shape) {
      card.append(diagramWrap(renderDiagram(shape, root, type, "mini", rootName)));
    }
    card.addEventListener("click", () => {
      location.hash = "lookup";
      setChord(root, type, { scroll: true });
    });
    return card;
  }));
}

function renderFinder() {
  const container = $("#finderResults");
  const parsed = parseNotes($("#noteInput").value);
  if (parsed.length < 2) {
    container.replaceChildren(empty("音を2つ以上入れると候補を表示します。日本語でも英語でもOKです。"));
    return;
  }
  const candidates = findChordCandidates(parsed);
  if (!candidates.length) {
    container.replaceChildren(empty("近い候補が見つかりません。入力音を確認してみてください。"));
    return;
  }
  container.replaceChildren(...candidates.slice(0, 4).map(candidate => {
    const card = document.createElement("article");
    card.className = "finder-card";
    const title = document.createElement("h2");
    title.textContent = candidate.name;
    const body = document.createElement("p");
    body.textContent = candidate.exact ? "入力音とぴったり一致" : candidate.summary;
    const meta = document.createElement("p");
    meta.textContent = candidate.degrees.join(" / ");
    const actions = document.createElement("div");
    actions.className = "mini-actions";
    const open = document.createElement("button");
    open.className = "link-button";
    open.type = "button";
    open.textContent = "コードを見る";
    open.addEventListener("click", () => {
      location.hash = "lookup";
      setChord(candidate.root, candidate.type, { scroll: true });
    });
    actions.append(open);
    card.append(title, body, meta, actions);
    return card;
  }));
}

function resultTop(name, sub) {
  const top = document.createElement("div");
  top.className = "result-top";
  const text = document.createElement("div");
  const h = document.createElement("h2");
  h.className = "result-name";
  h.textContent = name;
  const p = document.createElement("div");
  p.className = "result-family";
  p.textContent = sub;
  text.append(h, p);
  top.append(text);
  return top;
}

function diagramWrap(svg) {
  const wrap = document.createElement("div");
  wrap.className = "diagram-wrap";
  const doc = new DOMParser().parseFromString(svg, "image/svg+xml");
  const parsedSvg = doc.documentElement;
  if (parsedSvg?.nodeName.toLowerCase() === "svg") {
    wrap.append(document.importNode(parsedSvg, true));
  }
  return wrap;
}

function shapeTabs(shapes) {
  const tabs = document.createElement("div");
  tabs.className = "shape-tabs";
  shapes.slice(0, 4).forEach((shape, index) => {
    const button = document.createElement("button");
    button.className = "shape-tab";
    button.type = "button";
    button.classList.toggle("active", index === state.shapeIndex);
    button.textContent = publicShapeLabel(shape);
    button.addEventListener("click", () => {
      state.shapeIndex = index;
      renderLookup();
    });
    tabs.append(button);
  });
  return tabs;
}

function chordTones(root, type) {
  const info = TYPES[type];
  const rootIndex = noteIndex(root);
  return info.semis.map((semi, i) => ({ note: NOTES[(rootIndex + semi) % 12], degree: info.formula[i] }));
}

function toneRow(tones) {
  const row = document.createElement("div");
  row.className = "tone-row";
  tones.forEach(tone => {
    const item = document.createElement("div");
    item.className = "tone";
    const dot = document.createElement("span");
    dot.className = `tone-dot ${degreeClass(tone.degree)}`;
    const name = document.createElement("b");
    name.textContent = tone.note;
    const role = document.createElement("span");
    role.className = "tone-role";
    role.textContent = DEGREE_LABELS[tone.degree] || tone.degree;
    item.append(dot, name, role);
    row.append(item);
  });
  return row;
}

function degreeClass(degree) {
  return `degree-${String(degree).replace("#", "sharp").replace(/b/g, "flat")}`;
}

function noteRow(notes) {
  const row = document.createElement("div");
  row.className = "note-row";
  notes.forEach(note => {
    const pill = document.createElement("div");
    pill.className = "note-pill";
    const title = document.createElement("b");
    title.textContent = note.note;
    const sub = document.createElement("span");
    sub.textContent = `${note.degree} / ${DEGREE_LABELS[note.degree] || ""}`;
    pill.append(title, sub);
    row.append(pill);
  });
  return row;
}

function empty(text) {
  const div = document.createElement("div");
  div.className = "empty-state";
  div.textContent = text;
  return div;
}

function chip(text, onClick, id = "", title = "") {
  const button = document.createElement("button");
  button.className = "chip";
  button.type = "button";
  if (id) button.dataset.id = id;
  if (title) button.title = title;
  button.textContent = text;
  button.addEventListener("click", onClick);
  return button;
}

function option(value, text) {
  const opt = document.createElement("option");
  opt.value = value;
  opt.textContent = text;
  return opt;
}

function readRecent() {
  try {
    const value = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function saveRecent(root, type) {
  const recent = readRecent().filter(item => !(item.root === root && item.type === type));
  recent.unshift({ root, type });
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, 8)));
}

function renderRecent() {
  const recent = readRecent();
  const hasHistory = recent.length > 0;
  const chips = hasHistory ? recent : COMMON_CHORDS;
  const title = $("#recentTitle");
  if (title) title.textContent = hasHistory ? "最近見たコード" : "よく使うコード";
  $("#recentChips").replaceChildren(...chips.map(item => chip(chordName(item.root, item.type), () => setChord(item.root, item.type, { scroll: true }))));
}

function readStock() {
  try {
    const value = JSON.parse(localStorage.getItem(STOCK_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function saveStock(list) {
  localStorage.setItem(STOCK_KEY, JSON.stringify(list.slice(0, 12)));
}

function isStocked(root, type) {
  return readStock().some(item => item.root === root && item.type === type);
}

function addStock(root, type) {
  const list = readStock();
  if (list.some(item => item.root === root && item.type === type)) return;
  list.push({ root, type });
  saveStock(list);
  renderStock();
  renderLookup();
  updateStockBadge();
}

function removeStock(root, type) {
  saveStock(readStock().filter(item => !(item.root === root && item.type === type)));
  renderStock();
  renderLookup();
  updateStockBadge();
}

function clearStock() {
  localStorage.removeItem(STOCK_KEY);
  renderStock();
  renderLookup();
  updateStockBadge();
}

function updateStockBadge() {
  const count = readStock().length;
  document.querySelectorAll("[data-stock-badge]").forEach(badge => {
    badge.textContent = count ? String(count) : "";
    badge.hidden = count === 0;
  });
}

function renderStock() {
  const grid = $("#stockGrid");
  if (!grid) return;
  const list = readStock();
  if (!list.length) {
    grid.classList.add("is-empty");
    grid.replaceChildren(empty("押さえ方の画面で「＋ ストック」を押すと、ここにコードが溜まります。練習したい進行をまとめて見比べられます。"));
    return;
  }
  grid.classList.remove("is-empty");
  grid.replaceChildren(...list.map(item => {
    const { root, type } = item;
    const shape = bestShape(root, type);
    const card = document.createElement("div");
    card.className = "degree-card stock-card";

    const head = document.createElement("div");
    head.className = "dc-head";
    const chord = document.createElement("span");
    chord.className = "chord";
    chord.textContent = chordName(root, type);
    const remove = document.createElement("button");
    remove.className = "dc-remove";
    remove.type = "button";
    remove.setAttribute("aria-label", `${chordName(root, type)} をストックから外す`);
    remove.textContent = "×";
    remove.addEventListener("click", event => {
      event.stopPropagation();
      removeStock(root, type);
    });
    head.append(chord, remove);

    const tones = document.createElement("div");
    tones.className = "dc-tones";
    tones.textContent = chordTones(root, type).map(tone => tone.note).join(" ");

    card.append(head, tones);
    if (shape) card.append(diagramWrap(renderDiagram(shape, root, type, "mini")));
    card.addEventListener("click", () => {
      location.hash = "lookup";
      setChord(root, type, { scroll: true });
    });
    return card;
  }));
}

function getChordShapes(root, type) {
  const shapes = [];
  const openKey = `${root}:${type}`;
  if (OPEN_SHAPES[openKey]) {
    const [frets, fingers, label] = OPEN_SHAPES[openKey];
    shapes.push({ frets, fingers, label, source: "open" });
  }
  if (type === "dim7") shapes.push(...dim7Shapes(root));
  if (type === "dim") shapes.push(...dimTriadSixthRootShapes(root));
  if (type === "m7b5") shapes.push(...halfDiminishedSixthRootShapes(root));
  movableTemplates(type).forEach(template => {
    const fret = rootFret(root, template.rootString);
    if (fret !== null && fret >= 0 && fret <= 11) {
      shapes.push({
        frets: template.rel.map(v => v < 0 ? -1 : v + fret),
        fingers: template.fingers,
        label: `${template.label}${fret === 0 ? "" : ` ${fret}F`}`,
        source: "movable"
      });
    }
  });
  return uniqueShapes(shapes).sort((a, b) => shapeScore(a) - shapeScore(b));
}

function movableTemplates(type) {
  const base = {
    maj: [
      { label: "6弦ルート", rootString: 6, rel: [0, 2, 2, 1, 0, 0], fingers: [1, 3, 4, 2, 1, 1] },
      { label: "5弦ルート", rootString: 5, rel: [-1, 0, 2, 2, 2, 0], fingers: [0, 1, 3, 3, 3, 1] }
    ],
    min: [
      { label: "6弦ルート", rootString: 6, rel: [0, 2, 2, 0, 0, 0], fingers: [1, 3, 4, 1, 1, 1] },
      { label: "5弦ルート", rootString: 5, rel: [-1, 0, 2, 2, 1, 0], fingers: [0, 1, 3, 4, 2, 1] }
    ],
    7: [
      { label: "6弦ルート", rootString: 6, rel: [0, 2, 0, 1, 0, 0], fingers: [1, 3, 1, 2, 1, 1] },
      { label: "5弦ルート", rootString: 5, rel: [-1, 0, 2, 0, 2, 0], fingers: [0, 1, 3, 1, 4, 1] }
    ],
    maj7: [
      { label: "6弦ルート", rootString: 6, rel: [0, 2, 1, 1, 0, 0], fingers: [1, 4, 2, 3, 1, 1] },
      { label: "5弦ルート", rootString: 5, rel: [-1, 0, 2, 1, 2, 0], fingers: [0, 1, 3, 2, 4, 1] }
    ],
    m7: [
      { label: "6弦ルート", rootString: 6, rel: [0, 2, 0, 0, 0, 0], fingers: [1, 3, 1, 1, 1, 1] },
      { label: "5弦ルート", rootString: 5, rel: [-1, 0, 2, 0, 1, 0], fingers: [0, 1, 3, 1, 2, 1] }
    ],
    // 要確認: mMaj7 / augMaj7 は公開版に専用データが無いため標準ボイシングを暫定で配置（音楽データは要検証）
    mMaj7: [
      { label: "6弦ルート", rootString: 6, rel: [0, 2, 1, 0, 0, 0], fingers: [1, 3, 2, 1, 1, 1] },
      { label: "5弦ルート", rootString: 5, rel: [-1, 0, 2, 1, 1, 0], fingers: [0, 1, 3, 2, 4, 1] }
    ],
    augMaj7: [{ label: "5弦ルート", rootString: 5, rel: [-1, 0, 3, 1, 2, -1], fingers: [0, 1, 4, 2, 3, 0] }],
    m7b5: [{ label: "5弦ルート", rootString: 5, rel: [-1, 0, 1, 0, 1, -1], fingers: [0, 1, 2, 1, 3, 0] }],
    dim: [{ label: "5弦ルート", rootString: 5, rel: [-1, 0, 1, 2, 1, -1], fingers: [0, 1, 2, 4, 3, 0] }],
    dim7: [{ label: "5弦ルート", rootString: 5, rel: [-1, 0, 1, 2, 1, -1], fingers: [0, 1, 2, 4, 3, 0] }],
    aug: [
      { label: "6弦ルート", rootString: 6, rel: [0, 3, 2, 1, 1, 0], fingers: [0, 4, 3, 1, 2, 0] },
      { label: "5弦ルート", rootString: 5, rel: [-1, 0, 3, 2, 2, 1], fingers: [0, 1, 4, 2, 3, 1] }
    ],
    6: [
      { label: "6弦ルート", rootString: 6, rel: [0, 2, 2, 1, 2, 0], fingers: [1, 2, 3, 1, 4, 1] },
      { label: "5弦ルート", rootString: 5, rel: [-1, 0, 2, 2, 2, 2], fingers: [0, 1, 2, 3, 4, 4] }
    ],
    m6: [
      { label: "6弦ルート", rootString: 6, rel: [0, 2, 2, 0, 2, 0], fingers: [1, 2, 3, 1, 4, 1] },
      { label: "5弦ルート", rootString: 5, rel: [-1, 0, 2, 2, 1, 2], fingers: [0, 1, 3, 4, 2, 4] }
    ],
    9: [
      { label: "6弦ルート", rootString: 6, rel: [0, 2, 0, 1, 0, 2], fingers: [1, 2, 1, 1, 1, 4] },
      { label: "5弦ルート", rootString: 5, rel: [-1, 0, 2, 4, 2, 3], fingers: [0, 1, 2, 4, 2, 3] }
    ],
    m9: [
      { label: "6弦ルート", rootString: 6, rel: [0, 2, 0, 0, 0, 2], fingers: [1, 2, 1, 1, 1, 4] },
      { label: "5弦ルート", rootString: 5, rel: [-1, 0, 2, 4, 1, 3], fingers: [0, 1, 2, 4, 1, 3] }
    ],
    sus2: [
      { label: "6弦ルート", rootString: 6, rel: [0, 2, 4, 4, 0, 0], fingers: [1, 1, 3, 4, 1, 1] },
      { label: "5弦ルート", rootString: 5, rel: [-1, 0, 2, 2, 0, 0], fingers: [0, 1, 2, 3, 1, 1] }
    ],
    sus4: [
      { label: "6弦ルート", rootString: 6, rel: [0, 2, 2, 2, 0, 0], fingers: [1, 2, 3, 4, 1, 1] },
      { label: "5弦ルート", rootString: 5, rel: [-1, 0, 2, 2, 3, 0], fingers: [0, 1, 2, 3, 4, 1] }
    ],
    "7sus4": [
      { label: "6弦ルート", rootString: 6, rel: [0, 2, 0, 2, 0, 0], fingers: [1, 2, 1, 3, 1, 1] },
      { label: "5弦ルート", rootString: 5, rel: [-1, 0, 2, 0, 3, 0], fingers: [0, 1, 2, 1, 3, 1] }
    ],
    add9: [
      { label: "5弦ルート", rootString: 5, rel: [-1, 0, 2, 4, 2, 0], fingers: [0, 1, 2, 4, 3, 1] },
      { label: "6弦ルート", rootString: 6, rel: [0, 2, 4, 1, 0, 0], fingers: [1, 3, 4, 2, 1, 1] }
    ]
  };
  return base[type] || base.maj;
}

function dimTriadSixthRootShapes(root) {
  const fret = rootFret(root, 6);
  if (fret === 0) return [{ frets: [0, -1, 2, 3, -1, 3], fingers: [0, 0, 1, 2, 0, 3], label: "6弦ルート", source: "movable" }];
  return [{ frets: [fret, fret + 1, -1, fret, fret - 1, -1], fingers: [2, 4, 0, 3, 1, 0], label: `6弦ルート ${fret}F`, source: "movable" }];
}

function halfDiminishedSixthRootShapes(root) {
  const fret = rootFret(root, 6);
  if (fret === 0) return [{ frets: [0, -1, 2, 3, 3, 3], fingers: [0, 0, 1, 2, 3, 4], label: "6弦ルート", source: "movable" }];
  return [{ frets: [fret, -1, fret, fret, fret - 1, -1], fingers: [2, 0, 3, 4, 1, 0], label: `6弦ルート ${fret}F`, source: "movable" }];
}

function dim7Shapes(root) {
  let fret = rootFret(root, 5);
  if (fret === 0) return [{ frets: [-1, 0, 1, 2, 1, 2], fingers: [0, 0, 1, 3, 2, 4], label: "5弦ルート dim7", source: "movable" }];
  if (fret === 1 || fret === 2) fret += 3;
  return [{ frets: [-1, fret, fret + 1, fret - 1, fret + 1, -1], fingers: [0, 2, 3, 1, 4, 0], label: `5弦ルート ${fret}F`, source: "movable" }];
}

function bestShape(root, type) {
  return getChordShapes(root, type)[0];
}

function uniqueShapes(shapes) {
  const seen = new Set();
  return shapes.filter(shape => {
    const key = shape.frets.join(",");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function shapeScore(shape) {
  const openBonus = shape.source === "open" ? -20 : 0;
  return openBonus + maxFret(shape) + minFret(shape) * .2 + shape.frets.filter(f => f < 0).length * 2;
}

function renderDiagram(shape, root, type, size, displayRoot = root) {
  const c = svgColors();
  const displayName = displayChordName(displayRoot, type);
  const width = 540;
  const height = size === "large" ? 360 : 300;
  const left = 76;
  const right = 488;
  const top = size === "large" ? 82 : 70;
  const bottom = size === "large" ? 268 : 222;
  const fretGap = (right - left) / 5;
  const stringGap = (bottom - top) / 5;
  const fretted = shape.frets.filter(f => f > 0);
  const min = fretted.length ? Math.min(...fretted) : 1;
  const max = fretted.length ? Math.max(...fretted) : 4;
  const start = max > 5 ? min : 1;
  const notes = playedNotes(shape, root, type);
  const isMini = size !== "large";
  const dotRadius = isMini ? 15 : 18;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${displayName} chord diagram">`;
  svg += `<rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="16" fill="${c.bg}" stroke="rgba(35,48,58,.1)"/>`;
  svg += `<text x="${left}" y="38" font-size="${isMini ? 20 : 28}" font-weight="900" fill="${c.text}">${displayName}</text>`;
  if (!isMini) svg += `<text x="${right - 90}" y="38" font-size="13" font-weight="800" fill="${c.muted}">${publicShapeLabel(shape)}</text>`;
  if (start > 1) svg += `<text x="${left}" y="${bottom + 46}" font-size="13" fill="${c.muted}">${start}フレットから表示</text>`;
  for (let i = 0; i < 6; i++) {
    const y = bottom - i * stringGap;
    svg += `<line x1="${left}" y1="${y}" x2="${right}" y2="${y}" stroke="${c.stroke}" stroke-width="${i === 0 || i === 5 ? 2.6 : 1.8}" opacity=".55"/>`;
  }
  for (let i = 0; i <= 5; i++) {
    const x = left + i * fretGap;
    svg += `<line x1="${x}" y1="${top}" x2="${x}" y2="${bottom}" stroke="${c.stroke}" stroke-width="${i === 0 && start === 1 ? 7 : 1.8}" opacity="${i === 0 && start === 1 ? .65 : .35}"/>`;
    if (i < 5) svg += `<text x="${x + fretGap / 2}" y="${bottom + 26}" text-anchor="middle" font-size="12" fill="${c.muted}">${start + i}</text>`;
  }
  barreGroups(shape, start).forEach(group => {
    const x = left + (group.fret - start + .5) * fretGap;
    const ys = group.strings.map(stringIndex => bottom - stringIndex * stringGap);
    const y1 = Math.min(...ys) - dotRadius;
    const y2 = Math.max(...ys) + dotRadius;
    svg += `<rect x="${x - dotRadius * .72}" y="${y1}" width="${dotRadius * 1.44}" height="${y2 - y1}" rx="${dotRadius}" fill="rgba(76,141,255,.16)" stroke="rgba(76,141,255,.45)" stroke-width="2"/>`;
  });
  shape.frets.forEach((fret, index) => {
    const y = bottom - index * stringGap;
    const item = notes[index];
    if (fret < 0) {
      svg += `<text x="${left - 20}" y="${y + 5}" text-anchor="middle" font-size="${isMini ? 14 : 16}" font-weight="700" fill="${c.muted}">×</text>`;
      return;
    }
    if (!isMini) {
      const noteColor = DEGREE_COLORS[item.degree] || c.text;
      svg += `<text x="${left - 22}" y="${y + 5}" text-anchor="middle" font-size="14" font-weight="800" fill="${noteColor}">${item.note}</text>`;
    } else if (fret === 0) {
      const color = DEGREE_COLORS[item.degree] || c.muted;
      svg += `<circle cx="${left - 16}" cy="${y}" r="7" fill="none" stroke="${color}" stroke-width="2"/>`;
    }
    if (fret === 0) return;
    const x = left + (fret - start + .5) * fretGap;
    const color = DEGREE_COLORS[item.degree] || c.text;
    const finger = FINGER_NAMES[shape.fingers[index]] || "";
    svg += `<circle cx="${x}" cy="${y}" r="${dotRadius}" fill="${color}" stroke="${c.bg}" stroke-width="3"/>`;
    svg += `<text x="${x}" y="${y + 6}" text-anchor="middle" font-size="14" font-weight="900" fill="#fff">${finger || item.degree}</text>`;
  });
  svg += `</svg>`;
  return svg;
}

function svgColors() {
  const s = getComputedStyle(document.documentElement);
  return {
    bg: s.getPropertyValue("--svg-bg").trim(),
    stroke: s.getPropertyValue("--svg-stroke").trim(),
    text: s.getPropertyValue("--svg-text").trim(),
    muted: s.getPropertyValue("--svg-muted").trim()
  };
}

function playedNotes(shape, root, type) {
  const rootIdx = noteIndex(root);
  const typeInfo = TYPES[type];
  return shape.frets.map((fret, idx) => {
    const stringNumber = 6 - idx;
    if (fret < 0) return { string: stringNumber, muted: true };
    const note = noteAtString(idx, fret);
    const semi = (noteIndex(note) - rootIdx + 12) % 12;
    const degreeIndex = typeInfo.semis.map(s => s % 12).indexOf(semi);
    const degree = degreeIndex >= 0 ? typeInfo.formula[degreeIndex] : "?";
    return { string: stringNumber, fret, note, degree, muted: false };
  });
}

function barreGroups(shape, start) {
  const groups = new Map();
  shape.frets.forEach((fret, idx) => {
    const finger = shape.fingers[idx];
    if (fret <= 0 || !finger || fret < start || fret >= start + 5) return;
    const key = `${finger}:${fret}`;
    if (!groups.has(key)) groups.set(key, { finger, fret, strings: [] });
    groups.get(key).strings.push(idx);
  });
  return Array.from(groups.values()).filter(group => group.strings.length >= 2);
}

function noteAtString(stringIndex, fret) {
  return NOTES[(noteIndex(OPEN_STRINGS[stringIndex]) + fret) % 12];
}

function rootFret(root, stringNumber) {
  const open = stringNumber === 6 ? "E" : "A";
  return (noteIndex(root) - noteIndex(open) + 12) % 12;
}

// M7(メジャー7) と m7(マイナー7) は大文字小文字だけが違うので、小文字化せず大小を区別して照合する
const TYPE_ALIASES = {
  "": "maj", "maj": "maj", "M": "maj",
  "m": "min", "min": "min", "-": "min",
  "7": "7", "dom7": "7",
  "M7": "maj7", "maj7": "maj7", "Maj7": "maj7", "ma7": "maj7",
  "m7": "m7", "min7": "m7", "-7": "m7",
  "mM7": "mMaj7", "mMaj7": "mMaj7", "minMaj7": "mMaj7",
  "m7b5": "m7b5", "m7-5": "m7b5", "min7b5": "m7b5",
  "dim": "dim",
  "dim7": "dim7",
  "aug": "aug", "+": "aug",
  "augM7": "augMaj7", "augMaj7": "augMaj7", "+M7": "augMaj7",
  "6": "6",
  "m6": "m6", "min6": "m6",
  "9": "9",
  "m9": "m9", "min9": "m9",
  "sus2": "sus2",
  "sus4": "sus4", "sus": "sus4",
  "7sus4": "7sus4", "7sus": "7sus4",
  "add9": "add9", "add2": "add9"
};

function parseChordName(raw) {
  const compact = raw.trim().replace(/\s+/g, "");
  const match = compact.match(/^([A-Ga-g])([#♯b♭]?)(.*)$/);
  if (!match) return null;
  const root = normalizeNote(formatRootToken(match[1] + match[2]));
  const suffix = match[3].replace(/[♭]/g, "b").replace(/[♯]/g, "#");
  const type = TYPE_ALIASES[suffix];
  return root && type ? { root, type } : null;
}

function parseNotes(raw) {
  const text = raw.replace(/[,，、]/g, " ").replace(/[／/｜|>→-]/g, " ").replace(/\s+/g, " ").trim();
  if (!text) return [];
  const tokens = /\s/.test(text) ? text.split(/\s+/) : scanNoteTokens(text);
  return tokens.map(parseNoteToken).filter(Boolean);
}

function scanNoteTokens(text) {
  const tokens = [];
  let index = 0;
  while (index < text.length) {
    const chunk = text.slice(index);
    const jp = chunk.match(/^(ファ|ド|レ|ミ|ソ|ラ|シ)([#＃♯b♭]?)/);
    if (jp) {
      tokens.push(jp[1] + (jp[2] || ""));
      index += jp[0].length;
      continue;
    }
    const en = chunk.match(/^([A-Ga-g])([#＃♯b♭]?)/);
    if (en) {
      tokens.push(en[1] + (en[2] || ""));
      index += en[0].length;
      continue;
    }
    index += 1;
  }
  return tokens;
}

function parseNoteToken(token) {
  const jpMap = { "ド": "C", "レ": "D", "ミ": "E", "ファ": "F", "ソ": "G", "ラ": "A", "シ": "B" };
  const cleaned = token.trim().replace("＃", "#").replace("♯", "#").replace("♭", "b");
  const jp = cleaned.match(/^(ファ|ド|レ|ミ|ソ|ラ|シ)([#b]?)/);
  if (jp) return normalizeNote(jpMap[jp[1]] + (jp[2] || ""));
  const en = cleaned.match(/^([A-Ga-g])([#b]?)/);
  if (en) return normalizeNote(formatRootToken(en[1] + (en[2] || "")));
  return null;
}

function findChordCandidates(notes) {
  const uniqueNotes = uniqueBy(notes, note => note);
  const inputIndexes = uniqueNotes.map(noteIndex).filter(index => index >= 0);
  const inputSet = new Set(inputIndexes);
  const candidates = [];
  NOTES.forEach(root => {
    const rootIndex = noteIndex(root);
    TYPE_ORDER.forEach((type, typeOrder) => {
      const typeInfo = TYPES[type];
      const chordIndexes = uniqueBy(typeInfo.semis.map(semi => (rootIndex + semi) % 12), index => index);
      const chordSet = new Set(chordIndexes);
      const matched = inputIndexes.filter(index => chordSet.has(index));
      const missing = chordIndexes.filter(index => !inputSet.has(index));
      const extra = inputIndexes.filter(index => !chordSet.has(index));
      if (matched.length < 2 || extra.length > 2) return;
      const exact = missing.length === 0 && extra.length === 0;
      let score = matched.length * 12 - missing.length * 3 - extra.length * 7;
      if (exact) score += 30;
      if (inputSet.has(rootIndex)) score += 6;
      score -= typeOrder * .02;
      candidates.push({
        root,
        type,
        name: chordName(root, type),
        exact,
        score,
        summary: [missing.length ? `省略: ${missing.map(i => NOTES[i]).join(" ")}` : "", extra.length ? `コード外: ${extra.map(i => NOTES[i]).join(" ")}` : ""].filter(Boolean).join(" / "),
        degrees: degreeLabelsForNotes(uniqueNotes, root, type)
      });
    });
  });
  const sorted = candidates.sort((a, b) => b.score - a.score);
  const exact = sorted.filter(item => item.exact);
  return exact.length ? exact : sorted;
}

function degreeLabelsForNotes(notes, root, type) {
  const rootIndex = noteIndex(root);
  const typeInfo = TYPES[type];
  const semis = typeInfo.semis.map(value => value % 12);
  return notes.map(note => {
    const semi = (noteIndex(note) - rootIndex + 12) % 12;
    const degreeIndex = semis.indexOf(semi);
    const degree = degreeIndex >= 0 ? typeInfo.formula[degreeIndex] : "?";
    return `${note}: ${degree}`;
  });
}

function uniqueBy(items, keyFn) {
  const seen = new Set();
  return items.filter(item => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function chordName(root, type) {
  return `${root}${TYPES[type].suffix}`;
}

function displayChordName(root, type) {
  return `${root}${TYPES[type].suffix}`;
}

function typeLabelShort(type) {
  return TYPES[type].suffix || "maj";
}

function publicShapeLabel(shape) {
  if (shape.source === "open" || shape.label.includes("開放")) return "開放形";
  if (shape.label.includes("6弦")) return "6弦ルート";
  if (shape.label.includes("5弦")) return "5弦ルート";
  return shape.label.replace(/型/g, "");
}

function normalizeNote(note) {
  const normalized = String(note).replace("♭", "b").replace("♯", "#");
  const map = { DB: "C#", "D#": "Eb", GB: "F#", "G#": "Ab", "A#": "Bb", CB: "B", "B#": "C", "E#": "F", FB: "E" };
  return map[normalized.toUpperCase()] || normalized[0].toUpperCase() + normalized.slice(1);
}

function formatRootToken(note) {
  return note.charAt(0).toUpperCase() + note.slice(1).replace(/b/i, "b");
}

function noteIndex(note) {
  return NOTES.indexOf(normalizeNote(note));
}

function minFret(shape) {
  const values = shape.frets.filter(f => f > 0);
  return values.length ? Math.min(...values) : 0;
}

function maxFret(shape) {
  const values = shape.frets.filter(f => f > 0);
  return values.length ? Math.max(...values) : 0;
}
