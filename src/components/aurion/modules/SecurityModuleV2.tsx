// Security Module V2 — Guardian with GBR Button Integration
// Охранный модуль с интеграцией ГБР-кнопки через Hub

import { useState, useEffect } from 'react';
import { AlertTriangle, Lock, Camera, Zap, Shield, Bell } from 'lucide-react';
import { hubIntegrationService, type GBRButtonEvent } from '@/services/hubIntegrationService';
import { jarvisService } from '@/services/jarvisService';
import type { AurionStore } from '@/store/aurionStore';

interface SecurityModuleV2Props {
  store: AurionStore;
}

export default function SecurityModuleV2({ store }: SecurityModuleV2Props) {
  const [gbrEvents, setGbrEvents] = useState<GBRButtonEvent[]>([]);
  const [hubConnected, setHubConnected] = useState(false);
  const [gbrButtonStatus, setGbrButtonStatus] = useState<boolean>(true);
  const [automations, setAutomations] = useState<any[]>([]);

  // Подключение к Hub при загрузке
  useEffect(() => {
    const initializeHub = async () => {
      try {
        // Подключение к Hub
        const hub = await hubIntegrationService.connectToHub({
          name: 'Квартира девушки',
          protocol: 'mqtt',
          host: 'home.local',
          port: 1883,
          username: 'admin',
          password: 'password',
        });

        // Обнаружение устройств
        await hubIntegrationService.discoverDevices(hub.id);
        setHubConnected(true);

        // Подписка на события ГБР-кнопки
        const unsubscribe = hubIntegrationService.onGBRButtonEvent((event) => {
          setGbrEvents(prev => [event, ...prev].slice(0, 20));
          handleGBRButtonEvent(event);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Ошибка инициализации Hub:', error);
        setHubConnected(false);
      }
    };

    const unsubscribe = initializeHub();
    return () => {
      unsubscribe?.then(fn => fn?.());
    };
  }, []);

  // Обработка события ГБР-кнопки
  const handleGBRButtonEvent = (event: GBRButtonEvent) => {
    console.log(`🔘 ГБР-кнопка событие: ${event.action}`);

    switch (event.action) {
      case 'press':
        store.setSystemMode('GUARDIAN');
        console.log(`GBR Button: Guardian mode activated at ${event.location}`);
        break;

      case 'long_press':
        store.setSystemMode('EMERGENCY');
        console.log(`GBR Button: EMERGENCY MODE ACTIVATED! Security notified.`);
        break;

      case 'double_press':
        store.setSystemMode('SLEEP');
        console.log(`GBR Button: System in Sleep mode. All devices disabled.`);
        break;
    }
  };

  // Симуляция нажатия ГБР-кнопки
  const simulateGBRPress = (action: 'press' | 'long_press' | 'double_press') => {
    const event = hubIntegrationService.handleGBRButtonPress(
      'hub-1',
      'gbr-button-1',
      action,
      'Прихожая'
    );
    setGbrEvents(prev => [event, ...prev].slice(0, 20));
    handleGBRButtonEvent(event);
  };

  // Создание автоматизации для ГБР-кнопки
  const createGBRAutomation = () => {
    const automation = hubIntegrationService.createGBRAutomation({
      name: 'Вечерний режим безопасности',
      buttonId: 'gbr-button-1',
      action: 'press',
      triggers: [
        { deviceId: 'light-smart-1', command: 'off' },
        { deviceId: 'lock-smart-1', command: 'on' },
        { deviceId: 'camera-1', command: 'on' },
      ],
    });

    setAutomations(prev => [...prev, automation]);
  };

  // Получение предсказаний безопасности
  const securityPredictions = jarvisService.predictSecurityThreats(store);
  const contextualHelp = jarvisService.getContextualHelp(store);

  return (
    <div className="space-y-6">
      {/* ГБР-кнопка статус */}
      <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-red-400" />
            <div>
              <h3 className="text-lg font-bold text-red-300">ГБР-КНОПКА</h3>
              <p className="text-sm text-red-400/70">
                {hubConnected ? '✓ Подключена к Hub' : '✗ Не подключена'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-red-300">
              {gbrButtonStatus ? 'АКТИВНА' : 'НЕАКТИВНА'}
            </div>
            <div className="text-xs text-red-400/70">Статус: OK</div>
          </div>
        </div>

        {/* Кнопки управления */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => simulateGBRPress('press')}
            className="bg-red-600/40 hover:bg-red-600/60 border border-red-500/50 rounded px-3 py-2 text-sm font-mono text-red-300 transition"
          >
            Нажать
          </button>
          <button
            onClick={() => simulateGBRPress('long_press')}
            className="bg-orange-600/40 hover:bg-orange-600/60 border border-orange-500/50 rounded px-3 py-2 text-sm font-mono text-orange-300 transition"
          >
            Долгое
          </button>
          <button
            onClick={() => simulateGBRPress('double_press')}
            className="bg-yellow-600/40 hover:bg-yellow-600/60 border border-yellow-500/50 rounded px-3 py-2 text-sm font-mono text-yellow-300 transition"
          >
            Двойное
          </button>
        </div>

        {/* Рекомендации */}
        <div className="mt-4 pt-4 border-t border-red-500/20 space-y-2">
          {hubIntegrationService.getGBRRecommendations().map((rec, i) => (
            <div key={i} className="flex gap-2 text-xs text-red-300/80">
              <span>•</span>
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* История нажатий ГБР-кнопки */}
      {gbrEvents.length > 0 && (
        <div className="bg-slate-900/40 border border-cyan-500/20 rounded-lg p-4">
          <h4 className="text-sm font-bold text-cyan-300 mb-3">История ГБР-кнопки</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {gbrEvents.map(event => (
              <div key={event.id} className="flex justify-between text-xs text-cyan-400/70 bg-slate-800/40 p-2 rounded">
                <span>
                  {event.action === 'press' && '🔘 Нажата'}
                  {event.action === 'long_press' && '⏱️ Долгое нажатие'}
                  {event.action === 'double_press' && '⏱️⏱️ Двойное нажатие'}
                  {' — '}
                  {event.location}
                </span>
                <span>{new Date(event.timestamp).toLocaleTimeString('ru-RU')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Предсказания безопасности */}
      {securityPredictions.length > 0 && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <h4 className="text-sm font-bold text-red-300 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Предсказания безопасности
          </h4>
          <div className="space-y-3">
            {securityPredictions.map((pred, i) => (
              <div key={i} className="bg-slate-800/40 p-3 rounded border border-red-500/20">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-bold text-red-300">{pred.prediction}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    pred.urgency === 'critical' ? 'bg-red-600/40 text-red-300' :
                    pred.urgency === 'high' ? 'bg-orange-600/40 text-orange-300' :
                    'bg-yellow-600/40 text-yellow-300'
                  }`}>
                    {pred.urgency.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-cyan-300/70 mb-2">{pred.recommendation}</p>
                <div className="text-xs text-cyan-400/50">
                  Уверенность: {(pred.confidence * 100).toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Контекстная помощь */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <h4 className="text-sm font-bold text-blue-300 mb-2 flex items-center gap-2">
          <Bell className="w-4 h-4" />
          Рекомендация Джарвиса
        </h4>
        <p className="text-sm text-blue-300/80">{contextualHelp}</p>
      </div>

      {/* Автоматизации */}
      <div className="bg-slate-900/40 border border-cyan-500/20 rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-bold text-cyan-300">Автоматизации ГБР-кнопки</h4>
          <button
            onClick={createGBRAutomation}
            className="text-xs bg-cyan-600/40 hover:bg-cyan-600/60 border border-cyan-500/50 rounded px-2 py-1 text-cyan-300 transition"
          >
            + Создать
          </button>
        </div>
        {automations.length > 0 ? (
          <div className="space-y-2">
            {automations.map(auto => (
              <div key={auto.id} className="flex justify-between items-center bg-slate-800/40 p-2 rounded text-xs">
                <span className="text-cyan-300">{auto.name}</span>
                <span className={`px-2 py-1 rounded ${auto.active ? 'bg-green-600/40 text-green-300' : 'bg-red-600/40 text-red-300'}`}>
                  {auto.active ? 'Активна' : 'Отключена'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-cyan-400/50">Автоматизации не созданы</p>
        )}
      </div>

      {/* Статус системы безопасности */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-900/40 border border-cyan-500/20 rounded-lg p-3 text-center">
          <Camera className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
          <div className="text-xs font-bold text-cyan-300">Камеры</div>
          <div className="text-lg font-bold text-cyan-400">3/3</div>
        </div>
        <div className="bg-slate-900/40 border border-cyan-500/20 rounded-lg p-3 text-center">
          <Lock className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
          <div className="text-xs font-bold text-cyan-300">Замки</div>
          <div className="text-lg font-bold text-cyan-400">2/2</div>
        </div>
        <div className="bg-slate-900/40 border border-cyan-500/20 rounded-lg p-3 text-center">
          <Shield className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
          <div className="text-xs font-bold text-cyan-300">Датчики</div>
          <div className="text-lg font-bold text-cyan-400">5/5</div>
        </div>
      </div>
    </div>
  );
}
