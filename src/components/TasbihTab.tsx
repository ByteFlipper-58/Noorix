import React, { useState, useCallback, useRef, useEffect } from 'react';
import { RotateCcw, Sparkles, Check } from 'lucide-react';
import useLocalization from '../hooks/useLocalization';

const DHIKR_PRESETS = [
    { key: 'subhanAllah', arabic: 'سُبْحَانَ ٱللَّٰهِ', target: 33 },
    { key: 'alhamdulillah', arabic: 'ٱلْحَمْدُ لِلَّٰهِ', target: 33 },
    { key: 'allahuAkbar', arabic: 'ٱللَّٰهُ أَكْبَرُ', target: 33 },
];

const TasbihTab: React.FC = () => {
    const { t, isRTL } = useLocalization();
    const [selectedPreset, setSelectedPreset] = useState(0);
    const [count, setCount] = useState(0);
    const [round, setRound] = useState(1);
    const [showCompleted, setShowCompleted] = useState(false);
    const [ripple, setRipple] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const target = DHIKR_PRESETS[selectedPreset].target;
    const progress = (count / target) * 100;

    const handleTap = useCallback(() => {
        if (count < target) {
            setCount(c => c + 1);
            setRipple(true);
            setTimeout(() => setRipple(false), 300);

            // Vibrate on mobile
            if ('vibrate' in navigator) {
                navigator.vibrate(15);
            }
        }
    }, [count, target]);

    useEffect(() => {
        if (count >= target) {
            setShowCompleted(true);
            if ('vibrate' in navigator) {
                navigator.vibrate([50, 100, 50]);
            }
            const timer = setTimeout(() => {
                setShowCompleted(false);
                setCount(0);
                setRound(r => r + 1);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [count, target]);

    const handleReset = () => {
        setCount(0);
        setRound(1);
        setShowCompleted(false);
    };

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                e.preventDefault();
                handleTap();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleTap]);

    return (
        <div className={`${isRTL ? 'text-right' : ''}`}>
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-100">{t('tasbih.title')}</h2>
                <p className="text-xs text-gray-500 mt-1">{t('tasbih.round', { n: round })}</p>
            </div>

            {/* Dhikr selector */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                {DHIKR_PRESETS.map((preset, i) => (
                    <button
                        key={preset.key}
                        onClick={() => { setSelectedPreset(i); setCount(0); setRound(1); }}
                        className={`flex-shrink-0 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 ${i === selectedPreset
                                ? 'bg-gradient-to-r from-emerald-600/80 to-emerald-500/80 text-white shadow-glow-sm border border-emerald-400/20'
                                : 'glass-card text-gray-400 hover:text-gray-200'
                            }`}
                    >
                        {t(`tasbih.${preset.key}`)}
                    </button>
                ))}
            </div>

            {/* Arabic text */}
            <div className="glass-card rounded-3xl p-5 mb-6 text-center relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                <p className="text-3xl text-gray-100 font-serif leading-relaxed" dir="rtl">
                    {DHIKR_PRESETS[selectedPreset].arabic}
                </p>
                <p className="text-xs text-gray-500 mt-2">{t(`tasbih.${DHIKR_PRESETS[selectedPreset].key}`)}</p>
            </div>

            {/* Main counter */}
            <div className="flex flex-col items-center mb-6">
                {/* Counter button */}
                <button
                    ref={buttonRef}
                    onClick={handleTap}
                    disabled={showCompleted}
                    className="relative w-48 h-48 md:w-56 md:h-56 rounded-full focus:outline-none transition-transform duration-150 active:scale-[0.97] disabled:scale-100"
                    aria-label={t('tasbih.tapToCount')}
                >
                    {/* Progress ring */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
                        {/* Background ring */}
                        <circle
                            cx="100" cy="100" r="90"
                            fill="none"
                            stroke="rgba(255,255,255,0.04)"
                            strokeWidth="6"
                        />
                        {/* Progress ring */}
                        <circle
                            cx="100" cy="100" r="90"
                            fill="none"
                            stroke="url(#progressGrad)"
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 90}`}
                            strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                            className="transition-all duration-300 ease-out"
                        />
                        <defs>
                            <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#10B981" />
                                <stop offset="100%" stopColor="#34D399" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Inner circle */}
                    <div className={`absolute inset-3 rounded-full glass-card border border-white/[0.06] flex flex-col items-center justify-center transition-all duration-300 ${ripple ? 'bg-emerald-500/10' : ''
                        }`}>
                        {showCompleted ? (
                            <div className="flex flex-col items-center animate-pulse">
                                <Check className="text-emerald-400 mb-2" size={32} />
                                <span className="text-emerald-400 text-sm font-medium">{t('tasbih.completed')}</span>
                            </div>
                        ) : (
                            <>
                                <span className="text-5xl md:text-6xl font-bold text-gray-100 tabular-nums">
                                    {count}
                                </span>
                                <span className="text-xs text-gray-500 mt-1">/ {target}</span>
                            </>
                        )}
                    </div>

                    {/* Ripple effect */}
                    {ripple && (
                        <div className="absolute inset-0 rounded-full border-2 border-emerald-400/20 animate-ping pointer-events-none" />
                    )}
                </button>

                {/* Tap hint */}
                <p className="text-xs text-gray-600 mt-4">{t('tasbih.tapToCount')}</p>
            </div>

            {/* Reset button */}
            <div className="flex justify-center">
                <button
                    onClick={handleReset}
                    className="glass-card px-5 py-2.5 rounded-2xl flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition-all duration-300"
                >
                    <RotateCcw size={16} />
                    {t('tasbih.reset')}
                </button>
            </div>
        </div>
    );
};

export default TasbihTab;
