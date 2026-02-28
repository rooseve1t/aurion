export const jarVoiceEngine = {
  async processCommand(
    command: string,
    context: any,
    autonomyLevel: number = 0,
    emotionalState: string = 'neutral',
    stressLevel: number = 0
  ) {
    try {
      const res = await fetch('/api/ai/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command,
          context,
          autonomyLevel,
          emotionalState,
          stressLevel
        })
      });
      
      const text = await res.text();
      if (!res.ok) throw new Error(`AI Service Error: ${text}`);
      
      try {
        return JSON.parse(text);
      } catch (e) {
        console.error("Invalid JSON from AI:", text);
        return { response: "Ошибка обработки ответа от ИИ (Rate Limit).", agentRole: "GUARDIAN" };
      }
    } catch (error) {
      console.error("JarVoice Engine Error:", error);
      return { response: "Прошу прощения, сэр. Связь с сервером потеряна.", agentRole: "GUARDIAN" };
    }
  },

  async synthesizeSpeech(text: string) {
    try {
      const res = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!res.ok) return null;
      const responseText = await res.text();
      try {
        const data = JSON.parse(responseText);
        return data.audioData;
      } catch (e) {
        return null;
      }
    } catch (error) {
      console.error("TTS Error:", error);
      return null;
    }
  },

  async getProactiveInsight(state: any) {
    try {
      const res = await fetch('/api/ai/insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state })
      });
      
      const text = await res.text();
      if (!res.ok) throw new Error(`Insight Service Error: ${text}`);
      
      try {
        return JSON.parse(text);
      } catch (e) {
        return { insight: null }; // Return null if parsing fails to avoid spamming
      }
    } catch (error) {
      return { insight: null };
    }
  }
};
