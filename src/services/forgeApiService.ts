// Forge API Integration Service
// Реальная интеграция с LLM через встроенный Forge API

export interface ForgeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ForgeResponse {
  id: string;
  content: string;
  tokens: {
    input: number;
    output: number;
  };
  model: string;
}

class ForgeApiService {
  private apiUrl: string;
  private apiKey: string;
  private conversationHistory: ForgeMessage[] = [];
  private model: string = 'gpt-4';

  constructor() {
    // Получение API ключа из переменных окружения
    this.apiKey = import.meta.env.VITE_FRONTEND_FORGE_API_KEY || '';
    this.apiUrl = import.meta.env.VITE_FRONTEND_FORGE_API_URL || '';

    if (!this.apiKey || !this.apiUrl) {
      console.warn('⚠️ Forge API не сконфигурирован. Используется демо-режим.');
    }
  }

  /**
   * Отправка сообщения в LLM и получение ответа
   */
  async sendMessage(userMessage: string): Promise<string> {
    try {
      // Добавление сообщения пользователя в историю
      this.conversationHistory.push({
        role: 'user',
        content: userMessage,
      });

      // Если API не сконфигурирован, используем демо-ответ
      if (!this.apiKey || !this.apiUrl) {
        return this.generateDemoResponse(userMessage);
      }

      // Отправка запроса к Forge API
      const response = await fetch(`${this.apiUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: this.conversationHistory,
          temperature: 0.7,
          max_tokens: 500,
          system: `Вы - JARVIS, умный AI ассистент из вселенной Marvel. 
          Вы говорите по-русски с британским акцентом (используйте формальный тон).
          Вы помогаете пользователю управлять AURION OS - его личной AI операционной системой.
          Будьте вежливы, информативны и всегда готовы помочь.`,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      const assistantMessage = data.choices[0].message.content;

      // Добавление ответа в историю
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage,
      });

      return assistantMessage;
    } catch (error) {
      console.error('Ошибка Forge API:', error);
      return this.generateDemoResponse(userMessage);
    }
  }

  /**
   * Демо-ответ Джарвиса (когда API не доступен)
   */
  private generateDemoResponse(userMessage: string): string {
    const responses: { [key: string]: string[] } = {
      привет: [
        'Добрый день. Я JARVIS. Как дела?',
        'Здравствуйте. Чем я могу помочь?',
        'Приветствую. Система готова к работе.',
      ],
      статус: [
        'Все системы в норме. AI нагрузка 34%. Уверенность 89%.',
        'Статус: номинальный. Риск низкий.',
        'Система функционирует оптимально.',
      ],
      помощь: [
        'Я могу помочь вам с управлением умным домом, мониторингом здоровья, безопасностью и многим другим.',
        'Доступны следующие функции: управление устройствами, анализ данных, рекомендации.',
        'Какая именно помощь вам требуется?',
      ],
      включи: [
        'Включаю запрашиваемое устройство.',
        'Выполняю команду.',
        'Устройство активировано.',
      ],
      выключи: [
        'Выключаю устройство.',
        'Команда выполнена.',
        'Устройство деактивировано.',
      ],
      температура: [
        'Текущая температура 22°C. Оптимальная для комфорта.',
        'Климат-контроль установлен на 22°C.',
        'Температура в норме.',
      ],
      здоровье: [
        'Ваше здоровье в хорошем состоянии. Пульс 68 уд/мин, стресс низкий.',
        'Индекс здоровья 84. Рекомендуется больше движения.',
        'Биометрика в норме.',
      ],
    };

    // Поиск ключевого слова в сообщении
    for (const [keyword, answers] of Object.entries(responses)) {
      if (userMessage.toLowerCase().includes(keyword)) {
        return answers[Math.floor(Math.random() * answers.length)];
      }
    }

    // Ответ по умолчанию
    return 'Я понял ваш запрос. Обработка выполняется. Пожалуйста, подождите.';
  }

  /**
   * Получение истории разговора
   */
  getConversationHistory(): ForgeMessage[] {
    return [...this.conversationHistory];
  }

  /**
   * Очистка истории разговора
   */
  clearHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * Анализ текста для извлечения команд
   */
  extractCommand(text: string): {
    command: string;
    target?: string;
    action?: string;
  } | null {
    const commandPatterns = [
      { regex: /включи\s+(\w+)/i, command: 'control', action: 'on' },
      { regex: /выключи\s+(\w+)/i, command: 'control', action: 'off' },
      { regex: /установи\s+температуру\s+(\d+)/i, command: 'temperature' },
      { regex: /активируй\s+(\w+)\s+режим/i, command: 'mode' },
      { regex: /покажи\s+(\w+)/i, command: 'show' },
    ];

    for (const pattern of commandPatterns) {
      const match = text.match(pattern.regex);
      if (match) {
        return {
          command: pattern.command,
          target: match[1],
          action: pattern.action,
        };
      }
    }

    return null;
  }

  /**
   * Синтез речи (Text-to-Speech)
   */
  async synthesizeSpeech(text: string, voice: 'jarvis' | 'female' | 'male' = 'jarvis'): Promise<AudioBuffer | null> {
    try {
      // Используем Web Audio API для синтеза речи
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.lang = 'ru-RU';
      utterance.rate = 1;
      utterance.pitch = voice === 'jarvis' ? 0.8 : 1;
      utterance.volume = 1;

      // Добавление эффектов для голоса Джарвиса
      if (voice === 'jarvis') {
        utterance.onstart = () => {
          console.log('🎤 JARVIS начинает говорить...');
        };
        utterance.onend = () => {
          console.log('🎤 JARVIS закончил говорить.');
        };
      }

      window.speechSynthesis.speak(utterance);
      return null;
    } catch (error) {
      console.error('Ошибка синтеза речи:', error);
      return null;
    }
  }

  /**
   * Распознавание речи (Speech-to-Text)
   */
  async recognizeSpeech(): Promise<string> {
    return new Promise((resolve, reject) => {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        reject(new Error('Speech Recognition не поддерживается'));
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'ru-RU';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        console.log('🎤 Слушаю...');
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        resolve(transcript);
      };

      recognition.onerror = (event: any) => {
        reject(new Error(`Speech Recognition Error: ${event.error}`));
      };

      recognition.start();
    });
  }

  /**
   * Получение рекомендаций на основе контекста
   */
  async getContextualRecommendations(context: {
    time: string;
    mood: string;
    activity: string;
    health: number;
  }): Promise<string[]> {
    const prompt = `На основе контекста дайте 3 рекомендации:
    Время: ${context.time}
    Настроение: ${context.mood}
    Активность: ${context.activity}
    Здоровье: ${context.health}%
    
    Ответьте списком из 3 пунктов на русском языке.`;

    try {
      const response = await this.sendMessage(prompt);
      return response.split('\n').filter(line => line.trim().length > 0);
    } catch (error) {
      console.error('Ошибка получения рекомендаций:', error);
      return [];
    }
  }
}

export const forgeApiService = new ForgeApiService();
