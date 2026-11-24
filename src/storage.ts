function read(key: string) {
  try {
    return Number(localStorage.getItem(key)) || 0;
  } catch {
    return 0;
  }
}

function write(key: string, value: number) {
  try {
    localStorage.setItem(key, String(value));
  } catch {}
}

export function saveBest(score: number) {
  const best = Math.max(read('best'), score);
  write('best', best);
  return best;
}

export const readCheckpoint = () => read('checkpoint') || 1;
export const saveCheckpoint = (chapter: number) => write('checkpoint', chapter);
