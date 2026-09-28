// Web Audio & Devotional Narration Engine

class DevotionalAudioEngine {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;
  private intervalId: number | null = null;
  private currentTime: number = 0;
  private duration: number = 195;
  private playbackRate: number = 1;
  private volume: number = 0.85;
  private onTimeUpdateCallback: ((time: number, duration: number) => void) | null = null;
  private onStateChangeCallback: ((isPlaying: boolean) => void) | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private ambientOscillators: OscillatorNode[] = [];
  private currentScript: string = '';

  constructor() {
    // Lazy initialize on user interaction
  }

  private initAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 64;
        this.gainNode = this.audioCtx.createGain();
        this.gainNode.gain.value = this.volume;
        this.gainNode.connect(this.audioCtx.destination);
        this.analyser.connect(this.gainNode);
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public setCallbacks(
    onTimeUpdate: (time: number, duration: number) => void,
    onStateChange: (isPlaying: boolean) => void
  ) {
    this.onTimeUpdateCallback = onTimeUpdate;
    this.onStateChangeCallback = onStateChange;
  }

  public loadDevotional(durationSec: number, script: string) {
    this.stop();
    this.currentTime = 0;
    this.duration = durationSec || 180;
    this.currentScript = script;
    if (this.onTimeUpdateCallback) {
      this.onTimeUpdateCallback(0, this.duration);
    }
  }

  public togglePlay(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public play() {
    this.initAudioContext();
    this.isPlaying = true;
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(true);
    }

    // Start ambient devotional chords
    this.startAmbientSound();

    // Start voice synthesis if supported
    this.startSpeechSynthesis();

    // Start timer progression
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = window.setInterval(() => {
      this.currentTime += 0.25 * this.playbackRate;
      if (this.currentTime >= this.duration) {
        this.stop();
      } else {
        if (this.onTimeUpdateCallback) {
          this.onTimeUpdateCallback(this.currentTime, this.duration);
        }
      }
    }, 250);
  }

  public pause() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.stopAmbientSound();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(false);
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.currentTime = 0;
    this.stopAmbientSound();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(false);
    }
    if (this.onTimeUpdateCallback) {
      this.onTimeUpdateCallback(0, this.duration);
    }
  }

  public seek(seconds: number) {
    this.currentTime = Math.max(0, Math.min(seconds, this.duration));
    if (this.onTimeUpdateCallback) {
      this.onTimeUpdateCallback(this.currentTime, this.duration);
    }
  }

  public setPlaybackRate(rate: number) {
    this.playbackRate = rate;
    if (this.currentUtterance && 'speechSynthesis' in window) {
      this.currentUtterance.rate = rate;
    }
  }

  public setVolume(vol: number) {
    this.volume = vol;
    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(vol, this.audioCtx ? this.audioCtx.currentTime : 0);
    }
  }

  private startAmbientSound() {
    if (!this.audioCtx || !this.analyser) return;

    this.stopAmbientSound();

    // Sacred warm organ / piano frequencies: C3 (130.81Hz), G3 (196Hz), E4 (329.63Hz)
    const freqs = [130.81, 196.00, 261.63, 329.63];
    const masterGain = this.audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
    masterGain.connect(this.analyser);

    freqs.forEach((f) => {
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const oscGain = this.audioCtx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, this.audioCtx.currentTime);
      
      // Gentle lfo modulation
      const lfo = this.audioCtx.createOscillator();
      lfo.frequency.setValueAtTime(0.2, this.audioCtx.currentTime);
      const lfoGain = this.audioCtx.createGain();
      lfoGain.gain.setValueAtTime(0.015, this.audioCtx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(oscGain.gain);

      oscGain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
      osc.connect(oscGain);
      oscGain.connect(masterGain);

      osc.start();
      lfo.start();
      this.ambientOscillators.push(osc, lfo);
    });
  }

  private stopAmbientSound() {
    this.ambientOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // ignore already stopped
      }
    });
    this.ambientOscillators = [];
  }

  private startSpeechSynthesis() {
    if (!('speechSynthesis' in window)) return;

    // If currently paused in speech synthesis, resume
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      return;
    }

    window.speechSynthesis.cancel();

    if (!this.currentScript) return;

    const utterance = new SpeechSynthesisUtterance(this.currentScript);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95 * this.playbackRate;
    utterance.pitch = 0.92; // Slightly deeper, warm pastoral timbre

    // Try to find a good Portuguese voice
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find(v => v.lang.includes('pt-BR') || v.lang.includes('pt')) || null;
    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    utterance.onend = () => {
      if (this.currentTime >= this.duration - 2) {
        this.stop();
      }
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public getWaveformData(): Uint8Array {
    if (!this.analyser) {
      return new Uint8Array(32);
    }
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }
}

export const devotionalAudio = new DevotionalAudioEngine();
