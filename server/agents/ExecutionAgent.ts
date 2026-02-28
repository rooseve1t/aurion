import { BaseAgent } from './BaseAgent';
import { AurionEvent } from '../core/EventBus';
import { createLogger } from '../core/Logger';
import { dbService } from '../services/DatabaseService';
import { desktopControlService } from '../services/DesktopControlService';
import { smartHomeManager } from '../services/SmartHomeManager';

const logger = createLogger('ExecutionAgent');

export class ExecutionAgent extends BaseAgent {
  constructor() {
    super('agent-execution', 'EXECUTION');
  }

  async handleEvent(event: AurionEvent): Promise<void> {
    if (event.type === 'EXECUTE_ACTION') {
      await this.execute(event.payload.command, event.payload.context);
    }
  }

  async execute(command: string, context: any): Promise<any> {
    this.status = 'active';
    logger.info(`Executing action: ${command}`);

    let result = { status: 'success', message: 'Действие симулировано' };

    try {
      if (command.includes('toggle') && context.deviceId) {
        // Smart Home Action
        await smartHomeManager.executeCommand(context.deviceId, 'toggle', context);
        result = { status: 'success', message: `Устройство ${context.deviceId} переключено` };
      } else if (command.includes('email')) {
        // Email Action (Mock)
        result = { status: 'success', message: `Письмо отправлено ${context.recipient}` };
      } else if (command.includes('mouse') || command.includes('click')) {
        // Desktop Control Action
        if (command.includes('move')) {
          await desktopControlService.moveMouse(context.x || 0, context.y || 0);
        } else if (command.includes('click')) {
          await desktopControlService.clickMouse(context.button || 'left');
        }
        result = { status: 'success', message: 'Действие мыши выполнено' };
      } else if (command.includes('type')) {
        await desktopControlService.typeText(context.text || '');
        result = { status: 'success', message: 'Текст напечатан' };
      } else if (command.includes('open') && context.appName) {
        await desktopControlService.openApplication(context.appName);
        result = { status: 'success', message: `Открыто приложение ${context.appName}` };
      }
    } catch (e) {
      logger.error('Execution failed', e);
      result = { status: 'error', message: 'Ошибка выполнения' };
    }

    await this.logAction('ACTION_EXECUTED', { command, result });
    this.status = 'idle';
    return result;
  }
}
