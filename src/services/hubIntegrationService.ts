// Hub Integration Service
// Управление умными устройствами через Hub (MQTT/REST API)
// Поддержка ГБР-кнопки и других IoT устройств

export interface HubDevice {
  id: string;
  name: string;
  type: 'button' | 'sensor' | 'light' | 'lock' | 'camera' | 'thermostat';
  status: boolean;
  value?: number;
  lastUpdate: number;
  hubId: string;
}

export interface HubConnection {
  id: string;
  name: string;
  protocol: 'mqtt' | 'rest' | 'zigbee' | 'zwave';
  host: string;
  port: number;
  username?: string;
  password?: string;
  connected: boolean;
  devices: HubDevice[];
}

export interface GBRButtonEvent {
  id: string;
  timestamp: number;
  action: 'press' | 'long_press' | 'double_press';
  duration?: number;
  location: string;
}

class HubIntegrationService {
  private hubConnections: Map<string, HubConnection> = new Map();
  private gbrButtonEvents: GBRButtonEvent[] = [];
  private eventListeners: ((event: GBRButtonEvent) => void)[] = [];

  /**
   * Подключение к Hub
   * Поддерживает MQTT, REST API, Zigbee, Z-Wave
   */
  async connectToHub(config: {
    name: string;
    protocol: 'mqtt' | 'rest' | 'zigbee' | 'zwave';
    host: string;
    port: number;
    username?: string;
    password?: string;
  }): Promise<HubConnection> {
    const hubId = `hub-${Date.now()}`;
    
    try {
      // Имитация подключения (в реальном приложении здесь будет MQTT/REST запрос)
      const connection: HubConnection = {
        id: hubId,
        name: config.name,
        protocol: config.protocol,
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
        connected: true,
        devices: [],
      };

      this.hubConnections.set(hubId, connection);
      console.log(`✓ Подключено к Hub: ${config.name} (${config.protocol}://${config.host}:${config.port})`);
      
      return connection;
    } catch (error) {
      console.error('Ошибка подключения к Hub:', error);
      throw error;
    }
  }

  /**
   * Обнаружение устройств на Hub
   */
  async discoverDevices(hubId: string): Promise<HubDevice[]> {
    const hub = this.hubConnections.get(hubId);
    if (!hub) {
      throw new Error(`Hub ${hubId} не найден`);
    }

    try {
      // Имитация обнаружения устройств
      const discoveredDevices: HubDevice[] = [
        {
          id: 'gbr-button-1',
          name: 'ГБР Кнопка - Прихожая',
          type: 'button',
          status: true,
          lastUpdate: Date.now(),
          hubId,
        },
        {
          id: 'motion-sensor-1',
          name: 'Датчик движения - Гостиная',
          type: 'sensor',
          status: true,
          value: 0,
          lastUpdate: Date.now(),
          hubId,
        },
        {
          id: 'light-smart-1',
          name: 'Умный свет - Спальня',
          type: 'light',
          status: false,
          value: 0,
          lastUpdate: Date.now(),
          hubId,
        },
        {
          id: 'lock-smart-1',
          name: 'Умный замок - Входная дверь',
          type: 'lock',
          status: true,
          lastUpdate: Date.now(),
          hubId,
        },
        {
          id: 'camera-1',
          name: 'IP Камера - Прихожая',
          type: 'camera',
          status: true,
          lastUpdate: Date.now(),
          hubId,
        },
      ];

      hub.devices = discoveredDevices;
      console.log(`✓ Обнаружено ${discoveredDevices.length} устройств на Hub`);
      
      return discoveredDevices;
    } catch (error) {
      console.error('Ошибка обнаружения устройств:', error);
      throw error;
    }
  }

  /**
   * Управление ГБР-кнопкой
   * Получение статуса и истории нажатий
   */
  async getGBRButtonStatus(hubId: string, buttonId: string): Promise<HubDevice | null> {
    const hub = this.hubConnections.get(hubId);
    if (!hub) return null;

    const button = hub.devices.find(d => d.id === buttonId && d.type === 'button');
    return button || null;
  }

  /**
   * Получение истории нажатий ГБР-кнопки
   */
  getGBRButtonHistory(limit: number = 50): GBRButtonEvent[] {
    return this.gbrButtonEvents.slice(-limit);
  }

  /**
   * Обработка события нажатия ГБР-кнопки
   */
  handleGBRButtonPress(
    hubId: string,
    buttonId: string,
    action: 'press' | 'long_press' | 'double_press',
    location: string = 'Прихожая'
  ): GBRButtonEvent {
    const event: GBRButtonEvent = {
      id: `event-${Date.now()}`,
      timestamp: Date.now(),
      action,
      location,
    };

    this.gbrButtonEvents.push(event);

    // Уведомление слушателей
    this.eventListeners.forEach(listener => listener(event));

    // Логирование
    const actionText = {
      press: 'Нажата',
      long_press: 'Долгое нажатие',
      double_press: 'Двойное нажатие',
    };

    console.log(`🔘 ГБР-кнопка: ${actionText[action]} в ${location}`);

    return event;
  }

  /**
   * Подписка на события ГБР-кнопки
   */
  onGBRButtonEvent(callback: (event: GBRButtonEvent) => void): () => void {
    this.eventListeners.push(callback);
    
    // Возврат функции для отписки
    return () => {
      this.eventListeners = this.eventListeners.filter(l => l !== callback);
    };
  }

  /**
   * Управление устройством через Hub
   */
  async controlDevice(
    hubId: string,
    deviceId: string,
    action: 'on' | 'off' | 'toggle',
    value?: number
  ): Promise<boolean> {
    const hub = this.hubConnections.get(hubId);
    if (!hub) {
      throw new Error(`Hub ${hubId} не найден`);
    }

    const device = hub.devices.find(d => d.id === deviceId);
    if (!device) {
      throw new Error(`Устройство ${deviceId} не найдено`);
    }

    try {
      // Имитация управления устройством
      if (action === 'toggle') {
        device.status = !device.status;
      } else {
        device.status = action === 'on';
      }

      if (value !== undefined) {
        device.value = value;
      }

      device.lastUpdate = Date.now();

      console.log(`✓ Устройство ${device.name}: ${device.status ? 'включено' : 'выключено'}`);
      
      return true;
    } catch (error) {
      console.error(`Ошибка управления устройством ${deviceId}:`, error);
      throw error;
    }
  }

  /**
   * Получение статуса всех устройств на Hub
   */
  async getHubStatus(hubId: string): Promise<{
    connected: boolean;
    deviceCount: number;
    devices: HubDevice[];
  }> {
    const hub = this.hubConnections.get(hubId);
    if (!hub) {
      throw new Error(`Hub ${hubId} не найден`);
    }

    return {
      connected: hub.connected,
      deviceCount: hub.devices.length,
      devices: hub.devices,
    };
  }

  /**
   * Создание автоматизации на основе ГБР-кнопки
   */
  createGBRAutomation(config: {
    name: string;
    buttonId: string;
    action: 'press' | 'long_press' | 'double_press';
    triggers: Array<{
      deviceId: string;
      command: 'on' | 'off' | 'toggle';
      value?: number;
    }>;
  }): {
    id: string;
    name: string;
    active: boolean;
  } {
    const automationId = `automation-${Date.now()}`;

    console.log(`✓ Создана автоматизация: ${config.name}`);
    console.log(`  Кнопка: ${config.buttonId}`);
    console.log(`  Действие: ${config.action}`);
    console.log(`  Триггеры: ${config.triggers.length}`);

    return {
      id: automationId,
      name: config.name,
      active: true,
    };
  }

  /**
   * Получение списка всех подключенных Hub'ов
   */
  getConnectedHubs(): HubConnection[] {
    return Array.from(this.hubConnections.values());
  }

  /**
   * Отключение от Hub
   */
  async disconnectHub(hubId: string): Promise<void> {
    const hub = this.hubConnections.get(hubId);
    if (hub) {
      hub.connected = false;
      console.log(`✓ Отключено от Hub: ${hub.name}`);
    }
  }

  /**
   * Получение рекомендаций по использованию ГБР-кнопки
   */
  getGBRRecommendations(): string[] {
    return [
      'Нажмите ГБР-кнопку один раз для активации режима Guardian',
      'Долгое нажатие (2+ сек) активирует режим Emergency',
      'Двойное нажатие отключает все умные устройства',
      'ГБР-кнопка отправляет уведомления на ваш телефон',
      'История всех нажатий сохраняется в системе',
      'Вы можете создать автоматизацию для каждого типа нажатия',
    ];
  }
}

export const hubIntegrationService = new HubIntegrationService();
