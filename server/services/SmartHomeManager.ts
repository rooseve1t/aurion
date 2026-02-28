import mqtt from 'mqtt';
import { createLogger } from './Logger';
import { eventBus } from '../core/EventBus';

const logger = createLogger('SmartHomeManager');

export interface SmartDevice {
  id: string;
  name: string;
  type: 'light' | 'switch' | 'sensor' | 'thermostat';
  brand: 'hue' | 'xiaomi' | 'yeelight' | 'generic';
  state: any;
}

class SmartHomeManager {
  private client: mqtt.MqttClient | null = null;
  private devices: Map<string, SmartDevice> = new Map();

  constructor() {
    this.connectMQTT();
  }

  private connectMQTT() {
    const brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
    logger.info(`Connecting to MQTT broker at ${brokerUrl}`);

    try {
      this.client = mqtt.connect(brokerUrl);

      this.client.on('connect', () => {
        logger.info('Connected to MQTT broker');
        this.client?.subscribe('home/+/status');
      });

      this.client.on('message', (topic, message) => {
        this.handleMessage(topic, message.toString());
      });

      this.client.on('error', (err) => {
        logger.error(err, 'MQTT error');
      });
    } catch (error) {
      logger.error(error, 'Failed to connect to MQTT broker');
    }
  }

  private handleMessage(topic: string, message: string) {
    // topic: home/{deviceId}/status
    const parts = topic.split('/');
    if (parts.length === 3 && parts[2] === 'status') {
      const deviceId = parts[1];
      try {
        const payload = JSON.parse(message);
        this.updateDeviceState(deviceId, payload);
      } catch (e) {
        logger.warn(`Failed to parse MQTT message for ${deviceId}: ${message}`);
      }
    }
  }

  public updateDeviceState(deviceId: string, state: any) {
    const device = this.devices.get(deviceId);
    if (device) {
      device.state = { ...device.state, ...state };
      this.devices.set(deviceId, device);
      
      eventBus.publish({
        id: `evt-${Date.now()}`,
        type: 'DEVICE_STATE_UPDATE',
        payload: { deviceId, state },
        priority: 'low',
        source: 'SmartHomeManager',
        timestamp: Date.now()
      });
    }
  }

  public async executeCommand(deviceId: string, command: string, params: any = {}) {
    logger.info({ deviceId, command, params }, 'Executing command');
    
    // In a real implementation, this would route to specific adapters
    // For now, we'll just publish to MQTT if connected
    if (this.client && this.client.connected) {
      this.client.publish(`home/${deviceId}/set`, JSON.stringify({ command, ...params }));
    } else {
      logger.warn('MQTT not connected, command not sent');
    }
  }

  public registerDevice(device: SmartDevice) {
    this.devices.set(device.id, device);
    logger.info(`Registered device: ${device.name} (${device.id})`);
  }

  public getDevice(deviceId: string) {
    return this.devices.get(deviceId);
  }

  public getAllDevices() {
    return Array.from(this.devices.values());
  }
}

export const smartHomeManager = new SmartHomeManager();
