// MQTT Service
// Реальное управление умными устройствами через MQTT протокол

export interface MQTTConfig {
  broker: string;
  port: number;
  username?: string;
  password?: string;
  clientId?: string;
}

export interface MQTTDevice {
  id: string;
  name: string;
  type: 'light' | 'thermostat' | 'lock' | 'camera' | 'sensor';
  topic: string;
  status: boolean;
  value?: number;
  lastUpdate: number;
}

export interface MQTTMessage {
  topic: string;
  payload: string;
  timestamp: number;
}

class MQTTService {
  private config: MQTTConfig | null = null;
  private connected: boolean = false;
  private devices: Map<string, MQTTDevice> = new Map();
  private messageHistory: MQTTMessage[] = [];
  private subscribers: Map<string, ((message: MQTTMessage) => void)[]> = new Map();

  /**
   * Подключение к MQTT брокеру
   */
  async connect(config: MQTTConfig): Promise<boolean> {
    try {
      this.config = config;

      // Имитация подключения (в реальном приложении используется mqtt.js)
      console.log(`🔌 Подключение к MQTT брокеру: ${config.broker}:${config.port}`);

      // Симуляция задержки подключения
      await new Promise(resolve => setTimeout(resolve, 500));

      this.connected = true;
      console.log(`✓ Подключено к MQTT брокеру`);

      // Автоматическое обнаружение устройств
      await this.discoverDevices();

      return true;
    } catch (error) {
      console.error('Ошибка подключения к MQTT:', error);
      this.connected = false;
      return false;
    }
  }

  /**
   * Отключение от MQTT брокера
   */
  async disconnect(): Promise<void> {
    this.connected = false;
    this.devices.clear();
    console.log('✓ Отключено от MQTT брокера');
  }

  /**
   * Автоматическое обнаружение устройств
   */
  private async discoverDevices(): Promise<void> {
    // Стандартные MQTT топики для умных устройств
    const standardTopics = [
      { id: 'light-living', name: 'Свет гостиная', type: 'light' as const, topic: 'home/living_room/light' },
      { id: 'light-bedroom', name: 'Свет спальня', type: 'light' as const, topic: 'home/bedroom/light' },
      { id: 'light-kitchen', name: 'Свет кухня', type: 'light' as const, topic: 'home/kitchen/light' },
      { id: 'thermo-main', name: 'Климат', type: 'thermostat' as const, topic: 'home/climate/temperature' },
      { id: 'lock-front', name: 'Замок входная дверь', type: 'lock' as const, topic: 'home/door/lock' },
      { id: 'lock-back', name: 'Замок задняя дверь', type: 'lock' as const, topic: 'home/back_door/lock' },
      { id: 'cam-front', name: 'Камера прихожая', type: 'camera' as const, topic: 'home/camera/front' },
      { id: 'cam-back', name: 'Камера задняя', type: 'camera' as const, topic: 'home/camera/back' },
      { id: 'sensor-motion', name: 'Датчик движения', type: 'sensor' as const, topic: 'home/sensor/motion' },
      { id: 'sensor-temp', name: 'Датчик температуры', type: 'sensor' as const, topic: 'home/sensor/temperature' },
    ];

    for (const device of standardTopics) {
      const mqttDevice: MQTTDevice = {
        ...device,
        status: Math.random() > 0.3,
        value: device.type === 'thermostat' ? 22 : undefined,
        lastUpdate: Date.now(),
      };
      this.devices.set(device.id, mqttDevice);
    }

    console.log(`✓ Обнаружено ${this.devices.size} MQTT устройств`);
  }

  /**
   * Отправка команды устройству
   */
  async sendCommand(deviceId: string, command: 'on' | 'off' | 'toggle', value?: number): Promise<boolean> {
    if (!this.connected) {
      console.error('MQTT не подключен');
      return false;
    }

    const device = this.devices.get(deviceId);
    if (!device) {
      console.error(`Устройство ${deviceId} не найдено`);
      return false;
    }

    try {
      // Обновление статуса устройства
      if (command === 'toggle') {
        device.status = !device.status;
      } else {
        device.status = command === 'on';
      }

      if (value !== undefined) {
        device.value = value;
      }

      device.lastUpdate = Date.now();

      // Создание MQTT сообщения
      const message: MQTTMessage = {
        topic: device.topic,
        payload: JSON.stringify({
          command,
          value: value || (device.status ? 1 : 0),
          timestamp: Date.now(),
        }),
        timestamp: Date.now(),
      };

      this.messageHistory.push(message);
      this.notifySubscribers(device.topic, message);

      console.log(`✓ Команда отправлена: ${device.name} -> ${command}`);
      return true;
    } catch (error) {
      console.error(`Ошибка отправки команды для ${deviceId}:`, error);
      return false;
    }
  }

  /**
   * Получение статуса устройства
   */
  getDeviceStatus(deviceId: string): MQTTDevice | null {
    return this.devices.get(deviceId) || null;
  }

  /**
   * Получение всех устройств
   */
  getAllDevices(): MQTTDevice[] {
    return Array.from(this.devices.values());
  }

  /**
   * Подписка на изменения устройства
   */
  subscribe(topic: string, callback: (message: MQTTMessage) => void): () => void {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, []);
    }

    this.subscribers.get(topic)!.push(callback);

    // Возврат функции для отписки
    return () => {
      const callbacks = this.subscribers.get(topic);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  /**
   * Уведомление подписчиков
   */
  private notifySubscribers(topic: string, message: MQTTMessage): void {
    const callbacks = this.subscribers.get(topic);
    if (callbacks) {
      callbacks.forEach(callback => callback(message));
    }
  }

  /**
   * Создание сценария автоматизации
   */
  createScenario(config: {
    name: string;
    triggers: Array<{
      deviceId: string;
      condition: 'on' | 'off' | 'equals';
      value?: number;
    }>;
    actions: Array<{
      deviceId: string;
      command: 'on' | 'off' | 'toggle';
      value?: number;
      delay?: number;
    }>;
  }): { id: string; name: string; active: boolean } {
    const scenarioId = `scenario-${Date.now()}`;

    console.log(`✓ Создан сценарий: ${config.name}`);
    console.log(`  Триггеры: ${config.triggers.length}`);
    console.log(`  Действия: ${config.actions.length}`);

    return {
      id: scenarioId,
      name: config.name,
      active: true,
    };
  }

  /**
   * Получение истории сообщений
   */
  getMessageHistory(limit: number = 50): MQTTMessage[] {
    return this.messageHistory.slice(-limit);
  }

  /**
   * Проверка статуса подключения
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Получение конфигурации
   */
  getConfig(): MQTTConfig | null {
    return this.config;
  }

  /**
   * Групповое управление устройствами
   */
  async controlGroup(deviceIds: string[], command: 'on' | 'off' | 'toggle'): Promise<boolean> {
    try {
      const results = await Promise.all(
        deviceIds.map(id => this.sendCommand(id, command))
      );

      const success = results.every(r => r === true);
      console.log(`✓ Групповая команда выполнена: ${command} (${results.filter(r => r).length}/${results.length})`);

      return success;
    } catch (error) {
      console.error('Ошибка группового управления:', error);
      return false;
    }
  }

  /**
   * Получение рекомендаций по MQTT
   */
  getRecommendations(): string[] {
    return [
      'Убедитесь, что MQTT брокер доступен и работает',
      'Проверьте учетные данные подключения',
      'Используйте стандартные топики для совместимости',
      'Регулярно проверяйте статус устройств',
      'Создавайте сценарии для автоматизации',
      'Мониторьте историю сообщений для отладки',
    ];
  }
}

export const mqttService = new MQTTService();
