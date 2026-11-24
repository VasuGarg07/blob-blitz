export const byId = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;

export const stage = byId('stage');
export const hero = byId('hero');
export const input = byId<HTMLInputElement>('keys');
export const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
