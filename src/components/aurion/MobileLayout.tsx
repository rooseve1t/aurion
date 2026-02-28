// AURION OS — Mobile Layout
// Адаптивный layout для мобильных устройств (iPhone XR и выше)

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { AurionStore } from '@/store/aurionStore';
import TopBar from './TopBar';
import LeftNav from './LeftNav';
import CenterHUD from './CenterHUD';
import RightPanel from './RightPanel';
import { useI18n } from '@/contexts/I18nContext';

interface Props {
  store: AurionStore;
  isMobile: boolean;
}

export default function MobileLayout({ store, isMobile }: Props) {
  const [navOpen, setNavOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const i18n = useI18n();

  if (!isMobile) {
    // Desktop layout
    return (
      <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
        <TopBar store={store} />
        <div className="flex flex-1 overflow-hidden gap-4 p-4">
          <div className="w-48 shrink-0 overflow-y-auto">
            <LeftNav store={store} />
          </div>
          <div className="flex-1 overflow-y-auto">
            <CenterHUD store={store} />
          </div>
          <div className="w-64 shrink-0 overflow-y-auto">
            <RightPanel store={store} />
          </div>
        </div>
      </div>
    );
  }

  // Mobile layout (iPhone XR)
  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Mobile TopBar с меню-бургером */}
      <div
        className="flex items-center px-4 h-12 shrink-0 gap-3"
        style={{
          background: 'oklch(0.07 0.012 240 / 95%)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid oklch(0.72 0.18 200 / 15%)',
        }}
      >
        {/* Меню-бургер */}
        <button
          onClick={() => setNavOpen(!navOpen)}
          className="p-1.5 rounded transition-colors"
          style={{
            color: 'oklch(0.72 0.18 200)',
            background: navOpen ? 'oklch(0.72 0.18 200 / 15%)' : 'transparent',
          }}
        >
          {navOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Логотип */}
        <div className="flex-1 flex items-center gap-2">
          <span
            className="text-sm font-bold tracking-[0.1em]"
            style={{
              color: 'oklch(0.85 0.18 200)',
              fontFamily: 'Space Grotesk, sans-serif',
            }}
          >
            {i18n.app_title}
          </span>
        </div>

        {/* Кнопка события */}
        <button
          onClick={() => setRightPanelOpen(!rightPanelOpen)}
          className="p-1.5 rounded transition-colors"
          style={{
            color: 'oklch(0.72 0.18 200)',
            background: rightPanelOpen ? 'oklch(0.72 0.18 200 / 15%)' : 'transparent',
          }}
        >
          <span className="text-xs font-semibold">📊</span>
        </button>
      </div>

      {/* Основной контент */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Выдвижное меню (левое) */}
        {navOpen && (
          <>
            {/* Overlay */}
            <div
              className="absolute inset-0 z-40 bg-black/50"
              onClick={() => setNavOpen(false)}
            />
            {/* Меню */}
            <div
              className="absolute left-0 top-12 bottom-0 w-64 z-50 overflow-y-auto"
              style={{
                background: 'oklch(0.07 0.012 240 / 98%)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid oklch(0.72 0.18 200 / 15%)',
              }}
            >
              <LeftNav store={store} />
            </div>
          </>
        )}

        {/* Центральный контент */}
        <div className="flex-1 overflow-y-auto">
          <CenterHUD store={store} />
        </div>

        {/* Выдвижная правая панель */}
        {rightPanelOpen && (
          <>
            {/* Overlay */}
            <div
              className="absolute inset-0 z-40 bg-black/50"
              onClick={() => setRightPanelOpen(false)}
            />
            {/* Панель */}
            <div
              className="absolute right-0 top-12 bottom-0 w-72 z-50 overflow-y-auto"
              style={{
                background: 'oklch(0.07 0.012 240 / 98%)',
                backdropFilter: 'blur(20px)',
                borderLeft: '1px solid oklch(0.72 0.18 200 / 15%)',
              }}
            >
              <RightPanel store={store} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
