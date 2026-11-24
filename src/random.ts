export const pick = <T>(list: T[]) => list[Math.floor(Math.random() * list.length)];

export function shuffle<T>(list: T[]) {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
