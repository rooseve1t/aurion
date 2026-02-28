// AURION OS — Main Page
// Главная страница с поддержкой мобильных и десктопных устройств
// Design: Bioluminescent Deep Space HUD

import { useEffect, useRef, useState } from 'react';
import { useAurionStore } from '@/store/aurionStore';
import BootSequence from '@/components/aurion/BootSequence';
import LeftNav from '@/components/aurion/LeftNav';
import CenterHUD from '@/components/aurion/CenterHUD';
import RightPanel from '@/components/aurion/RightPanel';
import TopBar from '@/components/aurion/TopBar';
import EmergencyOverlay from '@/components/aurion/EmergencyOverlay';
import MobileLayout from '@/components/aurion/MobileLayout';

export default function AurionOS() {
  const store = useAurionStore();
  const { state, finishBoot, setBootProgress } = store;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Определение мобильного устройства
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /iPhone|iPad|Android|Mobile|webOS/i.test(navigator.userAgent) || window.innerWidth < 1024;
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Boot sequence
  useEffect(() => {
    let progress = 0;
    timerRef.current = setInterval(() => {
      progress += Math.random() * 12 + 3;
      if (progress >= 100) {
        progress = 100;
        setBootProgress(100);
        clearInterval(timerRef.current!);
        setTimeout(() => finishBoot(), 600);
      } else {
        setBootProgress(Math.min(progress, 99));
      }
    }, 180);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  // Simulate live metrics
  useEffect(() => {
    if (state.isBooting) return;
    const interval = setInterval(() => {
      store.updateMetrics({
        aiLoad: Math.max(10, Math.min(95, state.metrics.aiLoad + (Math.random() - 0.5) * 6)),
        confidenceScore: Math.max(60, Math.min(99, state.metrics.confidenceScore + (Math.random() - 0.5) * 3)),
        riskScore: Math.max(5, Math.min(40, state.metrics.riskScore + (Math.random() - 0.5) * 2)),
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [state.isBooting, state.metrics]);

  if (state.isBooting) {
    return <BootSequence progress={state.bootProgress} />;
  }

  // Mobile layout
  if (isMobile) {
    return (
      <>
        <MobileLayout store={store} isMobile={true} />
        {state.systemMode === 'EMERGENCY' && (
          <EmergencyOverlay store={store} />
        )}
      </>
    );
  }

  // Desktop layout
  return (
    <div
      className="h-screen w-screen flex flex-col overflow-hidden"
      style={{
        background: 'oklch(0.06 0.01 250)',
        backgroundImage: `
          radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.55 0.22 250 / 8%) 0%, transparent 70%),
          radial-gradient(ellipse 40% 40% at 20% 50%, oklch(0.72 0.18 200 / 4%) 0%, transparent 60%),
          radial-gradient(ellipse 30% 30% at 80% 80%, oklch(0.55 0.25 290 / 3%) 0%, transparent 60%)
        `,
      }}
    >
      {/* Top bar */}
      <TopBar store={store} />

      {/* Main HUD area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left navigation rail */}
        <LeftNav store={store} />

        {/* Center content area */}
        <CenterHUD store={store} />

        {/* Right event stream */}
        <RightPanel store={store} />
      </div>

      {/* Emergency overlay */}
      {state.systemMode === 'EMERGENCY' && (
        <EmergencyOverlay store={store} />
      )}
    </div>
  );
}
