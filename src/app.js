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
const TYPE_ORDER = ["maj", "min", "7", "m7", "maj7", "sus4", "add9", "sus2", "7sus4", "dim", "dim7", "m7b5", "aug"];
const ACTIVE_TYPES = new Set(TYPE_ORDER);
const ROOT_BASES = ["C", "D", "E", "F", "G", "A", "B"];
const ROOT_ACCIDENTALS = [
  { id: "flat", label: "♭" },
  { id: "sharp", label: "♯" }
];
const ROOT_NAME_MAP = {
  C: { flat: "B", natural: "C", sharp: "C#" },
  D: { flat: "C#", natural: "D", sharp: "Eb" },
  E: { flat: "Eb", natural: "E", sharp: "F" },
  F: { flat: "E", natural: "F", sharp: "F#" },
  G: { flat: "F#", natural: "G", sharp: "Ab" },
  A: { flat: "Ab", natural: "A", sharp: "Bb" },
  B: { flat: "Bb", natural: "B", sharp: "C" }
};
const MOBILE_PRIMARY_TYPES = ["min", "7", "m7", "maj7", "sus4", "add9"];
// 種類セレクタは、公開確認対象のコードだけに絞る。
const TYPE_GROUPS = [
  { label: "基本", types: ["min", "7", "m7", "maj7", "sus4", "add9"] },
  { label: "もっと見る", types: ["sus2", "7sus4", "dim", "dim7", "m7b5", "aug"] }
];
const RECENT_KEY = "chordAtlasPublicRecent";
const STOCK_KEY = "chordAtlasPublicStock";
const MEMO_KEY = "chordAtlasPublicMemos";

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
  "E:aug": [[0, 3, 2, 1, 1, 0], [0, 4, 3, 1, 2, 0], "開放Eaug"],
  "E:6": [[0, 2, 2, 1, 2, 0], [0, 2, 3, 1, 4, 0], "開放E6"],
  "A:6": [[-1, 0, 2, 2, 2, 2], [0, 0, 1, 1, 1, 1], "開放A6"],
  "E:m6": [[0, 2, 2, 0, 2, 0], [0, 2, 3, 0, 4, 0], "開放Em6"],
  "A:m6": [[-1, 0, 2, 2, 1, 2], [0, 0, 2, 3, 1, 4], "開放Am6"],
  "E:9": [[0, 2, 0, 1, 0, 2], [0, 2, 0, 1, 0, 3], "開放E9"],
  "A:9": [[-1, 0, 2, 4, 2, 3], [0, 0, 1, 4, 2, 3], "開放A9"],
  "E:m9": [[0, 2, 0, 0, 0, 2], [0, 2, 0, 0, 0, 3], "開放Em9"],
  "A:m9": [[-1, 0, 2, 4, 1, 3], [0, 0, 2, 4, 1, 3], "開放Am9"],
  "E:mMaj7": [[0, 2, 1, 0, 0, 0], [0, 2, 1, 0, 0, 0], "開放EmM7"],
  "A:mMaj7": [[-1, 0, 2, 1, 1, 0], [0, 0, 3, 1, 2, 0], "開放AmM7"],
  "F:m7b5": [[1, -1, 1, 1, 0, -1], [1, 0, 2, 3, 0, 0], "開放寄り"],
  "A:m7b5": [[-1, 0, 1, 0, 1, -1], [0, 0, 1, 0, 2, 0], "開放Am7♭5"],
  "F:dim": [[1, 2, -1, 1, 0, -1], [1, 3, 0, 2, 0, 0], "開放寄り"],
  "A:dim": [[-1, 0, 1, 2, 1, -1], [0, 0, 1, 3, 2, 0], "開放Adim"],
  "C:add9": [[-1, 3, 2, 0, 3, 0], [0, 2, 1, 0, 3, 0], "開放Cadd9"],
  "F:add9": [[-1, -1, 3, 2, 1, 3], [0, 0, 3, 2, 1, 4], "定番Fadd9"],
  "E:sus2": [[0, 2, 4, 4, 0, 0], [0, 1, 3, 4, 0, 0], "開放Esus2"],
  "A:sus2": [[-1, 0, 2, 2, 0, 0], [0, 0, 1, 2, 0, 0], "開放Asus2"],
  "D:sus2": [[-1, -1, 0, 2, 3, 0], [0, 0, 0, 1, 3, 0], "開放Dsus2"],
  "D:sus4": [[-1, -1, 0, 2, 3, 3], [0, 0, 0, 1, 3, 4], "開放Dsus4"],
  "E:sus4": [[0, 2, 2, 2, 0, 0], [0, 1, 2, 3, 0, 0], "開放Esus4"],
  "A:sus4": [[-1, 0, 2, 2, 3, 0], [0, 0, 1, 2, 3, 0], "開放Asus4"],
  "D:7sus4": [[-1, -1, 0, 2, 1, 3], [0, 0, 0, 2, 1, 3], "開放D7sus4"],
  "E:7sus4": [[0, 2, 0, 2, 0, 0], [0, 1, 0, 2, 0, 0], "開放E7sus4"],
  "A:7sus4": [[-1, 0, 2, 0, 3, 0], [0, 0, 1, 0, 3, 0], "開放A7sus4"]
};


const VERIFIED_SHAPES = {
  add9: {
    C: [["x32030","021030"]],
    "C#": [["x43141","032141"],["x43x44","021034"]],
    D: [["x54252","032141"],["x57770","012340"]],
    "Eb": [["x65363","032141"],["x65066","021034"]],
    E: [["022102","023104"],["x76474","032141"]],
    F: [["xx3213","003214"],["x87585","032141"]],
    "F#": [["21x122","310244"],["xx4324","003214"]],
    G: [["300203","200103"],["xa97a7","032141"]],
    "Ab": [["43x34x","310240"],["xx6546","003214"]],
    A: [["x02420","001320"],["xx7657","003214"]],
    "Bb": [["x10311","010423"],["xx8768","003214"]],
    B: [["x21x22","021034"],["76x677","310244"]]
  },
  sus2: {
    C: [["x30013","030014"],["x30033","010023"]],
    "C#": [["x46644","013411"],["96689x","411340"]],
    D: [["xx0230","000230"]],
    "Eb": [["x68866","013411"],["b88abx","311240"]],
    E: [["024400","013400"],["079977","013411"]],
    F: [["133x13","123014"]],
    "F#": [["2xx122","200134"]],
    G: [["300033","100023"],["xa778a","031124"]],
    "Ab": [["4xx344","200134"],["466x46","123014"]],
    A: [["x02200","002300"],["x02400","001400"]],
    "Bb": [["x13311","013411"],["63356x","311240"]],
    B: [["x24422","013411"],["7xx677","200134"]]
  },
  aug: {
    C: [["x3211x","032110"],["x3655x","014230"]],
    "C#": [["98766x","432110"],["9xbaa9","104231"]],
    D: [["xx0332","000231"],["x5433x","032110"]],
    "Eb": [["x6544x","032110"],["ba988x","432110"]],
    E: [["032110","043120"],["x7655x","032110"]],
    F: [["xx3221","004231"],["x8766x","032110"]],
    "F#": [["xx4332","004231"],["xx433x","002110"]],
    G: [["32100x","321000"],["3x544x","104230"]],
    "Ab": [["43211x","432110"],["4x655x","104230"]],
    A: [["x03221","004231"],["54322x","432110"]],
    "Bb": [["x1433x","014230"],["65433x","432110"]],
    B: [["x2100x","021000"],["7x988x","104230"]]
  },
  dim7: {
    C: [["x34242","023141"],["8x787x","201310"]],
    "C#": [["x45353","023141"],["9x898x","201310"]],
    D: [["xx0101","000203"],["x56464","023141"]],
    "Eb": [["xx1212","001324"],["x67575","023141"]],
    E: [["012020","012030"],["xx2323","001324"]],
    F: [["1x0101","100203"],["xx3434","001314"]],
    "F#": [["2x121x","201310"],["234242","123141"]],
    G: [["31x320","310420"],["3x2320","301420"]],
    "Ab": [["4x3434","201314"],["xx6767","001324"]],
    A: [["x01212","001324"],["5x454x","201310"]],
    "Bb": [["x12020","012030"],["678686","123141"]],
    B: [["x23131","023141"],["7x676x","301420"]]
  }
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
  rootInputBase: "C",
  rootInputAccidental: null,
  type: "maj",
  shapeIndex: 0,
  key: "C",
  keyMode: "triad",
  selectedDegree: 0,
  keyShowShapes: true,
  typeExpanded: false,
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
  renderRootControls();
  renderTypeControls();
  $("#keySelect").replaceChildren(...Object.keys(SCALE.major.spellings).map(key => option(key, key)));
  $("#keySelect").value = state.key;
  renderRecent();
}

function renderRootControls() {
  const baseRow = document.createElement("div");
  baseRow.className = "chip-row root-base-row";
  baseRow.append(...ROOT_BASES.map(base => {
    const button = chip(base, () => selectRootBase(base));
    button.dataset.rootBase = base;
    return button;
  }));

  const accidentalRow = document.createElement("div");
  accidentalRow.className = "chip-row accidental-row";
  accidentalRow.append(...ROOT_ACCIDENTALS.map(item => {
    const button = chip(item.label, () => selectRootAccidental(item.id), `acc-${item.id}`);
    button.dataset.accidental = item.id;
    return button;
  }));

  $("#rootChips").replaceChildren(baseRow, accidentalRow);
}

function renderTypeControls() {
  const mobile = document.createElement("div");
  mobile.className = "mobile-type-picker";
  const mobileRow = document.createElement("div");
  mobileRow.className = "chip-row";
  mobileRow.append(...MOBILE_PRIMARY_TYPES.map(type => chip(typeLabelShort(type), () => setChord(state.root, type, { keepRootInput: true }), `type-${type}`, TYPES[type].label)));
  const toggle = document.createElement("button");
  toggle.className = "more-types";
  toggle.id = "typeMoreToggle";
  toggle.type = "button";
  toggle.addEventListener("click", () => {
    state.typeExpanded = !state.typeExpanded;
    renderLookup();
  });
  mobile.append(mobileRow, toggle);

  const typeGroups = $("#typeGroups");
  typeGroups.before(mobile);
  typeGroups.replaceChildren(...TYPE_GROUPS.map(group => {
    const wrap = document.createElement("div");
    wrap.className = "type-group";
    const label = document.createElement("div");
    label.className = "type-group-label";
    label.textContent = group.label;
    const row = document.createElement("div");
    row.className = "chip-row";
    row.append(...group.types.map(type => chip(typeLabelShort(type), () => setChord(state.root, type, { keepRootInput: true }), `type-${type}`, TYPES[type].label)));
    wrap.append(label, row);
    return wrap;
  }));
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
  $("#copyMemosButton")?.addEventListener("click", event => copyMemosForCodex(event.currentTarget));
  $("#exportMemosButton")?.addEventListener("click", exportMemosJson);
  $("#clearMemosButton")?.addEventListener("click", clearMemos);
}

function setScreen(screen) {
  const normalized = ["lookup", "key", "identify", "stock", "memo"].includes(screen) ? screen : "lookup";
  state.screen = normalized;
  document.querySelectorAll(".screen").forEach(section => section.classList.remove("active"));
  $(`#${normalized}Screen`)?.classList.add("active");
  document.querySelectorAll("[data-nav]").forEach(item => item.classList.toggle("active", item.dataset.nav === normalized));
  $("#clearButton")?.toggleAttribute("hidden", normalized !== "stock");
  if (normalized === "lookup" && state.pendingResultScroll) scrollLookupResultSoon();
}

function setChord(root, type, options = {}) {
  state.root = root;
  state.type = type;
  state.shapeIndex = 0;
  if (!options.keepRootInput) syncRootInput(root);
  if (!options.keepSearch) $("#chordSearch").value = chordName(root, type);
  saveRecent(root, type);
  renderLookup();
  renderRecent();
  if (options.scroll && window.matchMedia("(max-width: 759px)").matches) {
    state.pendingResultScroll = true;
    scrollLookupResultSoon();
  }
}

function selectRootBase(base) {
  state.rootInputBase = base;
  state.rootInputAccidental = null;
  setChord(ROOT_NAME_MAP[base].natural, "maj", { keepRootInput: true });
}

function selectRootAccidental(accidental) {
  const base = state.rootInputBase || rootSelectionFromName(state.root).base;
  const nextRoot = ROOT_NAME_MAP[base]?.[accidental];
  if (!nextRoot) return;
  state.rootInputBase = base;
  state.rootInputAccidental = accidental;
  setChord(nextRoot, state.type, { keepRootInput: true });
}

function syncRootInput(root) {
  const rootSelection = rootSelectionFromName(root);
  state.rootInputBase = rootSelection.base;
  state.rootInputAccidental = rootSelection.accidental === "natural" ? null : rootSelection.accidental;
}

function rootSelectionFromName(root) {
  for (const base of ROOT_BASES) {
    const entries = Object.entries(ROOT_NAME_MAP[base]);
    const found = entries.find(([, name]) => name === root);
    if (found) return { base, accidental: found[0] };
  }
  return { base: "C", accidental: "natural" };
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
  renderMemos();
  updateStockBadge();
  updateMemoBadge();
}

function renderLookup() {
  const rootInputBase = state.rootInputBase || rootSelectionFromName(state.root).base;
  document.querySelectorAll("[data-root-base]").forEach(button => button.classList.toggle("active", button.dataset.rootBase === rootInputBase));
  document.querySelectorAll("[data-accidental]").forEach(button => {
    const nextRoot = ROOT_NAME_MAP[rootInputBase]?.[button.dataset.accidental];
    button.disabled = !nextRoot;
    button.classList.toggle("active", button.dataset.accidental === state.rootInputAccidental);
  });
  document.querySelectorAll("#typeGroups .chip").forEach(button => button.classList.toggle("active", button.dataset.id === `type-${state.type}`));
  document.querySelectorAll(".mobile-type-picker .chip").forEach(button => button.classList.toggle("active", button.dataset.id === `type-${state.type}`));
  const showExpandedTypes = state.typeExpanded || (state.type !== "maj" && !MOBILE_PRIMARY_TYPES.includes(state.type));
  $("#typeGroups").classList.toggle("expanded", showExpandedTypes);
  const typeMoreToggle = $("#typeMoreToggle");
  if (typeMoreToggle) typeMoreToggle.textContent = showExpandedTypes ? "閉じる" : "もっと見る";
  const result = $("#lookupResult");
  const shapes = getChordShapes(state.root, state.type);
  const shape = shapes[state.shapeIndex] || shapes[0];
  if (!shape) {
    result.replaceChildren(empty("このコードのフォームがまだありません。"));
    return;
  }
  const top = resultTop(chordName(state.root, state.type), TYPES[state.type].family);
  const actions = document.createElement("div");
  actions.className = "result-actions";
  actions.append(stockButton(state.root, state.type), memoButton());
  top.append(actions);
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

function memoButton() {
  const button = document.createElement("button");
  button.className = "stock-add memo-add";
  button.type = "button";
  button.textContent = "メモ";
  button.addEventListener("click", addMemoForCurrent);
  return button;
}

function addMemoForCurrent() {
  const shapes = getChordShapes(state.root, state.type);
  const shape = shapes[state.shapeIndex] || shapes[0];
  if (!shape) return;
  const title = chordName(state.root, state.type);
  const defaultText = `${title} / ${publicShapeLabel(shape)}: `;
  const note = window.prompt("このコードフォームについての気づきをメモ", defaultText);
  if (!note || !note.trim()) return;
  const memo = {
    id: memoId(),
    createdAt: new Date().toISOString(),
    root: state.root,
    type: state.type,
    chord: title,
    shapeIndex: state.shapeIndex,
    shapeLabel: publicShapeLabel(shape),
    frets: shape.frets,
    page: "#lookup",
    note: note.trim()
  };
  saveMemos([memo, ...readMemos()]);
  renderMemos();
  updateMemoBadge();
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

function isActiveType(type) {
  return ACTIVE_TYPES.has(type);
}

function activeItems(items) {
  return items.filter(item => item && item.root && isActiveType(item.type));
}

function saveRecent(root, type) {
  if (!isActiveType(type)) return;
  const recent = activeItems(readRecent()).filter(item => !(item.root === root && item.type === type));
  recent.unshift({ root, type });
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, 8)));
}

function renderRecent() {
  const recent = activeItems(readRecent());
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
  localStorage.setItem(STOCK_KEY, JSON.stringify(activeItems(list).slice(0, 12)));
}

function isStocked(root, type) {
  if (!isActiveType(type)) return false;
  return activeItems(readStock()).some(item => item.root === root && item.type === type);
}

function addStock(root, type) {
  if (!isActiveType(type)) return;
  const list = activeItems(readStock());
  if (list.some(item => item.root === root && item.type === type)) return;
  list.push({ root, type });
  saveStock(list);
  renderStock();
  renderLookup();
  updateStockBadge();
}

function removeStock(root, type) {
  saveStock(activeItems(readStock()).filter(item => !(item.root === root && item.type === type)));
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
  const count = activeItems(readStock()).length;
  document.querySelectorAll("[data-stock-badge]").forEach(badge => {
    badge.textContent = count ? String(count) : "";
    badge.hidden = count === 0;
  });
}

function renderStock() {
  const grid = $("#stockGrid");
  if (!grid) return;
  const list = activeItems(readStock());
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

function readMemos() {
  try {
    const value = JSON.parse(localStorage.getItem(MEMO_KEY) || "[]");
    return Array.isArray(value) ? value.filter(item => item && item.id && item.note) : [];
  } catch {
    return [];
  }
}

function saveMemos(list) {
  localStorage.setItem(MEMO_KEY, JSON.stringify(list.slice(0, 100)));
}

function memoId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function updateMemoBadge() {
  const count = readMemos().length;
  document.querySelectorAll("[data-memo-badge]").forEach(badge => {
    badge.textContent = count ? String(count) : "";
    badge.hidden = count === 0;
  });
}

function renderMemos() {
  const list = $("#memoList");
  if (!list) return;
  const memos = readMemos();
  if (!memos.length) {
    list.classList.add("is-empty");
    list.replaceChildren(empty("押さえ方の画面で「メモ」を押すと、今見ているコードとフォーム付きで気づきを保存できます。"));
    return;
  }
  list.classList.remove("is-empty");
  list.replaceChildren(...memos.map(memoCard));
}

function memoCard(item) {
  const card = document.createElement("article");
  card.className = "memo-card";

  const head = document.createElement("div");
  head.className = "memo-card-head";
  const title = document.createElement("h2");
  title.textContent = item.chord || chordName(item.root, item.type);
  const remove = document.createElement("button");
  remove.className = "dc-remove";
  remove.type = "button";
  remove.setAttribute("aria-label", `${title.textContent} のメモを削除`);
  remove.textContent = "×";
  remove.addEventListener("click", () => removeMemo(item.id));
  head.append(title, remove);

  const meta = document.createElement("div");
  meta.className = "memo-meta";
  meta.textContent = [item.shapeLabel, fretPatternText(item.frets), formatMemoDate(item.createdAt)].filter(Boolean).join(" / ");

  const body = document.createElement("p");
  body.className = "memo-note";
  body.textContent = item.note;

  const actions = document.createElement("div");
  actions.className = "mini-actions";
  const open = document.createElement("button");
  open.className = "link-button";
  open.type = "button";
  open.textContent = "コードを見る";
  open.addEventListener("click", () => openMemoChord(item));
  actions.append(open);

  card.append(head, meta, body, actions);
  return card;
}

function removeMemo(id) {
  saveMemos(readMemos().filter(item => item.id !== id));
  renderMemos();
  updateMemoBadge();
}

function clearMemos() {
  const memos = readMemos();
  if (!memos.length) return;
  if (!window.confirm("メモをすべて削除しますか？")) return;
  localStorage.removeItem(MEMO_KEY);
  renderMemos();
  updateMemoBadge();
}

function openMemoChord(item) {
  location.hash = "lookup";
  setChord(item.root, item.type, { scroll: true });
  const shapes = getChordShapes(item.root, item.type);
  state.shapeIndex = Math.min(item.shapeIndex || 0, Math.max(shapes.length - 1, 0));
  renderLookup();
}

function memoMarkdown(memos = readMemos()) {
  const lines = ["# Chord Atlas 気づきメモ", "", `Exported: ${new Date().toLocaleString("ja-JP")}`, ""];
  memos.forEach((item, index) => {
    lines.push(`## ${index + 1}. ${item.chord || chordName(item.root, item.type)}`);
    lines.push(`- フォーム: ${item.shapeLabel || "未設定"}`);
    lines.push(`- フレット: ${fretPatternText(item.frets) || "未設定"}`);
    lines.push(`- 作成: ${formatMemoDate(item.createdAt) || "未設定"}`);
    lines.push(`- メモ: ${item.note}`);
    lines.push("");
  });
  return lines.join("\n");
}

async function copyMemosForCodex(button) {
  const memos = readMemos();
  if (!memos.length) {
    window.alert("コピーするメモがまだありません。");
    return;
  }
  const text = memoMarkdown(memos);
  try {
    await navigator.clipboard.writeText(text);
    flashButton(button, "コピーしました");
  } catch {
    window.prompt("コピーしてください", text);
  }
}

function exportMemosJson() {
  const memos = readMemos();
  if (!memos.length) {
    window.alert("保存するメモがまだありません。");
    return;
  }
  const blob = new Blob([JSON.stringify(memos, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "chord-atlas-memos.json";
  link.click();
  URL.revokeObjectURL(url);
}

function flashButton(button, text) {
  if (!button) return;
  const original = button.textContent;
  button.textContent = text;
  setTimeout(() => {
    button.textContent = original;
  }, 1400);
}

function fretPatternText(frets) {
  return Array.isArray(frets) ? frets.map(fret => fret < 0 ? "x" : String(fret)).join("") : "";
}

function formatMemoDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" });
}
function getChordShapes(root, type) {
  const shapes = [];
  const verified = verifiedShapes(root, type);
  shapes.push(...verified);
  if (verified.length) {
    return uniqueShapes(shapes
      .map(shape => ({ ...shape, fingers: sanitizeFingers(shape.frets, shape.fingers) }))
      .filter(shape => !hasImpossibleFingerStretch(shape)))
      .sort((a, b) => shapeScore(a) - shapeScore(b));
  }
  const openKey = `${root}:${type}`;
  if (OPEN_SHAPES[openKey]) {
    const [frets, fingers, label] = OPEN_SHAPES[openKey];
    shapes.push({ frets, fingers: sanitizeFingers(frets, fingers), label, source: "open" });
  }
  if (type === "dim7") shapes.push(...dim7Shapes(root));
  if (type === "dim") shapes.push(...dimTriadSixthRootShapes(root));
  if (type === "m7b5") shapes.push(...halfDiminishedSixthRootShapes(root));
  movableTemplates(type).forEach(template => {
    const fret = rootFret(root, template.rootString);
    if (fret !== null && fret >= 0 && fret <= 11) {
      shapes.push({
        frets: template.rel.map(v => v < 0 ? -1 : v + fret),
        fingers: sanitizeFingers(template.rel.map(v => v < 0 ? -1 : v + fret), template.fingers),
        label: `${template.label}${fret === 0 ? "" : ` ${fret}F`}`,
        source: "movable"
      });
    }
  });
  return uniqueShapes(shapes
    .map(shape => ({ ...shape, fingers: sanitizeFingers(shape.frets, shape.fingers) }))
    .filter(shape => !hasImpossibleFingerStretch(shape)))
    .sort((a, b) => shapeScore(a) - shapeScore(b));
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
    dim7: [],
    aug: [
      { label: "6弦ルート", rootString: 6, rel: [0, 3, 2, 1, 1, 0], fingers: [1, 4, 3, 2, 2, 1] },
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
  return [{ frets: [-1, fret, fret + 1, fret - 1, fret + 1, -1], fingers: [0, 2, 3, 1, 4, 0], label: `5弦ルート ${fret}F`, source: "movable" }];
}

function sanitizeFingers(frets, fingers) {
  return fingers.map((finger, index) => frets[index] > 0 ? finger : 0);
}

function verifiedShapes(root, type) {
  const specs = VERIFIED_SHAPES[type]?.[root] || [];
  return specs.map(([frets, fingers], index) => ({
    frets: parseFretPattern(frets),
    fingers: parseFingerPattern(fingers),
    label: index === 0 ? "定番形" : "別形",
    source: "verified"
  }));
}

function parseFretPattern(pattern) {
  return [...pattern].map(char => {
    if (char === "x") return -1;
    if (/[0-9]/.test(char)) return Number(char);
    return char.toLowerCase().charCodeAt(0) - 87;
  });
}

function parseFingerPattern(pattern) {
  return [...pattern].map(char => Number(char) || 0);
}

function hasImpossibleFingerStretch(shape) {
  const fretsByFinger = new Map();
  shape.frets.forEach((fret, index) => {
    const finger = shape.fingers[index] || 0;
    if (finger > 0 && fret > 0) {
      const frets = fretsByFinger.get(finger) || new Set();
      frets.add(fret);
      fretsByFinger.set(finger, frets);
    }
  });
  return [...fretsByFinger.values()].some(frets => frets.size > 1);
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
  const sourceBonus = shape.source === "verified" ? -30 : shape.source === "open" ? -20 : 0;
  return sourceBonus + maxFret(shape) + minFret(shape) * .2 + shape.frets.filter(f => f < 0).length * 2;
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
  if (start > 1) {
    svg += `<text x="${left}" y="${bottom + 47}" font-size="14" font-weight="900" fill="${c.accent}">${start}フレットから表示</text>`;
    svg += `<text x="${left + 108}" y="${bottom + 47}" font-size="12" font-weight="700" fill="${c.muted}">1フレットではありません</text>`;
  }
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
    muted: s.getPropertyValue("--svg-muted").trim(),
    accent: s.getPropertyValue("--accent").trim()
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
  "m7b5": "m7b5", "m7-5": "m7b5", "min7b5": "m7b5",
  "dim": "dim",
  "dim7": "dim7",
  "aug": "aug", "+": "aug",
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
  return root && isActiveType(type) ? { root, type } : null;
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

