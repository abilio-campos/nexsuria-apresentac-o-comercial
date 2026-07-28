import { usePortalStore, portal } from "./portal-store";

export function useOrderedList<T extends { slug?: string; id?: string }>(
  listId: string,
  items: T[],
  getId: (item: T) => string = (i) => (i.slug ?? i.id) as string,
) {
  const s = usePortalStore();
  const defaults = items.map(getId);
  const order = s.listOrders[listId] ?? defaults;
  const hidden = new Set(s.listHidden[listId] ?? []);
  const byId = new Map(items.map((i) => [getId(i), i] as const));
  const seq: string[] = [];
  order.forEach((id) => {
    if (byId.has(id) && !seq.includes(id)) seq.push(id);
  });
  defaults.forEach((id) => {
    if (!seq.includes(id)) seq.push(id);
  });
  const visible = seq.filter((id) => !hidden.has(id));
  return {
    editMode: s.editMode,
    all: seq.map((id) => byId.get(id)!),
    visible: visible.map((id) => byId.get(id)!),
    isHidden: (id: string) => hidden.has(id),
    move: (id: string, dir: -1 | 1) => portal.moveListItem(listId, id, dir, defaults),
    toggleHidden: (id: string) => portal.toggleListHidden(listId, id),
    getId,
  };
}