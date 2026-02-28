// AURION OS — Center HUD
// Main content area that renders the active module panel

import type { AurionStore } from '@/store/aurionStore';
import CoreModule from './modules/CoreModule';
import VoiceModule from './modules/VoiceModule';
import MemoryModule from './modules/MemoryModule';
import SecurityModule from './modules/SecurityModule';
import SmartHomeModule from './modules/SmartHomeModule';
import HealthModule from './modules/HealthModule';
import RemindersModule from './modules/RemindersModule';
import TwinModule from './modules/TwinModule';
import AutonomyModule from './modules/AutonomyModule';
import SocialModule from './modules/SocialModule';
import MultimediaModule from './modules/MultimediaModule';
import AnalyticsModule from './modules/AnalyticsModule';

interface Props { store: AurionStore; }

export default function CenterHUD({ store }: Props) {
  const { state } = store;

  const renderModule = () => {
    switch (state.activeModule) {
      case 'core': return <CoreModule store={store} />;
      case 'voice': return <VoiceModule store={store} />;
      case 'memory': return <MemoryModule store={store} />;
      case 'security': return <SecurityModule store={store} />;
      case 'smarthome': return <SmartHomeModule store={store} />;
      case 'health': return <HealthModule store={store} />;
      case 'reminders': return <RemindersModule store={store} />;
      case 'twin': return <TwinModule store={store} />;
      case 'autonomy': return <AutonomyModule store={store} />;
      case 'social': return <SocialModule store={store} />;
      case 'multimedia': return <MultimediaModule store={store} />;
      case 'analytics': return <AnalyticsModule store={store} />;
      default: return <CoreModule store={store} />;
    }
  };

  return (
    <div
      className="flex-1 overflow-hidden flex flex-col"
      style={{ minWidth: 0 }}
    >
      {renderModule()}
    </div>
  );
}
