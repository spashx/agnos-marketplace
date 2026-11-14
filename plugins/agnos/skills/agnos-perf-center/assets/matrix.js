/* agnos-perf-center page script.
   Views: overview, search, filters, matrix, quality, detail panel, deep links.
   Panels: splitter bars, see the "resizable panels" section.
   Graph: see the "graph" section — the selection's neighbourhood as a traceability flow, columns by type.
   Call graph: functions as nodes, calls in typed arrays, see "call graph".
   Kept free of quality findings, each function under a cognitive complexity of 15.
   Every text taken from the data is inserted with textContent, never as HTML; every visual value comes
   from the design tokens' custom properties. */
"use strict";

(function () {

  // A literal written more than once is a named constant.
  const CSS_VAR_C_GRAPH_ARROW_SCALE = "--c-graph-arrow-scale";
  const CSS_VAR_C_GRAPH_BOX_FILL_OPACITY = "--c-graph-box-fill-opacity";
  const CSS_VAR_C_GRAPH_BOX_LABEL_GAP = "--c-graph-box-label-gap";
  const CSS_VAR_C_GRAPH_BOX_LABEL_SIZE = "--c-graph-box-label-size";
  const CSS_VAR_C_GRAPH_BOX_PADDING = "--c-graph-box-padding";
  const CSS_VAR_C_GRAPH_DIM = "--c-graph-dim";
  const CSS_VAR_C_GRAPH_LABEL_SIZE = "--c-graph-label-size";
  const CSS_VAR_C_GRAPH_NODE_FILL = "--c-graph-node-fill";
  const CSS_VAR_C_GRAPH_NODE_HEIGHT = "--c-graph-node-height";
  const CSS_VAR_C_GRAPH_NODE_SIZE_FILE = "--c-graph-node-size-file";
  const CSS_VAR_C_GRAPH_ROW_GAP = "--c-graph-row-gap";
  const CSS_VAR_C_GRAPH_SELECTED_BORDER = "--c-graph-selected-border";
  const CSS_VAR_C_GRAPH_SELECTED_BORDER_WIDTH = "--c-graph-selected-border-width";
  const CSS_VAR_S_FONT_MONO = "--s-font-mono";
  const CSS_VAR_S_SPACE_XL = "--s-space-xl";
  const CSS_VAR_S_WEIGHT_STRONG = "--s-weight-strong";
  const VALUE_ITEM = ".item";
  const CLASS_KPI_LABEL = "kpi-label";
  const CLASS_KPI_VALUE = "kpi-value";
  const CLASS_CHIP_COUNT = "chip-count";
  const CLASS_QUALITY_SHORTCUT = "quality-shortcut";
  const SVG_RECT = "rect";
  const TEXT_COMMITS = "commits";
  const TEXT_KEPT_SPACED = " kept by the filters";
  const KEY_ARROWLEFT = "ArrowLeft";
  const KEY_ARROWRIGHT = "ArrowRight";
  const TYPE_FILE = "FILE";
  const TYPE_FUNCTION = "FN";
  const VALUE_IMPLEMENTATION_DETAIL = "Implementation detail";
  const TYPE_UNDEFINED = "UNDEFINED";
  const KIND_UNDEFINED = "undefined";      // an ID cited but not in the index
  const VALUE_ARIA_EXPANDED = "aria-expanded";
  const VALUE_ARIA_LABEL = "aria-label";
  const VALUE_ARIA_PRESSED = "aria-pressed";
  const VALUE_ARIA_SELECTED = "aria-selected";
  const TAG_ARTICLE = "article";
  const STYLE_BACKGROUND_COLOR = "background-color";
  const STYLE_BACKGROUND_FILL = "background-fill";
  const STYLE_BACKGROUND_OPACITY = "background-opacity";
  const STYLE_BORDER_COLOR = "border-color";
  const STYLE_BORDER_STYLE = "border-style";
  const STYLE_BORDER_WIDTH = "border-width";
  const VALUE_BOXKEY = "boxKey";
  const VALUE_BUTT = "butt";
  const TAG_BUTTON = "button";
  const VALUE_CALL_SITE = "call site";
  const VALUE_CALL_SITES = "call sites";
  const VALUE_CALLS = "calls";
  const VALUE_CENTER = "center";
  const EVENT_CHANGE = "change";
  const VALUE_CHECKBOX = "checkbox";
  const EVENT_CLICK = "click";
  const LINK_KIND_CODE = "code";
  const LINK_KIND_DEFINES = "defines";
  const VALUE_AMBIGUOUS = "ambiguous";
  const CSS_QUICK_DELAY = "--c-search-tip-delay";
  const VALUE_CONTAINS = "contains";
  const VALUE_COVERAGE_FILTER = "coverage-filter";
  const VALUE_COVERAGE_ITEM = "coverage-item";
  const VALUE_COVERAGE_ITEM_LABEL = "coverage-item-label";
  const VALUE_COVERAGE_ITEM_VALUE = "coverage-item-value";
  const STYLE_CURVE_STYLE = "curve-style";
  const VALUE_DASHED = "dashed";
  const CY_DATA_LABEL = "data(label)";
  const CY_DATA_WIDTH = "data(width)";
  const VALUE_DEPTH = "depth";
  const VALUE_DETAIL_LEVEL = "detail-level";
  const VALUE_DROP_TARGET = "drop-target";
  const VALUE_EDGE = "edge";
  const VALUE_EDGES = "edges";
  const VALUE_ELEMENT = "element";
  const VALUE_FADED = "faded";
  const STYLE_FONT_FAMILY = "font-family";
  const STYLE_FONT_SIZE = "font-size";
  const STYLE_FONT_WEIGHT = "font-weight";
  const VALUE_GRAPH = "graph";
  const VALUE_GRAPH_SCROLL = "graph-scroll";
  const TAG_HEADER = "header";
  const VALUE_HOVER = "hover";
  const DOM_INPUT = "input";
  const VALUE_ITEM_2 = "item";
  const EVENT_KEYDOWN = "keydown";
  const EVENT_FOCUS = "focus";
  const EVENT_BLUR = "blur";
  const VALUE_KPI_SUB = "kpi-sub";
  const TAG_LABEL = "label";
  const VALUE_LEGEND_ITEM = "legend-item";
  const VALUE_LINE = "line";
  const VALUE_LINES = "lines";
  const STYLE_LINE_COLOR = "line-color";
  const VALUE_MATRIX = "matrix";
  const VALUE_MATRIX_TABLE = "matrix-table";
  const EVENT_MOUSEOUT = "mouseout";
  const EVENT_MOUSEOVER = "mouseover";
  const VALUE_NEAR = "near";
  const VALUE_NODE_ITEM = "node.item";
  const VALUE_NODES = "nodes";
  const VALUE_NONE = "none";
  const VALUE_OVERVIEW = "overview";
  const EVENT_POINTERCANCEL = "pointercancel";
  const EVENT_POINTERMOVE = "pointermove";
  const EVENT_POINTERUP = "pointerup";
  const VALUE_ROUND = "round";
  const VALUE_ROUND_RECTANGLE = "round-rectangle";
  const VALUE_SEARCH_EMPTY = "search-empty";
  const VALUE_SELECTED = "selected";
  const VALUE_SHOW_ENCLOSING = "show-enclosing";
  const VALUE_SHOW_FILES = "show-files";
  const VALUE_SHOW_FUNCTIONS = "show-functions";
  const CALL_GRAPH_CARD = "call-graph-card";
  const VALUE_SHOW_HIERARCHY = "show-hierarchy";
  const VALUE_SOLID = "solid";
  const TAG_SPAN = "span";
  const STYLE_TARGET_ARROW_SHAPE = "target-arrow-shape";
  const TAG_TBODY = "tbody";
  const STYLE_TEXT_HALIGN = "text-halign";
  const STYLE_TEXT_VALIGN = "text-valign";
  const TAG_THEAD = "thead";
  const VALUE_TOGGLE = "toggle";
  const VALUE_TRUE = "true";
  const VALUE_WIDTH = "width";
  const STARTED = performance.now();
  // as amended: the data come from <page>.data.js, written beside the page.
  const DATA = window.AGNOS_PERF_CENTER_DATA;
  if (!DATA) {
    showDataMissing();
    return;
  }

  function showDataMissing() {
    const missing = document.querySelector('script[src$=".data.js"]')?.getAttribute("src") || "the data script";   // not a library's
    document.body.replaceChildren(Object.assign(document.createElement("p"), { className: "data-missing",
      textContent: `The traceability data are missing: ${missing} must stand beside this page (with its .json twin). `
        + "Generate them again with the agnos-perf-center skill." }));
  }

  // ---- libraries -------------------------------
  // The libraries come from cdnjs; one that could not be loaded is said in place of what needs it, never called.
  const GLOBAL_CYTOSCAPE = "cytoscape";
  const LIBRARIES = new Map((DATA.meta.libraries || []).map((lib) => [lib.global, lib]));
  const libraryLoaded = (global) => window[global] !== undefined;

  function libraryMissing(global) {
    const lib = LIBRARIES.get(global) || { name: global, use: "this view" };
    const box = document.createElement("div");
    box.className = "library-missing";
    box.setAttribute("role", "status");
    box.textContent = `${lib.name} could not be loaded: ${lib.use} needs a network connection to cdnjs.cloudflare.com. `
      + "The other views work without it.";
    return box;
  }

  // ---- library charts --------------------------
  // An ECharts chart drawn in SVG, its look read from the resolved design tokens, drawn again when the theme changes,
  // with ARIA (no pattern:), and a keyboard path over its data items. No visual value is written here.
  const GLOBAL_ECHARTS = "echarts";
  const CHART_RENDERER = "svg";
  const CHART_NEXT_KEYS = new Set(["ArrowRight", "ArrowDown"]);
  const CHART_PREVIOUS_KEYS = new Set(["ArrowLeft", "ArrowUp"]);
  const CHART_ACTIVATE_KEYS = new Set(["Enter", " "]);
  const CHART_AXES = ["xAxis", "yAxis", "radiusAxis", "angleAxis"];
  const CSS_VAR_S_FONT_SANS = "--s-font-sans";
  const CSS_VAR_C_CARD_BG = "--c-card-bg";
  const libraryCharts = [];
  const cssValue = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const cssSize = (name) => Number.parseFloat(cssValue(name));

  function chartTheme() {
    const text = cssValue("--s-text");
    const muted = cssValue("--s-text-muted");
    const border = cssValue("--s-border");
    const fontFamily = cssValue(CSS_VAR_S_FONT_SANS);
    const caption = { color: muted, fontFamily, fontSize: cssSize("--s-text-caption") };
    const small = { color: text, fontFamily, fontSize: cssSize("--s-text-small") };
    const line = { lineStyle: { color: border } };
    return {
      textStyle: small,
      legend: { textStyle: caption },
      tooltip: { backgroundColor: cssValue(CSS_VAR_C_CARD_BG), borderColor: cssValue("--c-card-border"), textStyle: small },
      axis: { axisLine: line, axisTick: line, splitLine: line, axisLabel: caption, nameTextStyle: caption },
      colour: { text, muted, border, accent: cssValue("--s-accent"), surface: cssValue(CSS_VAR_C_CARD_BG) },
      caption, small,
    };
  }

  // The option a chart's build gives, with the theme's text, legend, tooltip and axes under its own settings.
  function themedOption(option, theme, description) {
    const withAxis = (axis) => ({ ...theme.axis, ...axis });
    const themed = { ...option, animation: false, backgroundColor: "transparent", textStyle: theme.textStyle,
      tooltip: { ...theme.tooltip, ...option.tooltip },
      aria: { enabled: true, decal: { show: false }, label: { enabled: true, description } } };   // No pattern
    if (option.legend) themed.legend = { ...theme.legend, ...option.legend };
    for (const key of CHART_AXES) {
      if (option[key]) themed[key] = Array.isArray(option[key]) ? option[key].map(withAxis) : withAxis(option[key]);
    }
    return themed;
  }

  function drawLibraryChart(entry) {
    entry.chart?.dispose();
    entry.chart = window[GLOBAL_ECHARTS].init(entry.box, null, { renderer: CHART_RENDERER });
    entry.chart.setOption(themedOption(entry.build(chartTheme()), chartTheme(), entry.options.description));
    entry.chart.on("click", (params) => entry.options.onActivate?.({ seriesIndex: params.seriesIndex, dataIndex: params.dataIndex, params }));
    entry.box.setAttribute("aria-label", entry.options.label);          // ECharts writes its description there
    entry.box.setAttribute("aria-description", entry.options.description);
    entry.index = -1;
  }

  function chartStep(key) {
    if (CHART_NEXT_KEYS.has(key)) return 1;
    return CHART_PREVIOUS_KEYS.has(key) ? -1 : 0;
  }

  // Tab reaches the chart, the arrows go from item to item showing its tooltip, Enter does what a click does.
  function chartKeys(entry, event) {
    const items = entry.options.items || [];
    if (!items.length) return;
    if (CHART_ACTIVATE_KEYS.has(event.key)) {
      if (entry.index >= 0) { event.preventDefault(); entry.options.onActivate?.(items[entry.index]); }
      return;
    }
    const step = chartStep(event.key);
    if (!step) return;
    event.preventDefault();
    entry.index = (entry.index + step + items.length) % items.length;
    entry.options.onPoint?.(items[entry.index]);
    entry.chart.dispatchAction({ type: "downplay" });
    entry.chart.dispatchAction({ type: "highlight", ...items[entry.index] });
    entry.chart.dispatchAction({ type: "showTip", ...items[entry.index] });
  }

  // A chart in box from build(theme), or null with the missing-library message; options: label,
  // description, items ({seriesIndex, dataIndex} in keyboard order), onActivate(item).
  function libraryChart(box, build, options) {
    for (let i = libraryCharts.length - 1; i >= 0; i -= 1) {
      if (!libraryCharts[i].box.isConnected) { libraryCharts[i].chart?.dispose(); libraryCharts.splice(i, 1); }
    }
    if (!libraryLoaded(GLOBAL_ECHARTS)) {
      box.replaceChildren(libraryMissing(GLOBAL_ECHARTS));
      return null;
    }
    const entry = { box, build, options, chart: null, index: -1 };
    Object.assign(box, { tabIndex: 0 });
    box.addEventListener("keydown", (event) => chartKeys(entry, event));
    box.addEventListener(EVENT_BLUR, () => entry.chart?.dispatchAction({ type: "hideTip" }));
    new ResizeObserver(() => entry.chart?.resize()).observe(box);
    drawLibraryChart(entry);
    libraryCharts.push(entry);
    return entry.chart;
  }

  // The charts drawn again in the theme now in force.
  function redrawLibraryCharts() {
    for (const entry of libraryCharts) if (entry.box.isConnected && libraryLoaded(GLOBAL_ECHARTS)) drawLibraryChart(entry);
  }

  // ---- vocabulary ---------------------------------------------------------------------------------------------
  const TYPES = ["FTR", "RQ", "ADR", "DEC", "PLAN", "TASK"];
  const CALL_GRAPH = DATA.callGraph || null;     // only in a page generated with --call-graph
  const NODE_TYPES = [...TYPES, ...(CALL_GRAPH ? ["FN"] : []), "FILE", "UNDEFINED"];
  const TYPE_NAME = {
    FTR: ["Feature", "Features"], RQ: ["Requirement", "Requirements"], ADR: ["ADR", "ADRs"],
    DEC: ["Decision", "Decisions"], PLAN: ["Plan", "Plans"], TASK: ["Task", "Tasks"], FN: ["Function", "Functions"],
    FILE: ["Source file", "Source files"], UNDEFINED: ["Undefined ID", "Undefined IDs"],
  };
  const RELATION = {
    "contains:out": "contains", "contains:in": "part of", "refs:out": "cites", "refs:in": "cited by",
    "code:out": "cites", "code:in": "cited in", "defines:out": "defines", "defines:in": "defined in",
  };
  const COVERAGE = {
    covered: ["Covered", "a source file cites the requirement"],
    indirect: ["Indirect", "a source file cites a decision, task or ADR linked to it"],
    uncovered: ["Uncovered", "no source file cites it, directly or indirectly"],
  };
  // A check's badge by its risk; its title, rule and findings come from the data's `quality` block.
  const CHECK_BADGE = { critical: "error", high: "warn", medium: "warn", low: "warn", informational: "neutral" };
  const INFORMATIONAL = "informational";
  const ITEMS_FILE = "file";
  const ITEMS_FUNCTION = "function";
  const FUNCTIONS_CHECK = "functions-traced";
  const SCORE_MAX = 10;
  const SCORE_DECIMALS = 1;
  const FIX_FIRST_SHOWN = 3;
  const SEARCH_LIMIT = 60;
  const CELL_LIMIT = 3;
  const RANK_TITLE = 3;                 // a search match: ID equal 0, ID start 1, ID part 2, title part 3, none -1
  const RANK_NONE = -1;
  const RESULT_NODE = 3;                // a search result is [rank, type order, label, node]
  const FINDINGS_SHOWN = 60;
  const EVIDENCE_SHOWN = 3;
  const PERCENT = 100;
  const FILE_PREFIX = "file:";
  const FN_PREFIX = "fn:";
  const COMMIT_PREFIX = "commit:";      // a commit selected in the detail panel: commit:<short hash>
  const isCommitKey = (key) => Boolean(key) && key.startsWith(COMMIT_PREFIX);
  const CALLS_SHOWN = 50;               // callers or callees listed at first, and added per "more"
  // The levels of detail, and the boxes drawn in place of functions above the function level.
  const DETAIL = { namespace: "namespace", class: "class", function: "function" };
  const BOX_PREFIX = "box:";            // a box's key: box:<qualified scope name>
  const NAMESPACE_KIND = "namespace";   // a scope's kind in the call graph's scope table
  const CLASS_KIND = "class";
  // as amended: one box for what stands in no named namespace, anonymous ones included.
  const GLOBAL_BOX = "global";
  const GLOBAL_LABEL = "(global namespace)";
  const GLOBAL_KEY = BOX_PREFIX + "(global)";
  const BOX_KINDS = [NAMESPACE_KIND, CLASS_KIND, GLOBAL_BOX];
  const SEPARATOR_RE = /^[:.]+/;        // what joins a scope's name to an inner name (C++ "::", others ".")
  // The words of the toolbar, the legend and the panels.
  const BOX_NAME = { [NAMESPACE_KIND]: "Namespace", [CLASS_KIND]: "Class", [GLOBAL_BOX]: "Global namespace" };
  const DETAIL_CHOICES = [
    [DETAIL.namespace, "Namespace", "Namespaces only, the calls merged between them; the rest in the (global namespace)"],
    [DETAIL.class, "Class", "Classes, the calls merged between them; a namespace's free functions in its own frame"],
    [DETAIL.function, "Function", "Every function, in the frame of its class or namespace"],
  ];
  const ENCLOSING_HINT = "Draw the enclosing scopes: each class inside its namespace, or the global namespace, and each "
    + "function's class inside its namespace; off, each class stands alone. Scopes drawn are namespaces, modules, "
    + "packages and classes; blocks and functions are not. Not available at the Namespace detail";
  const DETAIL_HINT = "How finely the implementation is drawn: by namespace, by class, or function by function in their scopes";
  const DETAIL_OFF_HINT = "Turn on Implementation (or the Functions type filter) to choose how finely it is drawn";
  const IMPLEMENTATION_HINT = "Draw the implementation: the functions, classes or namespaces citing the elements, at the "
    + "chosen detail, and their calls (caller → callee); same as the Functions type filter";
  const BOX_HINT = {
    [NAMESPACE_KIND]: "a namespace, module or package: its classes and functions (dashed frame)",
    [CLASS_KIND]: "a class or struct: its methods",
    [GLOBAL_BOX]: "what stands in no named namespace: global and anonymous-namespace functions, classes outside a namespace",
  };
  const SCOPE_FIELD = 7;                // a function row's scope index (-1: none)

  // ---- DOM helpers (text only) --------------------------------------------------------------------------------
  const isAbsent = (value) => value === undefined || value === null || value === false;

  function setProp(node, key, value) {
    if (key === "class") node.className = value;
    else if (key === "text") node.textContent = value;
    else if (key === "on") Object.entries(value).forEach(([type, fn]) => node.addEventListener(type, fn));
    else if (key === "style") Object.entries(value).forEach(([prop, v]) => node.style.setProperty(prop, v));
    else node.setAttribute(key, value === true ? "" : String(value));
  }

  function el(tag, props, ...children) {
    const node = document.createElement(tag);
    Object.entries(props || {}).filter(([, value]) => !isAbsent(value)).forEach(([key, value]) => setProp(node, key, value));
    children.flat().filter((child) => !isAbsent(child))
      .forEach((child) => node.append(child instanceof Node ? child : document.createTextNode(String(child))));
    return node;
  }
  const $ = (id) => document.getElementById(id);
  const clear = (node) => { node.replaceChildren(); return node; };
  const plural = (type, n) => TYPE_NAME[type][n === 1 ? 0 : 1];
  const pct = (part, whole) => (whole ? Math.round((PERCENT * part) / whole) : 0);

  // ---- the page's rich tooltip --------------------------------------------
  // One card for every piece of business information: a bold first line, its details below, beside its target and kept
  // inside the window; shown on hover after a delay token and at once on keyboard focus. The browser's title is left to
  // what a control does.
  const TIP_ID = "tip";
  const TIP_HEAD = "tip-head";
  const TIP_LINE = "tip-line";
  let richTipTimer = null;

  // content: { head, type (a dot of that element type before the head), lines (a text, or a list of texts and nodes),
  // mono (the lines that are code) }
  function showRichTip(target, content) {
    clearTimeout(richTipTimer);
    const tip = $(TIP_ID);
    const head = el("div", { class: TIP_HEAD }, content.type ? el("span", { class: `dot t-${content.type}` }) : null, content.head);
    clear(tip).append(head, ...(content.lines || []).filter((line) => line !== null && line !== undefined && line !== "")
      .map((line, i) => el("div", { class: `${TIP_LINE}${(content.mono || []).includes(i) ? " tip-mono" : ""}` }, line)));
    const box = target.getBoundingClientRect ? target.getBoundingClientRect() : target;
    tip.hidden = false;
    const size = tip.getBoundingClientRect();
    const left = box.right + size.width > window.innerWidth ? box.left - size.width : box.right;
    const top = box.bottom + size.height > window.innerHeight ? box.top - size.height : box.bottom;
    tip.style.left = `${Math.max(0, left)}px`;
    tip.style.top = `${Math.max(0, top)}px`;
  }

  function hideRichTip() {
    clearTimeout(richTipTimer);
    $(TIP_ID).hidden = true;
  }

  function scheduleRichTip(target, contentOf, delayToken) {
    clearTimeout(richTipTimer);
    if (!delayToken) { showRichTip(target, contentOf()); return; }           // no delay token: at once, as the charts
    const delay = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue(delayToken));
    richTipTimer = setTimeout(() => showRichTip(target, contentOf()), delay);
  }

  // A node that raises a rich tooltip: never a browser title of its own.
  function richTip(node, contentOf, delayToken) {
    node.removeAttribute("title");
    node.dataset.richTip = VALUE_TRUE;
    if (!node.matches("button, a, input, [tabindex]")) node.setAttribute("tabindex", "0");     // a keyboard path
    node.addEventListener(EVENT_MOUSEOVER, () => scheduleRichTip(node, contentOf, delayToken));
    node.addEventListener(EVENT_MOUSEOUT, hideRichTip);
    node.addEventListener(EVENT_FOCUS, () => showRichTip(node, contentOf()));
    node.addEventListener(EVENT_BLUR, hideRichTip);
    return node;
  }

  // ---- model --------------------------------------------------------------------------------------------------
  const nodes = new Map();
  const links = new Map();
  addElements();
  addFiles();
  const fnKeys = addFunctions();
  openLinks();
  const addLink = (from, to, kind, lines) => {
    links.get(from).push({ key: to, kind, dir: "out", lines });
    links.get(to).push({ key: from, kind, dir: "in", lines });
  };
  addEdges();
  addFunctionLinks();
  const calls = buildCalls();
  const boxes = buildBoxes();
  const nodeOf = (key) => nodes.get(key) || boxes.get(key);
  const byKeyLabel = (a, b) => nodeOf(a).label.localeCompare(nodeOf(b).label, undefined, { numeric: true });
  indexSearch();

  function addElements() {
    for (const e of DATA.elements) {
      nodes.set(e.id, {
        key: e.id, label: e.id, type: e.kind === KIND_UNDEFINED ? TYPE_UNDEFINED : e.type, elementType: e.type,
        kind: e.kind, title: e.title, tri: e.tri, status: e.status, doc: e.doc, first: e.first, last: e.last,
      });
    }
  }

  function addFiles() {
    for (const f of DATA.files) {
      const key = FILE_PREFIX + f.path;
      nodes.set(key, { key, label: f.path, type: TYPE_FILE, kind: "file", title: "", tri: "", path: f.path, ids: f.ids });
    }
  }

  function openLinks() {
    for (const key of nodes.keys()) links.set(key, []);
  }

  function countTypes() {
    const found = Object.fromEntries(NODE_TYPES.map((t) => [t, 0]));
    for (const n of nodes.values()) found[n.type] += 1;
    return found;
  }

  function addEdges() {
    for (const [source, target, kind, lines] of DATA.edges) {
      const from = kind === LINK_KIND_CODE ? FILE_PREFIX + source : source;
      if (nodes.has(from) && nodes.has(target)) addLink(from, target, kind, lines);
    }
  }

  function indexSearch() {              // the search's index, made once
    for (const n of nodes.values()) {
      n.find = n.label.toLowerCase();
      n.findTitle = (n.title || "").toLowerCase();
    }
  }
  const typeOrder = (type) => NODE_TYPES.indexOf(type);
  const requirements = DATA.elements.filter((e) => e.kind === VALUE_ELEMENT && e.type === "RQ").map((e) => nodes.get(e.id));
  const counts = countTypes();
  const trigrams = [...new Set(DATA.elements.filter((e) => e.kind === VALUE_ELEMENT).map((e) => e.tri))]
    .sort((a, b) => a.localeCompare(b));
  const CHECKS = DATA.quality.checks;
  const checkBadgeClass = (check) => "badge badge-" + (check.findings.length ? CHECK_BADGE[check.risk] : "ok");
  // A finding is an element's ID, a file's path or the index of a function of the call graph.
  const findingKey = (check, item) => {
    if (check.items === ITEMS_FILE) return FILE_PREFIX + item;
    return check.items === ITEMS_FUNCTION ? fnKeys[item] : item;
  };
  const findingKeys = (check) => check.findings.map((item) => findingKey(check, item));

  // ---- call graph -------------------------------------------
  // Functions are nodes like the others, contained by their file and citing the IDs of their lines. Their calls stay
  // in typed arrays, compressed rows per caller and per callee, built once: a view asks callers(i) or callees(i) and
  // gets objects for those calls only, never one object per call of the whole graph.
  function addFunctions() {
    if (!CALL_GRAPH) return [];
    return CALL_GRAPH.functions.map(([file, first, last, name, language, text, dup]) => {
      const path = DATA.files[file].path;
      const suffix = dup ? "." + dup : "";
      const key = `${FN_PREFIX}${path}:${first}${suffix}`;
      nodes.set(key, { key, label: name, type: "FN", kind: "function", title: text, tri: "", doc: path, path, first, last,
        file: FILE_PREFIX + path, language: CALL_GRAPH.languages[language] });
      return key;
    });
  }

  // A function's IDs carry the lines of its file's own citations: the proofs are stored once, in the file's links.
  function addFunctionLinks() {
    for (const key of fnKeys) addLink(nodes.get(key).file, key, LINK_KIND_DEFINES, []);
    const proofs = new Map();
    const proofsOf = (fileKey, id) => {
      if (!proofs.has(fileKey)) {
        proofs.set(fileKey, new Map(links.get(fileKey).filter((l) => l.kind === LINK_KIND_CODE && l.dir === "out")
          .map((l) => [l.key, l.lines])));
      }
      return proofs.get(fileKey).get(id) || [];
    };
    for (const [index, id, lineNumbers] of CALL_GRAPH?.ids || []) {
      const key = fnKeys[index];
      if (!nodes.has(id)) continue;
      const wanted = new Set(lineNumbers);
      addLink(key, id, LINK_KIND_CODE, proofsOf(nodes.get(key).file, id).filter(([no]) => wanted.has(no)));
    }
  }

  function buildCalls() {
    if (!CALL_GRAPH) return null;
    const flat = CALL_GRAPH.calls;
    const n = fnKeys.length;
    const m = CALL_GRAPH.counts.calls;
    const from = new Int32Array(m);
    const to = new Int32Array(m);
    const ambiguous = new Uint8Array(m);
    const lineStart = new Int32Array(m + 1);
    const lines = new Int32Array(flat.length);
    let p = 0;
    let caller = 0;
    let c = 0;
    let l = 0;
    while (p < flat.length) {
      caller += flat[p++];
      const first = CALL_GRAPH.functions[caller][1];
      for (let k = flat[p++]; k > 0; k -= 1, c += 1) {
        from[c] = caller;
        to[c] = caller + flat[p++];
        const word = flat[p++];
        ambiguous[c] = word % 2;
        lineStart[c] = l;
        for (let count = Math.floor(word / 2); count > 0; count -= 1) lines[l++] = first + flat[p++];
      }
    }
    lineStart[c] = l;
    const rows = (ends) => {
      const start = new Int32Array(n + 1);
      for (let i = 0; i < m; i += 1) start[ends[i] + 1] += 1;
      for (let i = 0; i < n; i += 1) start[i + 1] += start[i];
      const order = new Int32Array(m);
      const fill = start.slice(0, n);
      for (let i = 0; i < m; i += 1) order[fill[ends[i]]++] = i;
      return { start, order };
    };
    const out = rows(from);
    const into = rows(to);
    const call = (i, other) => ({ key: fnKeys[other], ambiguous: ambiguous[i] === 1,
      lines: Array.from(lines.subarray(lineStart[i], lineStart[i + 1])) });
    const list = (r, i, other) => {
      const found = [];
      for (let j = r.start[i]; j < r.start[i + 1]; j += 1) found.push(call(r.order[j], other[r.order[j]]));
      return found;
    };
    // The graph's walk: visit(other key, ambiguous, direction) per call of the function, with no object per call.
    const each = (i, visit) => {
      for (let j = out.start[i]; j < out.start[i + 1]; j += 1) visit(fnKeys[to[out.order[j]]], ambiguous[out.order[j]], "out");
      for (let j = into.start[i]; j < into.start[i + 1]; j += 1) visit(fnKeys[from[into.order[j]]], ambiguous[into.order[j]], "in");
    };
    return {
      index: new Map(fnKeys.map((key, i) => [key, i])),
      callees: (i) => list(out, i, to),
      callers: (i) => list(into, i, from),
      each,
    };
  }

  // ---- boxes ---------------------------------------------
  // A namespace or class of the scope table, or the (global) box of what stands in no named namespace,
  // drawn in place of its functions at the namespace and class levels. A class outside any namespace is in (global).
  function buildBoxes() {
    const found = new Map();
    const scopes = CALL_GRAPH?.scopes || [];
    const scopeKey = (i) => BOX_PREFIX + scopes[i][0];
    if (CALL_GRAPH) found.set(GLOBAL_KEY, { key: GLOBAL_KEY, label: GLOBAL_LABEL, type: "FN", box: GLOBAL_BOX, parent: null });
    const outerOf = (kind, parent) => {
      if (parent >= 0) return scopeKey(parent);
      return kind === CLASS_KIND ? GLOBAL_KEY : null;
    };
    scopes.forEach(([name, kind, parent], i) => found.set(scopeKey(i), { key: scopeKey(i), label: name, type: "FN",
      box: kind, parent: outerOf(kind, parent), scope: i }));
    // The box standing for function i: itself at the function level, its own scope at the class level, its nearest
    // namespace at the namespace level, else (global).
    const of = (i, level) => {
      if (level === DETAIL.function) return fnKeys[i];
      let scope = CALL_GRAPH.functions[i][SCOPE_FIELD];
      while (level === DETAIL.namespace && scope >= 0 && scopes[scope][1] !== NAMESPACE_KIND) scope = scopes[scope][2];
      return scope >= 0 ? scopeKey(scope) : GLOBAL_KEY;
    };
    const scopeOf = (i) => {                       // the key of a function's own scope box, null when it has none
      const scope = CALL_GRAPH.functions[i][SCOPE_FIELD];
      return scope >= 0 ? scopeKey(scope) : null;
    };
    const get = (key) => found.get(key);
    // The functions a box holds, directly or through its inner boxes: those of a scope and its inner scopes, or, for
    // (global), every function standing in it at the namespace level.
    const members = new Map();
    const within = (i, key) => {
      if (key === GLOBAL_KEY) return of(i, DETAIL.namespace) === key;
      for (let scope = CALL_GRAPH.functions[i][SCOPE_FIELD]; scope >= 0; scope = scopes[scope][2]) {
        if (scopeKey(scope) === key) return true;
      }
      return false;
    };
    const membersOf = (key) => {
      if (!members.has(key)) members.set(key, fnKeys.map((_, i) => i).filter((i) => within(i, key)));
      return members.get(key);
    };
    const innerOf = (key) => [...found.values()].filter((box) => box.parent === key).map((box) => box.key);
    return { get, of, scopeOf, membersOf, innerOf };
  }

  // ---- state --------------------------------------------------------------------------------------------------
  const state = {
    selected: null, view: VALUE_OVERVIEW, search: "", coverage: "all", sort: { column: "id", dir: 1 },
    types: new Set(NODE_TYPES.filter((t) => t !== "FN")),   // functions off at load
    tris: new Set(trigrams), openChecks: new Set(), moreFindings: new Set(),
  };
  const isVisible = (node) => state.types.has(node.type) && (!node.tri || state.tris.has(node.tri));

  // ---- graph ------------------------------------------------
  // The neighbourhood of the selection is laid out as a traceability flow: one column per element family, left to
  // right, each node a labelled pill tinted with its type colour.
  const COLUMNS = [["FTR"], ["RQ"], ["ADR", "DEC"], ["PLAN", "TASK"], ["FN"], ["FILE"], ["UNDEFINED"]];
  const COLUMN_NAME = ["Features", "Requirements", "ADRs · decisions", "Plans · tasks", "Implementation", "Source files",
    "Undefined IDs"];                   // The code column holds functions, classes or namespaces
  // One look per relation — dash pattern token (none: solid), colour token, arrow at the target — read by
  // the graph's style and by the legend's drawn samples alike. Each relation has a colour of its own.
  const EDGE_LOOK = {
    contains: { dash: "--c-graph-dash-contains", colour: "--c-graph-edge-contains", arrow: "triangle",
      meaning: "specification hierarchy (feature → requirement, ADR → decision, plan → task)" },
    refs: { dash: "", colour: "--c-graph-edge-cites", arrow: "triangle", meaning: "cites (citing → cited)" },
    code: { dash: "--c-graph-dash-code", colour: "--c-graph-edge-code", arrow: "triangle",
      meaning: "cited in code (file or function → ID)" },
    ...(CALL_GRAPH ? {
      defines: { dash: "--c-graph-dash-defines", colour: "--c-graph-edge-defines", arrow: "triangle",
        meaning: "defines (file → function)" },
      calls: { dash: "", colour: "--c-graph-edge-call", arrow: "triangle", meaning: "calls (caller → callee)" },
      ambiguous: { dash: "", colour: "--c-graph-edge-ambiguous", arrow: "triangle",
        meaning: "ambiguous call (the name matches several definitions)" },
    } : {}),
  };
  const EDGE_SELECTOR = { ambiguous: 'edge[kind = "calls"][?ambiguous]' };
  const SAMPLE_WIDTH = 32;              // the legend's line sample, in its own SVG units
  const SAMPLE_HEIGHT = 10;
  const SAMPLE_ARROW = 7;
  const MAX_DRAWN = 400;                // nodes drawn at most, nearest levels first
  const MAX_ROWS = 18;                  // a taller column wraps into sub-columns
  const MAX_PER_COLUMN = 72;            // beyond this, the column ends with a "+n more" note
  const MONO_CHAR_RATIO = 0.62;         // width of a monospace character, as a share of the font size
  const LABEL_MAX_CHARS = 26;
  const STRIPE_PERCENT = 7;             // the type colour band at the left of a pill, as a share of its width
  const BOW_RATIO = 0.35;               // how far a same-column edge bows out, as a share of its height
  const BOW_WEIGHT = 0.5;               // the bow's control point sits halfway along the edge
  const graph = createGraph();

  function shortLabel(n) {
    return clip(n.type === TYPE_FILE ? n.label.split("/").pop() : n.label);
  }

  function clip(text) {
    return text.length > LABEL_MAX_CHARS ? `${text.slice(0, LABEL_MAX_CHARS - 1)}…` : text;
  }

  // A name drawn inside its box, without the box's own name: "send" in net::Port, "Port" in net.
  function nameIn(name, outer) {
    return outer && name.startsWith(outer) ? name.slice(outer.length).replace(SEPARATOR_RE, "") || name : name;
  }

  // The nearest levels of a walk (its Map's first entries), the last one cut where MAX_DRAWN falls.
  function nearest(levels) {
    return levels.size > MAX_DRAWN ? new Map([...levels].slice(0, MAX_DRAWN)) : levels;
  }

  // The call-site count of one call link.
  function callSites(caller, callee) {
    return calls.callees(calls.index.get(caller)).find((c) => c.key === callee)?.lines.length || 0;
  }

  // One call merged into a link between boxes: its call sites, by caller and line, and its ambiguity.
  function mergeCall(data, call, caller, sites) {
    data.ambiguous = (data.ambiguous ?? true) && call.ambiguous;
    if (!sites.has(data.id)) sites.set(data.id, new Set());
    for (const line of call.lines) sites.get(data.id).add(caller + line);
  }

  // The callers and callees of a selected function, or null when the selection is no function.
  function callSplit(selected) {
    const index = calls?.index.get(selected);
    if (index === undefined) return null;
    return { callers: new Set(calls.callers(index).map((c) => c.key)), callees: new Set(calls.callees(index).map((c) => c.key)) };
  }

  // The same split by box: the boxes calling the selection's box, and those it calls, among the walk's.
  function boxSplit(members, drawnOf, centre) {
    if (!boxes.get(centre)) return null;
    const split = { callers: new Set(), callees: new Set() };
    for (const key of members.keys()) {
      const index = calls.index.get(key);
      if (index === undefined || drawnOf(key) !== centre) continue;
      for (const c of calls.callers(index)) if (members.has(c.key)) split.callers.add(drawnOf(c.key));
      for (const c of calls.callees(index)) if (members.has(c.key)) split.callees.add(drawnOf(c.key));
    }
    return split;
  }

  // Where the walk starts: the selection itself, or the functions of a selected box.
  function boxStarts(start) {
    return boxes.get(start) ? boxes.membersOf(start).map((i) => fnKeys[i]) : [start];
  }

  // The order of a boxed column: box by box, the selection's own boxes first at each depth, then by name.
  function chainOrder(chains, selected) {
    const mine = chains.get(selected) || [];
    const byName = (a, b) => nodeOf(a).label.localeCompare(nodeOf(b).label, undefined, { numeric: true });
    return (a, b) => {
      const x = chains.get(a);
      const y = chains.get(b);
      for (let d = 0; d < Math.max(x.length, y.length); d += 1) {
        if (x[d] === y[d]) continue;
        if (x[d] === undefined || y[d] === undefined) return x.length - y.length;
        return (y[d] === mine[d]) - (x[d] === mine[d]) || byName(x[d], y[d]);
      }
      return (b === selected) - (a === selected) || byName(a, b);
    };
  }

  // The calls of one function to the kept nodes, as graph edges.
  function callEdges(index, key, kept) {
    const edges = [];
    calls.each(index, (other, ambiguous, dir) => {
      if (dir === "out" && other !== key && kept.has(other)) {       // a recursive call is not drawn
        edges.push({ group: VALUE_EDGES, data: { id: `${key}>${other}>calls`, source: key, target: other, kind: VALUE_CALLS,
          ambiguous: ambiguous === 1, curve: 0 } });
      }
    });
    return edges;
  }

  function createGraph() {
    const container = $("cy");
    let tipTimer = null;
    let cy = null;
    let depth = 1;
    let detail = DETAIL.function;       // The level of detail, the function level by default
    let enclosing = true;               // The enclosing boxes drawn around the level's own
    let centre = null;                  // the drawn node standing for the selection: itself, or its box
    let dirty = true;
    const prop = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const num = (name) => Number.parseFloat(prop(name));
    const showFiles = () => $(VALUE_SHOW_FILES).checked;
    const showHierarchy = () => $(VALUE_SHOW_HIERARCHY).checked;
    const columnOf = (type) => COLUMNS.findIndex((c) => c.includes(type));

    function style() {
      const fontSize = num(CSS_VAR_C_GRAPH_LABEL_SIZE);
      const fill = prop(CSS_VAR_C_GRAPH_NODE_FILL);
      const typeStyles = NODE_TYPES.map((t) => {
        const colour = prop(`--s-type-${t.toLowerCase()}`);
        return { selector: `node.item[type = "${t}"]`, style: { [STYLE_BORDER_COLOR]: colour,
          "background-gradient-stop-colors": [colour, colour, fill, fill],
          "background-gradient-stop-positions": [0, STRIPE_PERCENT, STRIPE_PERCENT, PERCENT] } };
      });
      return [
        { selector: VALUE_NODE_ITEM, style: {
          shape: VALUE_ROUND_RECTANGLE, label: CY_DATA_LABEL, width: CY_DATA_WIDTH, height: num(CSS_VAR_C_GRAPH_NODE_HEIGHT),
          [STYLE_BACKGROUND_COLOR]: prop(CSS_VAR_C_GRAPH_NODE_FILL), [STYLE_BACKGROUND_FILL]: "linear-gradient",
          "background-gradient-direction": "to-right", [STYLE_BORDER_WIDTH]: num("--s-stroke-hairline"),
          color: prop("--c-graph-node-text"), [STYLE_FONT_FAMILY]: prop(CSS_VAR_S_FONT_MONO), [STYLE_FONT_SIZE]: fontSize,
          [STYLE_FONT_WEIGHT]: prop("--s-weight-medium"), [STYLE_TEXT_VALIGN]: VALUE_CENTER, [STYLE_TEXT_HALIGN]: VALUE_CENTER,
          "min-zoomed-font-size": num("--s-space-xs") } },
        ...typeStyles,
        { selector: 'node.item[type = "UNDEFINED"]', style: { [STYLE_BORDER_STYLE]: VALUE_DASHED } },
        // A box in the colour of its kind, as a pill or as the frame around its contents.
        ...BOX_KINDS.map((kind) => ({ selector: `node.box-${kind}`, style: { [STYLE_BORDER_COLOR]: prop(`--c-graph-box-${kind}`) } })),
        { selector: "node:parent", style: {
          shape: VALUE_ROUND_RECTANGLE, [STYLE_BACKGROUND_FILL]: VALUE_SOLID, [STYLE_BACKGROUND_OPACITY]: num(CSS_VAR_C_GRAPH_BOX_FILL_OPACITY),
          [STYLE_BORDER_WIDTH]: num("--c-graph-box-border-width"), padding: num(CSS_VAR_C_GRAPH_BOX_PADDING), label: CY_DATA_LABEL,
          [STYLE_FONT_FAMILY]: prop(CSS_VAR_S_FONT_MONO), [STYLE_FONT_SIZE]: num(CSS_VAR_C_GRAPH_BOX_LABEL_SIZE),
          [STYLE_FONT_WEIGHT]: prop(CSS_VAR_S_WEIGHT_STRONG), [STYLE_TEXT_VALIGN]: "top", [STYLE_TEXT_HALIGN]: VALUE_CENTER,
          "text-margin-y": -num(CSS_VAR_C_GRAPH_BOX_LABEL_GAP) } },
        ...BOX_KINDS.map((kind) => ({ selector: `node:parent.box-${kind}`,
          style: { [STYLE_BACKGROUND_COLOR]: prop(`--c-graph-box-${kind}`), color: prop(`--c-graph-box-${kind}`) } })),
        { selector: `node:parent.box-${NAMESPACE_KIND}`, style: { [STYLE_BORDER_STYLE]: VALUE_DASHED } },
        // Its own frame, label and fill only: an opacity on a compound node would fade its pills a second time.
        { selector: "node:parent.faint", style: { "border-opacity": num(CSS_VAR_C_GRAPH_DIM), "text-opacity": num(CSS_VAR_C_GRAPH_DIM),
          [STYLE_BACKGROUND_OPACITY]: num(CSS_VAR_C_GRAPH_BOX_FILL_OPACITY) * num(CSS_VAR_C_GRAPH_DIM) } },
        { selector: "node:parent.selected", style: { [STYLE_BORDER_WIDTH]: num(CSS_VAR_C_GRAPH_SELECTED_BORDER_WIDTH),
          [STYLE_BORDER_COLOR]: prop(CSS_VAR_C_GRAPH_SELECTED_BORDER) } },
        { selector: "node.header", style: {
          shape: "rectangle", label: CY_DATA_LABEL, width: CY_DATA_WIDTH, height: num(CSS_VAR_C_GRAPH_NODE_HEIGHT),
          [STYLE_BACKGROUND_OPACITY]: 0, [STYLE_BORDER_WIDTH]: 0, color: prop("--c-graph-header-color"),
          [STYLE_FONT_FAMILY]: prop("--s-font-sans"), [STYLE_FONT_SIZE]: fontSize, [STYLE_FONT_WEIGHT]: prop(CSS_VAR_S_WEIGHT_STRONG),
          "text-transform": "uppercase", [STYLE_TEXT_VALIGN]: VALUE_CENTER, [STYLE_TEXT_HALIGN]: VALUE_CENTER, events: "no" } },
        ...NODE_TYPES.map((t) => ({ selector: `node.dot[type = "${t}"]`,
          style: { [STYLE_BACKGROUND_COLOR]: prop(`--s-type-${t.toLowerCase()}`) } })),
        { selector: "node.dot", style: { label: "", width: num(CSS_VAR_C_GRAPH_NODE_SIZE_FILE), height: num(CSS_VAR_C_GRAPH_NODE_SIZE_FILE),
          shape: "ellipse", [STYLE_BACKGROUND_FILL]: VALUE_SOLID, [STYLE_BORDER_WIDTH]: 0 } },
        { selector: VALUE_EDGE, style: {
          width: num("--c-graph-edge-width"), [STYLE_LINE_COLOR]: prop("--c-graph-edge"), [STYLE_CURVE_STYLE]: "unbundled-bezier",
          "control-point-distances": "data(curve)", "control-point-weights": BOW_WEIGHT, opacity: num("--s-opacity-muted") } },
        ...Object.entries(EDGE_LOOK).map(([kind, look]) => ({ selector: EDGE_SELECTOR[kind] || `edge[kind = "${kind}"]`,
          style: edgeLook(look) })),
        // Calls: straight, the cheapest edge that still carries an arrow.
        { selector: 'edge[kind = "calls"]', style: { [STYLE_CURVE_STYLE]: "straight" } },
        { selector: ".dim", style: { opacity: num(CSS_VAR_C_GRAPH_DIM) } },
        { selector: ".faded", style: { opacity: num("--c-graph-faded") } },
        // A link away from the selection is a faint trace without arrow: only the selection's links stand out.
        { selector: "edge.faded", style: { opacity: num("--c-graph-edge-faded"), [STYLE_TARGET_ARROW_SHAPE]: VALUE_NONE } },
        // A highlighted link keeps its relation's colour: wider and opaque only.
        { selector: "edge.near", style: { width: num("--c-graph-edge-width-highlight"), opacity: 1 } },
        { selector: "node.item.selected", style: { [STYLE_BORDER_WIDTH]: num(CSS_VAR_C_GRAPH_SELECTED_BORDER_WIDTH),
          [STYLE_BORDER_COLOR]: prop(CSS_VAR_C_GRAPH_SELECTED_BORDER), [STYLE_FONT_WEIGHT]: prop("--s-weight-bold") } },
        { selector: "node.item.hover", style: { [STYLE_BORDER_WIDTH]: num("--c-graph-node-border-width") } },
      ];
    }

    const dashOf = (look) => (look.dash ? prop(look.dash).split(/\s+/).map(Number) : []);

    function edgeLook(look) {
      const colour = prop(look.colour);
      return { "line-style": look.dash ? VALUE_DASHED : VALUE_SOLID, ...(look.dash ? { "line-dash-pattern": dashOf(look) } : {}),
        "line-cap": look.dash === EDGE_LOOK.code.dash ? VALUE_ROUND : VALUE_BUTT, [STYLE_LINE_COLOR]: colour,
        [STYLE_TARGET_ARROW_SHAPE]: look.arrow, "target-arrow-color": colour, "arrow-scale": num(CSS_VAR_C_GRAPH_ARROW_SCALE) };
    }

    // The legend's sample of a relation: the same dash, colour, width, opacity and arrow as the graph draws it.
    function edgeSample(look) {
      const ns = "http://www.w3.org/2000/svg";
      const svg = (tag, attributes) => {
        const node = document.createElementNS(ns, tag);
        Object.entries(attributes).forEach(([k, v]) => node.setAttribute(k, String(v)));
        return node;
      };
      const scale = num(CSS_VAR_C_GRAPH_ARROW_SCALE);          // the graph's arrow size, so the sample's matches it
      const middle = SAMPLE_HEIGHT / 2;
      const half = middle * scale;
      const length = SAMPLE_ARROW * scale;
      const tip = SAMPLE_WIDTH;
      const base = SAMPLE_WIDTH - length;
      const head = look.arrow === "vee"
        ? `${base},${middle - half} ${tip},${middle} ${base},${middle + half} ${base + length / 2},${middle}`
        : `${base},${middle - half} ${tip},${middle} ${base},${middle + half}`;
      const line = svg(VALUE_LINE, { x1: 0, y1: middle, x2: base, y2: middle, "stroke-width": num("--c-graph-legend-edge-width"),   // a little thicker than the graph's, to read
        "stroke-dasharray": dashOf(look).join(" ") || VALUE_NONE,
        "stroke-linecap": look.dash === EDGE_LOOK.code.dash ? VALUE_ROUND : VALUE_BUTT });
      line.style.stroke = `var(${look.colour})`;
      const arrow = svg("polygon", { points: head });
      arrow.style.fill = `var(${look.colour})`;
      const box = svg("svg", { class: "legend-edge", viewBox: `0 0 ${SAMPLE_WIDTH} ${SAMPLE_HEIGHT}`, "aria-hidden": VALUE_TRUE });
      box.append(line, arrow);
      return box;
    }

    // The specification hierarchy only when asked; a file's "defines" goes with the file (nodeAllowed).
    function edgeAllowed(l) { return l.kind !== VALUE_CONTAINS || showHierarchy(); }
    function nodeAllowed(node) { return isVisible(node) && (node.type !== TYPE_FILE || showFiles()); }

    // Every neighbour of a node: its links, and for a function its calls (from the typed arrays).
    function eachNeighbour(key, visit) {
      for (const l of links.get(key)) if (edgeAllowed(l)) visit(l.key);
      const index = calls?.index.get(key);
      if (index !== undefined) calls.each(index, (other) => visit(other));
    }

    // The levels around the start, nearest first: the Map's order is the walk's, so its first MAX_DRAWN entries are
    // the nearest levels, the last one cut where the limit falls.
    function neighbourhood(start) {
      const starts = boxStarts(start);              // a selected box: its functions, all at level 0
      const seen = new Map(starts.map((key) => [key, 0]));
      let frontier = starts;
      for (let level = 1; level <= depth && frontier.length; level += 1) {
        const next = [];
        for (const key of frontier) {
          eachNeighbour(key, (other) => {
            if (seen.has(other) || !nodeAllowed(nodes.get(other))) return;
            seen.set(other, level);
            next.push(other);
          });
        }
        frontier = next;
      }
      return seen;
    }

    // An edge between two nodes of one column bows out to the left of it, so that it does not run over the column.
    function bow(from, to) {
      if (!from || !to || from.x !== to.x) return 0;
      const size = Math.abs(to.y - from.y) * BOW_RATIO + num(CSS_VAR_C_GRAPH_NODE_HEIGHT);
      return to.y > from.y ? size : -size;
    }

    function edgesAmong(keys, positions) {
      const kept = new Set(keys);
      const edges = [];
      for (const key of keys) {
        for (const l of links.get(key)) {
          if (l.dir === "out" && kept.has(l.key) && edgeAllowed(l)) {
            const curve = positions ? bow(positions.get(key), positions.get(l.key)) : 0;
            edges.push({ group: VALUE_EDGES, data: { id: `${key}>${l.key}>${l.kind}`, source: key, target: l.key, kind: l.kind,
              curve } });
          }
        }
        const index = calls?.index.get(key);
        if (index !== undefined) edges.push(...callEdges(index, key, kept));
      }
      return edges;
    }

    // The walk's functions replaced by the boxes standing for them at the level of detail,
    // each box at the nearest level of its functions, in the walk's order; the other nodes stay themselves.
    function detailView(levels) {
      if (detail === DETAIL.function) return { levels, drawnOf: (key) => key, edges: edgesAmong, split: callSplit };
      const drawnOf = (key) => {
        const index = calls.index.get(key);
        return index === undefined ? key : boxes.of(index, detail);
      };
      const mapped = new Map();
      for (const [key, level] of levels) {
        const box = drawnOf(key);
        if (!mapped.has(box)) mapped.set(box, level);
      }
      return { levels: mapped, drawnOf, edges: (keys, positions) => boxEdges({ members: levels, drawnOf, keys, positions }),
        split: (centre) => boxSplit(levels, drawnOf, centre) };
    }

    // The boxes drawn around a node, outermost first. At the function level, a function's own
    // scope, and with enclosing boxes its outer scopes; at the class level, with enclosing boxes, a box's outer scopes.
    function enclosingChain(key) {
      const index = calls?.index.get(key);
      let inner = null;
      if (index !== undefined && detail === DETAIL.function) inner = boxes.scopeOf(index);
      else if (boxes.get(key) && detail === DETAIL.class && enclosing) inner = boxes.get(key).parent;
      const chain = [];
      for (let box = inner; box; box = enclosing ? boxes.get(box).parent : null) chain.unshift(box);
      return chain;
    }

    // The links among the drawn boxes and nodes, one per relation and ordered pair, nothing inside one box. A link
    // merging calls counts their call sites and is ambiguous only when every merged call is.
    function boxEdges({ members, drawnOf, keys, positions }) {
      const kept = new Set(keys);
      const edges = new Map();
      const sites = new Map();
      const add = (from, to, kind) => {
        const id = `${from}>${to}>${kind}`;
        if (!edges.has(id)) {
          const curve = kind === VALUE_CALLS ? 0 : bow(positions.get(from), positions.get(to));
          edges.set(id, { group: VALUE_EDGES, data: { id, source: from, target: to, kind, curve } });
        }
        return edges.get(id).data;
      };
      for (const key of members.keys()) {
        const from = drawnOf(key);
        if (kept.has(from)) memberEdges(key, from, { members, drawnOf, kept, add, sites });
      }
      for (const [id, found] of sites) edges.get(id).data.count = found.size;
      return [...edges.values()];
    }

    // The links and calls of one walked node, from the box or node drawn for it to those drawn for the other ends.
    function memberEdges(key, from, { members, drawnOf, kept, add, sites }) {
      const to = (other) => (members.has(other) && kept.has(drawnOf(other)) ? drawnOf(other) : from);
      for (const l of links.get(key)) if (l.dir === "out" && edgeAllowed(l) && to(l.key) !== from) add(from, to(l.key), l.kind);
      const index = calls.index.get(key);
      for (const c of index === undefined ? [] : calls.callees(index)) {
        if (to(c.key) !== from) mergeCall(add(from, to(c.key), VALUE_CALLS), c, `${key}:`, sites);
      }
    }

    function pillWidth(label) {
      return label.length * num(CSS_VAR_C_GRAPH_LABEL_SIZE) * MONO_CHAR_RATIO + 2 * num("--c-graph-node-padding");
    }

    // The flow's columns. Around a selected function, its column splits in three — callers, the function, callees —
    // so that calls run left to right, never along one column.
    function flowColumns(selected, split) {
      const base = COLUMNS.map((types, c) => ({ name: COLUMN_NAME[c], has: (key) => types.includes(nodeOf(key).type) }));
      if (!split) return base;
      const { callers, callees } = split;
      const isCall = (key, set) => key !== selected && nodeOf(key).type === "FN" && set.has(key);
      const at = columnOf("FN");
      return [...base.slice(0, at),
        { name: "Callers", has: (key) => isCall(key, callers) },
        { name: COLUMN_NAME[at], has: (key) => base[at].has(key) && !isCall(key, callers) && !isCall(key, callees) },
        { name: "Callees", has: (key) => isCall(key, callees) && !callers.has(key) },
        ...base.slice(at + 1)];
    }

    // The flow layout: columns left to right, each as wide as its widest pill, the selection first in its column.
    function flowElements(levels, selected, view) {
      const columns = flowColumns(selected, view.split(selected));
      const byColumn = columns.map(() => []);
      for (const key of levels.keys()) byColumn[columns.findIndex((column) => column.has(key))].push(key);
      const flow = { levels, selected, elements: [], drawn: [], positions: new Map(), left: 0 };
      byColumn.forEach((keys, c) => { if (keys.length) placeColumn(flow, keys, c, columns[c].name); });
      return { elements: [...flow.elements, ...view.edges(flow.drawn, flow.positions)], drawn: flow.drawn.length,
        total: levels.size };
    }

    // One column: its header, its pills — in rows, or one under the other in their boxes — and its note.
    function placeColumn(flow, keys, c, name) {
      const chains = new Map(keys.map((key) => [key, enclosingChain(key)]));
      const boxed = [...chains.values()].some((chain) => chain.length);
      keys.sort(boxed ? chainOrder(chains, flow.selected) : (a, b) => (b === flow.selected) - (a === flow.selected)
        || nodeOf(a).label.localeCompare(nodeOf(b).label, undefined, { numeric: true }));
      const shown = keys.slice(0, MAX_PER_COLUMN);
      const boxName = (box) => (box ? boxes.get(box).label : null);
      const labels = shown.map((key) => (chains.get(key).length ? clip(nameIn(nodeOf(key).label, boxName(chains.get(key).at(-1))))
        : shortLabel(nodeOf(key))));
      const widest = Math.max(...labels.map(pillWidth));
      const placed = boxed ? boxedRows(shown, chains, flow.left, widest, c) : gridRows(shown, flow.left, widest);
      const centre = flow.left + placed.span / 2;
      const header = `${name} · ${keys.length}`;
      flow.elements.push({ group: VALUE_NODES, classes: TAG_HEADER, data: { id: `header:${c}`, label: header, width: pillWidth(header) },
        position: { x: centre, y: -num("--c-graph-header-gap") } });
      for (const [id, frame] of placed.frames) {
        const box = boxes.get(frame.box);
        const label = frame.parent ? clip(nameIn(box.label, boxName(frame.outer))) : shortLabel(box);
        flow.elements.push({ group: VALUE_NODES, classes: `box box-${box.box}`, data: { id, label, name: box.label, box: box.box,
          boxKey: frame.box, ...(frame.parent ? { parent: frame.parent } : {}) } });
      }
      shown.forEach((key, i) => {
        const n = nodeOf(key);
        const position = placed.points[i];
        const parent = placed.parents[i];
        flow.elements.push({ group: VALUE_NODES, classes: n.box ? `item box box-${n.box}` : VALUE_ITEM_2, data: { id: key, type: n.type,
          label: labels[i], name: n.label, width: pillWidth(labels[i]), level: flow.levels.get(key),
          ...(n.box ? { box: n.box } : {}), ...(parent ? { parent } : {}) }, position });
        flow.positions.set(key, position);
        flow.drawn.push(key);
      });
      if (keys.length > shown.length) {
        const more = `+${keys.length - shown.length} more`;
        flow.elements.push({ group: VALUE_NODES, classes: TAG_HEADER, data: { id: `more:${c}`, label: more, width: pillWidth(more) },
          position: { x: centre, y: placed.bottom } });
      }
      flow.left += Math.max(placed.span, pillWidth(header)) + num("--c-graph-column-gap");
    }

    // Pills in rows, a taller column wrapping into sub-columns.
    function gridRows(shown, left, widest) {
      const rowGap = num(CSS_VAR_C_GRAPH_ROW_GAP);
      const subColumns = Math.ceil(shown.length / MAX_ROWS);
      const rows = Math.ceil(shown.length / subColumns);
      const step = widest + num("--c-graph-sub-gap");
      const points = shown.map((_, i) => ({ x: left + widest / 2 + Math.floor(i / rows) * step, y: (i % rows) * rowGap }));
      return { points, parents: [], frames: new Map(), span: (subColumns - 1) * step + widest, bottom: rows * rowGap };
    }

    // Pills one under the other, each run of one box kept together, room left for the frames that close and open
    // between two pills; a box drawn as a pill of this column is its own frame, the others get one per column.
    function boxedRows(shown, chains, left, widest, c) {
      const rowGap = num(CSS_VAR_C_GRAPH_ROW_GAP);
      const pad = num(CSS_VAR_C_GRAPH_BOX_PADDING);
      const open = pad + num(CSS_VAR_C_GRAPH_BOX_LABEL_SIZE) + num(CSS_VAR_C_GRAPH_BOX_LABEL_GAP);
      const depth = Math.max(...shown.map((key) => chains.get(key).length));
      const items = new Set(shown);
      const frameId = (box) => (items.has(box) ? box : `${box}@${c}`);
      const placed = { points: [], parents: [], frames: new Map(), span: widest + 2 * depth * pad, bottom: 0 };
      let previous = [];
      let y = 0;
      shown.forEach((key, i) => {
        const chain = chains.get(key);
        let common = 0;
        while (common < chain.length && chain[common] === previous[common]) common += 1;
        y += (i ? rowGap + (previous.length - common) * pad : 0) + (chain.length - common) * open;
        placed.points.push({ x: left + depth * pad + widest / 2, y });
        const ids = chain.map(frameId);
        ids.forEach((id, d) => {
          if (!items.has(chain[d]) && !placed.frames.has(id)) {
            placed.frames.set(id, { box: chain[d], parent: ids[d - 1], outer: chain[d - 1] });
          }
        });
        placed.parents.push(ids.at(-1));
        previous = chain;
      });
      placed.bottom = y + rowGap + previous.length * pad;
      return placed;
    }

    function ensure() {
      if (cy) return cy;
      cy = cytoscape({ container, style: style(), minZoom: num("--c-graph-zoom-min"), maxZoom: num("--c-graph-zoom-max"),
        wheelSensitivity: num("--c-graph-wheel-sensitivity"),
        boxSelectionEnabled: false, autoungrabify: true, hideEdgesOnViewport: Boolean(CALL_GRAPH) });
      // A pill selects its element; a frame selects its box. A tap bubbles to the frames around its
      // target, which keeps the target: one selection.
      cy.on("tap", "node.item, node.box", (event) => select(event.target.data(VALUE_BOXKEY) || event.target.id()));
      cy.on(EVENT_MOUSEOVER, VALUE_NODE_ITEM, (event) => {
        event.target.addClass(VALUE_HOVER);
        event.target.connectedEdges().addClass(VALUE_NEAR);
        const at = event.target.renderedPosition();
        const box = container.getBoundingClientRect();
        scheduleRichTip({ left: box.left + at.x, right: box.left + at.x, top: box.top + at.y, bottom: box.top + at.y },
          () => nodeTip(event.target.id()), CSS_QUICK_DELAY);
      });
      cy.on(EVENT_MOUSEOUT, VALUE_NODE_ITEM, (event) => {
        event.target.removeClass(VALUE_HOVER);
        if (event.target.id() !== centre) event.target.connectedEdges().removeClass(VALUE_NEAR);
        highlight(centre);
        hideRichTip();
      });
      // A link's tooltip once the pointer rests on it for the token delay.
      cy.on(EVENT_MOUSEOVER, VALUE_EDGE, (event) => {
        clearTimeout(tipTimer);
        const at = event.renderedPosition;
        tipTimer = setTimeout(() => showTip(event.target.id(), at), num("--c-graph-tip-delay"));
      });
      cy.on(EVENT_MOUSEOUT, VALUE_EDGE, hideTip);
      cy.on("viewport", hideTip);
      return cy;
    }

    // A drawn link: its kind, its look, its two ends in their direction.
    function edgeParts(edgeId) {
      const edge = cy.getElementById(edgeId);
      const kind = edge.data("kind");
      const ambiguous = kind === VALUE_CALLS && edge.data(VALUE_AMBIGUOUS);
      return { edge, kind, ambiguous, look: ambiguous ? EDGE_LOOK.ambiguous : EDGE_LOOK[kind], source: edge.data("source"),
        target: edge.data("target") };
    }

    // The relation of a drawn link, its two ends in their direction, and its proof lines.
    function tipFor(edgeId) {
      const { edge, kind, look, source, target } = edgeParts(edgeId);
      const merged = edge.data("count");               // a link merging calls between boxes
      let proofs = merged ?? 0;
      if (merged === undefined && kind === VALUE_CALLS) proofs = callSites(source, target);
      else if (merged === undefined && links.has(source)) {
        proofs = links.get(source).filter((l) => l.dir === "out" && l.key === target && l.kind === kind)
          .reduce((sum, l) => sum + l.lines.length, 0);
      }
      let unit = proofs === 1 ? VALUE_LINE : VALUE_LINES;
      if (merged !== undefined) unit = proofs === 1 ? VALUE_CALL_SITE : VALUE_CALL_SITES;      // The merged count
      const lines = proofs ? ` · ${proofs} ${unit}` : "";
      return `${look.meaning}: ${nodeOf(source).label} → ${nodeOf(target).label}${lines}`;
    }

    // A relation, its two ends in their direction, its first proof lines, on the page's rich tooltip.
    function edgeTipContent(edgeId) {
      const { kind, ambiguous, look, source, target } = edgeParts(edgeId);
      const proofs = links.has(source) ? links.get(source).filter((l) => l.dir === "out" && l.key === target && l.kind === kind)
        .flatMap((l) => l.lines) : [];
      const count = tipFor(edgeId).split(" · ").slice(1).join(" · ");
      return { head: RELATION_NAME[ambiguous ? VALUE_AMBIGUOUS : kind] || look.meaning,
        lines: [`${nodeOf(source).label} → ${nodeOf(target).label}`, look.meaning, count,
          ...proofs.slice(0, PROOFS_SHOWN).map(([line, text]) => `L${line} ${text}`)],
        mono: [3, 4] };
    }

    function showTip(edgeId, at) {
      const box = container.getBoundingClientRect();
      showRichTip({ left: box.left + at.x, right: box.left + at.x, top: box.top + at.y, bottom: box.top + at.y }, edgeTipContent(edgeId));
    }

    function hideTip() {
      clearTimeout(tipTimer);
      hideRichTip();
    }

    function highlight(key) {
      cy.elements().removeClass("selected near faded dim faint");
      // The drawn node, or the frames of a selected box with what they hold.
      const frames = key ? cy.nodes().filter((n) => n.data(VALUE_BOXKEY) === key && !n.hasClass(VALUE_ITEM_2)) : cy.collection();
      const own = key ? cy.getElementById(key).union(frames) : cy.collection();
      const centre = own.union(frames.descendants());
      if (centre.empty()) return;
      const near = centre.closedNeighborhood();
      cy.nodes(VALUE_ITEM).not(near).addClass("dim");
      // A frame holding nothing near the selection is faint like its pills, not a veil drawn over them.
      cy.nodes(".box").not(VALUE_ITEM).filter((frame) => frame.descendants(VALUE_ITEM).intersection(near).empty()).addClass("faint");
      cy.edges().not(centre.connectedEdges()).addClass(VALUE_FADED);
      own.addClass(VALUE_SELECTED);
      centre.connectedEdges().addClass(VALUE_NEAR);
    }

    function draw() {
      if (!libraryLoaded(GLOBAL_CYTOSCAPE)) {
        container.closest(".graph-frame").replaceChildren(libraryMissing(GLOBAL_CYTOSCAPE));
        return;
      }
      const started = performance.now();
      const key = isCommitKey(state.selected) ? null : state.selected;     // A commit is not drawn here
      $("graph-empty").hidden = Boolean(key);
      ensure();
      cy.resize();
      let built = { elements: [], drawn: 0, total: 0 };
      centre = key;
      if (key) {
        const view = detailView(neighbourhood(key));      // the 400-node limit applies to what the level draws
        const drawnFor = new Set(boxStarts(key).map(view.drawnOf));   // a box whose functions the level draws as one
        centre = drawnFor.size === 1 ? [...drawnFor][0] : key;
        built = { ...flowElements(nearest(view.levels), centre, view), total: view.levels.size };
      }
      cy.batch(() => { cy.elements().remove(); cy.add(built.elements); });
      cy.layout({ name: "preset" }).run();
      highlight(centre);
      frame();
      const ms = Math.round(performance.now() - started);
      const parts = [`${built.drawn} elements`, `${cy.edges().length} links`, `depth ${depth}`];
      if (built.total > built.drawn) parts.push(`${built.total - built.drawn} not drawn`);
      parts.push(`${ms} ms`);
      $("graph-status").textContent = parts.join(" · ");
      Object.assign(container.dataset, { graphNodes: String(built.drawn), graphSelected: key || "", graphMs: String(ms) });
      dirty = false;
    }

    // Fit the drawing; in the flow view never below a readable zoom: the canvas then grows to the whole flow at that
    // zoom and the frame scrolls to its top-left corner.
    function frame() {
      const padding = num(CSS_VAR_S_SPACE_XL);
      fitCanvas();
      cy.fit(undefined, padding);
      const floor = num("--c-graph-flow-min-zoom");
      if (cy.zoom() < floor) {
        const box = cy.elements().boundingBox();
        const scroller = $(VALUE_GRAPH_SCROLL);
        container.style.width = `${Math.ceil(Math.max(scroller.clientWidth, box.w * floor + 2 * padding))}px`;
        container.style.height = `${Math.ceil(Math.max(scroller.clientHeight, box.h * floor + 2 * padding))}px`;
        cy.resize();
        cy.zoom(floor);
        cy.pan({ x: padding - box.x1 * floor, y: padding - box.y1 * floor });
        scroller.scrollTo(0, 0);
      }
      container.dataset.graphZoom = cy.zoom().toFixed(2);
    }

    // The canvas back to the frame's size.
    function fitCanvas() {
      container.style.removeProperty(VALUE_WIDTH);
      container.style.removeProperty("height");
      cy.resize();
    }

    const visible = () => state.view === VALUE_GRAPH;

    $(VALUE_DEPTH).addEventListener(EVENT_CLICK, (event) => {
      const b = event.target.closest(TAG_BUTTON);
      if (!b) return;
      depth = Number(b.dataset.depth);
      for (const other of $(VALUE_DEPTH).querySelectorAll(TAG_BUTTON)) other.setAttribute(VALUE_ARIA_PRESSED, String(other === b));
      dirty = true;
      if (visible()) draw();          // a hidden frame has no size: drawn when the view is shown
    });
    $(VALUE_SHOW_FILES).addEventListener(EVENT_CHANGE, () => draw());
    if (CALL_GRAPH) {       // The Function type filter, at hand in the graph's own toolbar
      const toggle = el(DOM_INPUT, { type: VALUE_CHECKBOX, id: VALUE_SHOW_FUNCTIONS });
      toggle.addEventListener(EVENT_CHANGE, () => {
        if (toggle.checked) state.types.add("FN"); else state.types.delete("FN");
        renderFilters();
        filtersChanged();
      });
      $(VALUE_SHOW_FILES).closest(TAG_LABEL).after(el(TAG_LABEL, { class: VALUE_TOGGLE, title: IMPLEMENTATION_HINT }, toggle,
        " Implementation"));
    }
    if (CALL_GRAPH) {       // The implementation detail and the enclosing scopes
      const choice = el("fieldset", { class: "segmented", id: VALUE_DETAIL_LEVEL, [VALUE_ARIA_LABEL]: VALUE_IMPLEMENTATION_DETAIL,
        title: DETAIL_HINT },
      el(TAG_SPAN, { class: "segmented-label", text: VALUE_IMPLEMENTATION_DETAIL }),
      ...DETAIL_CHOICES.map(([level, label, hint]) => el(TAG_BUTTON, { type: TAG_BUTTON, "data-detail": level,
        [VALUE_ARIA_PRESSED]: String(level === detail), title: hint, text: label })));
      choice.addEventListener(EVENT_CLICK, (event) => {
        const b = event.target.closest(TAG_BUTTON);
        if (b) applyDetail(b.dataset.detail);
      });
      const box = el(DOM_INPUT, { type: VALUE_CHECKBOX, id: VALUE_SHOW_ENCLOSING, checked: true });
      box.addEventListener(EVENT_CHANGE, () => applyEnclosing(box.checked));
      $("display").after(choice);                         // Depth, Display, Implementation detail: the reading order
      $(VALUE_SHOW_HIERARCHY).closest(TAG_LABEL).after(el(TAG_LABEL, { class: VALUE_TOGGLE, title: ENCLOSING_HINT }, box,
        " Enclosing scopes"));
      syncImplementationControls();
    }

    // The detail choice and the enclosing scopes mean something only while the implementation is drawn
    // (whichever of the switch and the Functions type filter turned it off); the scopes' frames need a class level.
    function syncImplementationControls() {
      if (!CALL_GRAPH) return;
      const drawn = state.types.has("FN");
      const choice = $(VALUE_DETAIL_LEVEL);
      choice.disabled = !drawn;
      choice.title = drawn ? DETAIL_HINT : DETAIL_OFF_HINT;
      const box = $(VALUE_SHOW_ENCLOSING);
      box.disabled = !drawn || detail === DETAIL.namespace;
      const card = $(CALL_GRAPH_CARD);                                   // Its counts, with the implementation
      if (card) card.hidden = !drawn;
      box.closest(TAG_LABEL).classList.toggle("is-disabled", box.disabled);
    }

    // The level of detail, its button pressed.
    function applyDetail(level) {
      detail = level;
      for (const b of document.querySelectorAll("#detail-level button")) b.setAttribute(VALUE_ARIA_PRESSED, String(b.dataset.detail === level));
      syncImplementationControls();
      dirty = true;
      if (visible()) draw();
    }

    function applyEnclosing(on) {
      enclosing = on;
      if ($(VALUE_SHOW_ENCLOSING)) $(VALUE_SHOW_ENCLOSING).checked = on;
      dirty = true;
      if (visible()) draw();
    }
    $(VALUE_SHOW_HIERARCHY).addEventListener(EVENT_CHANGE, () => draw());
    $("fit").addEventListener(EVENT_CLICK, () => {          // the whole drawing in the frame, any zoom
      if (!cy) return;
      fitCanvas();
      cy.fit(undefined, num(CSS_VAR_S_SPACE_XL));
    });

    clear($("legend")).append(...NODE_TYPES.map((t) => el(TAG_SPAN, { class: VALUE_LEGEND_ITEM },
      el(TAG_SPAN, { class: `legend-shape shape-RQ t-${t}` }), TYPE_NAME[t][0])),
    ...Object.entries(EDGE_LOOK).map(([kind, look]) => richTip(el(TAG_SPAN, { class: VALUE_LEGEND_ITEM },
      edgeSample(look), look.meaning), () => ({ head: RELATION_NAME[kind], lines: [look.meaning] }))),
    ...(CALL_GRAPH ? BOX_KINDS.map((kind) => richTip(el(TAG_SPAN, { class: VALUE_LEGEND_ITEM },
      el(TAG_SPAN, { class: `legend-box box-${kind}` }), BOX_NAME[kind]), () => ({ head: BOX_NAME[kind], lines: [BOX_HINT[kind]] }))) : []));

    return {
      tipFor,
      edgeTipContent,
      tipContent: nodeTip,                // Read by the tests
      instance: ensure,
      setDetail: applyDetail,           // The level of detail, one of DETAIL's values
      setEnclosing: applyEnclosing,     // The enclosing boxes drawn or left out
      elements() { return cy ? cy.elements().map((e) => e.data()) : []; },
      show() { if (dirty || !cy) draw(); else cy.resize(); },
      select(key) {
        dirty = true;
        if (visible()) draw();
      },
      refresh() { syncImplementationControls(); dirty = true; if (visible()) draw(); },
      restyle() { if (cy) cy.style(style()); },
      resize() { cy?.resize(); },
      zoom() { return cy ? cy.zoom() : 1; },
      wheelSensitivity() { return cy ? cy.renderer().wheelSensitivity : null; },   // Read by the tests
    };
  }

  // ---- header and footer --------------------------------------------------------------------------------------
  function renderHeader() {
    const meta = DATA.meta;
    const item = (label, value, exact = value) => richTip(el("div", { class: "meta-item" },
      el(TAG_SPAN, { class: "meta-label", text: label }), el(TAG_SPAN, { class: "meta-value", text: value })),
    () => ({ head: label, lines: [exact] }));
    // The generation time in the reader's date and time; its exact UTC value in the tooltip
    const when = new Date(meta.generatedAt);
    const readable = Number.isNaN(when.getTime()) ? meta.generatedAt
      : new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(when);
    const utc = meta.generatedAt.replace("T", " ").replace(/Z$/, " UTC");
    clear($("meta")).append(item("Generated", readable, utc), item("Process", meta.process),
      item("Sources", meta.sources.join(", ")));
    document.title = `Performance center — ${meta.title}`;
  }

  // ---- licences -------------------------------------------------
  // The brand tone of a licence's badge; a licence nobody classified takes the light tone. The application's own badge is
  // written in the template, the libraries' come from the library record of the data.
  const LICENCE_TONE = { "AGPL-3.0": "green", MIT: "blue", "Apache-2.0": "yellow" };
  const TONE_DEFAULT = "light";
  const CLASS_BADGE_VALUE = "licence-badge-value";
  // The page of a licence at SPDX, the one template of every badge's address; checked once, never requested
  const SPDX_URL = "https://spdx.org/licenses/{id}.html";
  const SPDX_ID = "{id}";
  const CLASS_BADGE = "licence-badge";
  const CLASS_BADGE_LINK = "licence-badge licence-badge-link";

  function renderLicences() {
    const list = $("licence-list");
    list.append(...(DATA.meta.libraries || []).map((lib) => el(TAG_SPAN, { class: CLASS_BADGE },
      el(TAG_SPAN, { class: "licence-badge-label", text: `${lib.name} ${lib.version}` }), el(TAG_SPAN, { class: CLASS_BADGE_VALUE, text: lib.licence }))));
    for (const value of list.querySelectorAll(`.${CLASS_BADGE_VALUE}`)) value.dataset.tone = LICENCE_TONE[value.textContent] || TONE_DEFAULT;
    for (const badge of list.querySelectorAll(`.${CLASS_BADGE}`)) linkBadge(badge);
  }

  // A badge of a tabled licence becomes a link to its SPDX page in a new tab; any other keeps no link.
  function linkBadge(badge) {
    const id = badge.querySelector(`.${CLASS_BADGE_VALUE}`).textContent;
    if (!Object.hasOwn(LICENCE_TONE, id)) return;
    const link = el("a", { class: CLASS_BADGE_LINK, href: SPDX_URL.replace(SPDX_ID, id), target: "_blank", rel: "noopener" });
    link.append(...badge.childNodes);
    badge.replaceWith(link);
  }

  // ---- overview -----------------------------------------------------------------------------------------------
  function coverageCounts(list) {
    const c = { covered: 0, indirect: 0, uncovered: 0 };
    for (const rq of list) c[DATA.coverage[rq.key]] += 1;
    return c;
  }

  function stackBar(c, total) {
    return el("div", { class: "stack", role: "img",
      [VALUE_ARIA_LABEL]: `${c.covered} covered, ${c.indirect} indirect, ${c.uncovered} uncovered of ${total}` },
      ...Object.keys(COVERAGE).map((k) => richTip(el("div", { class: `stack-part stack-${k}`,
        style: { width: `${total ? (PERCENT * c[k]) / total : 0}%` } }), () => coverageTip(k, c[k], total))));
  }

  // A coverage rating, its count out of the requirements and its definition.
  function coverageTip(k, count, total) {
    return { head: COVERAGE[k][0], lines: [count === undefined ? "" : `${count} of ${total} requirements · ${pct(count, total)} %`,
      COVERAGE[k][1]] };
  }

  function searchPrefix(type) {
    if (type === TYPE_FILE) return FILE_PREFIX;
    if (type === TYPE_UNDEFINED || type === "FN") return "";
    return `${type}-`;
  }

  function renderOverview() {
    const c = coverageCounts(requirements);
    const total = requirements.length;
    const coverageCard = el(TAG_ARTICLE, { class: "card kpi" },
      el(TAG_SPAN, { class: CLASS_KPI_LABEL, text: "Requirements covered by source" }),
      el(TAG_SPAN, { class: CLASS_KPI_VALUE, text: `${pct(c.covered, total)} %` }),
      el(TAG_SPAN, { class: VALUE_KPI_SUB, text: `${c.covered} of ${total} cited by a source file · ${c.indirect} more indirectly` }));
    const typeTiles = el(TAG_ARTICLE, { class: "card kpis-types" },
      ...NODE_TYPES.map((t) => el(TAG_BUTTON, { class: `kpi-type t-${t}`, type: TAG_BUTTON,
        title: `Search ${plural(t, 2).toLowerCase()}`, on: { click: () => searchFor(searchPrefix(t), t) } },
        el(TAG_SPAN, { class: "kpi-type-value", text: counts[t] }), el(TAG_SPAN, { class: "kpi-type-label", text: plural(t, counts[t]) }))));
    clear($("kpis")).append(coverageCard, typeTiles);

    const coverage = $("coverage-chart");
    clear(coverage).append(stackBar(c, total), el("div", { class: "coverage-legend" },
      ...Object.keys(COVERAGE).map((k) => richTip(el(TAG_BUTTON, { class: VALUE_COVERAGE_ITEM, type: TAG_BUTTON,
        on: { click: () => { setCoverageFilter(k); showView(VALUE_MATRIX); } } },
        el(TAG_SPAN, { class: VALUE_COVERAGE_ITEM_LABEL }, el(TAG_SPAN, { class: `legend-swatch stack-${k}` }), COVERAGE[k][0]),
        el(TAG_SPAN, { class: VALUE_COVERAGE_ITEM_VALUE, text: `${c[k]}` }),
        el(TAG_SPAN, { class: VALUE_KPI_SUB, text: `${pct(c[k], total)} % of ${total}` })),
      () => { const tip = coverageTip(k, c[k], total); return { ...tip, lines: [...tip.lines, "Click to show them in the matrix"] }; }))));
    const areas = el("div", { class: "quality-areas", "data-chart": "areas" });   // The coverage per trigram
    coverage.append(areas);
    drawAreas(areas, false);                                          // the coverage tiles above are its legend

    // The checks' compact form, in their order, nothing to unfold; a click opens the check
    clear($("quality-summary")).append(el("div", { class: "check-summaries" }, ...orderedChecks().map((check) =>
      el(TAG_BUTTON, { class: "card check-card check-summary", type: TAG_BUTTON, "data-check": check.key, on: { click: () => openCheck(check.key) } },
        el(TAG_HEADER, { class: "check-head" }, el(TAG_SPAN, { class: "check-card-title", text: check.title }), ...checkFigures(check))))));

    // Under the graph's frame, shown while the implementation is drawn
    if (CALL_GRAPH) document.querySelector("#view-graph .graph-frame").after(callGraphCard());
    graph.refresh();
  }

  // The call graph's counts; the untraced functions' risk is read from the data.
  function callGraphCard() {
    const c = CALL_GRAPH.counts;
    const functionsCheck = CHECKS.find((check) => check.key === FUNCTIONS_CHECK);
    const item = (label, value, hint, onClick) => richTip(el(onClick ? TAG_BUTTON : "div",
      { class: VALUE_COVERAGE_ITEM, type: onClick ? TAG_BUTTON : null, on: onClick ? { click: onClick } : null },
      el(TAG_SPAN, { class: VALUE_COVERAGE_ITEM_LABEL, text: label }), el(TAG_SPAN, { class: VALUE_COVERAGE_ITEM_VALUE, text: value }),
      el(TAG_SPAN, { class: VALUE_KPI_SUB, text: hint })), () => ({ head: `${label}: ${value}`, lines: [hint] }));
    return el(TAG_ARTICLE, { class: "card call-graph-card", id: CALL_GRAPH_CARD },
      el(TAG_HEADER, { class: "card-header" }, el("h2", { class: "card-title", text: "Call graph" }),
        el(TAG_SPAN, { class: "card-hint", text: `${c.calls} call links between ${c.functions} functions` })),
      el("div", { class: "coverage-legend call-graph-legend" },
        item("Functions", c.functions, "search them by name", () => searchFor("", "FN")),
        item("Call links", c.calls, "one per caller and callee"),
        item("Ambiguous calls", c.ambiguous, "a name matching several definitions"),
        item("External calls", c.external, "a name defined in no scanned file"),
        item("Untraced functions", functionsCheck.findings.length, `citing no ID · ${functionsCheck.risk}`, () => openCheck(FUNCTIONS_CHECK))));
  }

  // ---- sidebar ------------------------------------------------------------------------------------------------
  function chip(label, count, pressed, onClick, cls, title) {
    return el(TAG_BUTTON, { class: `chip ${cls || ""}`, type: TAG_BUTTON, [VALUE_ARIA_PRESSED]: String(pressed), title,
      on: { click: onClick } },
    cls ? el(TAG_SPAN, { class: `dot ${cls}` }) : null, label, el(TAG_SPAN, { class: CLASS_CHIP_COUNT, text: count }));
  }

  // What a filter does, said where it is.
  const typeHint = (t) => (t === "FN"
    ? "Show or hide functions in the graph (the search finds them either way)"
    : `Show or hide ${plural(t, 2).toLowerCase()} in the search and the graph`);

  function renderFilters() {
    if (CALL_GRAPH) $(VALUE_SHOW_FUNCTIONS).checked = state.types.has("FN");
    clear($("type-filters")).append(...NODE_TYPES.map((t) => chip(plural(t, 2), counts[t], state.types.has(t), () => {
      toggle(state.types, t); renderFilters(); filtersChanged();
    }, `t-${t}`, typeHint(t))));
    const triCount = (tri) => DATA.elements.filter((e) => e.kind === VALUE_ELEMENT && e.tri === tri).length;
    clear($("tri-filters")).append(...trigrams.map((tri) => chip(tri, triCount(tri), state.tris.has(tri), () => {
      toggle(state.tris, tri); renderFilters(); filtersChanged();
    }, null, `Show or hide the elements of the ${tri} feature area in the matrix, the search and the graph`)));
    clear($("quality-shortcuts")).append(...orderedChecks().map((check) => el("li", {}, richTip(el(TAG_BUTTON, { class: CLASS_QUALITY_SHORTCUT, type: TAG_BUTTON,
      on: { click: () => openCheck(check.key) } }, el(TAG_SPAN, { text: check.title }),
      el(TAG_SPAN, { class: checkBadgeClass(check), text: check.findings.length })), () => checkTip(check)))));
  }

  function toggle(set, value) { if (set.has(value)) set.delete(value); else set.add(value); }

  const findingCount = (n) => `${n} ${n === 1 ? "finding" : "findings"}`;
  const scoreTip = (check) => ({ head: `Score ${scoreText(check)} / ${SCORE_MAX}`,
    lines: [checkFormula(check), `population ${check.population} · ${findingCount(check.findings.length)}`] });

  // A check, its score, its risk, its findings and its rule.
  function checkTip(check) {
    const count = check.findings.length;
    return { head: check.title, lines: [`Score ${scoreText(check)} / ${SCORE_MAX} · risk ${check.risk}`,
      findingCount(count), check.rule] };
  }

  function filtersChanged() { renderMatrix(); graph.refresh(); }

  function onlyTrigram(tri) {                                          // null: every trigram
    state.tris = new Set(tri === null ? trigrams : [tri]);
    renderFilters();
    filtersChanged();
    showView(VALUE_MATRIX);
  }

  // ---- search -------------------------------------------------------------------------------------------------
  const search = $("search");
  const results = $("search-results");
  let resultKeys = [];
  let active = -1;

  function rank(node, q) {
    if (node.find === q) return 0;
    if (node.find.startsWith(q)) return 1;
    if (node.find.includes(q)) return 2;
    return node.findTitle.includes(q) ? RANK_TITLE : RANK_NONE;
  }

  // Functions are searched even while their type is off: that filter only keeps them out of the graph.
  const searchable = (node, onlyType) => (onlyType ? node.type === onlyType : node.type === "FN" || isVisible(node));

  function matches(q, onlyType) {
    const found = [];
    for (const node of nodes.values()) {
      if (!searchable(node, onlyType)) continue;
      const r = q ? rank(node, q) : 0;
      if (r >= 0) found.push([r, typeOrder(node.type), node.label, node]);
    }
    found.sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2].localeCompare(b[2]));
    return found.map((f) => f[RESULT_NODE]);
  }

  // A result's tooltip, the page's own, beside the list after the quick delay.
  const hideSearchTip = () => hideRichTip();

  // An element as every business tooltip names it: its type, its ID or name, its title, its location, its status.
  function elementTip(n) {
    return { type: n.type, head: n.label, lines: [TYPE_NAME[n.type][0] + (n.status ? ` · ${n.status}` : ""), n.title,
      n.doc ? `${n.doc}:${n.first}-${n.last}` : ""], mono: [2] };
  }

  const RELATION_NAME = { contains: "Contains", refs: "Cites", code: "Cited in code", defines: "Defines", calls: "Calls",
    ambiguous: "Ambiguous call" };
  const PROOFS_SHOWN = 2;

  function nodeTip(key) {
    const n = nodeOf(key);
    const linked = (links.get(key) || []).length;
    if (boxes.get(key)) {
      return { head: n.label, lines: [BOX_NAME[n.box] || BOX_NAME[CLASS_KIND], `${boxes.membersOf(key).length} functions`] };
    }
    if (n.type === TYPE_FILE) {
      const functions = (links.get(key) || []).filter((l) => l.kind === LINK_KIND_DEFINES && l.dir === "out").length;
      return { type: n.type, head: n.path.split("/").pop(), lines: ["Source file", n.path, `${n.ids} IDs cited`,
        CALL_GRAPH ? `${functions} functions` : ""], mono: [1] };
    }
    if (n.type === "FN") {
      const index = calls ? calls.index.get(key) : undefined;
      const cited = (links.get(key) || []).filter((l) => l.kind === LINK_KIND_CODE && l.dir === "out").map((l) => l.key);
      return { type: n.type, head: n.label, lines: [`Function · ${n.language}`, `${n.path}:${n.first}-${n.last}`,
        index === undefined ? "" : `${calls.callers(index).length} callers · ${calls.callees(index).length} callees`,
        cited.length ? `Cites ${cited.join(", ")}` : "Cites no ID"], mono: [1] };
    }
    if (n.type === TYPE_UNDEFINED) return { type: n.type, head: n.label, lines: ["Cited, but not in the index", `${linked} links`] };
    const base = elementTip(n);
    const coverage = n.type === "RQ" && DATA.coverage[key] ? `${COVERAGE[DATA.coverage[key]][0]}: ${COVERAGE[DATA.coverage[key]][1]}` : "";
    return { ...base, lines: [...base.lines, coverage, `${linked} links`] };
  }

  function scheduleSearchTip(item, key) {
    hideSearchTip();
    const row = item.getBoundingClientRect();
    const side = results.getBoundingClientRect();
    scheduleRichTip({ left: side.left, right: side.right, top: row.top, bottom: row.top }, () => elementTip(nodes.get(key)),
      CSS_QUICK_DELAY);
  }
  results.addEventListener("mouseleave", hideSearchTip);
  results.addEventListener("scroll", hideSearchTip);

  function renderResults(onlyType) {
    const q = search.value.trim().toLowerCase();
    state.search = q;
    renderMatrix();
    hideSearchTip();
    if (!q && !onlyType) { closeResults(); return; }
    const found = matches(q, onlyType);
    resultKeys = found.slice(0, SEARCH_LIMIT).map((n) => n.key);
    active = resultKeys.length ? 0 : -1;
    clear(results).append(...(resultKeys.length ? resultKeys.map((key, i) => {
      const n = nodes.get(key);
      return el("li", { class: `search-result t-${n.type}`, role: "option", [VALUE_ARIA_SELECTED]: String(i === active),
        on: { mousedown: (event) => { event.preventDefault(); pick(i); },
          mouseenter: (event) => scheduleSearchTip(event.currentTarget, key) } },
        el(TAG_SPAN, { class: "id-link" }, el(TAG_SPAN, { class: `dot t-${n.type}` }), el(TAG_SPAN, { class: "id", text: n.label })),
        n.title ? el(TAG_SPAN, { class: "search-result-title", text: n.title }) : null);
    }) : [el("li", { class: VALUE_SEARCH_EMPTY, text: "No element matches." })]));
    if (found.length > SEARCH_LIMIT) {
      results.append(el("li", { class: VALUE_SEARCH_EMPTY, text: `${found.length - SEARCH_LIMIT} more — refine the search` }));
    }
    results.hidden = false;
    search.setAttribute(VALUE_ARIA_EXPANDED, VALUE_TRUE);
  }

  function closeResults() {
    hideSearchTip();
    results.hidden = true;
    search.setAttribute(VALUE_ARIA_EXPANDED, "false");
  }

  function moveActive(step) {
    if (!resultKeys.length) return;
    active = (active + step + resultKeys.length) % resultKeys.length;
    [...results.children].forEach((li, i) => li.setAttribute(VALUE_ARIA_SELECTED, String(i === active)));
    results.children[active].scrollIntoView({ block: "nearest" });
    scheduleSearchTip(results.children[active], resultKeys[active]);
  }

  function pick(i) {
    if (i < 0 || i >= resultKeys.length) return;
    closeResults();
    select(resultKeys[i]);
    if (state.view === VALUE_OVERVIEW) showView(VALUE_GRAPH);
  }

  function searchFor(text, type) {
    search.value = text;
    search.focus();
    renderResults(type);
  }

  if (CALL_GRAPH) search.placeholder = "Search ID, title, file or function…";
  search.addEventListener(DOM_INPUT, () => renderResults());
  search.addEventListener("focus", () => { if (search.value.trim()) renderResults(); });
  search.addEventListener("blur", closeResults);
  search.addEventListener(EVENT_KEYDOWN, (event) => {
    if (event.key === "ArrowDown") { event.preventDefault(); moveActive(1); }
    else if (event.key === "ArrowUp") { event.preventDefault(); moveActive(-1); }
    else if (event.key === "Enter") { event.preventDefault(); pick(active); }
    else if (event.key === "Escape") { closeResults(); search.blur(); }
  });
  document.addEventListener(EVENT_KEYDOWN, (event) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if (event.key === "/" && !typing) { event.preventDefault(); search.focus(); search.select(); }
  });

  // ---- matrix -------------------------------------------------------------------------------------------------
  // The source files citing an element; a function's citation is one of its file's, not one more.
  const fileCitations = (key) => links.get(key).filter((l) => l.kind === LINK_KIND_CODE && nodes.get(l.key).type === TYPE_FILE);

  function matrixRow(rq) {
    const all = links.get(rq.key);
    const ofTypes = (types, dirs) => all.filter((l) => types.includes(nodes.get(l.key).type) && dirs.includes(l.dir)
      && l.kind !== LINK_KIND_CODE).map((l) => l.key);
    const cited = fileCitations(rq.key);
    const files = cited.map((l) => l.key);
    const lines = cited.reduce((sum, l) => sum + l.lines.length, 0);
    return {
      node: rq, id: rq.key, title: rq.title, status: rq.status,
      feature: all.filter((l) => l.kind === VALUE_CONTAINS && l.dir === "in").map((l) => l.key),
      decisions: unique(ofTypes(["ADR", "DEC"], ["in", "out"])),
      tasks: unique(ofTypes(["TASK", "PLAN"], ["in"])),
      functions: functionsCiting(rq.key),
      files: unique(files), lines, coverage: DATA.coverage[rq.key],
    };
  }

  // The functions citing an element, in their lines or the comment just above them.
  function functionsCiting(key) {
    return unique(links.get(key).filter((l) => l.kind === LINK_KIND_CODE && l.dir === "in" && nodes.get(l.key).type === "FN")
      .map((l) => l.key));
  }

  function unique(list) { return [...new Set(list)]; }

  // Each column is declared once, with the cell it draws; the header and every row walk the
  // ordered list of keys (DEFAULT_COLUMN_ORDER, then the reader's order), so a header and its cells never part.
  const MATRIX_COLUMNS = [
    { key: "feature", label: "Feature", value: (r) => r.feature.join(" "), hint: "The feature that contains it",
      cell: (r) => el("td", {}, idList(r.feature), ...r.feature.map((key) => nodes.get(key).title)
        .filter(Boolean).map((title) => el("div", { class: "cell-title", text: title }))) },
    { key: "id", label: "Requirement", value: (r) => r.id, hint: "The requirement, its title and status",
      cell: (r) => el("td", { class: "cell-requirement" }, idButton(r.id),
        el("div", { class: "cell-title", text: r.title }),
        r.status ? el("span", { class: "badge badge-neutral", text: r.status }) : null) },
    { key: "coverage", label: "Coverage", value: (r) => ["covered", "indirect", "uncovered"].indexOf(r.coverage),
      hint: "Covered: a source file cites it · Indirect: through a linked decision, task, ADR or plan · Uncovered: neither",
      cell: (r) => el("td", {}, coverageBadge(r.coverage)) },
    // A list column sorts by its count but shows IDs: its header aligns left, like its cells (only "Lines" is a number).
    { key: "decisions", label: "ADRs / decisions", value: (r) => r.decisions.length,
      hint: "ADRs and decisions citing it or cited by it", cell: (r) => el("td", {}, idList(r.decisions)) },
    { key: "tasks", label: "Plans / tasks", value: (r) => r.tasks.length, hint: "Plans and tasks citing it",
      cell: (r) => el("td", {}, idList(r.tasks)) },
    ...(CALL_GRAPH ? [{ key: "functions", label: "Functions", value: (r) => r.functions.length,
      hint: "Functions citing it in their lines or the comment just above them",
      cell: (r) => el("td", {}, idList(r.functions)) }] : []),
    { key: "files", label: "Source files", value: (r) => r.files.length, hint: "Source files citing it",
      cell: (r) => el("td", {}, idList(r.files)) },
    { key: "lines", label: "Lines", value: (r) => r.lines, num: true, hint: "Source lines citing it, all files together",
      cell: (r) => el("td", { class: "num", text: r.lines || "—" }) },
  ];
  const DEFAULT_COLUMN_ORDER = MATRIX_COLUMNS.map((c) => c.key);
  const matrixRows = requirements.map(matrixRow);

  function rowMatches(r) {
    if (!state.tris.has(r.node.tri)) return false;
    if (state.coverage !== "all" && r.coverage !== state.coverage) return false;
    const q = state.search;
    if (!q) return true;
    return [r.id, r.title, ...r.feature, ...r.decisions, ...r.tasks, ...r.functions.map((f) => nodes.get(f).label),
      ...r.files.map((f) => nodes.get(f).label)]
      .some((v) => v.toLowerCase().includes(q));
  }

  function idList(keys) {
    if (!keys.length) return el(TAG_SPAN, { class: "cell-empty", text: "—" });
    const shown = keys.slice(0, CELL_LIMIT).map((k) => idButton(k, true));
    return el("div", { class: "cell-list" }, shown,
      keys.length > CELL_LIMIT ? el(TAG_SPAN, { class: "cell-more", text: `+${keys.length - CELL_LIMIT}` }) : null);
  }

  function idButton(key, short) {
    const n = nodeOf(key);
    const label = n.type === TYPE_FILE && short ? n.label.split("/").pop() : n.label;
    return richTip(el(TAG_BUTTON, { class: `id-link t-${n.type}`, type: TAG_BUTTON,
      on: { click: (event) => { event.stopPropagation(); select(key); } } },
      el(TAG_SPAN, { class: `dot t-${n.type}` }), el(TAG_SPAN, { class: "id", text: label })), () => nodeTip(key), CSS_QUICK_DELAY);
  }

  function coverageBadge(rating) {
    return richTip(el(TAG_SPAN, { class: `badge badge-${rating}`, text: COVERAGE[rating][0] }), () => coverageTip(rating));
  }

  // ---- column order ----------------------------------------------------
  // The reader's order is a list of column keys kept in the browser; whatever it lacks or does not know is repaired.
  const ORDER_KEY = "agnos-perf-center-column-order";
  const columnOrder = repairColumnOrder(loadColumnOrder());
  let draggedColumn = null;
  let resizingColumn = false;                                  // a resize grip never starts a move

  function loadColumnOrder() {
    try { return JSON.parse(localStorage.getItem(ORDER_KEY) || "[]"); } catch (error) { return []; }   // no storage
  }

  function saveColumnOrder() {
    try {
      if (columnOrder.join() === DEFAULT_COLUMN_ORDER.join()) localStorage.removeItem(ORDER_KEY);
      else localStorage.setItem(ORDER_KEY, JSON.stringify(columnOrder));
    } catch (error) { /* the order lasts this visit */ }
  }

  // Unknown or repeated keys are dropped; a column the order lacks comes back after its predecessor in the default order.
  function repairColumnOrder(saved) {
    const order = (Array.isArray(saved) ? saved : []).filter((key, i, all) => DEFAULT_COLUMN_ORDER.includes(key) && all.indexOf(key) === i);
    DEFAULT_COLUMN_ORDER.forEach((key, i) => {
      if (order.includes(key)) return;
      const before = i ? order.indexOf(DEFAULT_COLUMN_ORDER[i - 1]) : -1;
      order.splice(before + 1, 0, key);
    });
    return order;
  }

  function orderedColumns() { return columnOrder.map((key) => MATRIX_COLUMNS.find((c) => c.key === key)); }

  function moveColumn(key, to) {
    const from = columnOrder.indexOf(key);
    if (from < 0 || to < 0 || to >= columnOrder.length || to === from) return;
    columnOrder.splice(from, 1);
    columnOrder.splice(to, 0, key);
    saveColumnOrder();
    renderMatrix();
  }

  function resetColumns() {
    columnOrder.splice(0, columnOrder.length, ...DEFAULT_COLUMN_ORDER);
    saveColumnOrder();
    matrixColumns.reset();
    renderMatrix();
  }

  function columnHeaderMoves(th, key) {
    th.addEventListener("dragstart", (event) => {
      if (resizingColumn) { event.preventDefault(); return; }
      draggedColumn = key;
      try { event.dataTransfer.setData("text/plain", key); event.dataTransfer.effectAllowed = "move"; } catch (error) { /* a plain drag */ }
    });
    th.addEventListener("dragover", (event) => {
      if (!draggedColumn) return;
      event.preventDefault();
      th.classList.toggle(VALUE_DROP_TARGET, draggedColumn !== key);
    });
    th.addEventListener("dragleave", () => th.classList.remove(VALUE_DROP_TARGET));
    th.addEventListener("drop", (event) => {
      if (!draggedColumn) return;
      event.preventDefault();
      const moved = draggedColumn;
      draggedColumn = null;
      moveColumn(moved, columnOrder.indexOf(key));
    });
    th.addEventListener("dragend", () => { draggedColumn = null; th.classList.remove(VALUE_DROP_TARGET); });
    th.addEventListener(EVENT_KEYDOWN, (event) => {
      if (!event.altKey || (event.key !== KEY_ARROWLEFT && event.key !== KEY_ARROWRIGHT)) return;
      event.preventDefault();
      moveColumn(key, columnOrder.indexOf(key) + (event.key === KEY_ARROWRIGHT ? 1 : -1));
      document.querySelector(`#matrix-table th[data-column=${key}]`)?.focus();
    });
  }

  function renderMatrix() {
    const column = MATRIX_COLUMNS.find((c) => c.key === state.sort.column);
    const rows = matrixRows.filter(rowMatches).sort((a, b) => {
      const va = column.value(a);
      const vb = column.value(b);
      const order = typeof va === "number" ? va - vb : String(va).localeCompare(String(vb), undefined, { numeric: true });
      return order * state.sort.dir || a.id.localeCompare(b.id);
    });
    const ordered = orderedColumns();
    const head = el("tr", {}, ...ordered.map((c) => {
      const th = el("th", {
        class: `sortable ${c.num ? "num" : ""}`, scope: "col", "aria-sort": ariaSort(c.key), "data-column": c.key,
        draggable: VALUE_TRUE, tabindex: "0", title: `${c.hint} · click to sort · drag, or Alt+arrow, to move`,
        on: { click: () => { state.sort = { column: c.key, dir: state.sort.column === c.key ? -state.sort.dir : 1 }; renderMatrix(); } } },
      c.label, matrixColumns.grip(c.key, c.label));
      columnHeaderMoves(th, c.key);
      return th;
    }));
    const body = rows.map((r) => el("tr", { class: state.selected === r.id ? VALUE_SELECTED : null, "data-key": r.id,
      on: { click: () => select(r.id) } }, ...ordered.map((c) => c.cell(r))));
    $(VALUE_MATRIX_TABLE).classList.toggle("with-functions", Boolean(CALL_GRAPH));
    clear($(VALUE_MATRIX_TABLE)).append(el(TAG_THEAD, {}, head), el(TAG_TBODY, {}, body));
    matrixColumns.apply();
    $("matrix-status").textContent = `${rows.length} of ${matrixRows.length} requirements`;
  }

  // ---- column widths ---------------------------------------------------
  // The first resize freezes every column at its drawn width, so that one column grows or shrinks and the others stay;
  // the table is then as wide as its columns and the frame scrolls. one sizer per table
  // (the matrix, the Delivery tasks), each keeping its own widths.
  const COLUMNS_KEY = "agnos-perf-center-columns";
  const cssNumber = (name) => Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));

  function columnSizer(tableOf, storageKey) {
    const widths = (() => {
      try { return JSON.parse(localStorage.getItem(storageKey) || "{}"); } catch (error) { return {}; }   // no storage
    })();
    const headers = () => [...tableOf().querySelectorAll("th[data-column]")];

    function apply() {
      const table = tableOf();
      const custom = Object.keys(widths).length > 0;
      for (const th of headers()) {
        if (!custom) {
          th.style.removeProperty(VALUE_WIDTH);
          continue;
        }
        widths[th.dataset.column] ??= th.offsetWidth;               // a column not kept yet: as drawn
        th.style.width = `${widths[th.dataset.column]}px`;
      }
      if (custom) {
        table.style.width = `${headers().reduce((sum, th) => sum + (widths[th.dataset.column] || 0), 0)}px`;
        table.style.minWidth = "auto";
      } else {
        table.style.removeProperty(VALUE_WIDTH);
        table.style.removeProperty("min-width");
      }
    }

    function save() {
      try { localStorage.setItem(storageKey, JSON.stringify(widths)); } catch (error) { /* the widths last this visit */ }
    }

    function set(key, width) {
      if (!Object.keys(widths).length) for (const th of headers()) widths[th.dataset.column] = th.offsetWidth;
      widths[key] = Math.round(Math.max(cssNumber("--c-column-min-width"), width));
      apply();
      save();
    }

    function reset() {
      for (const key of Object.keys(widths)) delete widths[key];
      apply();
      save();
    }

    function drag(key, grip, event) {
      event.preventDefault();
      event.stopPropagation();
      grip.setPointerCapture(event.pointerId);
      resizingColumn = true;
      const start = event.clientX;
      const width = grip.parentElement.offsetWidth;
      const move = (e) => set(key, width + e.clientX - start);
      const end = () => {
        resizingColumn = false;
        grip.removeEventListener(EVENT_POINTERMOVE, move);
        grip.removeEventListener(EVENT_POINTERUP, end);
        grip.removeEventListener(EVENT_POINTERCANCEL, end);
      };
      grip.addEventListener(EVENT_POINTERMOVE, move);
      grip.addEventListener(EVENT_POINTERUP, end);
      grip.addEventListener(EVENT_POINTERCANCEL, end);
    }

    function grip(key, label) {
      const node = el(TAG_SPAN, { class: "col-grip", role: "separator", tabindex: "0", "aria-orientation": "vertical",
        [VALUE_ARIA_LABEL]: `Resize the ${label} column`, title: "Drag, or use the arrow keys, to resize · double-click to reset" });
      node.addEventListener(EVENT_CLICK, (event) => event.stopPropagation());          // a grip never sorts
      node.addEventListener("dblclick", (event) => { event.stopPropagation(); reset(); });
      node.addEventListener("pointerdown", (event) => drag(key, node, event));
      node.addEventListener("mousedown", (event) => event.preventDefault());       // the grip resizes, it never drags the header
      node.addEventListener(EVENT_KEYDOWN, (event) => {
        if (event.key !== KEY_ARROWLEFT && event.key !== KEY_ARROWRIGHT) return;
        event.preventDefault();
        event.stopPropagation();
        const step = cssNumber("--c-splitter-step");
        set(key, node.parentElement.offsetWidth + (event.key === KEY_ARROWRIGHT ? step : -step));
      });
      return node;
    }

    return { apply, reset, grip };
  }

  const matrixColumns = columnSizer(() => $(VALUE_MATRIX_TABLE), COLUMNS_KEY);

  function ariaSort(columnKey) {
    if (state.sort.column !== columnKey) return null;
    return state.sort.dir > 0 ? "ascending" : "descending";
  }

  function setCoverageFilter(value) {
    state.coverage = value;
    for (const b of $(VALUE_COVERAGE_FILTER).querySelectorAll(TAG_BUTTON)) b.setAttribute(VALUE_ARIA_PRESSED, String(b.dataset.coverage === value));
    renderMatrix();
  }

  $(VALUE_COVERAGE_FILTER).addEventListener(EVENT_CLICK, (event) => {
    const b = event.target.closest(TAG_BUTTON);
    if (b) setCoverageFilter(b.dataset.coverage);
  });

  function csvCell(value) {
    const text = String(value);
    return /[",\n;]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  }

  // The matrix rows shown, as CSV; with a call graph, a Functions column of qualified names.
  function csvText() {
    const withFunctions = (row, functions) => (CALL_GRAPH ? [...row, functions] : row);
    const header = [...withFunctions(["Requirement", "Title", "Status", "Feature", "ADRs / decisions", "Plans / tasks"],
      "Functions"), "Source files", "Source lines", "Coverage"];
    const lines = matrixRows.filter(rowMatches).map((r) => [...withFunctions([r.id, r.title, r.status, r.feature.join(" "),
      r.decisions.join(" "), r.tasks.join(" ")], r.functions.map((f) => nodes.get(f).label).join(" ")),
      r.files.map((f) => nodes.get(f).label).join(" "),
      fileCitations(r.id).flatMap((l) => l.lines.map((line) => `${nodes.get(l.key).label}:${line[0]}`)).join(" "),
      r.coverage]);
    return [header, ...lines].map((row) => row.map(csvCell).join(",")).join("\r\n");
  }

  function exportCsv() {
    const url = URL.createObjectURL(new Blob(["﻿", csvText()], { type: "text/csv;charset=utf-8" }));
    const a = el("a", { href: url, download: `traceability-${DATA.meta.title}.csv` });
    document.body.append(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  $("export-csv").addEventListener("click", exportCsv);
  $("reset-columns").addEventListener("click", resetColumns);

  // ---- quality view ----------------------------
  const scoreText = (check) => (check.score === null ? "n/a" : check.score.toFixed(SCORE_DECIMALS));
  const gradeOf = (score) => (score === null ? null : (DATA.quality.scale.find(([, threshold]) => score >= threshold) || DATA.quality.scale.at(-1))[0]);
  const riskWeight = (check) => DATA.quality.risks[check.risk];
  // The lowest score first; an informational check or one with no score last; the heavier risk, then the title, break a tie.
  const isRanked = (check) => check.score !== null && check.risk !== INFORMATIONAL;
  const rankedChecks = () => CHECKS.toSorted((a, b) => (!isRanked(a)) - (!isRanked(b))
    || (a.score ?? 0) - (b.score ?? 0) || riskWeight(b) - riskWeight(a) || a.title.localeCompare(b.title));
  // ( amended): the checks as listed, the heavier risk first, then by title.
  const orderedChecks = () => CHECKS.toSorted((a, b) => riskWeight(b) - riskWeight(a) || a.title.localeCompare(b.title));

  function checkFormula(check) {
    if (check.score === null) return "Nothing to score: the population is empty.";
    return `${SCORE_MAX} × (${check.population} − ${check.findings.length}) ÷ ${check.population} = ${scoreText(check)}`;
  }

  function checkKpis(check) {
    const compliant = check.population - check.findings.length;
    const kpi = (label, value) => el("div", { class: "check-kpi" }, el("span", { class: "check-kpi-value", text: value }),
      el("span", { class: "check-kpi-label", text: label }));
    return el("div", { class: "check-kpis" }, kpi("population", check.population), kpi("compliant", compliant),
      kpi("findings", check.findings.length), kpi("risk", check.risk));
  }

  function checkFindings(check) {
    const keys = findingKeys(check);
    const shown = state.moreFindings.has(check.key) ? keys : keys.slice(0, FINDINGS_SHOWN);
    return [keys.length ? el("ul", { class: "finding-list" }, ...shown.map((key) => {
      const n = nodes.get(key);
      return el("li", {}, richTip(el("button", { class: "finding", type: "button", on: { click: () => select(key) } },
        el("span", { class: `dot t-${n.type}` }), el("span", { class: "id", text: n.label }),
        n.title ? el("span", { class: "finding-title", text: n.title }) : null), () => nodeTip(key), CSS_QUICK_DELAY));
    })) : el("div", { class: "check-none", text: "None — the rule holds." }),
    keys.length > shown.length ? el("button", { class: "link-button", type: "button",
      on: { click: () => { state.moreFindings.add(check.key); renderQuality(); } }, text: `Show all ${keys.length}` }) : null];
  }

  // A check's risk, score bar and findings: its compact form beside its title (also the Overview's).
  function checkFigures(check) {
    const grade = isRanked(check) ? gradeOf(check.score) : null;
    return [richTip(el("span", { class: `badge badge-neutral check-risk risk-${check.risk}`, text: check.risk }),
      () => ({ head: `Risk ${check.risk}`, lines: [`Weight ${DATA.quality.risks[check.risk]} in the overall score`] })),
    richTip(el("span", { class: `check-score grade-${grade || VALUE_NONE}` },
      el("span", { class: "score-bar" }, el("span", { class: "score-fill", style: { "--score": (check.score ?? 0) * PERCENT / SCORE_MAX } })),
      el("span", { class: "score-text", text: scoreText(check) })),
    () => scoreTip(check)),
    richTip(el("span", { class: `${checkBadgeClass(check)} check-count`, text: check.findings.length }),
      () => ({ head: findingCount(check.findings.length),
        lines: ["The elements that fail this check"] }))];
  }

  // A check, compact (title, risk, score bar, findings) or detailed behind its chevron (rule, formula, figures, findings).
  function checkCard(check) {
    const open = state.openChecks.has(check.key);
    const detailId = `check-detail-${check.key}`;
    const toggleCheck = () => {
      if (open) state.openChecks.delete(check.key); else state.openChecks.add(check.key);
      renderQuality();
    };
    return el("article", { class: `card check-card${open ? " is-open" : ""}`, id: `check-${check.key}`, "data-check": check.key },
      el("header", { class: "check-head" },
        el("button", { class: "check-toggle", type: "button", "aria-expanded": String(open), "aria-controls": detailId,
          title: open ? "Show this check compact" : "Show the rule, the figures and the findings of this check",
          on: { click: toggleCheck } }, el("span", { class: "check-chevron", "aria-hidden": "true" }),
          el("span", { class: "check-card-title", text: check.title })),
        ...checkFigures(check)),
      open ? el("div", { class: "check-detail", id: detailId },
        el("p", { class: "check-card-desc", text: check.rule }),
        el("p", { class: "check-formula", text: checkFormula(check) }), checkKpis(check), ...checkFindings(check)) : null);
  }

  // ---- quality charts -----------------------------------------
  // Drawn by ECharts from the `quality` block: the checks radar, the feature areas.
  const SVG_NS = "http://www.w3.org/2000/svg";
  const HALF = 2;

  function svgEl(tag, attrs, ...children) {
    const node = document.createElementNS(SVG_NS, tag);
    for (const [name, value] of Object.entries(attrs || {})) if (!isAbsent(value)) node.setAttribute(name, String(value));
    node.append(...children.flat().filter((child) => !isAbsent(child))
      .map((child) => (child instanceof Node ? child : document.createTextNode(String(child)))));
    return node;
  }




  function checkTipLines(check) {
    return [check.title, `score ${scoreText(check)} out of ${SCORE_MAX} · risk ${check.risk}`,
      `population ${check.population} · ${findingCount(check.findings.length)}`];
  }

  // ---- the checks radar: drawn by ECharts through libraryChart.
  // One axis per scored check; the arrows go from check to check, each with its tooltip; Enter or a click on an axis's
  // name opens the check.
  let radarPointed = null;                                             // the check the keyboard is on, or null

  const RADAR_RINGS = 5;                                              // rings at 2, 4, 6, 8 and 10
  const RADAR_MOVE = "mousemove";
  const gradeColour = (score) => cssValue(`--s-grade-${gradeOf(score).toLowerCase()}`);

  function radarOption(theme) {
    const scored = CHECKS.filter((c) => c.score !== null);
    const accent = theme.colour.accent;
    const byName = new Map(scored.map((c) => [c.label, c]));
    // Each axis's name, then its score in its grade's colour: one rich style per grade.
    const rich = Object.fromEntries(scored.map((c) => [`g${c.key.replace(/\W/g, "")}`,
      { ...theme.caption, color: gradeColour(c.score), fontWeight: cssValue(CSS_VAR_S_WEIGHT_STRONG) }]));
    return {
      tooltip: { trigger: "item", formatter: () => tipHtml(radarPointed ? checkTipLines(radarPointed)
        : ["Checks", ...scored.map((c) => `${c.title}: ${scoreText(c)} out of ${SCORE_MAX}`)]) },
      radar: {
        indicator: scored.map((c) => ({ name: c.label, max: SCORE_MAX, check: c.key })), triggerEvent: true,
        shape: "polygon", splitNumber: RADAR_RINGS, radius: "62%",
        axisName: { ...theme.caption, color: theme.colour.text, rich,
          formatter: (name) => { const c = byName.get(name); return `${name}\n{g${c.key.replace(/\W/g, "")}|${scoreText(c)}}`; } },
        axisLine: { lineStyle: { color: theme.colour.border } },
        splitLine: { lineStyle: { color: theme.colour.border } },
        splitArea: { show: true, areaStyle: { color: [cssValue("--s-surface-subtle"), theme.colour.surface] } },
      },
      series: [
        { type: "radar", name: "Scores", z: 2,
          data: [{ name: "Scores", value: scored.map((c) => c.score) }],
          symbol: "circle", symbolSize: cssSize("--s-space-sm"),
          itemStyle: { color: accent, borderColor: theme.colour.surface, borderWidth: cssSize("--s-stroke-focus") },
          lineStyle: { color: accent, width: cssSize("--s-stroke-focus") },
          areaStyle: { color: accent, opacity: cssSize("--s-opacity-tint") } },
      ],
    };
  }

  function drawRadar(box) {
    const scored = CHECKS.filter((c) => c.score !== null);
    const byLabel = new Map(scored.map((c) => [c.label, c.key]));
    // The pointer's check: the axis nearest to its angle around the radar's centre (the first axis at the top, the
    // others counter-clockwise, as ECharts draws them), so that its tooltip is that check's.
    box.addEventListener(RADAR_MOVE, (event) => {
      const r = box.getBoundingClientRect();
      const angle = Math.atan2(r.top + r.height / HALF - event.clientY, event.clientX - r.left - r.width / HALF);
      const step = (HALF * Math.PI) / scored.length;
      const index = Math.round((angle - Math.PI / HALF) / step);
      radarPointed = scored[((index % scored.length) + scored.length) % scored.length];
    });
    libraryChart(box, radarOption, {
      label: "Checks radar",
      description: `Score out of ${SCORE_MAX} of each check, one axis per check: the further from the centre, the better.`,
      items: scored.map((c) => ({ seriesIndex: 0, dataIndex: 0, check: c.key })),
      onPoint: (item) => { radarPointed = CHECKS.find((c) => c.key === item.check); },
      onActivate: (item) => {
        const key = item.check || byLabel.get(item.params?.name);
        if (key) openCheck(key);
      },
    });
  }

  // ---- feature areas ( amended): one ECharts chart, a Total row then
  // one row per trigram, the shares of its requirements covered, indirect and uncovered stacked to 100 % in the coverage
  // colours (the counts in the tooltip), its grade and score at the row's end in its grade's colour; a row per trigram's height.
  // A trigram without requirement has no row: the report card lists it with its grade.
  const AREA_TOTAL = "Total";
  const AREA_BAR_GAP = "40%";                                        // the room between two rows' bars
  const COVERAGE_COLOUR = { covered: "--s-status-ok", indirect: "--s-status-warn", uncovered: "--s-status-error" };

  function areaRows() {
    const counts = (list) => Object.fromEntries(Object.keys(COVERAGE).map((k) => [k, list.filter((r) => DATA.coverage[r.key] === k).length]));
    return [{ name: AREA_TOTAL, grade: DATA.quality.grade, score: DATA.quality.score, counts: counts(requirements) },
      ...Object.entries(DATA.quality.trigrams).filter(([tri]) => requirements.some((r) => r.tri === tri)).map(([tri, t]) => ({ name: tri, grade: t.grade, score: t.score,
        findings: t.checks.reduce((sum, c) => sum + c.findings, 0), counts: counts(requirements.filter((r) => r.tri === tri)) }))];
  }

  function areasOption(theme, legend = true) {
    const rows = areaRows();
    const kinds = Object.keys(COVERAGE);
    // the grade as the page's grade chip (its letter on its colour), then the score in the text colour
    const end = (row) => (row.grade ? `{g${row.grade}|${row.grade}} ${scoreOut(row.score)}` : `– ${scoreOut(row.score)}`);
    const rich = Object.fromEntries([...new Set(rows.map((r) => r.grade).filter(Boolean))].map((g) => [`g${g}`,
      { ...theme.caption, color: cssValue(`--s-on-grade-${g.toLowerCase()}`), backgroundColor: cssValue(`--s-grade-${g.toLowerCase()}`),
        borderRadius: cssSize("--s-radius-sm"), padding: [cssSize("--s-space-hair"), cssSize("--s-space-xs")],
        fontWeight: cssValue(CSS_VAR_S_WEIGHT_STRONG) }]));
    const totalOf = (row) => kinds.reduce((sum, k) => sum + row.counts[k], 0);
    const share = (row, k) => (totalOf(row) ? (PERCENT * row.counts[k]) / totalOf(row) : 0);
    const tip = (params) => {
      const row = rows[(Array.isArray(params) ? params[0] : params).dataIndex];
      const total = totalOf(row);
      return tipHtml([row.name, `grade ${row.grade || VALUE_NONE} · score ${scoreOut(row.score)} out of ${SCORE_MAX}`,
        ...kinds.map((k) => `${COVERAGE[k][0]}: ${row.counts[k]} of ${total} requirements · ${Math.round(share(row, k))} %`),
        ...(row.findings === undefined ? [] : [findingCount(row.findings)])]);
    };
    return {
      legend: { show: legend, data: kinds.map((k) => COVERAGE[k][0]), top: 0 },
      // the room on the right holds the longest end label, "A 10.0", which containLabel does not count
      grid: { containLabel: true, left: 0, right: legendRoom() + chartMargin(), top: legend ? legendRoom() : chartMargin(), bottom: 0 },
      tooltip: { trigger: TRIGGER_AXIS, axisPointer: { type: "shadow" }, formatter: tip },
      xAxis: { type: AXIS_VALUE, max: PERCENT, axisLabel: { ...theme.caption, formatter: "{value} %" } },
      yAxis: { type: AXIS_CATEGORY, data: rows.map((r) => r.name), inverse: true,
        axisLabel: { ...theme.caption, color: theme.colour.text, interval: 0 } },   // every trigram named
      series: kinds.map((k, i) => ({ type: SERIES_BAR, name: COVERAGE[k][0], stack: "coverage", barCategoryGap: AREA_BAR_GAP,
        itemStyle: { color: cssValue(COVERAGE_COLOUR[k]) },
        label: { show: i === kinds.length - 1, position: "right", ...theme.caption, color: theme.colour.text, rich,
          formatter: ({ dataIndex }) => end(rows[dataIndex]) },
        data: rows.map((r) => ({ value: share(r, k), count: r.counts[k] })) })),
    };
  }

  function drawAreas(box, legend = true) {
    const rows = areaRows();
    box.style.setProperty("--rows", String(rows.length));
    libraryChart(box, (theme) => areasOption(theme, legend), {
      label: "Feature areas",
      description: `The requirements of the project (Total) and of each feature area, covered, indirect or uncovered, with each one's grade and score out of ${SCORE_MAX}.`,
      items: rows.map((_, i) => ({ seriesIndex: 0, dataIndex: i })),
      // A trigram's row shows the matrix filtered on it, the Total row with every trigram
      onActivate: (item) => {
        const row = rows[item.dataIndex];
        if (row) onlyTrigram(row.name === AREA_TOTAL ? null : row.name);
      },
    });
  }

  function renderCharts() {
    const card = (title, svg) => el("article", { class: "card chart-card" },
      el("header", { class: "card-header" }, el("h3", { class: "card-title", text: title })), svg);
    const radar = el("div", { class: "quality-radar", "data-chart": "radar" });
    const areas = el("div", { class: "quality-areas", "data-chart": "areas" });
    clear($("quality-charts")).append(card("Checks", radar), card("Feature areas", areas));
    drawRadar(radar);
    drawAreas(areas);
  }

  // The grade as a coloured letter: the letter is always written, the colour only repeats it.
  function gradeChip(grade, score, extra) {
    const meaning = grade ? `Grade ${grade}: ${DATA.quality.verdicts[grade].toLowerCase()}, score ${score.toFixed(SCORE_DECIMALS)} out of ${SCORE_MAX}` : "Not graded";
    return richTip(el("span", { class: `grade-chip grade-${grade || VALUE_NONE} ${extra || ""}`, text: grade || "–" }),
      () => ({ head: grade ? `Grade ${grade}` : "Not graded", lines: [meaning, grade ? gradeRange(grade) : ""] }));
  }

  const attentionChecks = () => rankedChecks().filter((c) => isRanked(c) && c.score < DATA.quality.attention);

  function gradeRange(letter) {
    const scale = DATA.quality.scale;
    const i = scale.findIndex(([l]) => l === letter);
    const upper = i ? scale[i - 1][1] : SCORE_MAX;
    return i ? `Scores from ${scale[i][1]} to under ${upper}` : `Scores from ${scale[i][1]} to ${upper}`;
  }

  function scaleStrip(grade) {
    const scale = DATA.quality.scale;
    return el("ol", { class: "scale", "aria-label": "Grade scale" }, ...scale.map(([letter, threshold], i) => {
      const upper = i ? scale[i - 1][1] : SCORE_MAX;
      const range = i ? `${threshold} to under ${upper}` : `${threshold} to ${upper}`;
      return richTip(el("li", { class: `scale-step grade-${letter}${letter === grade ? " is-current" : ""}`, text: letter,
        [VALUE_ARIA_LABEL]: `Grade ${letter}: score ${range}`, "aria-current": letter === grade ? "true" : null }),
      () => ({ head: `Grade ${letter}`, lines: [DATA.quality.verdicts[letter], gradeRange(letter)] }));
    }));
  }

  const scoreOut = (score) => (score === null ? "n/a" : score.toFixed(SCORE_DECIMALS));

  function verdictText(grade, attention) {
    if (!grade) return "Nothing to score";
    const need = attention === 1 ? "check needs" : "checks need";
    const attentionWords = attention ? `${attention} ${need} attention` : "no check needs attention";
    return `${DATA.quality.verdicts[grade]}: ${attentionWords}`;
  }

  // The report card of the decision maker: grade, score, verdict, grade of each trigram, what to fix first.
  function renderReport() {
    const quality = DATA.quality;
    const fixes = rankedChecks().filter((c) => isRanked(c) && c.findings.length).slice(0, FIX_FIRST_SHOWN);
    const fixLink = (c) => el("li", {}, richTip(el("button", { class: "fix-link", type: "button", "data-check": c.key,
      on: { click: () => openCheck(c.key) } },
    el("span", { class: "fix-title", text: c.title }),
    richTip(el("span", { class: `check-score grade-${gradeOf(c.score)}` }, el("span", { class: "score-text", text: scoreText(c) })),
      () => scoreTip(c))), () => checkTip(c)));
    const area = ([tri, t]) => richTip(el("li", { class: "report-trigram" },
      el("span", { class: "report-tri", text: tri }), gradeChip(t.grade, t.score), el("span", { class: "report-tri-score", text: scoreOut(t.score) })),
    () => { const low = (t.checks || []).filter((c) => c.score !== null && c.score < DATA.quality.attention).length;
      return { head: tri, lines: [`Score ${scoreOut(t.score)} / ${SCORE_MAX} · grade ${t.grade || "–"}`,
        `${low} ${low === 1 ? "check" : "checks"} under ${DATA.quality.attention}`] }; });
    clear($("quality-report")).append(
      el("div", { class: "report-main" }, gradeChip(quality.grade, quality.score, "report-grade"),
        el("div", { class: "report-summary" },
          el("div", { class: "report-score", text: quality.score === null ? "n/a" : `${scoreOut(quality.score)} / ${SCORE_MAX}` }),
          el("div", { class: "report-verdict", text: verdictText(quality.grade, attentionChecks().length) }), scaleStrip(quality.grade))),
      el("div", { class: "report-fix" }, el("h3", { class: "report-title", text: "Fix first" }),
        fixes.length ? el("ul", { class: "fix-first" }, ...fixes.map(fixLink)) : el("p", { class: "check-none", text: "Nothing to fix." })),
      el("div", { class: "report-areas" }, el("h3", { class: "report-title", text: "By feature area" }),
        el("ul", { class: "report-trigrams" }, ...Object.entries(quality.trigrams).map(area))));
  }

  function renderGradeChips() {
    for (const id of ["side-grade", "quality-grade", "overview-grade"]) {
      clear($(id)).append(gradeChip(DATA.quality.grade, DATA.quality.score));
    }
  }

  function renderQuality() {
    const total = CHECKS.filter((c) => c.risk !== INFORMATIONAL).reduce((sum, c) => sum + c.findings.length, 0);
    $("quality-count").textContent = total ? String(total) : "";
    renderGradeChips();
    renderReport();
    renderCharts();
    clear($("quality-list")).append(...orderedChecks().map(checkCard));
  }

  $("expand-checks").addEventListener("click", () => { CHECKS.forEach((c) => state.openChecks.add(c.key)); renderQuality(); });
  $("collapse-checks").addEventListener("click", () => { state.openChecks.clear(); renderQuality(); });

  function openCheck(key) {
    state.openChecks.add(key);
    renderQuality();
    showView("quality");
    const card = $(`check-${key}`);
    if (card) card.scrollIntoView({ block: "start" });
  }

  // ---- history view ----------------------------
  // The `history` block of the data file, drawn as a timeline of inline SVG: one row per process element,
  // or per file and function, one mark per commit that changed it. Only the rows in view are in the document
  //; the page computes no intervention, it filters and draws.
  const HISTORY = DATA.history || null;
  const HISTORY_VIEW = "history";
  const ANGLE_REQUIREMENTS = "requirements";
  const ANGLE_CODE = "code";
  const GROUPING_FILES = "files";
  const KIND_HUMAN = "human";
  const KIND_AGENT = "agent";
  const KIND_TOGETHER = "together";
  const KIND_MIXED = "mixed";           // a group of commits of different kinds
  const KIND_LABEL = { [KIND_HUMAN]: "human", [KIND_AGENT]: "agent", [KIND_TOGETHER]: "human and agent together", [KIND_MIXED]: "mixed group" };
  const GROUP_FILL = "var(--c-history-group-fill)";
  const INK_LIGHT = "var(--c-history-ink-light)";
  const INK_DARK = "var(--c-history-ink-dark)";
  const CLASS_MARK_INNER = "history-mark-inner";
  const GROUP_COUNT_MAX = 99;           // a larger count would not fit its mark
  const GROUP_TIP_COMMITS = 10;
  // The sRGB transfer, WCAG's luminance and the OKLab matrices: published constants, not visual choices.
  const BYTE_MAX = 255;
  const SRGB_KNEE = 0.04045;
  const SRGB_SLOPE = 12.92;
  const SRGB_OFFSET = 0.055;
  const SRGB_GAMMA = 2.4;
  const LUMINANCE = [0.2126, 0.7152, 0.0722];
  const LUMINANCE_FLARE = 0.05;
  const OKLAB_CONES = [[0.4122214708, 0.5363325363, 0.0514459929], [0.2119034982, 0.6806995451, 0.1073969566], [0.0883024619, 0.2817188376, 0.6299787005]];
  const OKLAB_AXES = [[0.2104542553, 0.793617785, -0.0040720468], [1.9779984951, -2.428592205, 0.4505937099], [0.0259040371, 0.7827717662, -0.808675766]];
  const IDENTITY_TOKENS = 12;           // the identities past these take a golden-angle hue
  const ROW_OVERSCAN = 6;               // rows drawn above and below the view, so that a scroll shows no gap
  const PAN_FRACTION = 0.1;             // an arrow key moves the period by this share of its width
  const MIN_SPAN_MS = 3600000;          // the narrowest period: one hour
  const DAY_MS = 86400000;
  const WEEK_DAYS = 7;
  const MONDAY_OFFSET_DAYS = 4;         // 1970-01-05, the first Monday after the epoch
  const EDGE_PAD = 0.03;                // the whole history fits with this share of margin on each side
  const WHEEL_NOTCH = 100;              // one wheel notch, in deltaY units
  const TICK_FROM = 0.25;               // an overview tick spans the middle half of the strip
  const TICK_TO = 0.75;
  const CSS_MARK = "--c-history-mark";
  const CSS_MARK_DIAMOND = "--c-history-mark-diamond";
  const CSS_MARK_SQUARE = "--c-history-mark-square";
  const FULL_HUE = 360;
  const LOCALE = "en";
  const UTC = "UTC";
  const SVG_CIRCLE = "circle";
  const VALUE_PATH = "path";
  const SVG_GROUP = "g";
  const SVG_TEXT = "text";
  const CLASS_MARK = ".history-mark";
  const CLASS_LABEL = "history-label";
  const CLASS_IDENTITY_ICON = "is-identity";
  const IS_SELECTED = "is-selected";
  const EVENT_POINTERDOWN = "pointerdown";
  const KEY_ENTER = "Enter";
  const ID_HISTORY_TYPES = "history-types";
  const ID_HISTORY_SPLIT = "history-split";
  const ID_HISTORY_FILTER = "history-filter";
  const CLASS_NAME = "history-name";
  const ATTR_PERSON = "data-person";
  const CSS_TIP_DELAY = "--c-history-tip-delay";
  const TEXT_IDENTITIES = "identities";
  const ID_SHOW_EMPTY = "history-show-empty";
  const ID_HISTORY_PEOPLE = "history-people";
  const ID_HISTORY_KIND = "history-kind";
  const CSS_HAIRLINE = "--s-stroke-hairline";
  const CSS_IDENTITY = "--identity";
  const ID_HISTORY_SCROLL = "history-scroll";
  const ID_HISTORY_ROWS = "history-rows";
  const ID_HISTORY_GROUPING = "history-grouping";
  const ID_HISTORY_ANGLE = "history-angle";
  const ID_HISTORY_OVERVIEW = "history-overview";
  const HANDLE_START = "start";         // The handles of the overview window, by the end they move
  const HANDLE_END = "end";
  const HANDLE_NAME = { [HANDLE_START]: "First day in view", [HANDLE_END]: "Last day in view" };
  const CLASS_LEGEND_ITEM = "history-legend-item";
  const CLASS_COUNT = "history-count";
  const ATTR_VIEWBOX = "viewBox";
  const ATTR_ARIA_HIDDEN = "aria-hidden";
  const MONTHS_PER_QUARTER = 3;
  const NUMERIC = "numeric";
  const SHORT = "short";
  const TWO_DIGIT = "2-digit";
  const UNIT_WEEK = "week";
  const UNIT_MONTH = "month";
  const UNIT_QUARTER = "quarter";
  const UNIT_YEAR = "year";
  const DAYS_PER_MONTH = 30;
  const DAYS_PER_QUARTER = 91;
  const DAYS_PER_YEAR = 365;
  const SIX = 6;
  const FORMAT_TIME = { month: SHORT, day: NUMERIC, hour: TWO_DIGIT, minute: TWO_DIGIT };
  const FORMAT_DAY = { month: SHORT, day: NUMERIC };
  const FORMAT_MONTH = { month: SHORT, year: NUMERIC };
  // The steps of the time axis, finest first: [name, approximate width in ms, label format].
  const TICK_UNITS = [
    ["hour", MIN_SPAN_MS, FORMAT_TIME],
    ["six hours", SIX * MIN_SPAN_MS, FORMAT_TIME],
    ["day", DAY_MS, FORMAT_DAY],
    [UNIT_WEEK, WEEK_DAYS * DAY_MS, FORMAT_DAY],
    [UNIT_MONTH, DAYS_PER_MONTH * DAY_MS, FORMAT_MONTH],
    [UNIT_QUARTER, DAYS_PER_QUARTER * DAY_MS, FORMAT_MONTH],
    [UNIT_YEAR, DAYS_PER_YEAR * DAY_MS, { year: NUMERIC }],
  ];
  const DATE_TEXT = new Intl.DateTimeFormat(LOCALE, { timeZone: UTC, year: NUMERIC, ...FORMAT_TIME });
  const DAY_TEXT = new Intl.DateTimeFormat(LOCALE, { timeZone: UTC, year: NUMERIC, ...FORMAT_DAY });

  const KIND_ALL = "all";
  const BAND_DAY_LIMIT = 45;            // a period of at most this many days is drawn day by day
  const BAND_WEEK_LIMIT = 270;          // up to this many, week by week; beyond, month by month
  const BAND_STACK = [KIND_HUMAN, KIND_TOGETHER, KIND_AGENT];   // from the bottom of a bar
  const hist = {
    angle: ANGLE_REQUIREMENTS, grouping: GROUPING_FILES, span: null, full: null, baseRows: [], rows: [], built: false,
    commit: null, people: new Set(), kind: KIND_ALL, showEmpty: false, kept: [], shown: [], scope: null, closed: new Set(),
    text: "", types: new Set(TYPES), label: null,
  };
  const MERGED_TEXT = { email: "e-mail", mailmap: ".mailmap" };
  const FOLDER_PREFIX = "dir:";
  const isFolder = (row) => row.folder !== undefined;
  const isEntry = (row) => !row.group && !isFolder(row);           // a row of an element, a file or a function
  const commitTime = HISTORY ? HISTORY.commits.map((c) => Date.parse(c.date)) : [];
  const fnIndex = new Map(fnKeys.map((key, i) => [key, i]));

  // A colour of its own per identity, from the tokens: twelve categorical ones, then golden-angle hues.
  function identityColour(index) {
    if (index < IDENTITY_TOKENS) return `var(--c-history-identity-${index + 1})`;
    const turn = index - IDENTITY_TOKENS;
    const lightness = cssNumber(turn % 2 ? "--c-history-identity-lightness-alt" : "--c-history-identity-lightness");
    const hue = (cssNumber("--c-history-identity-hue-start") + turn * cssNumber("--c-history-identity-hue-step")) % FULL_HUE;
    return `oklch(${lightness} ${cssNumber("--c-history-identity-chroma")} ${hue})`;
  }
  const colourOf = HISTORY ? HISTORY.people.map((_, i) => identityColour(i)) : [];

  function kindIcon(kind) {
    const icon = svgEl("svg", { class: `kind-icon kind-${kind}`, viewBox: "0 0 24 24", [ATTR_ARIA_HIDDEN]: VALUE_TRUE },
      svgEl("use", { href: `#icon-${kind}` }));
    return icon;
  }

  // An identity's sign is its kind's icon drawn in its colour, with no dot before it.
  function identityIcon(index) {
    const icon = kindIcon(HISTORY.people[index].kind);
    icon.classList.add(CLASS_IDENTITY_ICON);
    icon.style.setProperty(CSS_IDENTITY, colourOf[index]);
    return icon;
  }

  // An identity as the page names it everywhere: its icon in its colour, its name (never the colour alone).
  function personTag(index) {
    const person = HISTORY.people[index];
    return richTip(el(TAG_SPAN, { class: "history-person", tabindex: "0" }, identityIcon(index),
      el(TAG_SPAN, { text: person.name })), () => linesTip(identityLines(index)), CSS_TIP_DELAY);
  }

  // ---- rows: the requirements angle, the code angle by file or by requirement ----
  function mergeMarks(lists) {
    const byCommit = new Map();
    for (const [commit, lines] of lists.flat()) byCommit.set(commit, (byCommit.get(commit) || 0) + lines);
    return [...byCommit.entries()].sort((a, b) => a[0] - b[0]);
  }

  function groupedRows(keys, marksOf) {
    const rows = [];
    for (const type of TYPES) {
      const ofType = keys.filter((key) => nodes.get(key).type === type);
      if (!ofType.length) continue;
      rows.push({ group: true, label: plural(type, 2), count: ofType.length });
      for (const key of ofType) {
        const n = nodes.get(key);
        rows.push({ key, label: n.label, name: n.title, depth: 0, marks: marksOf(key) });
      }
    }
    return rows;
  }

  const elementKeys = () => DATA.elements.filter((e) => e.kind === VALUE_ELEMENT).map((e) => e.id);
  const elementMarks = (id) => HISTORY.interventions.elements[id] || [];
  const fileMarks = (key) => HISTORY.interventions.files[nodes.get(key).path] || [];
  const functionMarks = (key) => HISTORY.interventions.functions?.[String(fnIndex.get(key))] || [];

  function fileRows() {
    const functionsOf = new Map();
    for (const key of fnKeys) {
      const file = nodes.get(key).file;
      if (!functionsOf.has(file)) functionsOf.set(file, []);
      functionsOf.get(file).push(key);
    }
    // A tree of the files' folders; a folder holding one folder and no file joins it (a/b/c).
    const root = { path: "", dirs: new Map(), files: [] };
    for (const f of DATA.files) {
      let dir = root;
      for (const part of f.path.split("/").slice(0, -1)) {
        if (!dir.dirs.has(part)) dir.dirs.set(part, { name: part, path: dir.path ? `${dir.path}/${part}` : part, dirs: new Map(), files: [] });
        dir = dir.dirs.get(part);
      }
      dir.files.push(f);
    }
    const byName = (a, b) => a.name.localeCompare(b.name, undefined, { numeric: true });
    const rows = [];
    const walk = (dir, depth, ancestors) => {
      for (const sub of [...dir.dirs.values()].sort(byName)) {
        let folder = sub;
        let label = sub.name;
        while (!folder.files.length && folder.dirs.size === 1) {
          folder = [...folder.dirs.values()][0];
          label += `/${folder.name}`;
        }
        rows.push({ key: FOLDER_PREFIX + folder.path, folder: folder.path, label, name: "", title: folder.path, depth, ancestors,
          marks: [] });
        walk(folder, depth + 1, [...ancestors, folder.path]);
      }
      for (const f of [...dir.files].sort((a, b) => a.path.localeCompare(b.path, undefined, { numeric: true }))) {
        const key = FILE_PREFIX + f.path;
        rows.push({ key, label: f.path.slice(f.path.lastIndexOf("/") + 1), name: "", title: f.path, depth, ancestors, marks: fileMarks(key) });
        for (const fn of functionsOf.get(key) || []) {
          rows.push({ key: fn, label: nodes.get(fn).label, name: "", depth: depth + 1, ancestors, marks: functionMarks(fn) });
        }
      }
    };
    walk(root, 0, []);
    return rows;
  }

  // An element's code is the functions citing it, and the files citing it outside any function of theirs.
  function codeMarks(id) {
    const citing = links.get(id).filter((l) => l.kind === LINK_KIND_CODE && l.dir === "in").map((l) => l.key);
    const functions = citing.filter((key) => key.startsWith(FN_PREFIX));
    const withFunction = new Set(functions.map((key) => nodes.get(key).file));
    const files = citing.filter((key) => key.startsWith(FILE_PREFIX) && !withFunction.has(key));
    return mergeMarks([...functions.map(functionMarks), ...files.map(fileMarks)]);
  }

  function historyRows() {
    if (hist.angle === ANGLE_REQUIREMENTS) return groupedRows(elementKeys(), elementMarks);
    if (hist.grouping === GROUPING_FILES) return fileRows();
    const cited = elementKeys().filter((id) => links.get(id).some((l) => l.kind === LINK_KIND_CODE && l.dir === "in"));
    return groupedRows(cited, codeMarks);
  }

  // ---- filters ----
  const filtering = () => hist.people.size > 0 || hist.kind !== KIND_ALL;

  function keptCommits() {
    return HISTORY.commits.map((c) => {
      if (hist.people.size && ![c.author, ...c.coAuthors].some((i) => hist.people.has(i))) return false;
      if (hist.kind === KIND_HUMAN) return c.kind !== KIND_AGENT;
      return hist.kind !== KIND_AGENT || c.kind !== KIND_HUMAN;
    });
  }

  // ---- scope: an element and what it contains, or a file and its functions ----
  function contained(key) {
    const found = new Set([key]);
    const queue = [key];
    while (queue.length) {
      for (const l of links.get(queue.shift())) {
        if (l.kind === VALUE_CONTAINS && l.dir === "out" && !found.has(l.key)) { found.add(l.key); queue.push(l.key); }
      }
    }
    return found;
  }

  function scopeKeys() {
    if (!hist.scope) return null;
    const n = nodes.get(hist.scope);
    if (n.type === TYPE_FILE) return new Set([hist.scope, ...fnKeys.filter((key) => nodes.get(key).file === hist.scope)]);
    if (n.type === "FN") return new Set([hist.scope]);
    const elements = contained(hist.scope);
    if (hist.angle === ANGLE_REQUIREMENTS || hist.grouping !== GROUPING_FILES) return elements;
    const code = new Set();
    for (const id of elements) {
      for (const l of links.get(id)) {
        if (l.kind !== LINK_KIND_CODE || l.dir !== "in") continue;
        code.add(l.key);
        if (l.key.startsWith(FN_PREFIX)) code.add(nodes.get(l.key).file);
      }
    }
    return code;
  }

  function scopeHistory(key) {
    const n = nodes.get(key);
    hist.scope = key;
    showView(HISTORY_VIEW);
    setAngle(n.type === TYPE_FILE || n.type === "FN" ? ANGLE_CODE : ANGLE_REQUIREMENTS, GROUPING_FILES);
  }

  function renderScope() {
    const chipNode = $("history-scope");
    chipNode.hidden = !hist.scope;
    if (!hist.scope) return;
    clear(chipNode).append(el(TAG_SPAN, { text: `Scope: ${nodes.get(hist.scope).label}` }),
      el(TAG_BUTTON, { type: TAG_BUTTON, [VALUE_ARIA_LABEL]: "Remove the scope", title: "Show every row again, the filters kept", text: "×",
        on: { [EVENT_CLICK]: () => { hist.scope = null; applyFilters(); } } }));
  }

  function shownRows() {
    const walk = { rows: [], heading: null, open: [] };   // open: the folders above the current row, outermost first
    const scope = scopeKeys();
    for (const row of hist.baseRows) {
      if (row.group) startRowGroup(walk, row); else placeRow(walk, row, scope);
    }
    for (const row of walk.rows) if (isFolder(row)) row.marks = mergeMarks(row.lists);
    return walk.rows.filter((row) => isEntry(row) || row.count);
  }

  function startRowGroup(walk, row) {
    walk.heading = { ...row, count: 0 };
    walk.rows.push(walk.heading);
    walk.open.length = 0;
  }

  function placeRow(walk, row, scope) {
    const { rows, open } = walk;
    while (open.length && open.at(-1).depth >= row.depth) open.pop();
    const folded = (row.ancestors || []).some((path) => hist.closed.has(path));
    if (isFolder(row)) {
      const folder = { ...row, count: 0, lists: [] };
      if (!folded) rows.push(folder);
      open.push(folder);
      return;
    }
    const marks = wantedMarks(row, scope);
    if (!marks) return;
    creditRow(walk, row, marks);
    if (!folded) rows.push({ ...row, marks });
  }

  // The marks a row keeps, or null when the scope, the search or the filters leave it out.
  function wantedMarks(row, scope) {
    if (scope && !scope.has(row.key)) return null;
    if (!rowWanted(row)) return null;
    const marks = row.marks.filter(([ci]) => hist.kept[ci]);
    return !marks.length && filtering() && !hist.showEmpty ? null : marks;
  }

  function creditRow(walk, row, marks) {
    if (walk.heading) walk.heading.count += 1;
    for (const folder of walk.open) {                      // a folder carries the changes of the files below it
      folder.count += 1;
      if (row.key.startsWith(FILE_PREFIX)) folder.lists.push(marks);
    }
  }

  // A row stays when its ID, title, path or function name holds the text, and, with the requirements angle,
  // when its type is on.
  function rowWanted(row) {
    const n = nodes.get(row.key);
    if (hist.angle === ANGLE_REQUIREMENTS && n && !hist.types.has(n.type)) return false;
    if (!hist.text) return true;
    return [row.key, row.label, row.title, row.name, n?.title, n?.path].some((field) => field?.toLowerCase().includes(hist.text));
  }

  function renderTypeChips() {
    const counts = (type) => DATA.elements.filter((e) => e.kind === VALUE_ELEMENT && e.type === type).length;
    clear($(ID_HISTORY_TYPES)).append(...TYPES.map((type) => {
      const node = chip(plural(type, 2), counts(type), hist.types.has(type), () => { toggle(hist.types, type); renderTypeChips(); applyFilters(); },
        `t-${type}`, `Show or hide the ${plural(type, 2).toLowerCase()} in the timeline`);
      node.dataset.type = type;
      return node;
    }));
  }

  function toggleFolder(path) {
    if (hist.closed.has(path)) hist.closed.delete(path); else hist.closed.add(path);
    applyFilters();
  }

  function applyFilters() {
    hist.kept = keptCommits();
    hist.rows = shownRows();
    hist.shown = [...new Set(hist.rows.flatMap((row) => (isEntry(row) ? row.marks.map(([ci]) => ci) : [])))].sort((a, b) => a - b);
    for (const chipNode of $(ID_HISTORY_PEOPLE).querySelectorAll("[data-person]")) {
      chipNode.setAttribute(VALUE_ARIA_PRESSED, String(hist.people.has(Number(chipNode.dataset.person))));
    }
    for (const b of $(ID_HISTORY_KIND).querySelectorAll(TAG_BUTTON)) b.setAttribute(VALUE_ARIA_PRESSED, String(b.dataset.kind === hist.kind));
    const active = hist.rows.filter(isEntry).length;
    $("history-kept").textContent = `${rowCount(active)} · ${commitCount(hist.shown.length)}${filtering() ? TEXT_KEPT_SPACED : ""}`;
    renderFigures();
    renderScope();
    drawHistory();
  }

  function resetFilters() {
    hist.people.clear();
    hist.kind = KIND_ALL;
    hist.showEmpty = false;
    $(ID_SHOW_EMPTY).checked = false;
    hist.text = "";
    $(ID_HISTORY_FILTER).value = "";
    hist.types = new Set(TYPES);
    renderTypeChips();
    applyFilters();
  }

  // An identity's chip: its colour, its kind's icon, its name, its commits; its tooltip tells how it was merged.
  function identityLines(index) {
    const person = HISTORY.people[index];
    const merged = person.mergedBy.length            // as amended: said only when a merge took place
      ? `Identity merged by ${person.mergedBy.map((how) => MERGED_TEXT[how] || how).join(" and ")}` : null;
    return [`${person.name} (${KIND_LABEL[person.kind]})`, `${person.commits} commits as author, ${person.coCommits} as co-author`,
      `Names: ${person.names.join(", ")}`, `E-mails: ${person.emails.join(", ")}`, merged].filter(Boolean);
  }

  // The sidebar's History section; a click opens the History tab filtered on that identity alone.
  function renderHistorySidebar() {
    $("side-history").hidden = false;
    clear($("history-shortcuts")).append(...HISTORY.people.map((person, i) => {
      const item = el(TAG_BUTTON, { class: CLASS_QUALITY_SHORTCUT, type: TAG_BUTTON, [ATTR_PERSON]: i, [VALUE_ARIA_LABEL]: identityLines(i).join(". "),
        on: { [EVENT_CLICK]: () => openForPerson(i) } },
      el(TAG_SPAN, { class: "history-person-line" }, identityIcon(i), el(TAG_SPAN, { class: CLASS_NAME, text: person.name })),
      el(TAG_SPAN, { class: "badge badge-neutral chip-count", text: person.commits + person.coCommits }));
      item.addEventListener(EVENT_MOUSEOVER, () => {
        scheduleRichTip(item, () => linesTip(identityLines(i)), CSS_TIP_DELAY);
      });
      item.addEventListener(EVENT_MOUSEOUT, hideHistoryTip);
      item.addEventListener(EVENT_FOCUS, () => showTipLines(item, identityLines(i)));
      item.addEventListener(EVENT_BLUR, hideHistoryTip);
      return el("li", {}, item);
    }));
  }

  function openForPerson(index) {
    hideHistoryTip();
    showView(HISTORY_VIEW);
    hist.people = new Set([index]);
    hist.kind = KIND_ALL;
    applyFilters();
  }

  function personChip(index, onClick) {
    const person = HISTORY.people[index];
    return richTip(el(TAG_BUTTON, { class: "chip", type: TAG_BUTTON, [ATTR_PERSON]: index, [VALUE_ARIA_PRESSED]: String(hist.people.has(index)),
      [VALUE_ARIA_LABEL]: identityLines(index).join(". "), on: { [EVENT_CLICK]: onClick } },
    identityIcon(index), el(TAG_SPAN, { text: person.name }), el(TAG_SPAN, { class: CLASS_CHIP_COUNT, text: person.commits + person.coCommits })),
    () => linesTip(identityLines(index)), CSS_TIP_DELAY);
  }

  function renderPeopleChips() {
    clear($(ID_HISTORY_PEOPLE)).append(...HISTORY.people.map((_, i) => personChip(i, () => {
      toggle(hist.people, i);
      applyFilters();
    })));
  }

  const rowCount = (n) => `${n} ${n === 1 ? "row" : "rows"}`;
  const commitCount = (n) => `${n} ${n === 1 ? "commit" : TEXT_COMMITS}`;

  // ---- figures ----
  const dayCount = (ms) => { const days = Math.max(1, Math.round(ms / DAY_MS)); return `${days} ${days === 1 ? "day" : "days"}`; };
  function renderFigures() {
    const shown = hist.shown.map((ci) => HISTORY.commits[ci]);
    const people = new Set(shown.flatMap((c) => [c.author, ...c.coAuthors]));
    const ofKind = (kind) => [...people].filter((i) => HISTORY.people[i].kind === kind).length;
    const withAgent = shown.filter((c) => c.kind !== KIND_HUMAN).length;
    const dates = hist.shown.map((ci) => commitTime[ci]);
    const period = dates.length ? `${DAY_TEXT.format(dates[0])} – ${DAY_TEXT.format(dates.at(-1))}` : "—";
    const figure = (key, label, value, sub) => el("div", { class: "kpi", "data-figure": key },
      el(TAG_SPAN, { class: CLASS_KPI_LABEL, text: label }), el(TAG_SPAN, { class: CLASS_KPI_VALUE, text: value }),
      el(TAG_SPAN, { class: VALUE_KPI_SUB, text: sub }));
    clear($("history-kpis")).append(
      figure(TEXT_COMMITS, "Commits", shown.length, filtering() ? TEXT_KEPT_SPACED.trim() : "on the rows shown"),
      figure("humans", "Humans", ofKind(KIND_HUMAN), TEXT_IDENTITIES),
      figure("agents", "Agents", ofKind(KIND_AGENT), TEXT_IDENTITIES),
      figure("share", "With an agent", `${pct(withAgent, shown.length)} %`, `${withAgent} commits, alone or with a human`),
      figure("period", "Period", dates.length ? dayCount(dates.at(-1) - dates[0]) : "—", period));
  }

  // ---- time scale ----
  const rowHeight = () => cssNumber("--c-history-row-height");
  const labelWidth = () => hist.label ?? cssNumber("--c-history-label-width");
  const plotWidth = () => Math.max(1, $(ID_HISTORY_SCROLL).clientWidth - labelWidth());
  const plotLeft = () => $(ID_HISTORY_SCROLL).getBoundingClientRect().left + labelWidth();
  const spanWidth = () => hist.span[1] - hist.span[0];
  const localX = (t) => ((t - hist.span[0]) / spanWidth()) * plotWidth();
  const xOf = (t) => plotLeft() + localX(t);
  const timeAt = (clientX) => hist.span[0] + ((clientX - plotLeft()) / plotWidth()) * spanWidth();

  function fullSpan() {
    const first = commitTime.reduce((a, b) => Math.min(a, b), Infinity);
    const last = commitTime.reduce((a, b) => Math.max(a, b), -Infinity);
    const pad = Math.max((last - first) * EDGE_PAD, DAY_MS);
    return [first - pad, last + pad];
  }

  // The period in view, kept inside the whole history and no narrower than an hour.
  function setSpan(start, width) {
    const [full0, full1] = hist.full;
    const w = Math.min(Math.max(width, MIN_SPAN_MS), full1 - full0);
    const s = Math.min(Math.max(start, full0), full1 - w);
    hist.span = [s, s + w];
    drawHistory();
  }

  function zoomAround(t, factor) {
    const width = spanWidth() / factor;
    setSpan(t - ((t - hist.span[0]) / spanWidth()) * width, width);
  }

  const zoomStep = () => cssNumber("--c-history-zoom-step");
  const fitHistory = () => setSpan(hist.full[0], hist.full[1] - hist.full[0]);
  const panBy = (fraction) => setSpan(hist.span[0] + fraction * spanWidth(), spanWidth());

  // One end of the period moved to t, the other staying, within the whole history and the narrowest period.
  function moveSpanEnd(end, t) {
    const [full0, full1] = hist.full;
    const [start, stop] = hist.span;
    if (end === HANDLE_START) {
      const from = Math.min(Math.max(t, full0), stop - MIN_SPAN_MS);
      setSpan(from, stop - from);
    } else {
      setSpan(start, Math.min(t, full1) - start);
    }
  }

  // ---- the time axis ----
  function floorTo(unit, t) {
    const d = new Date(t);
    if (unit === UNIT_WEEK) return t - ((((t - MONDAY_OFFSET_DAYS * DAY_MS) % (WEEK_DAYS * DAY_MS)) + WEEK_DAYS * DAY_MS) % (WEEK_DAYS * DAY_MS));
    if (unit === UNIT_MONTH) return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1);
    if (unit === UNIT_QUARTER) return Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - (d.getUTCMonth() % MONTHS_PER_QUARTER), 1);
    if (unit === UNIT_YEAR) return Date.UTC(d.getUTCFullYear(), 0, 1);
    const step = TICK_UNITS.find(([name]) => name === unit)[1];
    return t - (t % step);
  }

  function nextTick(unit, t) {
    const d = new Date(t);
    if (unit === UNIT_MONTH) return Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1);
    if (unit === UNIT_QUARTER) return Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + MONTHS_PER_QUARTER, 1);
    if (unit === UNIT_YEAR) return Date.UTC(d.getUTCFullYear() + 1, 0, 1);
    return t + TICK_UNITS.find(([name]) => name === unit)[1];
  }

  // The finest step whose ticks stand at least the tick-gap token apart, and its ticks in the period in view.
  function axisTicks() {
    const room = plotWidth() / cssNumber("--c-history-tick-gap");
    const unit = TICK_UNITS.find(([, width]) => spanWidth() / width <= room) || TICK_UNITS.at(-1);
    const format = new Intl.DateTimeFormat(LOCALE, { timeZone: UTC, ...unit[2] });
    const ticks = [];
    for (let t = floorTo(unit[0], hist.span[0]); t <= hist.span[1]; t = nextTick(unit[0], t)) {
      if (t >= hist.span[0]) ticks.push({ t, label: format.format(t) });
    }
    return { unit: unit[0], ticks };
  }

  function drawAxis(ticks) {
    const axis = $("history-axis");
    const height = cssNumber("--c-history-axis-height");
    const gap = cssNumber(CSS_VAR_S_SPACE_XL) / 2;
    axis.setAttribute(ATTR_VIEWBOX, `0 0 ${plotWidth()} ${height}`);
    clear(axis).append(...ticks.flatMap(({ t, label }) => [
      svgEl(VALUE_LINE, { x1: localX(t), x2: localX(t), y1: height / 2, y2: height }),
      svgEl(SVG_TEXT, { x: localX(t) + gap / 2, y: height / 2 + gap / 2 }, label)]));
  }

  function drawOverview() {
    const svg = $(ID_HISTORY_OVERVIEW);
    const width = svg.clientWidth || plotWidth();
    const height = cssNumber("--c-history-overview-height");
    const [full0, full1] = hist.full;
    const at = (t) => ((t - full0) / (full1 - full0)) * width;
    const size = `${width} ${height}`;
    if (svg.dataset.size !== size) {                       // The ticks are drawn once per size, the window moves
      svg.dataset.size = size;
      svg.setAttribute(ATTR_VIEWBOX, `0 0 ${size}`);
      const ticks = HISTORY.commits.map((c, i) => svgEl(VALUE_LINE, { class: "history-tick", x1: at(commitTime[i]),
        x2: at(commitTime[i]), y1: height * TICK_FROM, y2: height * TICK_TO, stroke: `var(--c-history-${c.kind})` }));
      const inset = cssNumber(CSS_HAIRLINE);
      clear(svg).append(svgEl(SVG_RECT, { class: "history-window", y: inset, height: height - 2 * inset }), ...ticks,
        overviewHandle(HANDLE_START, height), overviewHandle(HANDLE_END, height));
    }
    const window = svg.firstElementChild;                  // under the ticks, which stay visible
    window.setAttribute("x", String(at(hist.span[0])));
    window.setAttribute(VALUE_WIDTH, String(Math.max(1, at(hist.span[1]) - at(hist.span[0]))));
    // Above the ticks, centred on their end, whole inside the strip, named with their date.
    const handleWidth = cssNumber("--c-history-handle-width");
    for (const [i, end] of [HANDLE_START, HANDLE_END].entries()) {
      const handle = svg.querySelector(`[data-end="${end}"]`);
      handle.setAttribute("transform", `translate(${Math.min(Math.max(at(hist.span[i]) - handleWidth / 2, 0), width - handleWidth)} 0)`);
      handle.setAttribute(VALUE_ARIA_LABEL, handleText(end));
    }
  }

  const handleText = (end) => `${HANDLE_NAME[end]}: ${dayOf(hist.span[end === HANDLE_START ? 0 : 1])}`;

  function overviewHandle(end, height) {
    // A rounded grip with two lines, as the slider of the Delivery chart: nothing like the strip's thin ticks.
    const handleWidth = cssNumber("--c-history-handle-width");
    const inset = cssNumber(CSS_HAIRLINE);
    const gap = cssNumber("--c-history-handle-grip-gap");
    const grip = (x) => svgEl(VALUE_LINE, { class: "history-handle-grip", x1: x, x2: x, y1: height * TICK_FROM, y2: height * TICK_TO });
    const handle = svgEl("g", { class: "history-handle", "data-end": end, role: "slider", tabindex: "0" });
    handle.append(svgEl(SVG_RECT, { class: "history-handle-body", x: inset, y: inset, width: handleWidth - 2 * inset,
      height: height - 2 * inset, rx: cssNumber("--c-history-handle-radius") }),
    grip(handleWidth / 2 - gap), grip(handleWidth / 2 + gap));
    return richTip(handle, () => linesTip([handleText(end), "Drag it, or use the left and right arrow keys"]), CSS_TIP_DELAY);
  }

  // ---- the activity band: commits per day, week or month of the period in view ----
  function bandUnit() {
    const days = spanWidth() / DAY_MS;
    if (days <= BAND_DAY_LIMIT) return "day";
    return days <= BAND_WEEK_LIMIT ? UNIT_WEEK : UNIT_MONTH;
  }

  function drawBand() {
    const band = $("history-band");
    const width = plotWidth();
    const height = cssNumber("--c-history-band-height");
    const unit = bandUnit();
    band.dataset.unit = unit;
    band.setAttribute(ATTR_VIEWBOX, `0 0 ${width} ${height}`);
    const buckets = [];
    for (let t = floorTo(unit, hist.span[0]); t <= hist.span[1]; t = nextTick(unit, t)) buckets.push({ t, end: nextTick(unit, t), counts: {} });
    let b = 0;
    for (const ci of hist.shown) {
      const at = commitTime[ci];
      while (b < buckets.length && buckets[b].end <= at) b += 1;
      if (b < buckets.length && at >= buckets[b].t) {
        const kind = HISTORY.commits[ci].kind;
        buckets[b].counts[kind] = (buckets[b].counts[kind] || 0) + 1;
      }
    }
    const total = (bucket) => BAND_STACK.reduce((sum, kind) => sum + (bucket.counts[kind] || 0), 0);
    const most = Math.max(1, ...buckets.map(total));
    const gap = cssNumber("--c-history-bar-gap");
    const inset = cssNumber(CSS_HAIRLINE);
    const bars = buckets.filter((bucket) => total(bucket)).map((bucket) => {
      const x = localX(bucket.t) + gap;
      const w = Math.max(inset, localX(bucket.end) - localX(bucket.t) - 2 * gap);
      let y = height - inset;
      const parts = BAND_STACK.filter((kind) => bucket.counts[kind]).map((kind) => {
        const h = ((height - 2 * inset) * bucket.counts[kind]) / most;
        y -= h;
        return svgEl(SVG_RECT, { class: `history-bar-${kind}`, x, y, width: w, height: h });
      });
      const period = unit === "day" ? "" : `${unit[0].toUpperCase()}${unit.slice(1)} of `;
      const lines = [`${period}${DAY_TEXT.format(bucket.t)}: ${total(bucket)} commits`,
        ...BAND_STACK.filter((kind) => bucket.counts[kind]).map((kind) => `${bucket.counts[kind]} ${KIND_LABEL[kind]}`)];
      const bar = svgEl(SVG_GROUP, { class: "history-bar", tabindex: "0", role: "img", [VALUE_ARIA_LABEL]: lines.join(", ") }, ...parts);
      bar.addEventListener(EVENT_MOUSEOVER, () => showTipLines(bar, lines));
      bar.addEventListener(EVENT_MOUSEOUT, hideHistoryTip);
      bar.addEventListener(EVENT_FOCUS, () => showTipLines(bar, lines));
      bar.addEventListener(EVENT_BLUR, hideHistoryTip);
      return bar;
    });
    clear(band).append(...bars);
  }

  // ---- rows in view ----
  function markLabel(row, ci, lines) {
    const commit = HISTORY.commits[ci];
    const people = [commit.author, ...commit.coAuthors].map((i) => HISTORY.people[i].name).join(" with ");
    return `${commit.hash}, ${DATE_TEXT.format(commitTime[ci])}, ${people}: ${lines} lines changed in ${row.label}`;
  }

  // A colour read as sRGB, whatever its notation, then compared in OKLab.
  const colourProbe = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  const colourValues = new Map();
  const srgbLinear = (c) => (c <= SRGB_KNEE ? c / SRGB_SLOPE : ((c + SRGB_OFFSET) / (1 + SRGB_OFFSET)) ** SRGB_GAMMA);

  function linearRgb(colour) {
    const value = colour.startsWith("var(") ? getComputedStyle(document.documentElement).getPropertyValue(colour.slice(4, -1)).trim() : colour;
    if (!colourValues.has(value)) {
      colourProbe.fillStyle = value;
      colourProbe.fillRect(0, 0, 1, 1);
      colourValues.set(value, [...colourProbe.getImageData(0, 0, 1, 1).data].slice(0, 3).map((c) => srgbLinear(c / BYTE_MAX)));
    }
    return colourValues.get(value);
  }

  function oklab(colour) {
    const rgb = linearRgb(colour);
    const cone = OKLAB_CONES.map((row) => Math.cbrt(row.reduce((sum, w, i) => sum + w * rgb[i], 0)));
    return OKLAB_AXES.map((row) => row.reduce((sum, w, i) => sum + w * cone[i], 0));
  }

  const colourGap = (a, b) => Math.hypot(...oklab(a).map((v, i) => v - oklab(b)[i]));
  const luminance = (colour) => linearRgb(colour).reduce((sum, c, i) => sum + LUMINANCE[i] * c, 0);
  // The black or the white token, for a diamond too close to its circle.
  const inkOn = (colour) => ((1 + LUMINANCE_FLARE) / (luminance(colour) + LUMINANCE_FLARE) >= (luminance(colour) + LUMINANCE_FLARE) / LUMINANCE_FLARE
    ? INK_LIGHT : INK_DARK);
  const distinctFrom = (colour, other) => (colourGap(colour, other) < cssNumber("--c-history-colour-gap") ? inkOn(other) : colour);

  const diamondPath = (x, y, d, attrs) => svgEl(VALUE_PATH, { d: `M${x} ${y - d}L${x + d} ${y}L${x} ${y + d}L${x - d} ${y}Z`, ...attrs });

  // as amended: one size per shape.
  const kindShape = (kind, x, y, fill) => (kind === KIND_AGENT ? diamondPath(x, y, cssNumber(CSS_MARK_DIAMOND), { fill })
    : svgEl(SVG_CIRCLE, { cx: x, cy: y, r: cssNumber(CSS_MARK), fill }));

  // The circle of the human holding the diamond of the agent, within the mark's radius.
  const togetherShapes = (x, y, human, agent) => [svgEl(SVG_CIRCLE, { cx: x, cy: y, r: cssNumber(CSS_MARK), fill: human }),
    diamondPath(x, y, cssNumber("--c-history-mark-inner"), { class: CLASS_MARK_INNER, fill: distinctFrom(agent, human) })];

  const contributors = (commit) => [commit.author, ...commit.coAuthors];
  const firstOfKind = (commit, kind) => contributors(commit).find((i) => HISTORY.people[i].kind === kind);

  function markAttrs(selected) {
    return { class: `history-mark${selected ? " " + IS_SELECTED : ""}`, tabindex: "0", role: "img" };
  }

  function markElement(row, ci, lines, y) {
    const commit = HISTORY.commits[ci];
    const x = localX(commitTime[ci]);
    const shapes = commit.kind === KIND_TOGETHER
      ? togetherShapes(x, y, colourOf[firstOfKind(commit, KIND_HUMAN)], colourOf[firstOfKind(commit, KIND_AGENT)])
      : [kindShape(commit.kind, x, y, colourOf[commit.author])];
    const mark = svgEl(SVG_GROUP, { ...markAttrs(hist.commit === ci), "data-commit": ci, "data-kind": commit.kind, "data-lines": lines,
      [VALUE_ARIA_LABEL]: markLabel(row, ci, lines) }, ...shapes);
    mark.addEventListener(EVENT_FOCUS, () => showHistoryTip(mark, row, ci, lines));
    mark.addEventListener(EVENT_BLUR, hideHistoryTip);
    return mark;
  }

  // ---- grouped marks ----
  // The marks of a row in time order: one joins the previous group when its centre is closer than the largest mark.
  function markGroups(marks) {
    const reach = cssNumber("--c-history-group-reach");
    const groups = [];
    for (const item of [...marks].sort(([a], [b]) => commitTime[a] - commitTime[b])) {
      const x = localX(commitTime[item[0]]);
      const last = groups.at(-1);
      if (last && x - last.x < reach) {
        last.x += (x - last.x) / (last.items.length + 1);
        last.items.push(item);
      } else {
        groups.push({ x, items: [item] });
      }
    }
    return groups;
  }

  // A group keeps an identity's colour only when it has one person of that kind: a colour always names someone.
  function soleColour(commits, kind) {
    const people = new Set(commits.map((commit) => firstOfKind(commit, kind)));
    return people.size === 1 && commits.every((commit) => contributors(commit).filter((i) => HISTORY.people[i].kind === kind).length === 1)
      ? colourOf[[...people][0]] : GROUP_FILL;
  }

  const squareShape = (x, y, fill) => {
    const half = cssNumber(CSS_MARK_SQUARE);
    return svgEl(SVG_RECT, { x: x - half, y: y - half, width: 2 * half, height: 2 * half, rx: cssNumber("--c-history-square-corner"), fill });
  };

  function groupShapes(kind, commits, x, y) {
    if (kind === KIND_MIXED) return [squareShape(x, y, GROUP_FILL)];
    if (kind === KIND_TOGETHER) return togetherShapes(x, y, soleColour(commits, KIND_HUMAN), soleColour(commits, KIND_AGENT));
    return [kindShape(kind, x, y, soleColour(commits, kind))];
  }

  function groupElement(row, group, y) {
    const cis = group.items.map(([ci]) => ci);
    const commits = cis.map((ci) => HISTORY.commits[ci]);
    const lines = group.items.reduce((sum, [, n]) => sum + n, 0);
    const kinds = new Set(commits.map((commit) => commit.kind));
    const kind = kinds.size === 1 ? commits[0].kind : KIND_MIXED;
    const shapes = groupShapes(kind, commits, group.x, y);
    const text = cis.length > GROUP_COUNT_MAX ? `${GROUP_COUNT_MAX}+` : cis.length;
    const countX = group.x + cssNumber(kind === KIND_AGENT ? CSS_MARK_DIAMOND : CSS_MARK) + cssNumber("--c-history-count-gap");
    const count = svgEl(SVG_TEXT, { class: "history-mark-count", x: countX, y }, text);   // beside the symbol, never on a colour
    const mark = svgEl(SVG_GROUP, { ...markAttrs(cis.includes(hist.commit)), "data-commits": cis.join(","), "data-count": cis.length,
      "data-kind": kind, "data-lines": lines, [VALUE_ARIA_LABEL]: `${commitCount(cis.length)}, ${lines} lines changed in ${row.label}` }, ...shapes, count);
    mark.addEventListener(EVENT_FOCUS, () => showTipLines(mark, groupTipLines(row, cis, lines)));
    mark.addEventListener(EVENT_BLUR, hideHistoryTip);
    return mark;
  }

  // The first commits of a group, then how many more.
  function groupTipLines(row, cis, lines) {
    const person = (ci) => contributors(HISTORY.commits[ci]).map((i) => HISTORY.people[i].name).join(" with ");
    const shown = cis.slice(0, GROUP_TIP_COMMITS).map((ci) => [`${person(ci)} · `,
      el(TAG_SPAN, { class: "tip-date", text: DATE_TEXT.format(commitTime[ci]) }), ` · ${HISTORY.commits[ci].subject}`]);
    const more = cis.length - shown.length;
    return [`${commitCount(cis.length)}, ${lines} lines changed in ${row.title || row.label}`, ...shown, more ? `+${more} more` : ""].filter(Boolean);
  }

  const groupCommits = (mark) => mark.dataset.commits.split(",").map(Number);

  // Zooms on the group; where the view can narrow no further, its newest commit is selected instead.
  function activateGroup(mark) {
    const cis = groupCommits(mark);
    const times = cis.map((ci) => commitTime[ci]);
    const [first, last] = [Math.min(...times), Math.max(...times)];
    const before = spanWidth();
    const width = Math.max((last - first) * (1 + 2 * EDGE_PAD), MIN_SPAN_MS);
    if (width >= before) {
      selectCommit(cis.reduce((newest, ci) => (commitTime[ci] > commitTime[newest] ? ci : newest)));
      return;
    }
    setSpan((first + last) / 2 - width / 2, width);
  }

  // A row, its changes, its identities and its last change.
  function rowTip(row) {
    const n = nodeOf(row.key);
    const people = new Set(row.marks.flatMap(([ci]) => [HISTORY.commits[ci].author, ...HISTORY.commits[ci].coAuthors]));
    const last = row.marks.reduce((best, [ci]) => (best === null || commitTime[ci] > commitTime[best] ? ci : best), null);
    const changes = row.marks.length;
    return { type: n ? n.type : null, head: n && n.type !== TYPE_FILE ? n.label : row.title || row.label,
      lines: [n && n.type !== TYPE_FILE ? n.title : "", `${changes} ${changes === 1 ? "change" : "changes"} · ${people.size} `
        + `${people.size === 1 ? "identity" : TEXT_IDENTITIES}`,
      last === null ? "No change in the history read"
        : `Last change: ${DAY_TEXT.format(commitTime[last])} by ${HISTORY.people[HISTORY.commits[last].author].name}`] };
  }

  function rowElement(row, index) {
    const height = rowHeight();
    const top = `${index * height}px`;
    if (row.group) {
      return el("div", { class: "history-row is-group", style: { top } },
        el(TAG_SPAN, { class: CLASS_LABEL }, row.label, el(TAG_SPAN, { class: CLASS_COUNT, text: row.count })), el("div"));
    }
    const folder = isFolder(row);
    const label = el(TAG_BUTTON, { class: `${CLASS_LABEL}${folder ? " history-folder" : ""}`, type: TAG_BUTTON,
      [VALUE_ARIA_EXPANDED]: folder ? String(!hist.closed.has(row.folder)) : null,
      style: { "--history-depth": row.depth }, on: { [EVENT_CLICK]: () => (folder ? toggleFolder(row.folder) : select(row.key)) } },
    el(TAG_SPAN, { class: "history-id", text: row.label }), row.name ? el(TAG_SPAN, { class: CLASS_NAME, text: row.name }) : null,
    el(TAG_SPAN, { class: CLASS_COUNT, text: row.marks.length || "" }));
    const width = plotWidth();
    const strip = svgEl("svg", { class: "history-strip", [ATTR_VIEWBOX]: `0 0 ${width} ${height}` },
      ...hist.ticks.map(({ t }) => svgEl(VALUE_LINE, { class: "history-grid-line", x1: localX(t), x2: localX(t), y1: 0, y2: height })));
    const reach = cssNumber("--c-history-group-reach");
    const inView = row.marks.filter(([ci]) => { const x = localX(commitTime[ci]); return x >= -reach && x <= width + reach; });
    for (const group of markGroups(inView)) {
      strip.append(group.items.length > 1 ? groupElement(row, group, height / 2)
        : markElement(row, group.items[0][0], group.items[0][1], height / 2));
    }
    richTip(label, () => rowTip(row), CSS_TIP_DELAY);
    return el("div", { class: "history-row", "data-key": row.key, style: { top } }, label, strip);
  }

  function drawRows() {
    const scroller = $(ID_HISTORY_SCROLL);
    const box = $(ID_HISTORY_ROWS);
    const height = rowHeight();
    box.style.height = `${hist.rows.length * height}px`;
    box.dataset.total = String(hist.rows.length);
    const first = Math.max(0, Math.floor(scroller.scrollTop / height) - ROW_OVERSCAN);
    const last = Math.min(hist.rows.length, Math.ceil((scroller.scrollTop + scroller.clientHeight) / height) + ROW_OVERSCAN);
    clear(box).append(...hist.rows.slice(first, last).map((row, i) => rowElement(row, first + i)));
  }

  function historyStatus() {
    const shown = hist.shown.filter((ci) => commitTime[ci] >= hist.span[0] && commitTime[ci] <= hist.span[1]).length;
    const active = hist.rows.filter((r) => isEntry(r) && r.marks.length).length;
    $("history-status").textContent = `${rowCount(active)} with changes · ${commitCount(shown)} in view · `
      + `${DAY_TEXT.format(hist.span[0])} – ${DAY_TEXT.format(hist.span[1])}`;
  }

  function drawHistory() {
    if (!hist.built || $("view-history").hidden) return;
    const gutter = `${$(ID_HISTORY_SCROLL).offsetWidth - $(ID_HISTORY_SCROLL).clientWidth}px`;   // the rows' scroll bar
    for (const row of document.querySelectorAll(".history-band-row, .history-axis-row, .history-overview-row")) row.style.paddingRight = gutter;
    const { ticks } = axisTicks();
    hist.ticks = ticks;
    drawAxis(ticks);
    drawBand();
    drawOverview();
    drawRows();
    historyStatus();
  }

  // ---- tooltip ----
  function tipLines(row, ci, lines) {
    const commit = HISTORY.commits[ci];
    const person = (i) => `${HISTORY.people[i].name} (${HISTORY.people[i].kind})`;
    return [`${commit.hash} · ${DATE_TEXT.format(commitTime[ci])}`,
      person(commit.author) + (commit.coAuthors.length ? ` with ${commit.coAuthors.map(person).join(", ")}` : ""),
      commit.subject, `${lines} lines changed in ${row.title || row.label}`];
  }

  const linesTip = (lines) => ({ head: lines[0], lines: lines.slice(1) });
  const showTipLines = (target, lines) => showRichTip(target, linesTip(lines));
  const hideHistoryTip = () => hideRichTip();

  function showHistoryTip(target, row, ci, lines) {
    showTipLines(target, tipLines(row, ci, lines));
  }

  // ---- the commit in the detail panel ----
  const GRAPH = HISTORY ? HISTORY.graph : null;
  const commitOf = new Map(HISTORY ? HISTORY.commits.map((c, i) => [c.hash, i]) : []);
  const graphNodeOf = new Map(GRAPH ? GRAPH.nodes.map((n, i) => [n.hash, i]) : []);
  const COMMIT_KIND_NAME = { [KIND_HUMAN]: "Human", [KIND_AGENT]: "Agent", [KIND_TOGETHER]: "Together" };
  const COMMIT_KIND_ICONS = { [KIND_HUMAN]: [KIND_HUMAN], [KIND_AGENT]: [KIND_AGENT], [KIND_TOGETHER]: [KIND_HUMAN, KIND_AGENT] };
  const CHANGED_ORDER = [...TYPES, TYPE_FILE, TYPE_FUNCTION];
  const UNNAMED_BRANCH = "unnamed branch";
  const TYPE_COMMIT = "COMMIT";
  const GROUP_GRAPH = "graph";
  const hashOf = (key) => key.slice(COMMIT_PREFIX.length);
  const knownCommit = (key) => isCommitKey(key) && (commitOf.has(hashOf(key)) || graphNodeOf.has(hashOf(key)));
  const lineCount = (n) => `${n} ${n === 1 ? VALUE_LINE : VALUE_LINES}`;
  const branchName = (node) => GRAPH.branches[node.branch] ?? UNNAMED_BRANCH;

  // [key, lines] of every element, file and function the commit changed, from the interventions (indexed once).
  let changedBy = null;
  function changedIn(ci) {
    if (!changedBy) {
      changedBy = new Map();
      const add = (key, list) => list.forEach(([c, lines]) => {
        if (!changedBy.has(c)) changedBy.set(c, []);
        changedBy.get(c).push([key, lines]);
      });
      Object.entries(HISTORY.interventions.elements).forEach(([id, list]) => add(id, list));
      Object.entries(HISTORY.interventions.files).forEach(([path, list]) => add(FILE_PREFIX + path, list));
      Object.entries(HISTORY.interventions.functions || {}).forEach(([n, list]) => add(fnKeys[Number(n)], list));
    }
    return (changedBy.get(ci) || []).filter(([key]) => nodes.has(key));
  }

  // The lines a commit changed: its files', and its process elements' outside an element it also changed (a feature's
  // range holds its requirements'); a function's lines are its file's.
  function changedLines(changed) {
    const keys = new Set(changed.map(([key]) => key));
    const inner = (key) => (links.get(key) || []).some((l) => l.kind === VALUE_CONTAINS && l.dir === "in" && keys.has(l.key));
    return changed.filter(([key]) => !key.startsWith(FN_PREFIX) && !inner(key)).reduce((sum, [, lines]) => sum + lines, 0);
  }

  function changedGroup(type, list) {
    const sorted = list.toSorted((a, b) => nodes.get(a[0]).label.localeCompare(nodes.get(b[0]).label, undefined, { numeric: true }));
    return grouped(type, listGroup(plural(type, list.length), sorted, ([key, lines]) => el("li", { class: "link-item" },
      idButton(key, true), el(TAG_SPAN, { class: "link-rel", text: lineCount(lines) }),
      nodes.get(key).title ? el(TAG_SPAN, { class: "link-title", text: nodes.get(key).title }) : null), type));
  }

  function commitBadges(commit, total, node) {
    return el("div", { class: "detail-badges" },
      commit ? richTip(el(TAG_SPAN, { class: "badge badge-neutral", text: lineCount(total) }), () => ({ head: "Lines changed",
        lines: [`${lineCount(total)} changed in the process elements and source files read`,
          "A feature's, an ADR's or a plan's lines hold those of what it contains: they are counted once"] })) : null,
      node ? richTip(el(TAG_SPAN, { class: "badge badge-neutral", text: branchName(node) }), () => ({ head: branchName(node),
        lines: ["The branch the commit was made on, found from the branch tips and the merges' messages"] })) : null);
  }

  function changedByType(changed) {
    const byType = new Map();
    for (const [k, lines] of changed) {
      const type = nodes.get(k).type;
      if (!byType.has(type)) byType.set(type, []);
      byType.get(type).push([k, lines]);
    }
    return byType;
  }

  // A commit as the panel shows a selection: its band (kind, hash, subject, date, contributors, badges, actions, tags),
  // then the git graph and what it changed, by type.
  function renderCommitDetail(panel, key) {
    const hash = hashOf(key);
    const ci = commitOf.get(hash);
    const node = GRAPH.nodes[graphNodeOf.get(hash)];
    const commit = ci === undefined ? null : HISTORY.commits[ci];
    const changed = commit ? changedIn(ci) : [];
    const merge = Boolean(node) && node.parents.length > 1;
    let kind = COMMIT_KIND_NAME[commit?.kind];
    if (!commit) kind = merge ? "Merge" : "Outside the folders read";
    const head = el("div", { class: `detail-head t-${TYPE_COMMIT}` },
      el("div", { class: "detail-kind" }, ...(commit ? COMMIT_KIND_ICONS[commit.kind].map(kindIcon) : []), `Commit · ${kind}`),
      el("h2", { class: "detail-id", text: hash }),
      el("p", { class: "detail-title", text: commit ? commit.subject : node.subject }),
      el("div", { class: "detail-location", text: DATE_TEXT.format(commit ? commitTime[ci] : Date.parse(node.date)) }),
      commit ? el("div", { class: "detail-people" }, personTag(commit.author), ...commit.coAuthors.map(personTag)) : null,
      commitBadges(commit, changedLines(changed), node),
      el("div", { class: "detail-actions" },
        el(TAG_BUTTON, { class: "button", type: TAG_BUTTON, text: "Copy hash", title: "Copy this commit's short hash to the clipboard",
          on: { [EVENT_CLICK]: () => copy(hash) } })));
    const byType = changedByType(changed);
    const types = CHANGED_ORDER.filter((type) => byType.has(type));
    const graphSection = gitGraph(key);
    const summary = el("div", { class: "detail-summary" },
      groupTag(GROUP_GRAPH, TYPE_COMMIT, `Git graph ${graphSection.querySelectorAll(".git-row").length}`), types.length
        ? types.map((type) => groupTag(type, type, `${plural(type, byType.get(type).length)} ${byType.get(type).length}`))
        : el(TAG_SPAN, { class: "badge badge-neutral", text: "No change credited" }));
    const note = merge ? "A merge credits no one: what it brings was changed by the commits of its parents."
      : "This commit changed none of the process elements and source files read.";
    panel.append(detailBand(TYPE_COMMIT, head, summary), el("div", { class: "detail-body" }, graphSection,
      ...types.map((type) => changedGroup(type, byType.get(type))), types.length ? null : el("p", { class: "detail-note", text: note })));
    applyTagFilter();
  }

  // ---- the git graph of the selected commit ----
  const GIT_WINDOW = 12;                // the commits drawn above and below the selected one
  const BRANCH_TOKENS = 8;              // --c-history-branch-1…8, taken in turn by the branches
  const MIDDLE = 0.5;
  const CSS_BRANCH = "--branch";
  const branchVar = (branch) => `var(--c-history-branch-${(branch % BRANCH_TOKENS) + 1})`;
  const branchColour = (branch) => `${CSS_BRANCH}: ${branchVar(branch)}`;
  let gitLanes = null;

  // The lane of each branch, computed once: the default branch (found first) in lane 0; every other one, from its
  // newest row, in the leftmost lane free over the rows its commits and lines span, so that a lane is reused once its
  // branch has ended.
  function laneOfBranch() {
    if (gitLanes) return gitLanes;
    const span = new Map();
    const reach = (branch, row) => {
      const s = span.get(branch);
      if (s) { s[0] = Math.min(s[0], row); s[1] = Math.max(s[1], row); } else span.set(branch, [row, row]);
    };
    GRAPH.nodes.forEach((n, i) => {
      reach(n.branch, i);
      n.parents.forEach((p, k) => (k === 0 ? reach(n.branch, Math.max(i, p - 1)) : reach(GRAPH.nodes[p].branch, i)));
    });
    const byStart = (a, b) => (b === 0) - (a === 0) || span.get(a)[0] - span.get(b)[0] || a - b;   // the default first
    const taken = [];
    gitLanes = new Map();
    for (const branch of [...span.keys()].sort(byStart)) {
      const [top, bottom] = span.get(branch);
      let lane = 0;
      while ((taken[lane] || []).some(([t, u]) => top <= u && t <= bottom)) lane += 1;
      taken[lane] ||= [];
      taken[lane].push([top, bottom]);
      gitLanes.set(branch, lane);
    }
    return gitLanes;
  }

  // A line from a commit to its parent: down its own lane, curving into the parent's in the last row (a branch's start),
  // or, to a second parent, curving out in the first row and down the parent's lane (a merge).
  function gitEdgePath(from, to, merge, x, y, row) {
    const [x0, y0, x1, y1] = [x(from.lane), y(from.row), x(to.lane), y(to.row)];
    if (from.lane === to.lane) return `M${x0} ${y0}L${x1} ${y1}`;
    if (merge) return `M${x0} ${y0}C${x0} ${y0 + row * MIDDLE} ${x1} ${y0 + row * MIDDLE} ${x1} ${y0 + row}L${x1} ${y1}`;
    return `M${x0} ${y0}L${x0} ${y1 - row}C${x0} ${y1 - row * MIDDLE} ${x1} ${y1 - row * MIDDLE} ${x1} ${y1}`;
  }

  function gitRow(i, centre, labelled) {
    const node = GRAPH.nodes[i];
    const commit = node.commit === null ? null : HISTORY.commits[node.commit];
    const subject = commit ? commit.subject : node.subject;
    const people = commit ? [commit.author, ...commit.coAuthors].map((p) => HISTORY.people[p].name).join(", ") : "";
    const tip = () => ({ head: node.hash, lines: [subject, DATE_TEXT.format(commit ? commitTime[node.commit] : Date.parse(node.date)),
      people, `Branch: ${branchName(node)}`] });                                         // The whole subject
    return richTip(el(TAG_BUTTON, { class: "git-row", type: TAG_BUTTON, "data-node": node.hash, "aria-current": i === centre ? VALUE_TRUE : null,
      [VALUE_ARIA_LABEL]: `${node.hash} ${subject}, ${branchName(node)}`,
      on: { [EVENT_CLICK]: () => select(COMMIT_PREFIX + node.hash) } },
    labelled ? el(TAG_SPAN, { class: "git-label", style: { [CSS_BRANCH]: branchVar(node.branch) }, text: branchName(node) }) : null,
    el(TAG_SPAN, { class: "git-hash", text: node.hash }), el(TAG_SPAN, { class: "git-subject", text: subject }),
    commit ? identityIcon(commit.author) : null), tip, CSS_TIP_DELAY);
  }

  // The commits around the selected one, newest at the top: a lane per branch, a dot per commit, the lines to the
  // parents, and a row per commit that selects it.
  function gitGraph(key) {
    const centre = graphNodeOf.get(hashOf(key));
    const lanes = laneOfBranch();
    const first = Math.max(0, centre - GIT_WINDOW);
    const last = Math.min(GRAPH.nodes.length - 1, centre + GIT_WINDOW);
    const row = cssNumber("--c-history-git-row");
    const lane = cssNumber("--c-history-git-lane");
    const dot = cssNumber("--c-history-git-dot");
    const x = (n) => (n + MIDDLE) * lane;
    const y = (i) => (i - first + MIDDLE) * row;
    const at = (i) => ({ row: i, lane: lanes.get(GRAPH.nodes[i].branch) });
    let widest = 0;
    const edges = [];
    for (let i = 0; i <= last; i += 1) {                 // every line that crosses the rows drawn
      GRAPH.nodes[i].parents.forEach((p, k) => {
        if (p < first) return;
        const [from, to] = [at(i), at(p)];
        widest = Math.max(widest, from.lane, to.lane);
        const carrier = k > 0 ? to : from;
        edges.push(svgEl(VALUE_PATH, { class: "git-edge", d: gitEdgePath(from, to, k > 0, x, y, row), "data-lane": carrier.lane,
          style: branchColour(GRAPH.nodes[carrier.row].branch) }));
      });
    }
    const dots = [];
    const seen = new Set();
    const rows = [];
    for (let i = first; i <= last; i += 1) {
      const node = GRAPH.nodes[i];
      const { lane: n } = at(i);
      widest = Math.max(widest, n);
      dots.push(svgEl(SVG_CIRCLE, { class: `git-dot${node.parents.length > 1 ? " is-merge" : ""}`, cx: x(n), cy: y(i), r: dot,
        "data-node": node.hash, "data-lane": n, style: branchColour(node.branch) }));
      if (i === centre) dots.push(svgEl(SVG_CIRCLE, { class: "git-ring", cx: x(n), cy: y(i), r: dot + cssNumber("--c-history-git-ring") }));
      rows.push(gitRow(i, centre, !seen.has(node.branch)));
      seen.add(node.branch);
    }
    const width = (widest + 1) * lane;
    const height = (last - first + 1) * row;
    return el("section", { class: "group git-graph-section", "data-group": GROUP_GRAPH },          // A tag shows it or not
      el("div", { class: "group-head" }, el("h3", { class: "group-title", text: "Git graph" }),
        el(TAG_SPAN, { class: "group-count", text: commitCount(last - first + 1) })),
      el("div", { class: "git-graph", style: { "--git-graph-width": `${width}px` } },
        svgEl("svg", { class: "git-lines", width, height, [ATTR_VIEWBOX]: `0 0 ${width} ${height}`, [ATTR_ARIA_HIDDEN]: VALUE_TRUE },
          ...edges, ...dots),
        el("div", { class: "git-rows" }, ...rows)));
  }

  // The mark of the selected commit is marked in the timeline; another selection unmarks it.
  function markCommit(key) {
    hist.commit = knownCommit(key) ? commitOf.get(hashOf(key)) ?? null : null;
    for (const mark of $(ID_HISTORY_ROWS).querySelectorAll(CLASS_MARK)) {
      mark.classList.toggle(IS_SELECTED, mark.dataset.commits ? groupCommits(mark).includes(hist.commit) : Number(mark.dataset.commit) === hist.commit);
    }
  }

  const selectCommit = (ci) => select(COMMIT_PREFIX + HISTORY.commits[ci].hash);

  const rowOfMark = (mark) => hist.rows.find((r) => r.key === mark.closest(".history-row").dataset.key);

  // ---- interactions: hover, click, wheel, drag, keyboard ----
  function setupHistory() {
    const rowsBox = $(ID_HISTORY_ROWS);
    rowsBox.addEventListener(EVENT_MOUSEOVER, (event) => {
      const mark = event.target.closest(CLASS_MARK);
      if (!mark) return;
      const lines = Number(mark.dataset.lines);
      scheduleRichTip(mark, () => linesTip(mark.dataset.commits ? groupTipLines(rowOfMark(mark), groupCommits(mark), lines)
        : tipLines(rowOfMark(mark), Number(mark.dataset.commit), lines)), cssNumber(CSS_TIP_DELAY));
    });
    rowsBox.addEventListener(EVENT_MOUSEOUT, (event) => { if (event.target.closest(CLASS_MARK)) hideHistoryTip(); });
    const pinFrom = (mark) => (mark.dataset.commits ? activateGroup(mark) : selectCommit(Number(mark.dataset.commit)));
    rowsBox.addEventListener(EVENT_CLICK, (event) => { const mark = event.target.closest(CLASS_MARK); if (mark) pinFrom(mark); });
    rowsBox.addEventListener(EVENT_KEYDOWN, (event) => {
      const mark = event.target.closest(CLASS_MARK);
      if (mark && (event.key === KEY_ENTER || event.key === " ")) { event.preventDefault(); pinFrom(mark); }
    });
    $(ID_HISTORY_SCROLL).addEventListener("scroll", () => { if (hist.built) drawRows(); });
    const plot = $("history-plot");
    plot.addEventListener("wheel", (event) => {
      if (event.clientX < plotLeft()) return;                       // over the labels, the wheel scrolls the rows
      event.preventDefault();
      zoomAround(timeAt(event.clientX), zoomStep() ** (-event.deltaY / WHEEL_NOTCH));
    }, { passive: false });
    let drag = null;
    $(ID_HISTORY_SCROLL).addEventListener(EVENT_POINTERDOWN, (event) => {
      if (event.clientX < plotLeft() || event.target.closest(CLASS_MARK)) return;
      drag = { x: event.clientX, start: hist.span[0] };
      event.currentTarget.setPointerCapture(event.pointerId);
    });
    $(ID_HISTORY_SCROLL).addEventListener(EVENT_POINTERMOVE, (event) => {
      if (drag) setSpan(drag.start - ((event.clientX - drag.x) / plotWidth()) * spanWidth(), spanWidth());
    });
    for (const type of [EVENT_POINTERUP, EVENT_POINTERCANCEL]) $(ID_HISTORY_SCROLL).addEventListener(type, () => { drag = null; });
    const overview = $(ID_HISTORY_OVERVIEW);
    const overviewTime = (event) => {
      const box = overview.getBoundingClientRect();
      return hist.full[0] + ((event.clientX - box.left) / box.width) * (hist.full[1] - hist.full[0]);
    };
    // A handle moves its end; the window moves by the distance dragged; elsewhere it centres there.
    let sliding = null;
    const slide = (event) => {
      const t = overviewTime(event);
      if (sliding.end) moveSpanEnd(sliding.end, t);
      else setSpan(t - sliding.offset, spanWidth());
    };
    overview.addEventListener(EVENT_POINTERDOWN, (event) => {
      const t = overviewTime(event);
      const inside = t >= hist.span[0] && t <= hist.span[1];
      sliding = { end: event.target.closest("[data-end]")?.dataset.end, offset: inside ? t - hist.span[0] : spanWidth() / 2 };
      if (!sliding.end) slide(event);
      overview.setPointerCapture(event.pointerId);
    });
    overview.addEventListener(EVENT_POINTERMOVE, (event) => { if (sliding) slide(event); });
    for (const type of [EVENT_POINTERUP, EVENT_POINTERCANCEL]) overview.addEventListener(type, () => { sliding = null; });
    // On a handle, the arrows move its end only, and never reach the timeline's own keys.
    overview.addEventListener(EVENT_KEYDOWN, (event) => {
      const { end } = event.target.dataset;
      if (!end || (event.key !== KEY_ARROWLEFT && event.key !== KEY_ARROWRIGHT)) return;
      event.preventDefault();
      event.stopPropagation();
      const step = (event.key === KEY_ARROWLEFT ? -PAN_FRACTION : PAN_FRACTION) * spanWidth();
      moveSpanEnd(end, hist.span[end === HANDLE_START ? 0 : 1] + step);
    });
    plot.addEventListener(EVENT_KEYDOWN, (event) => {
      const centre = (hist.span[0] + hist.span[1]) / 2;
      const keys = { "+": () => zoomAround(centre, zoomStep()), "=": () => zoomAround(centre, zoomStep()),
        "-": () => zoomAround(centre, 1 / zoomStep()), 0: fitHistory,
        [KEY_ARROWLEFT]: () => panBy(-PAN_FRACTION), [KEY_ARROWRIGHT]: () => panBy(PAN_FRACTION) };
      if (keys[event.key] && !event.target.closest(`.${CLASS_LABEL}, #${ID_HISTORY_SPLIT}, #${ID_HISTORY_FILTER}`)) {
        event.preventDefault();
        keys[event.key]();
      }
    });
    $("history-fit").addEventListener(EVENT_CLICK, fitHistory);
    $(ID_HISTORY_ANGLE).addEventListener(EVENT_CLICK, (event) => {
      const button = event.target.closest("[data-angle]");
      if (button) setAngle(button.dataset.angle, hist.grouping);
    });
    $(ID_HISTORY_GROUPING).addEventListener(EVENT_CLICK, (event) => {
      const button = event.target.closest("[data-grouping]");
      if (button) setAngle(hist.angle, button.dataset.grouping);
    });
    $(ID_HISTORY_KIND).addEventListener(EVENT_CLICK, (event) => {
      const button = event.target.closest("[data-kind]");
      if (button) { hist.kind = button.dataset.kind; applyFilters(); }
    });
    $(ID_SHOW_EMPTY).addEventListener(EVENT_CHANGE, (event) => { hist.showEmpty = event.target.checked; applyFilters(); });
    $("history-reset").addEventListener(EVENT_CLICK, resetFilters);
    renderPeopleChips();
    renderTypeChips();
    $(ID_HISTORY_FILTER).addEventListener("input", (event) => { hist.text = event.target.value.trim().toLowerCase(); applyFilters(); });
    setupLabelSplit();
    new ResizeObserver(() => drawHistory()).observe(plot);
    renderHistoryLegend();
    renderHistoryLimits();
  }

  const LABEL_KEY = "agnos-perf-center-history-label";

  function setLabelWidth(width, keep) {
    hist.label = width === null ? null
      : Math.round(Math.max(cssNumber("--c-history-label-min"), Math.min(width, cssNumber("--c-history-label-max"))));
    const view = $("view-history");
    if (hist.label === null) view.style.removeProperty("--history-label");
    else view.style.setProperty("--history-label", `${hist.label}px`);
    $(ID_HISTORY_SPLIT).setAttribute("aria-valuenow", String(Math.round(labelWidth())));
    if (keep) {
      try {
        if (hist.label === null) localStorage.removeItem(LABEL_KEY); else localStorage.setItem(LABEL_KEY, String(hist.label));
      } catch (error) { /* storage unavailable: the width lasts this visit */ }
    }
    drawHistory();
  }

  function setupLabelSplit() {
    const bar = $(ID_HISTORY_SPLIT);
    bar.setAttribute("aria-valuemin", String(cssNumber("--c-history-label-min")));
    bar.setAttribute("aria-valuemax", String(cssNumber("--c-history-label-max")));
    bar.addEventListener(EVENT_KEYDOWN, (event) => {
      if (event.key !== KEY_ARROWLEFT && event.key !== KEY_ARROWRIGHT) return;
      event.preventDefault();
      const step = cssNumber("--c-splitter-step");
      setLabelWidth(labelWidth() + (event.key === KEY_ARROWRIGHT ? step : -step), true);
    });
    bar.addEventListener("dblclick", () => setLabelWidth(null, true));
    bar.addEventListener(EVENT_POINTERDOWN, (event) => {
      event.preventDefault();
      bar.setPointerCapture(event.pointerId);
      bar.classList.add("dragging");
      const left = $("history-plot").getBoundingClientRect().left;
      const move = (e) => setLabelWidth(e.clientX - left, true);
      const end = () => {
        bar.removeEventListener(EVENT_POINTERMOVE, move);
        bar.removeEventListener(EVENT_POINTERUP, end);
        bar.removeEventListener(EVENT_POINTERCANCEL, end);
        bar.classList.remove("dragging");
      };
      bar.addEventListener(EVENT_POINTERMOVE, move);
      bar.addEventListener(EVENT_POINTERUP, end);
      bar.addEventListener(EVENT_POINTERCANCEL, end);
    });
    let saved = null;
    try { saved = localStorage.getItem(LABEL_KEY); } catch (error) { /* no storage */ }
    if (saved !== null && Number.isFinite(Number(saved))) setLabelWidth(Number(saved), false);
  }

  function setAngle(angle, grouping) {
    hist.angle = angle;
    hist.grouping = grouping;
    for (const b of $(ID_HISTORY_ANGLE).querySelectorAll(TAG_BUTTON)) b.setAttribute(VALUE_ARIA_PRESSED, String(b.dataset.angle === angle));
    for (const b of $(ID_HISTORY_GROUPING).querySelectorAll(TAG_BUTTON)) b.setAttribute(VALUE_ARIA_PRESSED, String(b.dataset.grouping === grouping));
    $(ID_HISTORY_GROUPING).hidden = angle !== ANGLE_CODE;
    $(ID_HISTORY_TYPES).hidden = angle !== ANGLE_REQUIREMENTS;
    hist.baseRows = historyRows();
    $(ID_HISTORY_SCROLL).scrollTop = 0;
    applyFilters();
  }

  // The shapes of the marks, drawn as the timeline draws them.
  function renderHistoryLegend() {
    const reach = cssNumber(CSS_MARK_DIAMOND);
    const sample = (kind, ...shapes) => el(TAG_SPAN, { class: CLASS_LEGEND_ITEM },
      svgEl("svg", { [ATTR_VIEWBOX]: `${-reach} ${-reach} ${2 * reach} ${2 * reach}`, [ATTR_ARIA_HIDDEN]: VALUE_TRUE }, ...shapes),
      KIND_LABEL[kind]);
    const neutral = "var(--s-text-subtle)";               // the shapes alone: the colours are the identities'
    clear($("history-legend")).append(
      sample(KIND_HUMAN, kindShape(KIND_HUMAN, 0, 0, neutral)),
      sample(KIND_AGENT, kindShape(KIND_AGENT, 0, 0, neutral)),
      sample(KIND_TOGETHER, ...togetherShapes(0, 0, neutral, neutral)),
      sample(KIND_MIXED, squareShape(0, 0, neutral)),
      el(TAG_SPAN, { class: CLASS_LEGEND_ITEM, text: "Colour: the identity, neutral for several · number: the commits grouped · wheel over the marks to zoom, drag to pan" }));
  }

  function historyLimitWords(limits) {
    const since = limits.since ? `, authored since ${limits.since}` : "";
    const depth = limits.depth ? `, the last ${limits.depth}` : "";
    return `${limits.commits} commits${since}${depth}`;
  }

  // The limits applied, and a cut history said as such.
  function renderHistoryLimits() {
    const limits = HISTORY.limits;
    const parts = [`${limits.commits} commits`];
    if (limits.since) parts.push(`since ${limits.since}`);
    if (limits.depth) parts.push(`last ${limits.depth}`);
    if (limits.shallow) parts.push("cut: shallow clone");
    const text = parts.join(" · ");
    $("history-limits").textContent = text;
    richTip($("history-limits"), () => ({ head: "History read", lines: [
      limits.first ? `From ${DAY_TEXT.format(Date.parse(limits.first))} to ${DAY_TEXT.format(Date.parse(limits.last))}` : "",
      historyLimitWords(limits),
      limits.shallow ? "Cut: the repository is a shallow clone" : "The whole history the limits allow"] }));
  }

  const historyView = {
    show() {
      if (!HISTORY) return;
      if (!hist.built) {
        hist.built = true;
        hist.full = fullSpan();
        hist.span = [...hist.full];
        hist.baseRows = historyRows();
        applyFilters();
        return;
      }
      drawHistory();
    },
    span: () => [...hist.span], setSpan, timeAt, xOf, state: hist, redraw: drawHistory,
    known: knownCommit, render: renderCommitDetail, markCommit, colourGap,
  };
  if (HISTORY) {
    document.querySelector(`.tab[data-view=${HISTORY_VIEW}]`).hidden = false;
    setupHistory();
    renderHistorySidebar();
  }

  // ---- delivery figures ------------------------------------
  // The `delivery` block: the tasks closed in git, the identities' active days and the
  // settings. The page computes the points, the throughput, the rework rate and the grains, within the history read.
  const DELIVERY = DATA.delivery || null;
  const GRAIN_DAY = "day";
  const ISO_DAY_LENGTH = 10;            // "2026-10-27"
  const ISO_MONTH_LENGTH = 7;           // "2026-10"
  const DAY_START = "T00:00:00Z";
  const ISO_DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
  const LINK_KIND_REFS = "refs";
  const TYPE_NONE = "none";             // a delivery commit whose subject has no Conventional-Commits type
  const TIERS = DELIVERY ? DELIVERY.settings.tiers : [];     // in their order: the data file's keys are sorted

  const dayMs = (day) => Date.parse(day + DAY_START);
  const dayOf = (ms) => new Date(ms).toISOString().slice(0, ISO_DAY_LENGTH);
  const addDays = (day, n) => dayOf(dayMs(day) + n * DAY_MS);
  const daysBetween = (from, to) => Math.round((dayMs(to) - dayMs(from)) / DAY_MS) + 1;
  const pointsOf = (row) => DELIVERY.settings.points[row.tier] || 0;

  // A task of the block, with what the filters read: its commit's day, identities and kind, its trigram, title, plan.
  function deliveryRow([id, tier, reTiered, commit, lines, type, reworked, reason]) {
    const c = HISTORY.commits[commit];
    const n = nodes.get(id);
    const own = links.get(id) || [];
    const plan = own.find((l) => l.kind === VALUE_CONTAINS && l.dir === "in")?.key || "";
    const cited = own.filter((l) => l.kind === LINK_KIND_REFS && l.dir === "out" && nodes.get(l.key)?.type === "RQ")
      .map((l) => l.key);
    return { id, tier, reTiered, commit, lines, type: type || TYPE_NONE, reworked, reason, day: c.date.slice(0, ISO_DAY_LENGTH),
      people: [c.author, ...c.coAuthors], kind: c.kind, tri: n ? n.tri : id.split("-")[1], title: n ? n.title : "", plan,
      find: [id, n ? n.title : "", plan, ...cited].join(" ").toLowerCase() };
  }
  const deliveryRows = DELIVERY ? DELIVERY.tasks.map(deliveryRow) : [];

  // A session of the friction log, its counters in the log's order.
  const FRICTION_COUNTERS = ["questions", "recoveries", "re-tiered", "verification"];
  const sumOf = (values) => values.reduce((sum, value) => sum + value, 0);
  const frictionRows = DELIVERY ? (DELIVERY.friction || []).map(([day, tri, ...rest]) => {
    const commit = rest.pop();
    return { day, tri, counters: rest, total: sumOf(rest), commit, author: HISTORY.commits[commit].author };
  }) : [];

  // The days a period may hold; the first day is left out when the history read may have cut it.
  function deliveryBounds() {
    const { since, depth, shallow, first, last } = HISTORY.limits;
    const read = [first.slice(0, ISO_DAY_LENGTH), last.slice(0, ISO_DAY_LENGTH)];
    const cut = Boolean(since || depth || shallow);
    return { first: cut && read[0] < read[1] ? addDays(read[0], 1) : read[0], last: read[1], cut, read };
  }

  function presetPeriods(bounds) {
    return DELIVERY.settings.periods.map((p) => {
      const to = addDays(bounds.last, -p.offset);
      const from = addDays(to, 1 - p.days);
      return { key: p.key, label: p.label, from, to, enabled: from >= bounds.first };
    });
  }

  // [A, B]: the settings' two ranges when both fit, else the two halves of the days read (A the later one).
  function defaultPeriods(bounds) {
    const presets = presetPeriods(bounds);
    const [a, b] = DELIVERY.settings.defaultPeriods.map((key) => presets.find((p) => p.key === key));
    if (a?.enabled && b?.enabled) return [{ from: a.from, to: a.to }, { from: b.from, to: b.to }];
    const n = daysBetween(bounds.first, bounds.last);
    if (n < 2) return [{ from: bounds.first, to: bounds.last }, { from: bounds.first, to: bounds.last }];
    const half = Math.floor(n / 2);
    return [{ from: addDays(bounds.last, 1 - half), to: bounds.last }, { from: bounds.first, to: addDays(bounds.first, n - half - 1) }];
  }

  // A date entered is refused, never moved: the message says why, or null when the date may be used.
  function checkDay(day, bounds) {
    if (!ISO_DAY_RE.test(day) || Number.isNaN(dayMs(day))) return `${day} is not a date (year-month-day)`;
    if (day < bounds.first || day > bounds.last) return `${day} is outside the history read, from ${bounds.first} to ${bounds.last}`;
    return null;
  }

  // Day and week, and month when the days read span more than the settings' weeks.
  function grainsOf(bounds) {
    const weeks = daysBetween(bounds.first, bounds.last) / WEEK_DAYS;
    return weeks > DELIVERY.settings.monthAfterWeeks ? [GRAIN_DAY, UNIT_WEEK, UNIT_MONTH] : [GRAIN_DAY, UNIT_WEEK];
  }

  // The day, the Monday of its week, or its month.
  function bucketOf(day, grain) {
    if (grain === UNIT_MONTH) return day.slice(0, ISO_MONTH_LENGTH);
    if (grain !== UNIT_WEEK) return day;
    const index = Math.floor(dayMs(day) / DAY_MS);
    return dayOf((index - (((index - MONDAY_OFFSET_DAYS) % WEEK_DAYS) + WEEK_DAYS) % WEEK_DAYS) * DAY_MS);
  }

  // The filters of the tab; an empty set keeps everything.
  const deliveryFilter = () => ({ text: "", tiers: new Set(), kinds: new Set(), tris: new Set(), types: new Set(),
    people: new Set(), reTiered: true });
  const kindAllowed = (kind, kinds) => !kinds.size || kinds.has(kind) || kinds.has(KIND_TOGETHER);

  function deliveryKept(row, filter) {
    if (row.reason || (!filter.reTiered && row.reTiered)) return false;
    if (filter.tiers.size && !filter.tiers.has(row.tier)) return false;
    if (filter.kinds.size && !filter.kinds.has(row.kind)) return false;
    if (filter.tris.size && !filter.tris.has(row.tri)) return false;
    if (filter.types.size && !filter.types.has(row.type)) return false;
    if (filter.people.size && !row.people.some((i) => filter.people.has(i))) return false;
    return !filter.text || row.find.includes(filter.text.toLowerCase());
  }
  const inPeriod = (day, period) => day >= period.from && day <= period.to;

  // The days of the period on which an identity kept by the filters authored or co-authored a commit.
  function activeDays(period, filter, bounds, only) {
    const days = new Set();
    for (const [person, list] of Object.entries(DELIVERY.activeDays)) {
      const i = Number(person);
      if (only !== undefined ? i !== only : (filter.people.size && !filter.people.has(i))) continue;
      if (!kindAllowed(HISTORY.people[i].kind, filter.kinds)) continue;
      for (const day of list) if (inPeriod(day, period) && day >= bounds.first) days.add(day);
    }
    return days.size;
  }

  // The four figures of a period, and its tasks.
  function deliveryFigures(period, filter, bounds) {
    const rows = deliveryRows.filter((r) => deliveryKept(r, filter) && inPeriod(r.day, period) && r.day >= bounds.first);
    const points = rows.reduce((sum, r) => sum + pointsOf(r), 0);
    const days = activeDays(period, filter, bounds);
    return { tasks: rows.length, points, activeDays: days, throughput: days ? points / days : null,
      reworkRate: rows.length ? rows.filter((r) => r.reworked).length / rows.length : null, rows };
  }
  const variation = (a, b) => (a === null || b === null || b === 0 ? null : (a - b) / b);

  // The log knows a session's date, trigram and author, nothing else.
  const frictionKept = (r, filter, bounds) => r.day >= bounds.first && (!filter.tris.size || filter.tris.has(r.tri))
    && (!filter.people.size || filter.people.has(r.author));

  // The sessions of a period, their events, per session (null without a session), per counter.
  function frictionFigures(period, filter, bounds) {
    const rows = frictionRows.filter((r) => frictionKept(r, filter, bounds) && inPeriod(r.day, period));
    const events = sumOf(rows.map((r) => r.total));
    return { sessions: rows.length, events, perSession: rows.length ? events / rows.length : null,
      counters: FRICTION_COUNTERS.map((_, i) => sumOf(rows.map((r) => r.counters[i]))) };
  }

  // The filters on that the friction cannot follow, named in its tooltip.
  function frictionIgnored(filter) {
    const named = [[filter.tiers.size, "tier"], [filter.kinds.size, "kind"], [filter.types.size, "commit type"],
      [filter.text, "text"], [!filter.reTiered, "re-tiered tasks"]];
    return named.filter(([on]) => on).map(([, name]) => name);
  }

  // Per identity of the period, its points by tier, its active days and its throughput.
  function perIdentity(period, filter, bounds) {
    const { rows } = deliveryFigures(period, filter, bounds);
    const byPerson = new Map();
    for (const r of rows) {
      for (const i of r.people) {
        if (filter.people.size && !filter.people.has(i)) continue;
        if (!byPerson.has(i)) byPerson.set(i, { person: i, byTier: Object.fromEntries(TIERS.map((t) => [t, 0])), tasksByTier: {}, points: 0, tasks: 0 });
        const entry = byPerson.get(i);
        entry.tasksByTier[r.tier] = (entry.tasksByTier[r.tier] || 0) + 1;
        entry.byTier[r.tier] += pointsOf(r);
        entry.points += pointsOf(r);
        entry.tasks += 1;
      }
    }
    return [...byPerson.values()].map((e) => {
      const days = activeDays(period, filter, bounds, e.person);
      return { ...e, activeDays: days, throughput: days ? e.points / days : null };
    }).sort((a, b) => a.person - b.person);
  }

  // The points of every bucket of the days read, by tier, empty buckets included.
  function pointsOverTime(filter, grain, bounds) {
    const buckets = new Map();
    for (let day = bounds.first; day <= bounds.last; day = addDays(day, 1)) {
      const key = bucketOf(day, grain);
      if (!buckets.has(key)) buckets.set(key, { bucket: key, byTier: Object.fromEntries(TIERS.map((t) => [t, 0])), reworked: 0, sessions: [] });
    }
    for (const r of deliveryRows) {
      const entry = buckets.get(bucketOf(r.day, grain));
      if (deliveryKept(r, filter) && entry && r.day >= bounds.first) {
        entry.byTier[r.tier] += pointsOf(r);
        if (r.reworked) entry.reworked += 1;                           // At its delivery date
      }
    }
    for (const r of frictionRows) {
      const entry = buckets.get(bucketOf(r.day, grain));
      if (entry && frictionKept(r, filter, bounds)) entry.sessions.push(r);
    }
    return [...buckets.values()];
  }

  // From what a figure measures, not from its sign; no word without a variation.
  const verdict = (change, lowerIsBetter) => {
    if (!change) return "";
    return (change > 0) !== Boolean(lowerIsBetter) ? "better" : "worse";
  };

  const deliveryApi = { rows: deliveryRows, bounds: deliveryBounds, presets: presetPeriods, defaults: defaultPeriods, checkDay,
    grains: grainsOf, bucketOf, filter: deliveryFilter, figures: deliveryFigures, variation, perIdentity, pointsOverTime,
    friction: frictionFigures, frictionIgnored, verdict, currentFilter: () => dlv.filter };

  // ---- delivery view ----
  const DELIVERY_VIEW = "delivery";
  const PERIOD_KEYS = ["a", "b"];
  const PRESET_CUSTOM = "custom";
  const FIGURE_DIGITS = 3;              // the figures as the band's data attributes hold them
  const SHOWN_DIGITS = 1;               // the throughput as the band writes it
  const ARROW_UP = "▲";
  const ARROW_DOWN = "▼";
  const ARROW_SAME = "=";
  const NO_VALUE = "—";
  const FIELD_KIND = "kind";
  const OVERLAY_FRICTION = "friction";
  const OVERLAY_REWORK = "rework";
  const dlv = { periods: {}, grain: GRAIN_DAY, filter: null, bounds: null, built: false, sort: { key: null, direction: null },
    overlays: { [OVERLAY_FRICTION]: false, [OVERLAY_REWORK]: false }, zoom: null };
  const periodInput = (key, side) => $(`delivery-${side}-${key}`);
  const dataNumber = (value, digits) => {
    if (value === null) return "";
    return digits ? value.toFixed(digits) : String(value);
  };

  function showDeliveryMessage(text) {
    const message = $("delivery-message");
    message.textContent = text || "";
    message.hidden = !text;
  }

  function renderDeliveryPeriods() {
    const presets = presetPeriods(dlv.bounds);
    for (const key of PERIOD_KEYS) {
      const period = dlv.periods[key];
      periodInput(key, "from").value = period.from;
      periodInput(key, "to").value = period.to;
      const match = presets.find((p) => p.enabled && p.from === period.from && p.to === period.to);
      $(`delivery-preset-${key}`).value = match ? match.key : PRESET_CUSTOM;
    }
  }

  // A ready-made range beyond the history read is disabled and says why; a date outside it is refused.
  function setupDeliveryPeriods() {
    const presets = presetPeriods(dlv.bounds);
    for (const key of PERIOD_KEYS) {
      const select = $(`delivery-preset-${key}`);
      select.append(el("option", { value: PRESET_CUSTOM, text: "Dates chosen" }), ...presets.map((p) => el("option", {
        value: p.key, text: p.label, disabled: !p.enabled,
        title: p.enabled ? `${p.from} to ${p.to}` : `${p.from} to ${p.to}: beyond the history read, which starts on ${dlv.bounds.first}` })));
      select.addEventListener(EVENT_CHANGE, () => {
        const preset = presets.find((p) => p.key === select.value);
        if (preset) { dlv.periods[key] = { from: preset.from, to: preset.to }; showDeliveryMessage(null); }
        renderDelivery();
      });
      for (const side of ["from", "to"]) {
        const input = periodInput(key, side);
        Object.assign(input, { min: dlv.bounds.first, max: dlv.bounds.last });
        input.addEventListener(EVENT_CHANGE, () => {
          const next = { ...dlv.periods[key], [side]: input.value };
          const refused = checkDay(input.value, dlv.bounds)
            || (next.from > next.to ? `The first day ${next.from} comes after the last day ${next.to}` : null);
          showDeliveryMessage(refused);
          if (!refused) dlv.periods[key] = next;
          renderDelivery();
        });
      }
    }
  }

  function setupDeliveryGrains() {
    const box = $("delivery-grain");
    box.append(el(TAG_SPAN, { class: "segmented-label", text: "Grain" }), ...grainsOf(dlv.bounds).map((grain) => el(TAG_BUTTON, {
      type: TAG_BUTTON, "data-grain": grain, text: grain, title: `The points over time, ${grain} by ${grain}`,
      on: { [EVENT_CLICK]: () => { dlv.grain = grain; renderDelivery(); } } })));
  }

  function renderDeliveryRead() {
    const { since, depth, shallow } = HISTORY.limits;
    const parts = [`History read: ${dlv.bounds.read[0]} to ${dlv.bounds.read[1]}`];
    if (since) parts.push(`since ${since}`);
    if (depth) parts.push(`last ${depth} commits`);
    if (shallow) parts.push("shallow clone");
    if (dlv.bounds.first !== dlv.bounds.read[0]) parts.push(`periods from ${dlv.bounds.first}, the first day may be cut`);
    $("delivery-read").textContent = parts.join(" · ");
  }

  // The tags of the tab; a tag on keeps its tasks only, several tags of one group keep each one's.
  function deliveryChip(label, count, set, value, attribute, title) {
    const node = chip(label, count, set.has(value), () => { toggle(set, value); renderDelivery(); }, null, title);
    node.dataset[attribute] = value;
    return node;
  }

  function renderDeliveryChips() {
    const counted = deliveryRows.filter((r) => !r.reason);
    const countOf = (field, value) => counted.filter((r) => r[field] === value).length;
    const distinct = (field) => [...new Set(counted.map((r) => r[field]))].sort((a, b) => a.localeCompare(b));
    const f = dlv.filter;
    clear($("delivery-tiers")).append(...TIERS.map((t) => deliveryChip(t, countOf("tier", t), f.tiers, t, "tier",
      `Count the tier ${t} tasks (${DELIVERY.settings.points[t]} points each)`)));
    clear($("delivery-kinds")).append(...[KIND_HUMAN, KIND_AGENT, KIND_TOGETHER].map((k) => deliveryChip(KIND_LABEL[k],
      countOf(FIELD_KIND, k), f.kinds, k, FIELD_KIND, `Count the tasks delivered by a ${KIND_LABEL[k]} commit`)));
    clear($("delivery-types")).append(...distinct("type").map((t) => deliveryChip(t, countOf("type", t), f.types, t, "type",
      `Count the tasks whose delivery commit is of type ${t}`)));
    clear($("delivery-tris")).append(...distinct("tri").map((t) => deliveryChip(t, countOf("tri", t), f.tris, t, "tri",
      `Count the tasks of the ${t} trigram`)));
    clear($("delivery-people")).append(...HISTORY.people.map((person, i) => richTip(el(TAG_BUTTON, { class: "chip", type: TAG_BUTTON,
      [ATTR_PERSON]: i, [VALUE_ARIA_PRESSED]: String(f.people.has(i)), [VALUE_ARIA_LABEL]: identityLines(i).join(". "),
      on: { [EVENT_CLICK]: () => { toggle(f.people, i); renderDelivery(); } } },
    identityIcon(i), el(TAG_SPAN, { text: person.name }), el(TAG_SPAN, { class: CLASS_CHIP_COUNT,
      text: counted.filter((r) => r.people.includes(i)).length })), () => linesTip(identityLines(i)), CSS_TIP_DELAY)));
    for (const b of $("delivery-grain").querySelectorAll(TAG_BUTTON)) b.setAttribute(VALUE_ARIA_PRESSED, String(b.dataset.grain === dlv.grain));
  }

  function changeArrow(change) {
    if (change > 0) return ARROW_UP;
    return change < 0 ? ARROW_DOWN : ARROW_SAME;
  }

  // A figure for A, for B and the variation from B to A, its arrow and sign written, never its colour alone.
  function changeText(change) {
    if (change === null) return NO_VALUE;
    const arrow = changeArrow(change);
    return `${arrow} ${change > 0 ? "+" : ""}${pct(change, 1)} %`;
  }

  // A period's mark, in its colour, wherever A and B are written.
  const periodBadge = (key) => el(TAG_SPAN, { class: `delivery-badge delivery-mark-${key}`, text: key.toUpperCase() });

  function deliveryFigure(key, label, values, show, lowerIsBetter, moreLines) {
    const [a, b] = values;
    const change = variation(a, b);
    const word = verdict(change, lowerIsBetter);
    const changeWords = word ? `${changeText(change)} ${word}` : changeText(change);
    const changeClass = word ? `delivery-change is-${word}` : "delivery-change";
    const node = el("div", { class: "kpi", "data-figure": key, "data-a": dataNumber(a, show.digits), "data-b": dataNumber(b, show.digits),
      "data-change": dataNumber(change, FIGURE_DIGITS) },
    el(TAG_SPAN, { class: CLASS_KPI_LABEL, text: label }),
    el(TAG_SPAN, { class: CLASS_KPI_VALUE }, periodBadge(PERIOD_KEYS[0]), show.text(a)),
    el(TAG_SPAN, { class: VALUE_KPI_SUB }, periodBadge(PERIOD_KEYS[1]), ` ${show.text(b)} · `, el(TAG_SPAN, {
      class: changeClass, text: changeWords })));
    return richTip(node, () => ({ head: label, lines: [`Period A, ${dlv.periods.a.from} to ${dlv.periods.a.to}: ${show.text(a)}`,
      `Period B, ${dlv.periods.b.from} to ${dlv.periods.b.to}: ${show.text(b)}`, `Variation from B to A: ${changeWords}`,
      lowerIsBetter ? "Less is better, more is worse" : "More is better, less is worse",
      ...(moreLines ? moreLines() : [])] }));
  }

  const counterWords = (counters) => FRICTION_COUNTERS.map((name, i) => `${name} ${counters[i]}`).join(", ");

  // What the friction figure of a period is made of, and the filters it does not follow.
  function frictionLines(friction) {
    const lines = PERIOD_KEYS.map((key, k) => `${key.toUpperCase()}: ${friction[k].sessions} sessions, ${friction[k].events} events (${counterWords(friction[k].counters)})`);
    lines.unshift("The events of a period divided by its sessions");
    const ignored = frictionIgnored(dlv.filter);
    return ignored.length ? [...lines,`Not filtered by ${ignored.join(", ")}: the log holds only a session's date, trigram and author`] : lines;
  }

  function renderDeliveryKpis(figures) {
    const [fa, fb] = figures;
    const count = { digits: 0, text: String };
    const rate = { digits: FIGURE_DIGITS, text: (v) => (v === null ? NO_VALUE : `${pct(v, 1)} %`) };
    const perDay = { digits: FIGURE_DIGITS, text: (v) => (v === null ? NO_VALUE : v.toFixed(SHOWN_DIGITS)) };
    const friction = PERIOD_KEYS.map((key) => frictionFigures(dlv.periods[key], dlv.filter, dlv.bounds));
    const band = [
      deliveryFigure("tasks", "Tasks delivered", [fa.tasks, fb.tasks], count),
      deliveryFigure("points", "Points", [fa.points, fb.points], count),
      deliveryFigure("throughput", "Points per active day", [fa.throughput, fb.throughput], perDay),
      deliveryFigure(OVERLAY_REWORK, "Rework", [fa.reworkRate, fb.reworkRate], rate, true),
      frictionRows.length ? deliveryFigure(OVERLAY_FRICTION, "Friction per session", friction.map((f) => f.perSession), perDay, true,
        () => frictionLines(friction)) : null,
    ].filter(Boolean);
    const box = clear($("delivery-kpis"));
    box.style.setProperty("--figures", String(band.length));
    box.append(...band);
  }

  // ---- delivery charts ( as amended) ----
  // Drawn by ECharts through libraryChart: each tier named in full, A and B in their periods' colours, a
  // tier told by the opacity of its period's colour, no pattern; every size and colour comes from the tokens.
  const PERIOD_NAME = { a: "Period A", b: "Period B" };
  const CHART_THROUGHPUT = "throughput";
  const CHART_TIMELINE = "timeline";
  const CHART_TIERS = "tiers";
  const SERIES_BAR = "bar";
  const AXIS_VALUE = "value";
  const AXIS_CATEGORY = "category";
  const TRIGGER_AXIS = "axis";
  const HTML_ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
  const taskCount = (n) => `${n} ${n === 1 ? "task" : "tasks"}`;
  const pointCount = (n) => `${n} ${n === 1 ? "point" : "points"}`;
  const periodText = (key) => `${PERIOD_NAME[key]}, ${dlv.periods[key].from} to ${dlv.periods[key].to}`;
  const tierLabel = (t) => `${t}, ${DELIVERY.settings.names[t]}, ${pointCount(DELIVERY.settings.points[t])}`;
  const tierOpacity = (t) => cssSize(`--c-delivery-tier-${t.toLowerCase()}-opacity`);
  const periodColour = (key) => resolvedColour(cssValue(`--c-delivery-period-${key}`));
  const LABEL_DIGITS = 1;                                              // a value written on its bar
  // A tooltip of ECharts is HTML: every text from the data is escaped.
  const escapeHtml = (value) => String(value).replace(/[&<>"]/g, (c) => HTML_ESCAPES[c]);
  const tipHtml = (lines) => lines.map((line, i) => (i ? escapeHtml(line) : `<b>${escapeHtml(line)}</b>`)).join("<br>");

  // An identity's colour as the browser resolves it: a token or a computed hue.
  function resolvedColour(colour) {
    const probe = document.createElement("span");
    probe.style.color = colour;
    document.body.append(probe);
    const value = getComputedStyle(probe).color;
    probe.remove();
    return value;
  }

  const legendGap = () => cssSize("--s-space-2xl");
  const SVG_XMLNS = "http://www.w3.org/2000/svg";
  const DATA_SVG = "data:image/svg+xml;charset=utf-8,";

  // An identity's kind icon, the page's own symbol, filled with the identity's colour and its
  // cut-outs with the card's, as an image that a library chart's text can show.
  function identityImage(index) {
    const symbol = document.getElementById(`icon-${HISTORY.people[index].kind}`);
    const svg = `<svg xmlns="${SVG_XMLNS}" viewBox="${symbol.getAttribute(ATTR_VIEWBOX)}" fill="${resolvedColour(colourOf[index])}">`
      + `<style>.icon-cut{fill:${resolvedColour(cssValue(CSS_VAR_C_CARD_BG))}}</style>${[...symbol.children].map((child) => new XMLSerializer().serializeToString(child)).join("")}</svg>`;
    return DATA_SVG + encodeURIComponent(svg);
  }
  const legendRoom = () => cssSize("--s-space-3xl");                  // a legend on two lines
  const chartLabelWidth = () => cssSize("--c-delivery-label-width");
  const chartMargin = () => cssSize("--s-space-lg");                  // the first letter of a label is never cut
  const LABEL_BREAK = ", ";                                            // "S, small task, 1 point" on three lines       // a long name is cut, whole in the tooltip

  // Per identity, its points per active day stacked by tier, A then B, each in its period's colour.
  function throughputOption(theme) {
    const per = Object.fromEntries(PERIOD_KEYS.map((key) => [key, perIdentity(dlv.periods[key], dlv.filter, dlv.bounds)]));
    const people = [...new Set(PERIOD_KEYS.flatMap((key) => per[key].map((e) => e.person)))].sort((a, b) => a - b);
    const entryOf = (key, person) => per[key].find((e) => e.person === person);
    const series = PERIOD_KEYS.flatMap((key) => TIERS.map((t, ti) => ({
      type: SERIES_BAR, name: tierLabel(t), stack: key,
      itemStyle: { color: periodColour(key), opacity: tierOpacity(t) },
      label: { show: ti === TIERS.length - 1, position: "right", ...theme.caption,
        formatter: ({ data }) => (entryOf(data.period, data.person)?.throughput ?? 0).toFixed(LABEL_DIGITS) },
      data: people.map((person) => {
        const entry = entryOf(key, person);
        const value = entry?.activeDays ? entry.byTier[t] / entry.activeDays : 0;
        return { value, person, period: key, tier: t };
      }),
    })));
    const tip = ({ data }) => {
      const entry = entryOf(data.period, data.person);
      if (!entry) return tipHtml([HISTORY.people[data.person].name, periodText(data.period), "No task delivered"]);
      const rate = entry.throughput === null ? "no active day" : `${entry.throughput.toFixed(SHOWN_DIGITS)} points per active day`;
      return tipHtml([HISTORY.people[data.person].name, periodText(data.period),
        `${pointCount(entry.points)} over ${entry.activeDays} active days: ${rate}`,
        ...TIERS.map((t) => `${tierLabel(t)}: ${taskCount(entry.tasksByTier[t] || 0)}, ${pointCount(entry.byTier[t])}`)]);
    };
    return {
      legend: { data: TIERS.map(tierLabel), top: 0, itemStyle: { color: theme.colour.muted } },
      grid: { containLabel: true, left: chartMargin(), right: legendGap(), top: legendRoom(), bottom: legendGap() },
      tooltip: { trigger: "item", formatter: tip },
      xAxis: { type: AXIS_VALUE, name: "points per active day", nameLocation: "middle", nameGap: legendGap() },
      yAxis: { type: AXIS_CATEGORY, data: people.map((p) => HISTORY.people[p].name), inverse: true,
        axisLabel: { ...theme.caption, width: chartLabelWidth(), overflow: "truncate",
          formatter: (name, i) => `{p${i}|} ${name}`,                  // The identity's icon first
          rich: Object.fromEntries(people.map((p, i) => [`p${i}`, { width: cssSize("--c-history-icon-size"),
            height: cssSize("--c-history-icon-size"), backgroundColor: { image: identityImage(p) } }])) } },
      series,
    };
  }

  // The marks over the points; shape tells them apart without colour.
  const OVERLAYS = [
    { key: OVERLAY_REWORK, name: "Rework", symbol: "diamond", value: (b) => b.reworked,
      hint: "Show or hide the tasks delivered in each bucket and reworked later" },
    { key: OVERLAY_FRICTION, name: "Friction", symbol: "circle", value: (b) => sumOf(b.sessions.map((s) => s.total)),
      hint: "Show or hide the friction events of the sessions of each bucket" },
  ];
  const NO_LOG_HINT = "No friction to show: METRICS_LOG.md is not committed in the process folder, or holds no row";
  const overlayAvailable = (overlay) => overlay.key !== OVERLAY_FRICTION || frictionRows.length > 0;
  const overlayShown = (overlay) => dlv.overlays[overlay.key] && overlayAvailable(overlay);

  // The fill or the outline stands out from every background of the chart.
  function overlaySeries(overlay, buckets) {
    return { type: "scatter", name: overlay.name, yAxisIndex: 1, symbol: overlay.symbol, symbolSize: cssSize("--c-delivery-overlay-mark"),
      itemStyle: { color: resolvedColour(cssValue(`--c-delivery-${overlay.key}`)), borderColor: resolvedColour(cssValue("--c-delivery-overlay-outline")), borderWidth: cssSize("--c-delivery-overlay-outline-width") },
      data: buckets.map((b) => overlay.value(b) || null) };
  }

  function sessionLine(session) {
    const c = HISTORY.commits[session.commit];
    return `Friction, ${session.tri}: ${session.total} (${counterWords(session.counters)}), ${HISTORY.people[c.author].name}, ${c.hash}`;
  }

  // A bucket's points by tier, the tasks reworked and each session, for the marks shown.
  function bucketTip(bucket) {
    const reworked = dlv.overlays[OVERLAY_REWORK] && bucket.reworked;
    return tipHtml([bucket.bucket, ...TIERS.filter((t) => bucket.byTier[t]).map((t) => `${tierLabel(t)}: ${pointCount(bucket.byTier[t])}`),
      ...(reworked ? [`Rework: ${taskCount(bucket.reworked)} delivered then reworked`] : []),
      ...(dlv.overlays[OVERLAY_FRICTION] ? bucket.sessions.map(sessionLine) : [])]);
  }

  // A tag changes the marks only, and the zoom stays.
  function toggleOverlay(overlay) {
    const box = document.querySelector(`[data-chart="${CHART_TIMELINE}"]`);
    const [zoom] = window[GLOBAL_ECHARTS]?.getInstanceByDom(box)?.getOption().dataZoom || [];
    dlv.overlays[overlay.key] = !dlv.overlays[overlay.key];
    dlv.zoom = zoom ? { start: zoom.start, end: zoom.end } : null;
    renderDeliveryCharts(PERIOD_KEYS.map((key) => deliveryFigures(dlv.periods[key], dlv.filter, dlv.bounds)));
    dlv.zoom = null;
  }

  function overlayTags() {
    return el("div", { class: "chips delivery-overlays", role: "group", [VALUE_ARIA_LABEL]: "Marks shown" }, ...OVERLAYS.map((overlay) => el(TAG_BUTTON, {
      class: "chip", type: TAG_BUTTON, "data-overlay": overlay.key, [VALUE_ARIA_PRESSED]: String(overlayShown(overlay)),
      disabled: !overlayAvailable(overlay), title: overlayAvailable(overlay) ? overlay.hint : NO_LOG_HINT,
      on: { [EVENT_CLICK]: () => toggleOverlay(overlay) } },
    el(TAG_SPAN, { class: `delivery-overlay-mark is-${overlay.key}` }), overlay.name)));
  }

  // The points of every bucket of the history read, stacked by tier, A and B marked, a zoom on the time axis.
  function timelineOption(theme) {
    const buckets = pointsOverTime(dlv.filter, dlv.grain, dlv.bounds);
    const area = (key, colour) => [{ name: key.toUpperCase(), xAxis: bucketOf(dlv.periods[key].from, dlv.grain),
      itemStyle: { color: colour, opacity: cssSize("--c-delivery-span-opacity") } }, { xAxis: bucketOf(dlv.periods[key].to, dlv.grain) }];
    const series = TIERS.map((t) => ({ type: SERIES_BAR, name: tierLabel(t), stack: "points",
      itemStyle: { color: theme.colour.muted, opacity: tierOpacity(t) },
      data: buckets.map((b) => {                                       // A and B in their colours
        const key = PERIOD_KEYS.find((k) => b.bucket >= bucketOf(dlv.periods[k].from, dlv.grain)
          && b.bucket <= bucketOf(dlv.periods[k].to, dlv.grain));
        return key ? { value: b.byTier[t], itemStyle: { color: periodColour(key) } } : { value: b.byTier[t] };
      }) }));
    series[0].markArea = { silent: true, label: { color: theme.colour.muted, fontSize: theme.caption.fontSize },
      data: [area(PERIOD_KEYS[0], periodColour(PERIOD_KEYS[0])), area(PERIOD_KEYS[1], periodColour(PERIOD_KEYS[1]))] };
    return {
      legend: { data: TIERS.map(tierLabel), top: 0 },                  // The tags are the marks' legend
      grid: { containLabel: true, left: 0, right: cssSize("--s-space-sm"), top: legendGap(), bottom: legendRoom() },   // Room for the slider and its right handle
      tooltip: { trigger: TRIGGER_AXIS, formatter: ([first]) => bucketTip(buckets[first.dataIndex]) },
      xAxis: { type: AXIS_CATEGORY, data: buckets.map((b) => b.bucket) },
      yAxis: [{ type: AXIS_VALUE, name: "points" },
        { type: AXIS_VALUE, name: "count", minInterval: 1, splitLine: { show: false }, show: OVERLAYS.some(overlayShown) }],
      dataZoom: [{ type: "inside", ...dlv.zoom }, { type: "slider", height: cssSize("--s-space-lg"), bottom: cssSize("--s-space-sm"), ...dlv.zoom }],
      series: [...series, ...OVERLAYS.filter(overlayShown).map((overlay) => overlaySeries(overlay, buckets))],
    };
  }

  // The tasks delivered per tier, A beside B, each in its period's colour.
  function tiersOption(theme, figures) {
    const series = PERIOD_KEYS.map((key, k) => ({ type: SERIES_BAR, name: key.toUpperCase(),
      itemStyle: { color: periodColour(key) }, label: { show: true, position: "top", ...theme.caption },
      data: TIERS.map((t) => figures[k].rows.filter((r) => r.tier === t).length) }));
    return {
      legend: { data: PERIOD_KEYS.map((key) => key.toUpperCase()), top: 0, formatter: (name) => periodText(name.toLowerCase()) },
      grid: { containLabel: true, left: 0, right: 0, top: legendRoom(), bottom: 0 },
      tooltip: { trigger: TRIGGER_AXIS },
      xAxis: { type: AXIS_CATEGORY, data: TIERS.map(tierLabel),
        axisLabel: { ...theme.caption, interval: 0, formatter: (label) => label.replaceAll(LABEL_BREAK, "\n") } },
      yAxis: { type: AXIS_VALUE, name: "tasks", minInterval: 1 },
      series,
    };
  }

  function renderDeliveryCharts(figures) {
    const people = new Set(PERIOD_KEYS.flatMap((key) => perIdentity(dlv.periods[key], dlv.filter, dlv.bounds).map((e) => e.person)));
    const charts = [
      [CHART_THROUGHPUT, "Points per active day", "For each identity, the points it delivered per active day in period A, then in period B, stacked by tier: a lighter shade for a smaller tier.",
        throughputOption, [...people].sort((a, b) => a - b).flatMap((_, i) => PERIOD_KEYS.map((__, k) => ({ seriesIndex: k * TIERS.length, dataIndex: i })))],
      [CHART_TIMELINE, "Points over time", `The points delivered per ${dlv.grain} over the history read, stacked by tier; periods A and B are shaded; circles give the friction events and diamonds the tasks later reworked, on the second axis.`,
        timelineOption, pointsOverTime(dlv.filter, dlv.grain, dlv.bounds).map((_, i) => ({ seriesIndex: 0, dataIndex: i }))],
      [CHART_TIERS, "Tasks per tier", "The tasks delivered in each tier, in period A beside period B.",
        (theme) => tiersOption(theme, figures), TIERS.flatMap((_, i) => PERIOD_KEYS.map((__, k) => ({ seriesIndex: k, dataIndex: i })))],
    ];
    const cards = charts.map(([key, title]) => {
      const box = el("div", { class: "delivery-chart", "data-chart": key });
      if (key === CHART_THROUGHPUT) box.style.setProperty("--rows", String(Math.max(people.size, 1)));
      return { box, card: el(TAG_ARTICLE, { class: `card chart-card${key === CHART_TIMELINE ? " delivery-wide" : ""}` },
        el(TAG_HEADER, { class: "card-header" }, el("h3", { class: "card-title", text: title }), key === CHART_TIMELINE ? overlayTags() : null), box) };
    });
    clear($("delivery-charts")).append(...cards.map((c) => c.card));
    charts.forEach(([, title, description, build, items], i) => libraryChart(cards[i].box, build, { label: title, description, items }));
  }

  // ---- delivery table ----
  const REASON_TEXT = {
    "created-done": "Done from its creation: git holds no change of its status to Done",
    annotated: "Its status reads more than Done",
    reopened: "Its status left Done after its delivery",
    "no-tier": "It has no tier S, M or L",
  };
  const SORT_ASCENDING = "ascending";
  const SORT_DESCENDING = "descending";
  const deliverers = (r) => r.people.map((i) => HISTORY.people[i].name).join(", ");
  const periodsOf = (r) => PERIOD_KEYS.filter((key) => inPeriod(r.day, dlv.periods[key])).map((key) => key.toUpperCase()).join(", ");
  // [key, header, value of a row, shown in the table]; the CSV also writes the commit type.
  const DELIVERY_COLUMNS = [
    ["id", "Task", (r) => r.id, true], ["title", "Title", (r) => r.title, true], ["tier", "Tier", (r) => r.tier, true],
    ["points", "Points", pointsOf, true], ["people", "Delivered by", deliverers, true], ["day", "Date", (r) => r.day, true],
    ["period", "Period", periodsOf, true], [VALUE_LINES, "Lines", (r) => r.lines, true],
    ["reworked", "Reworked", (r) => (r.reworked ? "yes" : ""), true], ["type", "Commit type", (r) => r.type, false],
  ];

  // The tasks of A and B kept by the filters, in the order chosen (by date by default), and those set aside.
  function deliveryTableRows() {
    const inAny = (r) => PERIOD_KEYS.some((key) => inPeriod(r.day, dlv.periods[key])) && r.day >= dlv.bounds.first;
    const kept = deliveryRows.filter((r) => inAny(r) && deliveryKept(r, dlv.filter));
    const column = DELIVERY_COLUMNS.find((c) => c[0] === dlv.sort.key);
    if (column) {
      const value = column[2];
      kept.sort((a, b) => {
        const [x, y] = [value(a), value(b)];
        const order = typeof x === "number" ? x - y : String(x).localeCompare(String(y), undefined, { numeric: true });
        return dlv.sort.direction === SORT_ASCENDING ? order : -order;
      });
    }
    const aside = deliveryRows.filter((r) => r.reason && inAny(r) && deliveryKept({ ...r, reason: null }, dlv.filter));
    return { kept, aside };
  }

  function deliveryCsv() {
    const { kept } = deliveryTableRows();
    return [DELIVERY_COLUMNS.map((c) => c[1]), ...kept.map((r) => DELIVERY_COLUMNS.map((c) => c[2](r)))]
      .map((row) => row.map(csvCell).join(",")).join("\r\n");
  }

  function exportDeliveryCsv() {
    const url = URL.createObjectURL(new Blob(["﻿", deliveryCsv()], { type: "text/csv;charset=utf-8" }));
    const a = el("a", { href: url, download: `delivery-${DATA.meta.title}.csv` });
    document.body.append(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function sortBy(key) {
    const again = dlv.sort.key === key && dlv.sort.direction === SORT_ASCENDING;
    dlv.sort = { key, direction: again ? SORT_DESCENDING : SORT_ASCENDING };
    renderDeliveryTable();
  }

  const selectOnKey = (id) => (event) => {
    if (event.key === KEY_ENTER || event.key === " ") { event.preventDefault(); select(id); }
  };

  const DELIVERY_TABLE = "delivery-tasks";
  const deliveryColumns = columnSizer(() => $(DELIVERY_TABLE), "agnos-perf-center-delivery-columns");

  function renderDeliveryTable() {
    const { kept, aside } = deliveryTableRows();
    const shown = DELIVERY_COLUMNS.filter((c) => c[3]);
    const head = el(TAG_THEAD, {}, el("tr", {}, ...shown.map(([key, label]) => el("th", { scope: "col", "data-sort": key, "data-column": key, tabindex: "0",
      "aria-sort": dlv.sort.key === key ? dlv.sort.direction : VALUE_NONE, title: `Sort by ${label.toLowerCase()}; again to reverse`,
      on: { [EVENT_CLICK]: () => sortBy(key), [EVENT_KEYDOWN]: (event) => { if (event.key === KEY_ENTER) sortBy(key); } } },
    label, deliveryColumns.grip(key, label)))));                              // Resizable, as in the matrix
    const rows = kept.map((r) => el("tr", { class: "delivery-row", "data-key": r.id, tabindex: "0",
      [VALUE_ARIA_LABEL]: `${r.id}, ${r.title}: delivered on ${r.day} by ${deliverers(r)}`,
      on: { [EVENT_CLICK]: () => select(r.id), [EVENT_KEYDOWN]: selectOnKey(r.id) } },
    ...shown.map((c) => el("td", { text: c[2](r) }))));
    const asideRows = aside.length ? [el("tr", {}, el("th", { colspan: shown.length, scope: "colgroup",
      text: `Set aside: ${taskCount(aside.length)} counted in no figure` })),
    ...aside.map((r) => el("tr", { class: "delivery-aside", "data-key": r.id, "data-reason": r.reason, tabindex: "0",
      on: { [EVENT_CLICK]: () => select(r.id), [EVENT_KEYDOWN]: selectOnKey(r.id) } },
    el("td", { text: r.id }), el("td", { text: r.title }), el("td", { colspan: shown.length - HALF, text: REASON_TEXT[r.reason] || r.reason })))] : [];
    clear($("delivery-table")).append(
      el("div", { class: "toolbar" }, el("h3", { class: "card-title", text: "Tasks delivered in A and B" }),
        el(TAG_SPAN, { class: "graph-status", text: `${taskCount(kept.length)} kept by the filters` }), el(TAG_SPAN, { class: "toolbar-spacer" }),
        el(TAG_BUTTON, { class: "button", type: TAG_BUTTON, id: "delivery-export", text: "Export CSV",
          title: "Download the tasks shown as a CSV file (UTF-8, comma-separated)", on: { [EVENT_CLICK]: exportDeliveryCsv } })),
      el("div", { class: "table-frame" }, el("table", { class: "matrix delivery-tasks", id: DELIVERY_TABLE }, head, el(TAG_TBODY, {}, ...rows),
        el(TAG_TBODY, { class: "delivery-aside-body" }, ...asideRows))));
    deliveryColumns.apply();
  }

  // The detail panel states a task's delivery, or why the Delivery tab sets it aside.
  function deliveryLine(key) {
    const r = deliveryRows.find((row) => row.id === key);
    if (!r) return null;
    const text = r.reason ? `Done on ${r.day}, set aside from the Delivery tab: ${REASON_TEXT[r.reason] || r.reason}`
      : `Delivered on ${r.day} by ${deliverers(r)}: tier ${r.tier}, ${pointsOf(r)} points`;
    return el("p", { class: "detail-delivery", text });
  }

  function renderDelivery() {
    renderDeliveryPeriods();
    renderDeliveryChips();
    const figures = PERIOD_KEYS.map((key) => deliveryFigures(dlv.periods[key], dlv.filter, dlv.bounds));
    renderDeliveryKpis(figures);
    renderDeliveryCharts(figures);
    renderDeliveryTable();
  }

  function setupDelivery() {
    dlv.bounds = deliveryBounds();
    dlv.filter = deliveryFilter();
    [dlv.periods.a, dlv.periods.b] = defaultPeriods(dlv.bounds);
    setupDeliveryPeriods();
    setupDeliveryGrains();
    renderDeliveryRead();
    $("delivery-filter").addEventListener(DOM_INPUT, (event) => { dlv.filter.text = event.target.value.trim(); renderDelivery(); });
    $("delivery-retiered").addEventListener(EVENT_CHANGE, (event) => { dlv.filter.reTiered = event.target.checked; renderDelivery(); });
    $("delivery-reset").addEventListener(EVENT_CLICK, () => {
      dlv.filter = deliveryFilter();
      $("delivery-filter").value = "";
      $("delivery-retiered").checked = true;
      renderDelivery();
    });
    dlv.built = true;
  }

  const deliveryView = {
    show() {
      if (!DELIVERY) return;
      if (!dlv.built) setupDelivery();
      renderDelivery();
    },
  };

  // ---- detail panel -------------------------------------------------------------------------------------------
  function renderDetail() {
    const panel = clear($("detail"));
    const key = state.selected;
    if (key !== pressedFor) { pressedTags.clear(); pressedFor = key; }
    if (!key) {
      panel.append(el("div", { class: "detail-empty" },
        el("span", { class: "detail-empty-title", text: "No element selected" }),
        el("span", { text: "Search an ID, a title or a file, or click any element of the matrix, the quality view or the graph: its links appear here, grouped by type." })));
      return;
    }
    if (boxes.get(key)) {
      renderBoxDetail(panel, boxes.get(key));
      return;
    }
    if (isCommitKey(key)) {
      historyView.render(panel, key);
      return;
    }
    const n = nodes.get(key);
    const head = elementHead(n, key);
    const groups = linksByType(key);
    const ordered = [...groups.keys()].sort((a, b) => typeOrder(a) - typeOrder(b));
    const summary = el("div", { class: "detail-summary" }, ordered.length ? ordered.map((t) =>
      groupTag(t, t, `${plural(t, groups.get(t).size)} ${groups.get(t).size}`))
      : el("span", { class: "badge badge-error", text: "No link" }));
    const callSections = n.type === "FN" ? callGroups(calls.index.get(key)) : [];
    summary.append(...callSections.map((s) => s.badge));
    if (CALL_GRAPH && n.type === "RQ" && !groups.has("FN")) summary.append(noFunctionBadge(key));
    panel.append(detailBand(n.type, head, summary),
      el("div", { class: "detail-body" }, ...callSections.map((s) => s.section), ...ordered.map((t) => linkGroup(t, groups.get(t)))));
    applyTagFilter();
  }

  function elementHead(n, key) {
    return el("div", { class: `detail-head t-${n.type}` },
      el("div", { class: "detail-kind" }, el("span", { class: `dot t-${n.type}` }), TYPE_NAME[n.type][0]),
      el("h2", { class: "detail-id", text: n.label }),
      n.title ? el("p", { class: "detail-title", text: n.title }) : null,
      el("div", { class: "detail-badges" },
        n.status ? el("span", { class: "badge badge-neutral", text: n.status }) : null,
        n.type === "RQ" && DATA.coverage[key] ? coverageBadge(DATA.coverage[key]) : null,
        n.kind === KIND_UNDEFINED ? el("span", { class: "badge badge-error", text: "Not in the index" }) : null),
      n.doc ? el("div", { class: "detail-location", text: `${n.doc}:${n.first}-${n.last}` }) : null,
      DELIVERY ? deliveryLine(key) : null,
      el("div", { class: "detail-actions" },
        el("button", { class: "button button-primary", type: "button", text: "Show in graph",
          title: "Open the graph on this element and its links", on: { click: () => showView("graph") } }),
        el("button", { class: "button", type: "button", text: "Copy ID",
          title: "Copy this ID (or name) to the clipboard", on: { click: () => copy(n.label) } }),
        HISTORY && n.kind !== KIND_UNDEFINED ? el(TAG_BUTTON, { class: "button", type: TAG_BUTTON, "data-action": HISTORY_VIEW, text: "History",
          title: "Open the History tab on this element: who changed it, and its code, over time",
          on: { [EVENT_CLICK]: () => scopeHistory(key) } }) : null));
  }

  // A tag is a toggle that shows only its group; the pressed tags belong to one selection.
  const pressedTags = new Set();
  let pressedFor = null;

  function groupTag(group, type, text) {
    const tag = el("button", { class: `badge badge-neutral tag t-${type}`, type: "button", "data-group": group,
      "aria-pressed": String(pressedTags.has(group)), title: "Show only this group of links; click again to show them all" },
      el("span", { class: `dot t-${type}` }), text);
    tag.addEventListener("click", () => {
      if (pressedTags.has(group)) pressedTags.delete(group); else pressedTags.add(group);
      tag.setAttribute("aria-pressed", String(pressedTags.has(group)));
      applyTagFilter();
    });
    return tag;
  }

  function grouped(group, section) {
    section.dataset.group = group;
    return section;
  }

  function applyTagFilter() {
    for (const section of $("detail").querySelectorAll(".detail-body .group")) {
      section.hidden = pressedTags.size > 0 && !pressedTags.has(section.dataset.group);
    }
  }

  // The identity and the tags stand in a band that does not scroll, over the body of links.
  function detailBand(type, head, summary) {
    return el("div", { class: `detail-top t-${type}` }, head, summary);
  }

  // {type: {linked key: [links]}} of an element's links.
  function linksByType(key) {
    const groups = new Map();
    for (const l of links.get(key)) {
      const type = nodes.get(l.key).type;
      if (!groups.has(type)) groups.set(type, new Map());
      const byKey = groups.get(type);
      if (!byKey.has(l.key)) byKey.set(l.key, []);
      byKey.get(l.key).push(l);
    }
    return groups;
  }

  function noFunctionBadge(key) {
    const note = fileCitations(key).length ? "cited at file level only" : "no function cites it";
    return richTip(el("span", { class: "badge badge-warn t-FN" }, el("span", { class: "dot t-FN" }),
      `${plural("FN", 0)} 0 · ${note}`), () => ({ head: "No function", lines: [`No function of the call graph cites this requirement: ${note}`] }));
  }

  // A function's callers and callees, the first CALLS_SHOWN of each, more on request.
  function callGroups(index) {
    const byLabel = (a, b) => nodes.get(a.key).label.localeCompare(nodes.get(b.key).label, undefined, { numeric: true });
    return [{ title: "Callers", rel: "called by", list: calls.callers(index) },
      { title: "Callees", rel: "calls", list: calls.callees(index) }]
      .map(({ title, rel, list }) => ({
        badge: groupTag(title.toLowerCase(), "FN", `${title} ${list.length}`),
        section: grouped(title.toLowerCase(), callGroup(title, rel, list.toSorted(byLabel))),
      }));
  }

  function callGroup(title, rel, list) {
    return listGroup(title, list, (c) => callItem(c, rel));
  }

  // A titled list, the first CALLS_SHOWN items at first, more on request.
  function listGroup(title, list, item, type = "FN") {
    const items = el("ul", { class: "group-items" });
    const more = el("button", { class: "link-button", type: "button" });
    let shown = 0;
    const next = () => {
      items.append(...list.slice(shown, shown + CALLS_SHOWN).map(item));
      shown = Math.min(list.length, shown + CALLS_SHOWN);
      more.hidden = shown >= list.length;
      more.textContent = `Show ${Math.min(CALLS_SHOWN, list.length - shown)} more of ${list.length - shown}`;
    };
    more.addEventListener("click", next);
    next();
    return el("section", { class: "group" },
      el("div", { class: "group-head" }, el("h3", { class: "group-title" }, el("span", { class: `dot t-${type}` }), title),
        el("span", { class: "group-count", text: list.length })),
      items, more);
  }

  // ---- a box's panel ---------------------------------------
  // Its kind and name, the box around it, its inner boxes and own functions, its calls in and out by box at its own
  // level, and the requirements its functions cite.
  function renderBoxDetail(panel, box) {
    const members = boxes.membersOf(box.key);
    const inner = boxes.innerOf(box.key).sort(byKeyLabel);
    const own = members.filter((i) => (boxes.scopeOf(i) ?? GLOBAL_KEY) === box.key).map((i) => fnKeys[i]);
    const cited = unique(members.flatMap((i) => links.get(fnKeys[i]).filter((l) => l.kind === "code" && l.dir === "out"
      && nodes.get(l.key).type === "RQ").map((l) => l.key))).sort(byKeyLabel);
    const { callers, callees } = boxCalls(box, members);
    const keyItem = (key) => el("li", { class: "link-item" }, idButton(key));
    const head = el("div", { class: "detail-head t-FN" },
      el("div", { class: "detail-kind" }, el("span", { class: "dot t-FN" }), BOX_NAME[box.box]),
      el("h2", { class: "detail-id", text: box.label }),
      el("div", { class: "detail-actions" },
        el("button", { class: "button button-primary", type: "button", text: "Show in graph",
          title: "Open the graph on this box, its functions and their links", on: { click: () => showView("graph") } }),
        el("button", { class: "button", type: "button", text: "Copy name",
          title: "Copy the box's name to the clipboard", on: { click: () => copy(box.label) } })));
    const summary = el("div", { class: "detail-summary" }, groupTag("inner", "FN", `Inner scopes ${inner.length}`),
      groupTag("FN", "FN", `${plural("FN", members.length)} ${members.length}`), groupTag("RQ", "RQ", `${plural("RQ", cited.length)} ${cited.length}`),
      groupTag("callers", "FN", `Callers ${callers.length}`), groupTag("callees", "FN", `Callees ${callees.length}`));
    panel.append(detailBand("FN", head, summary), el("div", { class: "detail-body" }, ...[
      box.parent ? listGroup("Enclosing scope", [box.parent], keyItem) : null,
      inner.length ? grouped("inner", listGroup("Inner scopes", inner, keyItem)) : null,
      grouped("FN", listGroup(plural("FN", own.length), own.sort(byKeyLabel), keyItem)),
      grouped("callers", listGroup("Callers by scope", callers, boxCallItem("called by"))),
      grouped("callees", listGroup("Callees by scope", callees, boxCallItem("calls"))),
      grouped("RQ", listGroup(plural("RQ", cited.length), cited, keyItem, "RQ"))].filter(Boolean)));
    applyTagFilter();
  }

  // The calls into and out of a box's functions, by the box of the other end at the box's own level, with their
  // call-site counts; calls among its own functions are left out.
  function boxCalls(box, members) {
    const level = box.box === CLASS_KIND ? DETAIL.class : DETAIL.namespace;
    const inside = new Set(members);
    const tally = (list) => {
      const counts = new Map();
      for (const c of list) {
        const other = calls.index.get(c.key);
        if (inside.has(other)) continue;
        const key = boxes.of(other, level);
        counts.set(key, (counts.get(key) || 0) + c.lines.length);
      }
      return [...counts].map(([key, count]) => ({ key, count })).sort((a, b) => byKeyLabel(a.key, b.key));
    };
    return { callers: tally(members.flatMap((i) => calls.callers(i))), callees: tally(members.flatMap((i) => calls.callees(i))) };
  }

  function boxCallItem(rel) {
    return ({ key, count }) => el("li", { class: "link-item" }, idButton(key),
      el("span", { class: "link-rel", text: `${rel} · ${count} ${count === 1 ? VALUE_CALL_SITE : VALUE_CALL_SITES}` }));
  }

  function callItem(c, rel) {
    const sites = c.lines.map((line) => `L${line}`).join(" · ");
    return el("li", { class: "link-item" }, idButton(c.key),
      richTip(el("span", { class: "link-rel" }, `${rel} · ${sites} `,
        c.ambiguous ? el("span", { class: "badge badge-warn", text: VALUE_AMBIGUOUS }) : null),
      () => ({ head: c.ambiguous ? "Ambiguous call" : "Call sites", lines: [`Lines of the call in the caller: ${sites}`,
        c.ambiguous ? "The name matches several definitions; the analysis cannot tell which one is called" : ""] })));
  }

  function linkGroup(type, byKey) {
    const items = [...byKey.entries()].sort((a, b) => nodes.get(a[0]).label.localeCompare(nodes.get(b[0]).label, undefined, { numeric: true }));
    return el("section", { class: "group", "data-group": type },
      el("div", { class: "group-head" }, el("h3", { class: "group-title" }, el("span", { class: `dot t-${type}` }), plural(type, items.length)),
        el("span", { class: "group-count", text: items.length })),
      el("ul", { class: "group-items" }, ...items.map(([key, list]) => {
        const n = nodes.get(key);
        const rel = unique(list.map((l) => RELATION[`${l.kind}:${l.dir}`])).join(", ");
        const lines = list.flatMap((l) => l.lines);
        return el("li", { class: "link-item" }, idButton(key), el("span", { class: "link-rel", text: rel }),
          n.title ? el("span", { class: "link-title", text: n.title }) : null,
          lines.length ? evidence(lines) : null);
      })));
  }

  function evidence(lines) {
    const box = el("div", { class: "evidence" });
    const draw = (all) => {
      clear(box).append(...(all ? lines : lines.slice(0, EVIDENCE_SHOWN)).map(([no, text]) => el("div", { class: "evidence-line" },
        el("span", { class: "evidence-no", text: `L${no}` }), el("span", { class: "evidence-text", text }))));
      if (!all && lines.length > EVIDENCE_SHOWN) {
        box.append(el("button", { class: "link-button", type: "button", text: `${lines.length - EVIDENCE_SHOWN} more lines`,
          on: { click: () => draw(true) } }));
      }
    };
    draw(false);
    return box;
  }

  function copy(text) {
    navigator.clipboard?.writeText(text).catch(() => undefined);
  }

  // ---- selection, views, history ------------------------------------------------------------------------------
  // An element, file or function of the model, a box of the call graph, or a commit.
  const isKey = (key) => nodes.has(key) || Boolean(boxes.get(key)) || historyView.known(key);

  function hashKey() {
    const raw = decodeURIComponent(location.hash.slice(1));
    return isKey(raw) ? raw : null;
  }

  // "#view=<name>" names a tab the page shows; no list of names, so a new view is linkable
  const VIEW_FRAGMENT = "view=";
  function hashView() {
    const raw = decodeURIComponent(location.hash.slice(1));
    if (!raw.startsWith(VIEW_FRAGMENT)) return null;
    const name = raw.slice(VIEW_FRAGMENT.length);
    const tab = [...document.querySelectorAll(".tab")].find((candidate) => candidate.dataset.view === name);
    return tab && !tab.hidden ? name : null;
  }

  function select(key, options) {
    if (!isKey(key)) return;
    const fromHistory = options?.fromHistory;
    state.selected = key;
    renderDetail();
    for (const tr of $("matrix-table").querySelectorAll("tbody tr")) tr.classList.toggle("selected", tr.dataset.key === key);
    if (!isCommitKey(key)) graph.select(key);
    historyView.markCommit(key);
    const hash = `#${encodeURIComponent(key)}`;
    if (!fromHistory && location.hash !== hash) history.pushState({ key }, "", hash);
  }

  // ---- help: the guide of the current tab, the others a choice away ----
  function setupHelp() {
    const dialog = $("help-dialog");
    const hiddenTab = (topic) => document.querySelector(`.tab[data-view="${topic}"]`)?.hidden;
    for (const part of dialog.querySelectorAll("[data-help]")) if (hiddenTab(part.dataset.help)) part.remove();
    if (!CALL_GRAPH) for (const part of dialog.querySelectorAll('[data-needs="call-graph"]')) part.remove();
    const guides = [...dialog.querySelectorAll("[data-help]")];
    const show = (topic) => {
      for (const part of guides) part.hidden = part.dataset.help !== topic;
      for (const b of $("help-list").children) {
        if (b.dataset.topic === topic) b.setAttribute("aria-current", VALUE_TRUE);
        else b.removeAttribute("aria-current");
      }
      $("help-body").scrollTop = 0;
    };
    $("help-list").append(...guides.map((part) => el(TAG_BUTTON, { class: "help-topic", type: TAG_BUTTON, "data-topic": part.dataset.help,
      text: part.dataset.title, on: { [EVENT_CLICK]: () => show(part.dataset.help) } })));
    $("help-button").addEventListener(EVENT_CLICK, () => { show(state.view); dialog.showModal(); });
    $("help-close").addEventListener(EVENT_CLICK, () => dialog.close());   // the browser returns the focus to the button
  }

  function showView(view) {
    state.view = view;
    for (const tab of document.querySelectorAll(".tab")) tab.setAttribute("aria-selected", String(tab.dataset.view === view));
    for (const section of document.querySelectorAll(".view")) section.hidden = section.id !== `view-${view}`;
    if (view === "graph") graph.show();
    if (view === HISTORY_VIEW) historyView.show();
    if (view === DELIVERY_VIEW) deliveryView.show();
  }

  document.querySelector(".tabs").addEventListener("click", (event) => {
    const tab = event.target.closest(".tab");
    if (tab) showView(tab.dataset.view);
  });

  function followHash() {
    const view = hashView();
    if (view) { showView(view); return; }
    const key = hashKey();
    if (key) select(key, { fromHistory: true });
  }
  window.addEventListener("popstate", followHash);
  window.addEventListener("hashchange", followHash);

  // ---- resizable panels ------------------------------------------------
  const PANELS_KEY = "agnos-perf-center-panels";
  const PANEL = {
    left: { bar: "split-left", property: "--sidebar-size", data: "sidebarWidth", base: "--c-sidebar-width",
      min: "--c-sidebar-min-width", max: "--c-sidebar-max-width", grow: "ArrowRight" },
    right: { bar: "split-right", property: "--detail-size", data: "detailWidth", base: "--c-detail-width",
      min: "--c-detail-min-width", max: "--c-detail-max-width", grow: "ArrowLeft" },
  };

  function setupPanels() {
    const app = $("app");
    const css = (name) => Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
    const widths = {};
    const current = (side) => widths[side] ?? css(PANEL[side].base);

    // A panel stays between its own limits, and never takes the room the main area needs.
    function clamp(side, value) {
      const other = side === "left" ? "right" : "left";
      const room = app.clientWidth - current(other) - 2 * css("--c-splitter-width") - css("--c-main-min-width");
      return Math.round(Math.max(css(PANEL[side].min), Math.min(value, css(PANEL[side].max), room)));
    }

    function apply() {
      for (const side of Object.keys(PANEL)) {
        const p = PANEL[side];
        if (widths[side] === undefined) app.style.removeProperty(p.property);
        else app.style.setProperty(p.property, `${widths[side]}px`);
        const width = String(Math.round(current(side)));
        app.dataset[p.data] = width;
        $(p.bar).setAttribute("aria-valuenow", width);
      }
      graph.resize();
    }

    function save() {
      try { localStorage.setItem(PANELS_KEY, JSON.stringify(widths)); } catch (error) { /* storage unavailable: the widths last this visit */ }
    }

    function set(side, value) {
      widths[side] = clamp(side, value);
      apply();
      save();
    }

    function drag(side, bar, event) {
      event.preventDefault();
      bar.setPointerCapture(event.pointerId);
      bar.classList.add("dragging");
      app.classList.add("resizing");
      const box = app.getBoundingClientRect();
      const move = (e) => set(side, side === "left" ? e.clientX - box.left : box.right - e.clientX);
      const end = () => {
        bar.removeEventListener("pointermove", move);
        bar.removeEventListener("pointerup", end);
        bar.removeEventListener("pointercancel", end);
        bar.classList.remove("dragging");
        app.classList.remove("resizing");
      };
      bar.addEventListener("pointermove", move);
      bar.addEventListener("pointerup", end);
      bar.addEventListener("pointercancel", end);
    }

    try { Object.assign(widths, JSON.parse(localStorage.getItem(PANELS_KEY) || "{}")); } catch (error) { /* no storage */ }
    for (const side of Object.keys(PANEL)) {
      const p = PANEL[side];
      const bar = $(p.bar);
      bar.setAttribute("aria-valuemin", String(css(p.min)));
      bar.setAttribute("aria-valuemax", String(css(p.max)));
      bar.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        const step = css("--c-splitter-step");
        set(side, current(side) + (event.key === p.grow ? step : -step));
      });
      bar.addEventListener("dblclick", () => { delete widths[side]; apply(); save(); });
      bar.addEventListener("pointerdown", (event) => drag(side, bar, event));
      if (widths[side] !== undefined) widths[side] = clamp(side, widths[side]);
    }
    apply();
  }

  // ---- theme --------------------------------------------------------------------------------------------------
  const THEME_KEY = "agnos-perf-center-theme";
  function effectiveTheme() {
    const set = document.documentElement.dataset.theme;
    if (set) return set;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(THEME_KEY, theme); } catch (error) { /* storage unavailable: the choice lasts this visit */ }
    graph.restyle();
    redrawLibraryCharts();
  }
  function restoreTheme() {
    try { const saved = localStorage.getItem(THEME_KEY); if (saved) document.documentElement.dataset.theme = saved; } catch (error) { /* no storage */ }
  }
  restoreTheme();
  $("theme-toggle").addEventListener("click", () => applyTheme(effectiveTheme() === "dark" ? "light" : "dark"));
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { graph.restyle(); redrawLibraryCharts(); });

  // ---- start --------------------------------------------------------------------------------------------------
  function openInitialView() {
    const view = hashView();   // A named view first, else the element of, else the default view
    if (view) { showView(view); return; }
    const initial = hashKey();
    if (initial) { select(initial, { fromHistory: true }); showView("graph"); } else showView("overview");
  }

  window.agnosTrace = { nodes, links, calls, csvText, EDGE_LOOK, state, select, showView, graph, el, $, clear, isVisible, TYPE_NAME, NODE_TYPES,
    FILE_PREFIX, renderQuality, historyView, delivery: DELIVERY ? deliveryApi : null, deliveryCsv,
    libraryChart, chartTheme, redrawLibraryCharts, radarPointed: () => radarPointed?.key || null, licenceTones: LICENCE_TONE };
  renderHeader();
  renderLicences();
  renderFilters();
  renderOverview();
  renderMatrix();
  renderQuality();
  renderDetail();
  setupPanels();
  document.querySelector(`.tab[data-view="${DELIVERY_VIEW}"]`).hidden = !DELIVERY;
  setupHelp();
  openInitialView();
  const readyMs = Math.round(performance.now());   // since the navigation started, the page's parsing included
  Object.assign(document.documentElement.dataset, { ready: "true", readyMs: String(readyMs) });
  console.info(`agnos-perf-center: interactive ${readyMs} ms after opening, script ${Math.round(readyMs - STARTED)} ms`);
})();
