// Mobile Layout V2 — iPhone XR Optimized
// Полная адаптация для мобильных устройств с выдвижным меню

import { useState, useEffect } from 'react';
import { Menu, X, Home, Shield, Zap, Heart, Bell, Settings } from 'lucide-react';
import TopBar from './TopBar';
import CenterHUD from './CenterHUD';
import LeftNav from './LeftNav';
import RightPanel from './RightPanel';
import type { AurionStore } from '@/store/aurionStore';

interface MobileLayoutV2Props {
  store: AurionStore;
  isMobile: boolean;
}

export default function MobileLayoutV2({ store, isMobile }: MobileLayoutV2Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'modules' | 'events' | 'settings'>('home');

  // Закрытие меню при клике на контент
  useEffect(() => {
    if (!isMobile) {
      setMenuOpen(false);
    }
  }, [isMobile]);

  return (
    <div className="h-screen w-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* Mobile Top Bar */}
      <div className="bg-slate-900/80 border-b border-cyan-500/20 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 hover:bg-slate-800 rounded transition"
        >
          {menuOpen ? (
            <X className="w-6 h-6 text-cyan-400" />
          ) : (
            <Menu className="w-6 h-6 text-cyan-400" />
          )}
        </button>

        <div className="flex-1 text-center">
          <h1 className="text-sm font-bold text-cyan-300">AURION OS</h1>
          <p className="text-xs text-cyan-400/60">{store.state.systemMode}</p>
        </div>

        <div className="w-6 h-6" /> {/* Spacer for alignment */}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex">
        {/* Hamburger Menu Overlay */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setMenuOpen(false)}
          />
        )}

        {/* Side Menu */}
        <div
          className={`fixed left-0 top-0 h-screen w-64 bg-slate-900/95 border-r border-cyan-500/20 transform transition-transform duration-300 z-50 overflow-y-auto ${
            menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 space-y-2">
            <LeftNav store={store} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            {activeTab === 'home' && <CenterHUD store={store} />}
            {activeTab === 'modules' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-cyan-300">Модули</h2>
                <LeftNav store={store} />
              </div>
            )}
            {activeTab === 'events' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-cyan-300">События</h2>
                <RightPanel store={store} />
              </div>
            )}
            {activeTab === 'settings' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-cyan-300">Настройки</h2>
                <div className="bg-slate-800/40 border border-cyan-500/20 rounded-lg p-4">
                  <p className="text-sm text-cyan-300/70">Настройки системы</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="bg-slate-900/80 border-t border-cyan-500/20 grid grid-cols-4 gap-1 p-2">
        <button
          onClick={() => {
            setActiveTab('home');
            setMenuOpen(false);
          }}
          className={`flex flex-col items-center justify-center py-2 rounded transition ${
            activeTab === 'home'
              ? 'bg-cyan-600/40 text-cyan-300'
              : 'text-cyan-400/60 hover:bg-slate-800'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs mt-1">Главная</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('modules');
            setMenuOpen(false);
          }}
          className={`flex flex-col items-center justify-center py-2 rounded transition ${
            activeTab === 'modules'
              ? 'bg-cyan-600/40 text-cyan-300'
              : 'text-cyan-400/60 hover:bg-slate-800'
          }`}
        >
          <Zap className="w-5 h-5" />
          <span className="text-xs mt-1">Модули</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('events');
            setMenuOpen(false);
          }}
          className={`flex flex-col items-center justify-center py-2 rounded transition ${
            activeTab === 'events'
              ? 'bg-cyan-600/40 text-cyan-300'
              : 'text-cyan-400/60 hover:bg-slate-800'
          }`}
        >
          <Bell className="w-5 h-5" />
          <span className="text-xs mt-1">События</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('settings');
            setMenuOpen(false);
          }}
          className={`flex flex-col items-center justify-center py-2 rounded transition ${
            activeTab === 'settings'
              ? 'bg-cyan-600/40 text-cyan-300'
              : 'text-cyan-400/60 hover:bg-slate-800'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-xs mt-1">Настройки</span>
        </button>
      </div>
    </div>
  );
}
