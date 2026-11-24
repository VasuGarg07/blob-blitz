declare module 'zzfx' {
  export function zzfx(...parameters: number[]): AudioBufferSourceNode;
  export const ZZFX: { audioContext: AudioContext };
}
