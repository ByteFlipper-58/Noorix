import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapPin, Navigation as NavigationIcon, Smartphone, RotateCcw, Compass } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import useLocalization from '../hooks/useLocalization';

// Mecca coordinates
const MECCA_LAT = 21.4225;
const MECCA_LNG = 39.8262;

function calculateQibla(lat: number, lng: number): number {
    const latRad = (lat * Math.PI) / 180;
    const lngRad = (lng * Math.PI) / 180;
    const meccaLatRad = (MECCA_LAT * Math.PI) / 180;
    const meccaLngRad = (MECCA_LNG * Math.PI) / 180;

    const dLng = meccaLngRad - lngRad;
    const x = Math.sin(dLng);
    const y = Math.cos(latRad) * Math.tan(meccaLatRad) - Math.sin(latRad) * Math.cos(dLng);

    let bearing = (Math.atan2(x, y) * 180) / Math.PI;
    return (bearing + 360) % 360;
}

function calculateDistance(lat: number, lng: number): number {
    const R = 6371;
    const dLat = ((MECCA_LAT - lat) * Math.PI) / 180;
    const dLng = ((MECCA_LNG - lng) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos((lat * Math.PI) / 180) * Math.cos((MECCA_LAT * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const QiblaTab: React.FC = () => {
    const { t, isRTL } = useLocalization();
    const { location } = useAppContext();
    const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
    const [compassStatus, setCompassStatus] = useState<'checking' | 'active' | 'unavailable' | 'low_accuracy' | 'permission_needed'>('checking');
    const [calibrationNeeded, setCalibrationNeeded] = useState(false);

    // Smoothing refs
    const lastHeadingRef = useRef<number | null>(null);
    const smoothingFactor = 0.15; // Lower = smoother but more lag

    const qiblaAngle = useMemo(() => {
        if (!location) return null;
        return calculateQibla(location.latitude, location.longitude);
    }, [location]);

    const distance = useMemo(() => {
        if (!location) return null;
        return calculateDistance(location.latitude, location.longitude);
    }, [location]);

    const startCompass = async () => {
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            try {
                const state = await (DeviceOrientationEvent as any).requestPermission();
                if (state === 'granted') {
                    window.addEventListener('deviceorientation', handleOrientation);
                    setCompassStatus('active');
                } else {
                    setCompassStatus('unavailable');
                }
            } catch (e) {
                setCompassStatus('unavailable');
            }
        }
    };

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;
        let mounted = true;

        const handleOrientation = (e: any) => {
            if (!mounted) return;

            let heading: number | null = null;
            let accuracy: number | null = null;

            // iOS logic
            if (typeof e.webkitCompassHeading === 'number') {
                heading = e.webkitCompassHeading;
                accuracy = e.webkitCompassAccuracy;
            }
            // Android logic (absolute orientation)
            else if (e.alpha !== null && (e.absolute === true || e.absolute === undefined)) {
                heading = 360 - e.alpha;
            }

            if (heading !== null) {
                heading = (heading + 360) % 360;

                // Smoothing (Low-pass filter)
                if (lastHeadingRef.current !== null) {
                    let delta = heading - lastHeadingRef.current;
                    if (delta > 180) delta -= 360;
                    if (delta < -180) delta += 360;

                    heading = lastHeadingRef.current + (delta * smoothingFactor);
                    heading = (heading + 360) % 360;
                }

                lastHeadingRef.current = heading;
                setDeviceHeading(heading);

                // Calibration check
                if (accuracy !== null && accuracy > 15) {
                    setCompassStatus('low_accuracy');
                    setCalibrationNeeded(true);
                } else {
                    setCompassStatus('active');
                    setCalibrationNeeded(false);
                }
            }
        };

        const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';

        if (!isSecure) {
            setCompassStatus('unavailable');
            return;
        }

        if ('DeviceOrientationEvent' in window) {
            const DeviceOrientationEvt = DeviceOrientationEvent as any;
            if (typeof DeviceOrientationEvt.requestPermission === 'function') {
                setCompassStatus('permission_needed');
            } else {
                // Android / other
                window.addEventListener('deviceorientationabsolute', handleOrientation);
                window.addEventListener('deviceorientation', handleOrientation);

                timeoutId = setTimeout(() => {
                    if (lastHeadingRef.current === null) setCompassStatus('unavailable');
                }, 2000);
            }
        } else {
            setCompassStatus('unavailable');
        }

        return () => {
            mounted = false;
            clearTimeout(timeoutId);
            window.removeEventListener('deviceorientation', handleOrientation);
            window.removeEventListener('deviceorientationabsolute', handleOrientation);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!location) {
        return (
            <div className={`${isRTL ? 'text-right' : ''}`}>
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-100">{t('qibla.title')}</h2>
                </div>
                <div className="glass-card rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 mx-auto flex items-center justify-center mb-4 border border-white/[0.06]">
                        <MapPin className="text-emerald-400" size={28} />
                    </div>
                    <p className="text-gray-400 text-sm">{t('qibla.needLocation')}</p>
                </div>
            </div>
        );
    }

    // Needle Calculation
    const needleRotation = qiblaAngle !== null
        ? deviceHeading !== null
            ? qiblaAngle - deviceHeading
            : qiblaAngle
        : 0;

    // Dial Rotation
    const dialRotation = deviceHeading !== null ? -deviceHeading : 0;

    return (
        <div className={`${isRTL ? 'text-right' : ''}`}>
            {/* Header */}
            <div className="mb-6 flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-100">{t('qibla.title')}</h2>
                    {location.city && (
                        <p className="text-sm text-gray-400 mt-1 flex items-center gap-1.5">
                            <MapPin size={14} className="text-emerald-400" />
                            {location.city}{location.country ? `, ${location.country}` : ''}
                        </p>
                    )}
                </div>

                {compassStatus === 'permission_needed' && (
                    <button
                        onClick={startCompass}
                        className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs px-3 py-1.5 rounded-lg border border-emerald-500/20 transition-colors"
                    >
                        {t('qibla.enableCompass')}
                    </button>
                )}
            </div>

            {/* Compass */}
            <div className="glass-card rounded-3xl p-6 mb-5 relative overflow-hidden">
                <div className="absolute -top-16 -right-16 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col items-center">
                    {/* Compass Container - Rotating for dial */}
                    <div className="relative w-64 h-64 md:w-72 md:h-72">

                        {/* Moving Dial part (Rotates with compass) */}
                        <div
                            className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform"
                            style={{ transform: `rotate(${dialRotation}deg)` }}
                        >
                            {/* Outer ring */}
                            <div className="absolute inset-0 rounded-full border-2 border-white/[0.06]" />

                            {/* Cardinal directions */}
                            <div className="absolute inset-0">
                                {['N', 'E', 'S', 'W'].map((dir, i) => {
                                    const angle = i * 90;
                                    const rad = (angle * Math.PI) / 180;
                                    const r = 45;
                                    const x = 50 + r * Math.sin(rad);
                                    const y = 50 - r * Math.cos(rad);
                                    return (
                                        <span
                                            key={dir}
                                            className={`absolute text-xs font-bold ${dir === 'N' ? 'text-emerald-400' : 'text-gray-500'}`}
                                            style={{
                                                left: `${x}%`,
                                                top: `${y}%`,
                                                transform: 'translate(-50%, -50%) rotate(${-dialRotation}deg)', // Keep text upright
                                            }}
                                        >
                                            {dir}
                                        </span>
                                    );
                                })}
                            </div>

                            {/* Degree marks */}
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                                {Array.from({ length: 72 }, (_, i) => {
                                    const angle = i * 5;
                                    const isMajor = angle % 30 === 0;
                                    const r1 = isMajor ? 88 : 91;
                                    const r2 = 95;
                                    const rad = (angle * Math.PI) / 180;
                                    return (
                                        <line
                                            key={i}
                                            x1={100 + r1 * Math.sin(rad)}
                                            y1={100 - r1 * Math.cos(rad)}
                                            x2={100 + r2 * Math.sin(rad)}
                                            y2={100 - r2 * Math.cos(rad)}
                                            stroke={isMajor ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)'}
                                            strokeWidth={isMajor ? 1.5 : 0.5}
                                        />
                                    );
                                })}
                            </svg>

                            {/* Qibla Indicator on the dial */}
                            {qiblaAngle !== null && (
                                <div
                                    className="absolute inset-0"
                                    style={{ transform: `rotate(${qiblaAngle}deg)` }}
                                >
                                    <div className="absolute top-2 left-1/2 -translate-x-1/2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Qibla Needle Layer - Independent of dial, points to Qibla */}
                        <div
                            className="absolute inset-4 transition-transform duration-300 ease-out will-change-transform"
                            style={{ transform: `rotate(${needleRotation}deg)` }}
                        >
                            <svg className="w-full h-full" viewBox="0 0 200 200">
                                <polygon
                                    points="100,20 95,100 105,100"
                                    fill="url(#needleGradient)"
                                    opacity="0.9"
                                />
                                <polygon
                                    points="100,180 95,100 105,100"
                                    fill="rgba(255,255,255,0.1)"
                                />
                                <circle cx="100" cy="100" r="6" fill="#10B981" opacity="0.8" />
                                <circle cx="100" cy="100" r="3" fill="white" opacity="0.9" />
                                <defs>
                                    <linearGradient id="needleGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10B981" />
                                        <stop offset="100%" stopColor="#059669" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>

                        {/* Kaaba icon in center */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 border border-emerald-400/20 flex items-center justify-center backdrop-blur-sm z-10">
                                <span className="text-sm">🕋</span>
                            </div>
                        </div>

                        {/* Heading Indicator (Triangle at top) */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-white/50" />

                    </div>

                    {/* Angle display */}
                    <div className="mt-5 text-center">
                        {/* Main: Current Heading */}
                        <div className="text-3xl font-bold text-gray-100 tabular-nums">
                            {deviceHeading !== null ? `${Math.round(deviceHeading)}°` : '—'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{deviceHeading !== null ? (t('qibla.currentHeading') || 'Heading') : t('qibla.compass')}</div>

                        {/* Secondary: Qibla Target */}
                        {qiblaAngle !== null && (
                            <div className="mt-2 text-xs text-amber-500/80 font-medium bg-amber-500/10 px-2 py-0.5 rounded-full inline-block">
                                {t('qibla.qiblaDirection')}: {Math.round(qiblaAngle)}°
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Calibration Warning */}
            {calibrationNeeded && (
                <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3 animate-pulse">
                    <RotateCcw className="text-amber-400" size={20} />
                    <div className="text-xs text-amber-200">
                        {t('qibla.calibrate')}
                    </div>
                </div>
            )}

            {/* Info cards */}
            <div className="space-y-3">
                {/* Direction info */}
                <div className="glass-card rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center border border-white/[0.06]">
                            <NavigationIcon className="text-emerald-400" size={18} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-200">{t('qibla.meccaDirection')}</p>
                            <p className="text-xs text-gray-500">
                                {distance !== null ? `~ ${Math.round(distance).toLocaleString()} ${t('common.km')}` : ''}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Compass status */}
                <div className="glass-card rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-white/[0.06] ${compassStatus === 'active' || compassStatus === 'low_accuracy'
                                ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/10'
                                : 'bg-gradient-to-br from-gray-500/10 to-gray-600/5'
                            }`}>
                            <Smartphone className={compassStatus === 'active' ? 'text-emerald-400' : 'text-gray-500'} size={18} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-200">{t('qibla.compass')}</p>
                            <p className="text-xs text-gray-500">
                                {(compassStatus === 'active' || compassStatus === 'low_accuracy') && '✓ ' + t('qibla.compass')}
                                {compassStatus === 'checking' && '...'}
                                {compassStatus === 'permission_needed' && t('qibla.enableCompass')}
                                {compassStatus === 'unavailable' && t('qibla.compassNotSupported')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QiblaTab;
