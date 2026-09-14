/** Audio 100% procedural con WebAudio. Sin assets. Respetuoso con autoplay: se desbloquea al primer gesto. */
class ProceduralAudio {
  private ctx: AudioContext | null = null;
  private muted = false;
  private lastPlay: Record<string, number> = {};

  setMuted(m: boolean): void {
    this.muted = m;
  }

  isMuted(): boolean {
    return this.muted;
  }

  /** Debe llamarse desde un gesto de usuario (click/tecla). */
  unlock(): void {
    try {
      if (!this.ctx) {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AC) return;
        this.ctx = new AC();
      }
      if (this.ctx.state === 'suspended') void this.ctx.resume();
    } catch {
      /* sin audio */
    }
  }

  private tone(freq: number, durMs: number, type: OscillatorType, vol: number, slideTo?: number, delayMs = 0): void {
    if (this.muted) return;
    try {
      this.unlock();
      if (!this.ctx) return;
      const t0 = this.ctx.currentTime + delayMs / 1000;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t0);
      if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t0 + durMs / 1000);
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + durMs / 1000);
      osc.connect(gain).connect(this.ctx.destination);
      osc.start(t0);
      osc.stop(t0 + durMs / 1000 + 0.02);
    } catch {
      /* noop */
    }
  }

  private gate(name: string, ms: number): boolean {
    const now = performance.now();
    if (now - (this.lastPlay[name] ?? 0) < ms) return false;
    this.lastPlay[name] = now;
    return true;
  }

  click(): void {
    this.tone(660, 60, 'square', 0.05);
  }
  jump(): void {
    if (!this.gate('jump', 60)) return;
    this.tone(300, 140, 'square', 0.06, 640);
  }
  doubleJump(): void {
    this.tone(420, 120, 'square', 0.06, 880);
  }
  dash(): void {
    if (!this.gate('dash', 120)) return;
    this.tone(900, 110, 'sawtooth', 0.045, 220);
  }
  coin(): void {
    if (!this.gate('coin', 50)) return;
    this.tone(950, 70, 'square', 0.05);
    this.tone(1420, 110, 'square', 0.05, undefined, 65);
  }
  power(): void {
    this.tone(520, 90, 'triangle', 0.08);
    this.tone(780, 90, 'triangle', 0.08, undefined, 85);
    this.tone(1040, 140, 'triangle', 0.08, undefined, 170);
  }
  stomp(): void {
    this.tone(500, 90, 'square', 0.07, 140);
  }
  hurt(): void {
    if (!this.gate('hurt', 200)) return;
    this.tone(220, 220, 'sawtooth', 0.08, 70);
  }
  checkpoint(): void {
    this.tone(740, 100, 'triangle', 0.07);
    this.tone(1108, 140, 'triangle', 0.07, undefined, 95);
  }
  win(): void {
    const seq = [523, 659, 784, 1046];
    seq.forEach((f, i) => this.tone(f, 160, 'triangle', 0.08, undefined, i * 120));
  }
  lose(): void {
    const seq = [392, 330, 262, 196];
    seq.forEach((f, i) => this.tone(f, 180, 'sawtooth', 0.06, undefined, i * 140));
  }
}

export const AudioBus = new ProceduralAudio();
