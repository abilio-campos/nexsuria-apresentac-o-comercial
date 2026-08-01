import { useEffect, useSyncExternalStore } from "react";

export type NavItem = { to: string; label: string; group?: string };

export const DEFAULT_NAV: NavItem[] = [
  { to: "/", label: "Home", group: "Empresa" },
  { to: "/quem-somos", label: "Quem Somos", group: "Empresa" },
  { to: "/metodologia", label: "Metodologia", group: "Empresa" },
  { to: "/equipe", label: "Quem Estará ao seu Lado", group: "Empresa" },
  { to: "/solucoes", label: "Soluções", group: "Ofertas" },
  { to: "/ecossistema", label: "Ecossistema", group: "Ofertas" },
  { to: "/ia", label: "Inteligência Artificial", group: "Ofertas" },
  { to: "/diferenciais", label: "Diferenciais", group: "Provas" },
  { to: "/casos-de-uso", label: "Casos de Uso", group: "Provas" },
  { to: "/percepcoes", label: "Percepções do Cliente", group: "Fechamento" },
  { to: "/contato", label: "Contato", group: "Fechamento" },
];

export type NavCfg = {
  order: string[];
  hidden: string[];
  labels: Record<string, string>;
};

export type MarkCategory = "pain" | "opportunity" | "neutral";
export type Mark = {
  label: string;
  page: string;
  category: MarkCategory;
  note?: string;
  ts: number;
};
export type Perceptions = {
  company: string;
  contact: string;
  painsFree: string;
  opportunitiesFree: string;
  notes: string;
};

export type VisitEntry = {
  id: string;
  departamento: string;
  responsavel: string;
  dores: string;
  oportunidades: string;
};

export const DEPARTAMENTO_SUGGESTIONS = [
  "Diretoria",
  "Financeiro",
  "Fiscal / Tributário",
  "Contábil",
  "Controladoria",
  "RH / DP",
  "SST",
  "TI",
  "Comercial",
  "Operações",
  "Suprimentos",
  "Manutenção / Ativos",
  "Jurídico",
];

export type ElStyle = {
  bg?: string;
  color?: string;
  w?: number;
  h?: number;
  fixedH?: boolean;
  radius?: number;
  pad?: number;
  fs?: number;
  bold?: boolean;
  border?: string;
  borderW?: number;
  hidden?: boolean;
};

type State = {
  nav: NavCfg;
  texts: Record<string, string>;
  textColors: Record<string, string>;
  listOrders: Record<string, string[]>;
  listHidden: Record<string, string[]>;
  positions: Record<string, { x: number; y: number }>;
  sizes: Record<string, { w?: number; h?: number; fixedH?: boolean }>;
  elStyles: Record<string, ElStyle>;
  spacers: Record<string, number[]>;
  btnScale: "p" | "m" | "g" | "gg";
  editMode: boolean;
  theme: { primary?: string; foreground?: string };
  marks: Record<string, Mark>;
  perceptions: Perceptions;
  visitEntries: VisitEntry[];
};

const KEY = "nx-portal-v1";
const initial: State = {
  nav: { order: DEFAULT_NAV.map((n) => n.to), hidden: [], labels: {} },
  texts: {},
  textColors: {},
  listOrders: {},
  listHidden: {},
  positions: {},
  sizes: {},
  elStyles: {},
  spacers: {},
  btnScale: "m",
  editMode: false,
  theme: {},
  marks: {},
  perceptions: { company: "", contact: "", painsFree: "", opportunitiesFree: "", notes: "" },
  visitEntries: [],
};


let state: State = initial;
const listeners = new Set<() => void>();
let hydrated = false;

function load() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      state = {
        ...initial,
        ...parsed,
        nav: { ...initial.nav, ...(parsed.nav || {}) },
        texts: { ...(parsed.texts || {}) },
        textColors: { ...(parsed.textColors || {}) },
        listOrders: { ...(parsed.listOrders || {}) },
        listHidden: { ...(parsed.listHidden || {}) },
        positions: { ...(parsed.positions || {}) },
        sizes: { ...(parsed.sizes || {}) },
        elStyles: { ...(parsed.elStyles || {}) },
        spacers: { ...(parsed.spacers || {}) },

        btnScale: (parsed.btnScale as State["btnScale"]) || "m",
        theme: { ...(parsed.theme || {}) },
        marks: { ...(parsed.marks || {}) },
        perceptions: { ...initial.perceptions, ...(parsed.perceptions || {}) },
        visitEntries: Array.isArray(parsed.visitEntries) ? parsed.visitEntries : [],
        editMode: false,
      };
    }
  } catch {}
}
// Do NOT call load() at module init: it would diverge the first client
// render from SSR (which sees `initial`) and cause hydration/hook mismatches.
// It is invoked from usePortalStore() inside an effect after mount.

function persist() {
  if (typeof window === "undefined") return;
  const { editMode: _e, ...rest } = state;
  void _e;
  localStorage.setItem(KEY, JSON.stringify(rest));
}

function set(next: Partial<State>) {
  state = { ...state, ...next };
  persist();
  listeners.forEach((l) => l());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
function getSnapshot() {
  return hydrated ? state : initial;
}
function getServerSnapshot() {
  return initial;
}

export function usePortalStore(): State {
  const s = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  useEffect(() => {
    if (!hydrated) {
      load();
      hydrated = true;
      listeners.forEach((l) => l());
    }
  }, []);
  return s;
}

export const portal = {
  toggleEdit() {
    set({ editMode: !state.editMode });
  },
  setText(key: string, value: string) {
    set({ texts: { ...state.texts, [key]: value } });
  },
  resetText(key: string) {
    const t = { ...state.texts };
    delete t[key];
    set({ texts: t });
  },
  setTextColor(key: string, hex: string | null) {
    const c = { ...state.textColors };
    if (hex) c[key] = hex;
    else delete c[key];
    set({ textColors: c });
  },
  moveListItem(listId: string, itemId: string, dir: -1 | 1, defaults: string[]) {
    const current = state.listOrders[listId] ?? defaults.slice();
    const order = current.filter((x) => defaults.includes(x));
    defaults.forEach((d) => {
      if (!order.includes(d)) order.push(d);
    });
    const idx = order.indexOf(itemId);
    if (idx < 0) return;
    const j = idx + dir;
    if (j < 0 || j >= order.length) return;
    [order[idx], order[j]] = [order[j], order[idx]];
    set({ listOrders: { ...state.listOrders, [listId]: order } });
  },
  toggleListHidden(listId: string, itemId: string) {
    const cur = state.listHidden[listId] ?? [];
    const next = cur.includes(itemId) ? cur.filter((x) => x !== itemId) : [...cur, itemId];
    set({ listHidden: { ...state.listHidden, [listId]: next } });
  },
  toggleHidden(to: string) {
    const hidden = state.nav.hidden.includes(to)
      ? state.nav.hidden.filter((x) => x !== to)
      : [...state.nav.hidden, to];
    set({ nav: { ...state.nav, hidden } });
  },
  setLabel(to: string, label: string) {
    const labels = { ...state.nav.labels };
    if (label && label !== DEFAULT_NAV.find((n) => n.to === to)?.label) labels[to] = label;
    else delete labels[to];
    set({ nav: { ...state.nav, labels } });
  },
  moveNav(to: string, dir: -1 | 1) {
    const order = getOrder();
    const idx = order.indexOf(to);
    if (idx < 0) return;
    const j = idx + dir;
    if (j < 0 || j >= order.length) return;
    [order[idx], order[j]] = [order[j], order[idx]];
    set({ nav: { ...state.nav, order } });
  },
  resetAll() {
    state = { ...initial };
    persist();
    listeners.forEach((l) => l());
  },
  setThemeColor(kind: "primary" | "foreground", hex: string | null) {
    const theme = { ...state.theme };
    if (hex) theme[kind] = hex;
    else delete theme[kind];
    set({ theme });
  },
  setPosition(id: string, pos: { x: number; y: number } | null) {
    const positions = { ...state.positions };
    if (pos && (pos.x !== 0 || pos.y !== 0)) positions[id] = pos;
    else delete positions[id];
    set({ positions });
  },
  setSize(id: string, size: { w?: number; h?: number } | null) {
    const sizes = { ...state.sizes };
    if (size && (size.w != null || size.h != null)) sizes[id] = size;
    else delete sizes[id];
    set({ sizes });
  },
  patchElStyle(id: string, patch: Partial<ElStyle>) {
    const cur = state.elStyles[id] ?? {};
    const next: ElStyle = { ...cur, ...patch };
    (Object.keys(next) as (keyof ElStyle)[]).forEach((k) => {
      const v = next[k];
      if (v === undefined || v === null || v === "" || v === false) delete next[k];
    });
    const elStyles = { ...state.elStyles };
    if (Object.keys(next).length === 0) delete elStyles[id];
    else elStyles[id] = next;
    set({ elStyles });
  },
  clearElStyle(id: string) {
    const elStyles = { ...state.elStyles };
    delete elStyles[id];
    set({ elStyles });
  },
  addSpacer(path: string, height = 120) {
    const cur = state.spacers[path] ?? [];
    set({ spacers: { ...state.spacers, [path]: [...cur, height] } });
  },
  setSpacerHeight(path: string, index: number, height: number) {
    const cur = (state.spacers[path] ?? []).slice();
    if (index < 0 || index >= cur.length) return;
    cur[index] = Math.max(8, Math.round(height));
    set({ spacers: { ...state.spacers, [path]: cur } });
  },
  removeSpacer(path: string, index: number) {
    const cur = (state.spacers[path] ?? []).filter((_, i) => i !== index);
    const spacers = { ...state.spacers };
    if (cur.length === 0) delete spacers[path];
    else spacers[path] = cur;
    set({ spacers });
  },
  setBtnScale(scale: State["btnScale"]) {
    set({ btnScale: scale });
  },

  moveNavTo(to: string, targetIndex: number) {
    const order = getOrder();
    const from = order.indexOf(to);
    if (from < 0 || targetIndex < 0 || targetIndex >= order.length) return;
    order.splice(targetIndex, 0, order.splice(from, 1)[0]);
    set({ nav: { ...state.nav, order } });
  },
  toggleMark(id: string, meta: { label: string; page: string }) {
    const marks = { ...state.marks };
    if (marks[id]) delete marks[id];
    else marks[id] = { label: meta.label, page: meta.page, category: "pain", ts: Date.now() };
    set({ marks });
  },
  setMarkCategory(id: string, category: MarkCategory) {
    if (!state.marks[id]) return;
    set({ marks: { ...state.marks, [id]: { ...state.marks[id], category } } });
  },
  setMarkNote(id: string, note: string) {
    if (!state.marks[id]) return;
    set({ marks: { ...state.marks, [id]: { ...state.marks[id], note } } });
  },
  clearMark(id: string) {
    const marks = { ...state.marks };
    delete marks[id];
    set({ marks });
  },
  clearAllMarks() {
    set({ marks: {}, perceptions: initial.perceptions, visitEntries: [] });
  },
  setPerception<K extends keyof Perceptions>(field: K, value: Perceptions[K]) {
    set({ perceptions: { ...state.perceptions, [field]: value } });
  },
  addVisitEntry() {
    if (state.visitEntries.length >= 15) return;
    const entry: VisitEntry = {
      id: `v_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      departamento: "",
      responsavel: "",
      dores: "",
      oportunidades: "",
    };
    set({ visitEntries: [...state.visitEntries, entry] });
  },
  updateVisitEntry(id: string, patch: Partial<Omit<VisitEntry, "id">>) {
    set({
      visitEntries: state.visitEntries.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    });
  },
  removeVisitEntry(id: string) {
    set({ visitEntries: state.visitEntries.filter((e) => e.id !== id) });
  },
  // Used by PortalSync to hydrate state from the database after login.
  replaceState(patch: Partial<State>) {
    state = {
      ...state,
      ...patch,
      nav: { ...state.nav, ...(patch.nav || {}) },
      texts: { ...state.texts, ...(patch.texts || {}) },
      textColors: { ...state.textColors, ...(patch.textColors || {}) },
      listOrders: { ...state.listOrders, ...(patch.listOrders || {}) },
      listHidden: { ...state.listHidden, ...(patch.listHidden || {}) },
      positions: { ...state.positions, ...(patch.positions || {}) },
      sizes: { ...state.sizes, ...(patch.sizes || {}) },
      elStyles: { ...state.elStyles, ...(patch.elStyles || {}) },
      spacers: { ...state.spacers, ...(patch.spacers || {}) },

      btnScale: patch.btnScale ?? state.btnScale,
      theme: { ...state.theme, ...(patch.theme || {}) },
      perceptions: { ...state.perceptions, ...(patch.perceptions || {}) },
      marks: { ...state.marks, ...(patch.marks || {}) },
      visitEntries: Array.isArray(patch.visitEntries) ? patch.visitEntries : state.visitEntries,
    };
    persist();
    listeners.forEach((l) => l());
  },
};

function getOrder(): string[] {
  const known = new Set(DEFAULT_NAV.map((n) => n.to));
  const kept = state.nav.order.filter((t) => known.has(t));
  const missing = DEFAULT_NAV.map((n) => n.to).filter((t) => !kept.includes(t));
  return [...kept, ...missing];
}

export function getResolvedNav(s: State): (NavItem & { hidden: boolean })[] {
  const byTo = new Map(DEFAULT_NAV.map((n) => [n.to, n]));
  const order = getOrder();
  return order.map((to) => {
    const base = byTo.get(to)!;
    return {
      ...base,
      label: s.nav.labels[to] ?? base.label,
      hidden: s.nav.hidden.includes(to),
    };
  });
}

// Registry of text keys used across pages (for admin listing)
const registered = new Map<string, string>(); // key -> default
const regListeners = new Set<() => void>();
export function registerText(key: string, def: string) {
  if (registered.get(key) !== def) {
    registered.set(key, def);
    regListeners.forEach((l) => l());
  }
}
export function useRegisteredTexts() {
  return useSyncExternalStore(
    (cb) => {
      regListeners.add(cb);
      return () => regListeners.delete(cb);
    },
    () => registered,
    () => registered,
  );
}