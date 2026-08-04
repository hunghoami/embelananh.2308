/* ==========================================================================
   REALISTIC SPARKLER AUDIO & SYNCHRONIZED SOUND EFFECTS ENGINE (v11.0)
   ========================================================================== */

class AudioManager {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.isInitialized = false;
        this.bgMusicTimer = null;
    }

    init() {
        if (this.isInitialized) return;
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
            this.isInitialized = true;
            console.log("🔊 Realistic Sparkler Audio Engine Initialized");
        } catch (e) {
            console.warn("AudioContext init error", e);
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stopBackgroundMusic();
        } else {
            this.startBackgroundMusic();
        }
        return this.isMuted;
    }

    // ----------------------------------------------------------------------
    // 1. HAPPY BIRTHDAY BACKGROUND MUSIC (CELESTIAL MUSIC BOX)
    // ----------------------------------------------------------------------
    startBackgroundMusic() {
        if (this.isMuted) return;
        this.init();
        
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        if (this.bgMusicTimer) return;

        const melody = [
            { notes: [261.63, 130.81], dur: 400 },
            { notes: [261.63], dur: 400 },
            { notes: [293.66, 146.83], dur: 800 },
            { notes: [261.63], dur: 800 },
            { notes: [349.23, 174.61], dur: 800 },
            { notes: [329.63, 164.81], dur: 1200 },

            { notes: [261.63, 130.81], dur: 400 },
            { notes: [261.63], dur: 400 },
            { notes: [293.66, 146.83], dur: 800 },
            { notes: [261.63], dur: 800 },
            { notes: [392.00, 196.00], dur: 800 },
            { notes: [349.23, 174.61], dur: 1200 },

            { notes: [261.63, 130.81], dur: 400 },
            { notes: [261.63], dur: 400 },
            { notes: [523.25, 261.63], dur: 800 },
            { notes: [440.00, 220.00], dur: 800 },
            { notes: [349.23, 174.61], dur: 800 },
            { notes: [329.63, 164.81], dur: 800 },
            { notes: [293.66, 146.83], dur: 1000 },

            { notes: [466.16, 233.08], dur: 400 },
            { notes: [466.16], dur: 400 },
            { notes: [440.00, 220.00], dur: 800 },
            { notes: [349.23, 174.61], dur: 800 },
            { notes: [392.00, 196.00], dur: 800 },
            { notes: [349.23, 174.61], dur: 1600 }
        ];

        let index = 0;
        const playStep = () => {
            if (this.isMuted || !this.isInitialized) return;

            const step = melody[index];
            step.notes.forEach((freq, i) => {
                this.playPolyphonicNote(freq, step.dur / 1000, i === 0 ? 0.22 : 0.1);
            });

            index = (index + 1) % melody.length;
            this.bgMusicTimer = setTimeout(playStep, step.dur + 50);
        };

        playStep();
    }

    stopBackgroundMusic() {
        if (this.bgMusicTimer) {
            clearTimeout(this.bgMusicTimer);
            this.bgMusicTimer = null;
        }
    }

    playPolyphonicNote(freq, duration, volume = 0.15) {
        if (this.isMuted || !this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

            gain.gain.setValueAtTime(0, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration * 1.2);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + duration * 1.2);
        } catch (e) {
            console.error("Polyphonic note error", e);
        }
    }

    // ----------------------------------------------------------------------
    // 2. REALISTIC SPARKLER / FIREWORK CRACKLE SOUND GENERATOR (PHÁO BÔNG CHÂN THỰC)
    // ----------------------------------------------------------------------
    playRealisticSparklerCrackle() {
        if (this.isMuted || !this.ctx) return;

        try {
            // Generate crackling fizz & popping sparks using noise grain spikes
            const duration = 0.6;
            const bufferSize = this.ctx.sampleRate * duration;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);

            for (let i = 0; i < bufferSize; i++) {
                // Rapid crackle grain impulse spikes
                if (Math.random() < 0.12) {
                    data[i] = (Math.random() * 2 - 1) * (0.8 + Math.random() * 0.2);
                } else {
                    data[i] = (Math.random() * 2 - 1) * 0.05;
                }
            }

            const noiseSource = this.ctx.createBufferSource();
            noiseSource.buffer = buffer;

            // Bandpass filter for crisp sparkler fizzling frequency (3000Hz - 6000Hz)
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(4500, this.ctx.currentTime);
            filter.Q.setValueAtTime(2.5, this.ctx.currentTime);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

            noiseSource.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            noiseSource.start();
        } catch (e) {
            console.error("Realistic sparkler audio error", e);
        }
    }

    // Candle Blow Out Puff
    playCandleBlow() {
        if (this.isMuted || !this.ctx) return;

        try {
            const bufferSize = this.ctx.sampleRate * 0.4;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(600, this.ctx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.4);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            noise.start();
        } catch (e) {
            console.error("Candle blow SFX error", e);
        }
    }

    // Magic Chime
    playMagicChime() {
        if (this.isMuted || !this.ctx) return;
        const arpeggio = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        arpeggio.forEach((freq, idx) => {
            setTimeout(() => {
                this.playPolyphonicNote(freq, 0.45, 0.18);
            }, idx * 65);
        });
    }

    // Card Unfold / Page Flip
    playCardUnfold() {
        if (this.isMuted || !this.ctx) return;
        this.playPolyphonicNote(450, 0.15, 0.12);
        setTimeout(() => this.playPolyphonicNote(900, 0.3, 0.15), 90);
    }
}

// Global Audio Instance
window.audioMgr = new AudioManager();
