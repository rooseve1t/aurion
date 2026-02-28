// TTS Service - Синтез речи с голосом Джарвиса
// Использует Web Audio API + эффекты для создания характерного голоса

interface TTSOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
}

class JarvisTTSService {
  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;

  constructor() {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  /**
   * Синтезирует текст в речь с эффектами Джарвиса
   * Использует встроенный Web Speech API + эффекты
   */
  async speak(text: string, options: TTSOptions = {}): Promise<void> {
    return new Promise((resolve) => {
      // Используем встроенный Speech Synthesis API
      const utterance = new SpeechSynthesisUtterance(text);

      // Параметры голоса для "Джарвиса"
      utterance.lang = 'ru-RU';
      utterance.rate = options.rate || 0.9; // Немного медленнее
      utterance.pitch = options.pitch || 0.8; // Ниже
      utterance.volume = options.volume || 1;

      // Пытаемся найти подходящий голос (мужской, русский)
      const voices = window.speechSynthesis.getVoices();
      const russianVoice = voices.find(v => v.lang.includes('ru') && v.name.includes('Male')) ||
                          voices.find(v => v.lang.includes('ru')) ||
                          voices[0];

      if (russianVoice) {
        utterance.voice = russianVoice;
      }

      // Добавляем эффект электронного голоса через Web Audio API
      utterance.onstart = () => {
        this.isPlaying = true;
        this.applyJarvisEffect();
      };

      utterance.onend = () => {
        this.isPlaying = false;
        resolve();
      };

      utterance.onerror = () => {
        this.isPlaying = false;
        resolve();
      };

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    });
  }

  /**
   * Применяет эффекты электронного голоса Джарвиса
   */
  private applyJarvisEffect(): void {
    if (!this.audioContext) return;

    try {
      // Создаём фильтр для эффекта электронного голоса
      const filter = this.audioContext.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 200;
      filter.Q.value = 2;

      // Компрессор для "робототизации"
      const compressor = this.audioContext.createDynamicsCompressor();
      compressor.threshold.value = -50;
      compressor.knee.value = 40;
      compressor.ratio.value = 12;
      compressor.attack.value = 0.003;
      compressor.release.value = 0.25;

      // Подключаем эффекты к выходу
      const source = this.audioContext.createMediaElementSource(
        document.querySelector('audio') as HTMLAudioElement
      );

      if (source && this.audioContext) {
        try {
          source.connect(filter);
          filter.connect(compressor);
          compressor.connect(this.audioContext.destination);
        } catch (e) {
          // Fallback
        }
      }
    } catch (e) {
      // Fallback если Web Audio API недоступен
      console.log('Web Audio API недоступен, используем базовый синтез');
    }
  }

  /**
   * Останавливает воспроизведение
   */
  stop(): void {
    window.speechSynthesis.cancel();
    this.isPlaying = false;
  }

  /**
   * Проверяет, говорит ли система
   */
  isSpeaking(): boolean {
    return this.isPlaying || window.speechSynthesis.speaking;
  }

  /**
   * Загружает голоса (нужно вызвать перед использованием)
   */
  loadVoices(): Promise<SpeechSynthesisVoice[]> {
    return new Promise((resolve) => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        resolve(voices);
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          resolve(window.speechSynthesis.getVoices());
        };
      }
    });
  }
}

// Экспортируем синглтон
export const jarvisTTS = new JarvisTTSService();

// Инициализируем голоса при загрузке
if (typeof window !== 'undefined') {
  jarvisTTS.loadVoices();
}
