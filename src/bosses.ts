import { blob, eye } from './art';
import { INK, WHITE } from './colors';

export type Power = 'drift' | 'summon' | 'erase' | 'rewrite' | 'fade' | 'dash' | 'mirror' | 'censor';

export interface Boss {
  name: string;
  hint: string;
  powers: Power[];
  art: () => string;
  lines: string[];
}

interface Family {
  name: string;
  powers: Power[];
  art: (accent: string) => string;
  lines: string[];
}

interface Volume {
  title: string;
  powers: Power[];
  accent: string;
  behind: (accent: string) => string;
  front: (accent: string) => string;
}

const POWER_HINTS: Record<Power, string> = {
  drift: 'slides around',
  summon: 'calls more blots',
  erase: 'wipes the word on a mistake',
  rewrite: 'rewrites slow words',
  fade: 'fades its words',
  dash: 'dashes at you',
  mirror: 'flips its words',
  censor: 'hides letters',
};

const FAMILIES: Family[] = [
  {
    name: 'Smudge',
    powers: [],
    art: (accent) => `<path d="M62 28h44M66 48h56M62 68h40" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="${blob(14, 34, 40, 54)}" fill="${INK}"/>${eye(34, 44, 12, accent)}${eye(58, 40, 8, accent)}`,
    lines: ['who left a thumb on the page', 'the first page is already ruined', 'wash your hands before you draw', 'one dirty sleeve ruined the cover'],
  },
  {
    name: 'Coffee Ring',
    powers: ['drift'],
    art: (accent) => `<g fill="none"><circle cx="50" cy="50" r="36" stroke="${INK}" stroke-width="26"/><circle cx="50" cy="50" r="36" stroke="#8a4f24" stroke-width="18"/></g><circle cx="92" cy="90" r="7" fill="#8a4f24" stroke="${INK}" stroke-width="3"/>${eye(17, 40, 9, accent)}${eye(17, 60, 9, accent)}`,
    lines: ['who spilled coffee across the cover', 'nobody sleeps until the pages dry', 'one more cup before the sunrise', 'that mug was never on a coaster'],
  },
  {
    name: 'Shredder',
    powers: ['summon'],
    art: (accent) => `<path d="M18 56h9v38h-9zM34 56h9v28h-9zM50 56h9v40h-9zM66 56h9v30h-9z" fill="${WHITE}" stroke="${INK}" stroke-width="3"/><rect x="4" y="14" width="92" height="46" rx="7" fill="${INK}"/><path d="M10 60l8-10 8 10 8-10 8 10 8-10 8 10 8-10 8 10 8-10 8 10" fill="${accent}"/>${eye(30, 33, 10, accent)}${eye(62, 33, 10, accent)}`,
    lines: ['the shredder already ate chapter three', 'feed me your very best drawings', 'rejected pages make delicious snacks', 'there goes another week of work'],
  },
  {
    name: 'Eraser',
    powers: ['erase'],
    art: (accent) => `<g transform="rotate(-12 50 50)" stroke="${INK}" stroke-width="5"><rect x="4" y="24" width="92" height="52" rx="11" fill="#f08aa5"/><path d="M56 24h29a11 11 0 0 1 11 11v30a11 11 0 0 1-11 11H56z" fill="${accent}"/></g>${eye(22, 50, 9, INK)}${eye(42, 46, 9, INK)}<g fill="#f08aa5" stroke="${INK}" stroke-width="2"><circle cx="2" cy="84" r="4"/><circle cx="16" cy="92" r="3"/></g>`,
    lines: ['every careless mistake will vanish forever', 'start again and draw it properly', 'that line was never straight enough', 'nothing you sketch will ever last'],
  },
  {
    name: 'Editor',
    powers: ['rewrite'],
    art: (accent) => `<rect x="14" y="4" width="72" height="92" fill="${WHITE}" stroke="${INK}" stroke-width="5"/><path d="M26 64h48M26 74h40M26 84h46" stroke="${INK}" stroke-width="4"/><path d="M20 70l58-12M22 88l50-14M20 18l24 10M80 18l-24 10" stroke="${accent}" stroke-width="6" stroke-linecap="round"/>${eye(36, 40, 10, accent)}${eye(64, 40, 10, accent)}`,
    lines: ['your editor wants another dramatic twist', 'make the villain slightly more handsome', 'fans demand a bigger tournament arc', 'change the ending and the beginning'],
  },
  {
    name: 'Ghost Layer',
    powers: ['fade'],
    art: (accent) => `<path d="M14 94V46a36 36 0 0 1 72 0v48l-12-11-12 11-12-11-12 11-12-11z" fill="${WHITE}" stroke="${INK}" stroke-width="5" stroke-dasharray="9 5"/><g fill="${accent}" stroke="${INK}" stroke-width="3"><ellipse cx="34" cy="46" rx="8" ry="12"/><ellipse cx="58" cy="46" rx="8" ry="12"/><ellipse cx="46" cy="70" rx="6" ry="8"/></g>`,
    lines: ['you forgot to save that hidden layer', 'the final panel is completely blank', 'something moved behind the background', 'nobody remembers drawing this character'],
  },
  {
    name: 'Speed Line',
    powers: ['dash'],
    art: (accent) => `<path d="M-6 50L58 8l-8 26 52-12-38 28 38 28-52-12 8 26z" fill="${accent}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M96 40h24M92 50h40M96 60h24" stroke="${INK}" stroke-width="4"/>${eye(30, 43, 7, INK)}${eye(30, 58, 7, INK)}`,
    lines: ['there are far too many speed lines', 'nobody can outrun the next chapter', 'blink once and the fight is over', 'faster than your hand can follow'],
  },
  {
    name: 'Mirror Page',
    powers: ['mirror'],
    art: (accent) => `<g stroke="${INK}" stroke-width="5" stroke-linejoin="round"><path d="M50 0L-2 50l52 50z" fill="${WHITE}"/><path d="M50 0l52 50-52 50z" fill="${accent}"/></g><circle cx="27" cy="50" r="11" fill="${accent}"/><circle cx="73" cy="50" r="11" fill="${WHITE}"/><circle cx="24" cy="50" r="4" fill="${WHITE}"/><circle cx="76" cy="50" r="4" fill="${INK}"/>`,
    lines: ['somebody printed the whole volume backwards', 'your reflection draws better than you', 'read this page from right to left', 'left becomes right and right becomes wrong'],
  },
  {
    name: 'Censor Bar',
    powers: ['censor'],
    art: (accent) => `<g fill="${INK}"><rect x="10" y="4" width="82" height="22"/><rect x="-4" y="30" width="100" height="12"/><rect x="-4" y="58" width="104" height="12"/><rect x="8" y="74" width="80" height="22"/></g><rect x="4" y="40" width="88" height="20" fill="${WHITE}" stroke="${accent}" stroke-width="4"/>${eye(32, 50, 8, accent)}${eye(62, 50, 8, accent)}`,
    lines: ['this secret panel cannot be published', 'certain forbidden words must remain hidden', 'the truth was covered in black ink', 'you are not allowed to read this'],
  },
  {
    name: 'Deadline',
    powers: ['dash', 'summon'],
    art: (accent) => `<path d="${blob(26, 38, 64, 74)}" fill="${INK}"/><circle cx="50" cy="50" r="33" fill="${WHITE}" stroke="${accent}" stroke-width="5"/><path d="M50 22v6M78 50h-6M50 78v-6M22 50h6" stroke="${INK}" stroke-width="4"/><path d="M50 60V30M50 60l16 8" stroke="${accent}" stroke-width="5" stroke-linecap="round"/><path d="M28 34l14 6M72 34l-14 6" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>${eye(37, 48, 7, accent)}${eye(63, 48, 7, accent)}`,
    lines: ['the deadline is tonight and nothing is finished', 'finish the last page before midnight strikes', 'the printer is waiting for your pages', 'there is no time left to breathe'],
  },
];

const none = () => '';
const outline = `stroke="${INK}" stroke-width="4" stroke-linejoin="round"`;

const VOLUMES: Volume[] = [
  { title: '', powers: [], accent: '#d42a14', behind: none, front: none },
  { title: 'Horned', powers: ['drift'], accent: '#2459d6', behind: none, front: (accent) => `<path d="M22 12Q8-2 10-22Q28-12 40 4zM78 12Q92-2 90-22Q72-12 60 4z" fill="${accent}" ${outline}/>` },
  { title: 'Spiked', powers: ['dash'], accent: '#0d8a56', behind: (accent) => `<path d="${blob(40, 52, 92, 104)}" fill="${accent}" ${outline}/>`, front: none },
  { title: 'Bandaged', powers: ['fade'], accent: '#7a35c9', behind: none, front: () => `<path d="M0 74L96 88M4 10L100 22" stroke="${INK}" stroke-width="15"/><path d="M0 74L96 88M4 10L100 22" stroke="${WHITE}" stroke-width="9"/>` },
  { title: 'Royal', powers: ['summon'], accent: '#b3257f', behind: none, front: () => `<path d="M24 4l-6-30 18 14 14-22 14 22 18-14-6 30z" fill="#f2c230" ${outline}/>` },
  { title: 'Masked', powers: ['erase'], accent: '#0f7f94', behind: none, front: (accent) => `<path d="M8 22q42-16 84 0l-4 8q-38-12-76 0z" fill="${accent}" ${outline}/><path d="M90 22l30-12-8 14 14 8-34 2z" fill="${accent}" ${outline}/>` },
  { title: 'Winged', powers: ['mirror'], accent: '#c25a00', behind: (accent) => `<path d="M60 46Q80-30 134-20Q122-4 130 8Q116 16 120 32Q100 36 84 62zM40 46Q20-30-34-20Q-22-4-30 8Q-16 16-20 32Q0 36 16 62z" fill="${accent}" ${outline}/>`, front: none },
  { title: 'Haloed', powers: ['rewrite'], accent: '#3f4bd1', behind: none, front: () => `<ellipse cx="50" cy="-12" rx="34" ry="9" fill="none" stroke="${INK}" stroke-width="11"/><ellipse cx="50" cy="-12" rx="34" ry="9" fill="none" stroke="#f2c230" stroke-width="6"/>` },
  { title: 'Blazing', powers: ['censor'], accent: '#d6330b', behind: () => `<path d="M-14 92Q-30 40-4 10Q0 30 10 30Q12-20 44-42Q42-14 60-4Q70-20 68-34Q100-8 98 24Q106 20 108 8Q130 50 114 92z" fill="#f39a1d" ${outline}/>`, front: none },
  { title: 'Final', powers: ['dash', 'summon'], accent: '#111111', behind: () => `<path d="${blob(48, 60, 108, 124)}" fill="#f2c230" ${outline}/>`, front: (accent) => `<path d="M24 4l-6-30 18 14 14-22 14 22 18-14-6 30z" fill="${accent}" stroke="#f2c230" stroke-width="4"/>` },
];

export const VOLUME_SIZE = FAMILIES.length;

function makeBoss(family: Family, volume: Volume): Boss {
  const powers = [...new Set([...family.powers, ...volume.powers])];
  return {
    name: `${volume.title} ${family.name}`.trim(),
    hint: powers.length ? `It ${powers.map((power) => POWER_HINTS[power]).join(', ')}` : 'Just a very big blot',
    powers,
    art: () => volume.behind(volume.accent) + family.art(volume.accent) + volume.front(volume.accent),
    lines: family.lines,
  };
}

export const BOSSES = VOLUMES.flatMap((volume) => FAMILIES.map((family) => makeBoss(family, volume)));
