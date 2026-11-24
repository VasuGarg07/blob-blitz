import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { RegExpMatcher, englishDataset, englishRecommendedTransformers } from 'obscenity';

const load = createRequire(import.meta.url);
const matcher = new RegExpMatcher({ ...englishDataset.build(), ...englishRecommendedTransformers });
const blocked = new Set(load('naughty-words/en.json'));
const missedByFilters = /^(molest|prostitut|brothel|whoreh|boner|gook|wetback|bimbo|cripple|midget|suicid|lynch|genocid|genital|erecti|erotic|testic|scrot|sodom|condoms?$|bugger|crap(s|p|$)|fart(s|ed|ing|$)|damn|pimp(s|ed|ing|$)|penile|rectum|retard|queers)/;
const isPlayable = (word) => /^[a-z]{3,12}$/.test(word) && !missedByFilters.test(word) && !blocked.has(word) && !matcher.hasMatch(word);
const tier = (...levels) => levels.flatMap((level) => load(`wordlist-english/english-words-${level}.json`)).filter(isPlayable);

const bank = { common: tier(10, 20), familiar: tier(35), rare: tier(40, 50) };
writeFileSync(new URL('../src/word-bank.json', import.meta.url), JSON.stringify(bank));
for (const [name, words] of Object.entries(bank)) console.log(name, words.length);
