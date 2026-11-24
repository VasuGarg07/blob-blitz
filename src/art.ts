import { WHITE } from './colors';

const between = (min: number, max: number) => min + Math.random() * (max - min);

export function blob(points: number, inner: number, outerMin: number, outerMax: number) {
  const ring = Array.from({ length: points }, (_, i) => {
    const angle = (i / points) * Math.PI * 2;
    const radius = i % 2 ? between(inner - 3, inner + 3) : between(outerMin, outerMax);
    return [50 + Math.cos(angle) * radius, 50 + Math.sin(angle) * radius];
  });
  const middle = (a: number[], b: number[]) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const curves = ring.map((point, i) => `Q${point} ${middle(point, ring[(i + 1) % points])}`);
  return `M${middle(ring[points - 1], ring[0])} ${curves.join(' ')}Z`;
}

export function eye(x: number, y: number, radius: number, color: string) {
  return `<circle cx="${x}" cy="${y}" r="${radius}" fill="${WHITE}"/><circle cx="${x - radius * 0.35}" cy="${y}" r="${radius * 0.42}" fill="${color}"/>`;
}
