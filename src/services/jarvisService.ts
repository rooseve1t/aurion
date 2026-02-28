// JARVIS AI Features Service
// Функции Джарвиса из Marvel: предсказание, анализ, рекомендации, контекстная помощь

import type { AurionStore } from '@/store/aurionStore';

export interface PredictionResult {
  type: 'threat' | 'health' | 'behavior' | 'energy' | 'security';
  confidence: number;
  prediction: string;
  recommendation: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

export interface ContextualAnalysis {
  timeOfDay: string;
  location: string;
  activity: string;
  mood: string;
  riskLevel: number;
  suggestions: string[];
}

export interface ProactiveAction {
  id: string;
  action: string;
  reason: string;
  confidence: number;
  autoExecute: boolean;
  timestamp: number;
}

class JARVISService {
  /**
   * Предсказание угроз безопасности на основе паттернов
   * Функция Джарвиса: анализ аномалий и предупреждение об опасностях
   */
  predictSecurityThreats(store: AurionStore): PredictionResult[] {
    const predictions: PredictionResult[] = [];
    const state = store.state;

    // Анализ угрозы
    if (state.threatLevel === 'HIGH' || state.threatLevel === 'CRITICAL') {
      predictions.push({
        type: 'threat',
        confidence: 0.95,
        prediction: 'Обнаружена угроза безопасности',
        recommendation: 'Активировать режим GUARDIAN и уведомить службу безопасности',
        urgency: 'critical',
      });
    }

    // Анализ режима охраны
    if (state.guardianMode && state.threatLevel === 'MEDIUM') {
      predictions.push({
        type: 'threat',
        confidence: 0.82,
        prediction: 'Средний уровень угрозы в режиме Guardian',
        recommendation: 'Включить все камеры и датчики движения',
        urgency: 'high',
      });
    }

    // Анализ времени суток и активности
    const hour = new Date().getHours();
    if (hour < 6 && state.systemMode === 'SLEEP') {
      predictions.push({
        type: 'threat',
        confidence: 0.78,
        prediction: 'Необычная активность в ночное время',
        recommendation: 'Проверить камеры и активировать алерт',
        urgency: 'high',
      });
    }

    return predictions;
  }

  /**
   * Предсказание проблем со здоровьем на основе биометрики
   * Функция Джарвиса: мониторинг жизненных показателей
   */
  predictHealthIssues(store: AurionStore): PredictionResult[] {
    const predictions: PredictionResult[] = [];
    const health = store.state.healthData;

    // Анализ сердечного ритма
    if (health.heartRate > 100 || health.heartRate < 60) {
      predictions.push({
        type: 'health',
        confidence: 0.88,
        prediction: 'Аномальный сердечный ритм обнаружен',
        recommendation: 'Рекомендуется медицинская консультация',
        urgency: 'high',
      });
    }

    // Анализ уровня стресса
    if (health.stressLevel > 80) {
      predictions.push({
        type: 'health',
        confidence: 0.82,
        prediction: 'Критический уровень стресса',
        recommendation: 'Начните сеанс релаксации или медитации',
        urgency: 'high',
      });
    }

    // Анализ качества сна
    if (health.sleepScore < 40) {
      predictions.push({
        type: 'health',
        confidence: 0.75,
        prediction: 'Плохое качество сна может повлиять на здоровье',
        recommendation: 'Улучшите условия сна: темнота, температура, тишина',
        urgency: 'medium',
      });
    }

    // Анализ активности
    if (health.activityLevel < 20) {
      predictions.push({
        type: 'health',
        confidence: 0.79,
        prediction: 'Низкий уровень физической активности',
        recommendation: 'Рекомендуется 30 минут активности в день',
        urgency: 'medium',
      });
    }

    return predictions;
  }

  /**
   * Анализ поведения и предсказание действий
   * Функция Джарвиса: обучение и адаптация к привычкам
   */
  predictBehaviorPatterns(store: AurionStore): PredictionResult[] {
    const predictions: PredictionResult[] = [];
    const hour = new Date().getHours();
    const day = new Date().getDay();

    // Предсказание времени пробуждения
    if (hour === 6 && day !== 0 && day !== 6) {
      predictions.push({
        type: 'behavior',
        confidence: 0.91,
        prediction: 'Обычное время пробуждения (6:00 AM)',
        recommendation: 'Постепенно увеличивайте освещение и температуру',
        urgency: 'low',
      });
    }

    // Предсказание времени обеда
    if (hour === 12) {
      predictions.push({
        type: 'behavior',
        confidence: 0.85,
        prediction: 'Время обеда',
        recommendation: 'Приготовьте питательный обед, напомните о гидратации',
        urgency: 'low',
      });
    }

    // Предсказание вечернего режима
    if (hour >= 21) {
      predictions.push({
        type: 'behavior',
        confidence: 0.88,
        prediction: 'Приближается время сна',
        recommendation: 'Снизьте яркость света, активируйте режим SLEEP',
        urgency: 'low',
      });
    }

    return predictions;
  }

  /**
   * Предсказание проблем с энергией/питанием
   * Функция Джарвиса: оптимизация энергопотребления
   */
  predictEnergyIssues(store: AurionStore): PredictionResult[] {
    const predictions: PredictionResult[] = [];
    const state = store.state;

    // Анализ энергопотребления
    if (state.metrics.aiLoad > 85) {
      predictions.push({
        type: 'energy',
        confidence: 0.87,
        prediction: 'Высокое использование ресурсов',
        recommendation: 'Отключите ненужные устройства, оптимизируйте нагрузку',
        urgency: 'medium',
      });
    }

    // Предсказание высокого риска
    if (state.metrics.riskScore > 75) {
      predictions.push({
        type: 'energy',
        confidence: 0.81,
        prediction: 'Высокий уровень риска в системе',
        recommendation: 'Проверьте все датчики и активируйте режим Guardian',
        urgency: 'high',
      });
    }

    return predictions;
  }

  /**
   * Контекстный анализ текущей ситуации
   * Функция Джарвиса: полное понимание контекста
   */
  analyzeContext(store: AurionStore): ContextualAnalysis {
    const hour = new Date().getHours();
    const state = store.state;

    let timeOfDay = 'день';
    if (hour < 6) timeOfDay = 'ночь';
    else if (hour < 12) timeOfDay = 'утро';
    else if (hour < 18) timeOfDay = 'день';
    else if (hour < 21) timeOfDay = 'вечер';
    else timeOfDay = 'ночь';

    const location = 'дом';
    const activity = 'отдых';
    const mood = state.healthData.stressLevel > 70 ? 'напряженное' : 'спокойное';
    const riskLevel = state.metrics.riskScore;

    const suggestions: string[] = [];

    // Контекстные рекомендации
    if (state.systemMode === 'NORMAL' && hour >= 22) {
      suggestions.push('Рекомендуется переключиться в режим SLEEP');
    }

    if (state.healthData.stressLevel > 60) {
      suggestions.push('Попробуйте медитацию или дыхательные упражнения');
    }

    const thermostat = state.smartHomeDevices.find(d => d.type === 'thermostat');
    if (thermostat && thermostat.value && thermostat.value > 26) {
      suggestions.push('Включите кондиционер для комфорта');
    }

    if (hour > 20) {
      suggestions.push('Проверьте, что все двери закрыты перед сном');
    }

    return {
      timeOfDay,
      location,
      activity,
      mood,
      riskLevel,
      suggestions,
    };
  }

  /**
   * Генерирование проактивных действий
   * Функция Джарвиса: инициирование действий без запроса
   */
  generateProactiveActions(store: AurionStore): ProactiveAction[] {
    const actions: ProactiveAction[] = [];
    const hour = new Date().getHours();
    const state = store.state;

    // Автоматическое включение света при наступлении темноты
    const livingRoomLight = state.smartHomeDevices.find(d => d.id === 'light-living');
    if (hour === 18 && livingRoomLight && !livingRoomLight.status) {
      actions.push({
        id: 'auto-lights-evening',
        action: 'Включить свет в гостиной',
        reason: 'Наступает вечер, рекомендуется включить свет',
        confidence: 0.89,
        autoExecute: true,
        timestamp: Date.now(),
      });
    }

    // Автоматическое включение режима SLEEP
    if (hour === 23 && state.systemMode === 'NORMAL') {
      actions.push({
        id: 'auto-sleep-mode',
        action: 'Активировать режим SLEEP',
        reason: 'Обычное время сна, система готова к отдыху',
        confidence: 0.92,
        autoExecute: true,
        timestamp: Date.now(),
      });
    }

    // Автоматическое отключение света при пробуждении
    const bedroomLight = state.smartHomeDevices.find(d => d.id === 'light-bedroom');
    if (hour === 6 && bedroomLight && bedroomLight.status) {
      actions.push({
        id: 'auto-lights-morning',
        action: 'Отключить свет в спальне',
        reason: 'Утро, естественное освещение достаточно',
        confidence: 0.85,
        autoExecute: true,
        timestamp: Date.now(),
      });
    }

    // Рекомендация проверки безопасности
    const doorsLocked = state.smartHomeDevices
      .filter(d => d.type === 'lock')
      .every(d => d.status);
    if (hour === 21 && !doorsLocked) {
      actions.push({
        id: 'security-check',
        action: 'Проверить и заблокировать все двери',
        reason: 'Вечер, время проверить безопасность перед сном',
        confidence: 0.88,
        autoExecute: false,
        timestamp: Date.now(),
      });
    }

    // Рекомендация активности
    if (hour % 2 === 0 && state.healthData.activityLevel < 30) {
      actions.push({
        id: 'activity-reminder',
        action: 'Напомнить о физической активности',
        reason: 'Низкий уровень активности, пора двигаться',
        confidence: 0.82,
        autoExecute: false,
        timestamp: Date.now(),
      });
    }

    return actions;
  }

  /**
   * Контекстная помощь на основе текущей ситуации
   * Функция Джарвиса: умная подсказка и помощь
   */
  getContextualHelp(store: AurionStore): string {
    const hour = new Date().getHours();
    const state = store.state;

    if (state.threatLevel === 'CRITICAL') {
      return 'ВНИМАНИЕ: Обнаружена критическая угроза безопасности. Активирован режим EMERGENCY. Все камеры записывают. Служба безопасности уведомлена.';
    }

    if (state.healthData.stressLevel > 80) {
      return 'Обнаружен высокий уровень стресса. Рекомендуется: 1) Глубокое дыхание (4-7-8), 2) Медитация 10 мин, 3) Прогулка на свежем воздухе.';
    }

    if (hour >= 22 && state.systemMode === 'NORMAL') {
      return 'Поздний час. Рекомендуется переключиться в режим SLEEP для оптимального восстановления.';
    }

    const thermostat = state.smartHomeDevices.find(d => d.type === 'thermostat');
    if (thermostat && thermostat.value && thermostat.value > 27) {
      return 'Температура выше комфортной. Включу кондиционер и улучшу вентиляцию.';
    }

    if (hour > 20) {
      return 'Вечер. Убедитесь, что все двери закрыты и система безопасности активна.';
    }

    if (state.healthData.activityLevel < 20) {
      return 'Низкий уровень активности. Рекомендуется 30 минут физической активности. Я напомню вам через час.';
    }

    return 'Все системы в норме. Я готов помочь. Скажите, что вам нужно.';
  }

  /**
   * Анализ аномалий в поведении системы
   * Функция Джарвиса: обнаружение необычных паттернов
   */
  detectAnomalies(store: AurionStore): string[] {
    const anomalies: string[] = [];
    const state = store.state;

    // Аномалия: необычная активность в ночное время
    const hour = new Date().getHours();
    if (hour > 2 && hour < 5) {
      const lights = state.smartHomeDevices.filter(d => d.type === 'light' && d.status);
      if (lights.length > 0) {
        anomalies.push('Необычная активность в ночное время');
      }
    }

    // Аномалия: множественные попытки доступа
    if (state.threatLevel === 'HIGH' || state.threatLevel === 'CRITICAL') {
      anomalies.push('Обнаружена угроза безопасности');
    }

    // Аномалия: резкое изменение температуры
    const thermostat = state.smartHomeDevices.find(d => d.type === 'thermostat');
    if (thermostat && thermostat.value && Math.abs(thermostat.value - 22) > 5) {
      anomalies.push('Резкое изменение температуры');
    }

    // Аномалия: необычное энергопотребление
    if (state.metrics.aiLoad > 90) {
      anomalies.push('Критически высокое использование ресурсов');
    }

    // Аномалия: необычный паттерн сна
    if (state.healthData.sleepScore < 30) {
      anomalies.push('Плохое качество сна может указывать на проблемы со здоровьем');
    }

    return anomalies;
  }
}

export const jarvisService = new JARVISService();
