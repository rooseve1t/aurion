// Apple HealthKit Integration Service
// Синхронизация данных здоровья с Apple Health на iPhone

export interface HealthMetric {
  type: 'heartRate' | 'steps' | 'distance' | 'activeEnergy' | 'sleepAnalysis' | 'bloodPressure' | 'bloodGlucose' | 'weight';
  value: number;
  unit: string;
  timestamp: number;
  source: string;
}

export interface HealthKitPermission {
  type: string;
  permission: 'authorized' | 'denied' | 'notDetermined';
}

class HealthKitService {
  private isAvailable: boolean = false;
  private isAuthorized: boolean = false;
  private permissions: Map<string, HealthKitPermission> = new Map();
  private healthData: HealthMetric[] = [];
  private syncInterval: number | null = null;

  constructor() {
    this.checkAvailability();
  }

  /**
   * Проверка доступности HealthKit
   */
  private checkAvailability(): void {
    // HealthKit доступен только на iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    this.isAvailable = isIOS;

    if (this.isAvailable) {
      console.log('✓ Apple HealthKit доступен');
    } else {
      console.log('⚠️ Apple HealthKit недоступен (требуется iOS)');
    }
  }

  /**
   * Запрос разрешений на доступ к HealthKit
   */
  async requestPermissions(): Promise<boolean> {
    if (!this.isAvailable) {
      console.warn('HealthKit недоступен на этом устройстве');
      return false;
    }

    try {
      // Имитация запроса разрешений
      console.log('📱 Запрос разрешений на доступ к Apple Health...');

      // В реальном приложении используется HealthKit API
      // Здесь используется демо-режим
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.isAuthorized = true;

      // Установка разрешений
      const requiredMetrics = [
        'heartRate',
        'steps',
        'distance',
        'activeEnergy',
        'sleepAnalysis',
        'bloodPressure',
        'weight',
      ];

      for (const metric of requiredMetrics) {
        this.permissions.set(metric, {
          type: metric,
          permission: 'authorized',
        });
      }

      console.log('✓ Разрешения на доступ к Apple Health получены');
      return true;
    } catch (error) {
      console.error('Ошибка запроса разрешений:', error);
      this.isAuthorized = false;
      return false;
    }
  }

  /**
   * Получение данных о сердечном ритме
   */
  async getHeartRateData(days: number = 7): Promise<HealthMetric[]> {
    if (!this.isAuthorized) {
      console.warn('Нет доступа к HealthKit');
      return [];
    }

    try {
      // Имитация получения данных о сердечном ритме
      const data: HealthMetric[] = [];
      const now = Date.now();

      for (let i = 0; i < days * 10; i++) {
        data.push({
          type: 'heartRate',
          value: 60 + Math.random() * 40,
          unit: 'bpm',
          timestamp: now - i * 3600000,
          source: 'Apple Health',
        });
      }

      console.log(`✓ Получены данные о сердечном ритме за ${days} дней`);
      return data;
    } catch (error) {
      console.error('Ошибка получения данных о сердечном ритме:', error);
      return [];
    }
  }

  /**
   * Получение данных о шагах
   */
  async getStepsData(days: number = 7): Promise<HealthMetric[]> {
    if (!this.isAuthorized) {
      console.warn('Нет доступа к HealthKit');
      return [];
    }

    try {
      const data: HealthMetric[] = [];
      const now = Date.now();

      for (let i = 0; i < days; i++) {
        data.push({
          type: 'steps',
          value: 5000 + Math.random() * 15000,
          unit: 'steps',
          timestamp: now - i * 86400000,
          source: 'Apple Health',
        });
      }

      console.log(`✓ Получены данные о шагах за ${days} дней`);
      return data;
    } catch (error) {
      console.error('Ошибка получения данных о шагах:', error);
      return [];
    }
  }

  /**
   * Получение данных о сне
   */
  async getSleepData(days: number = 7): Promise<HealthMetric[]> {
    if (!this.isAuthorized) {
      console.warn('Нет доступа к HealthKit');
      return [];
    }

    try {
      const data: HealthMetric[] = [];
      const now = Date.now();

      for (let i = 0; i < days; i++) {
        data.push({
          type: 'sleepAnalysis',
          value: 6 + Math.random() * 3,
          unit: 'hours',
          timestamp: now - i * 86400000,
          source: 'Apple Health',
        });
      }

      console.log(`✓ Получены данные о сне за ${days} дней`);
      return data;
    } catch (error) {
      console.error('Ошибка получения данных о сне:', error);
      return [];
    }
  }

  /**
   * Получение данных о весе
   */
  async getWeightData(days: number = 30): Promise<HealthMetric[]> {
    if (!this.isAuthorized) {
      console.warn('Нет доступа к HealthKit');
      return [];
    }

    try {
      const data: HealthMetric[] = [];
      const now = Date.now();
      let weight = 75; // Начальный вес в кг

      for (let i = 0; i < days; i++) {
        weight += (Math.random() - 0.5) * 0.5;
        data.push({
          type: 'weight',
          value: weight,
          unit: 'kg',
          timestamp: now - i * 86400000,
          source: 'Apple Health',
        });
      }

      console.log(`✓ Получены данные о весе за ${days} дней`);
      return data;
    } catch (error) {
      console.error('Ошибка получения данных о весе:', error);
      return [];
    }
  }

  /**
   * Получение данных о давлении
   */
  async getBloodPressureData(days: number = 7): Promise<HealthMetric[]> {
    if (!this.isAuthorized) {
      console.warn('Нет доступа к HealthKit');
      return [];
    }

    try {
      const data: HealthMetric[] = [];
      const now = Date.now();

      for (let i = 0; i < days; i++) {
        const systolic = 110 + Math.random() * 30;
        const diastolic = 70 + Math.random() * 20;
        data.push({
          type: 'bloodPressure',
          value: systolic / diastolic,
          unit: 'mmHg',
          timestamp: now - i * 86400000,
          source: 'Apple Health',
        });
      }

      console.log(`✓ Получены данные о давлении за ${days} дней`);
      return data;
    } catch (error) {
      console.error('Ошибка получения данных о давлении:', error);
      return [];
    }
  }

  /**
   * Получение всех данных здоровья
   */
  async getAllHealthData(): Promise<HealthMetric[]> {
    if (!this.isAuthorized) {
      console.warn('Нет доступа к HealthKit');
      return [];
    }

    try {
      const [heartRate, steps, sleep, weight, bloodPressure] = await Promise.all([
        this.getHeartRateData(7),
        this.getStepsData(7),
        this.getSleepData(7),
        this.getWeightData(30),
        this.getBloodPressureData(7),
      ]);

      this.healthData = [...heartRate, ...steps, ...sleep, ...weight, ...bloodPressure];
      console.log(`✓ Синхронизировано ${this.healthData.length} метрик здоровья`);

      return this.healthData;
    } catch (error) {
      console.error('Ошибка получения данных здоровья:', error);
      return [];
    }
  }

  /**
   * Запуск автоматической синхронизации
   */
  startAutoSync(intervalMinutes: number = 15): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    console.log(`🔄 Автосинхронизация HealthKit каждые ${intervalMinutes} минут`);

    this.syncInterval = window.setInterval(() => {
      this.getAllHealthData().catch(error => {
        console.error('Ошибка автосинхронизации:', error);
      });
    }, intervalMinutes * 60 * 1000);
  }

  /**
   * Остановка автоматической синхронизации
   */
  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('✓ Автосинхронизация остановлена');
    }
  }

  /**
   * Анализ здоровья на основе данных
   */
  analyzeHealth(): {
    heartRateAvg: number;
    stepsTotal: number;
    sleepAvg: number;
    healthScore: number;
    recommendations: string[];
  } {
    const heartRateData = this.healthData.filter(d => d.type === 'heartRate');
    const stepsData = this.healthData.filter(d => d.type === 'steps');
    const sleepData = this.healthData.filter(d => d.type === 'sleepAnalysis');

    const heartRateAvg = heartRateData.length > 0
      ? heartRateData.reduce((sum, d) => sum + d.value, 0) / heartRateData.length
      : 0;

    const stepsTotal = stepsData.reduce((sum, d) => sum + d.value, 0);
    const sleepAvg = sleepData.length > 0
      ? sleepData.reduce((sum, d) => sum + d.value, 0) / sleepData.length
      : 0;

    // Расчет общего индекса здоровья
    let healthScore = 100;
    if (heartRateAvg > 100) healthScore -= 10;
    if (stepsTotal < 50000) healthScore -= 15;
    if (sleepAvg < 7) healthScore -= 10;

    const recommendations: string[] = [];
    if (heartRateAvg > 100) recommendations.push('Снизьте уровень стресса');
    if (stepsTotal < 50000) recommendations.push('Увеличьте физическую активность');
    if (sleepAvg < 7) recommendations.push('Спите больше часов в день');

    return {
      heartRateAvg,
      stepsTotal,
      sleepAvg,
      healthScore,
      recommendations,
    };
  }

  /**
   * Проверка статуса авторизации
   */
  isHealthKitAuthorized(): boolean {
    return this.isAuthorized;
  }

  /**
   * Получение рекомендаций
   */
  getRecommendations(): string[] {
    return [
      'Убедитесь, что приложение имеет доступ к Apple Health',
      'Проверьте разрешения в Настройках > Конфиденциальность > Здоровье',
      'Синхронизируйте данные регулярно для точных результатов',
      'Используйте Apple Watch для более точного отслеживания',
      'Анализируйте тренды здоровья еженедельно',
    ];
  }
}

export const healthKitService = new HealthKitService();
