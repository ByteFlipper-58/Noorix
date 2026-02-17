import React, { useMemo } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import useLocalization from '../hooks/useLocalization';

// Curated collection of Quran ayahs (English + Arabic)
const AYAHS = [
    { arabic: 'بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', ref: '1:1', en: 'In the name of Allah, the Most Gracious, the Most Merciful' },
    { arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', ref: '1:5', en: 'You alone we worship, and You alone we ask for help' },
    { arabic: 'ٱللَّٰهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَيُّ ٱلْقَيُّومُ', ref: '2:255', en: 'Allah — there is no deity except Him, the Ever-Living, the Sustainer' },
    { arabic: 'رَبَّنَآ ءَاتِنَا فِى ٱلدُّنْيَا حَسَنَةً وَفِى ٱلْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ ٱلنَّارِ', ref: '2:201', en: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the torment of the Fire' },
    { arabic: 'إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا', ref: '94:6', en: 'Indeed, with hardship comes ease' },
    { arabic: 'فَٱذْكُرُونِىٓ أَذْكُرْكُمْ', ref: '2:152', en: 'So remember Me; I will remember you' },
    { arabic: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰٓ', ref: '93:5', en: 'And your Lord is going to give you, and you will be satisfied' },
    { arabic: 'قُلْ هُوَ ٱللَّٰهُ أَحَدٌ', ref: '112:1', en: 'Say, He is Allah, [who is] One' },
    { arabic: 'وَمَن يَتَوَكَّلْ عَلَى ٱللَّٰهِ فَهُوَ حَسْبُهُۥٓ', ref: '65:3', en: 'And whoever relies upon Allah — then He is sufficient for him' },
    { arabic: 'ٱدْعُونِىٓ أَسْتَجِبْ لَكُمْ', ref: '40:60', en: 'Call upon Me; I will respond to you' },
    { arabic: 'رَبِّ ٱشْرَحْ لِى صَدْرِى', ref: '20:25', en: 'My Lord, expand for me my chest' },
    { arabic: 'حَسْبُنَا ٱللَّٰهُ وَنِعْمَ ٱلْوَكِيلُ', ref: '3:173', en: 'Sufficient for us is Allah, and He is the best Disposer of affairs' },
    { arabic: 'وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ', ref: '57:4', en: 'And He is with you wherever you are' },
    { arabic: 'وَقُل رَّبِّ زِدْنِى عِلْمًا', ref: '20:114', en: 'And say, My Lord, increase me in knowledge' },
    { arabic: 'إِنَّ ٱللَّٰهَ مَعَ ٱلصَّٰبِرِينَ', ref: '2:153', en: 'Indeed, Allah is with the patient' },
    { arabic: 'لَا يُكَلِّفُ ٱللَّٰهُ نَفْسًا إِلَّا وُسْعَهَا', ref: '2:286', en: 'Allah does not burden a soul beyond that it can bear' },
    { arabic: 'وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ ٱلْوَرِيدِ', ref: '50:16', en: 'And We are closer to him than his jugular vein' },
    { arabic: 'فَإِنَّ ذِكْرَى تَنفَعُ ٱلْمُؤْمِنِينَ', ref: '51:55', en: 'For indeed, the reminder benefits the believers' },
    { arabic: 'وَلَا تَيْـَٔسُوا۟ مِن رَّوْحِ ٱللَّٰهِ', ref: '12:87', en: 'And do not despair of relief from Allah' },
    { arabic: 'رَبَّنَا تَقَبَّلْ مِنَّآ ۖ إِنَّكَ أَنتَ ٱلسَّمِيعُ ٱلْعَلِيمُ', ref: '2:127', en: 'Our Lord, accept from us. Indeed You are the Hearing, the Knowing' },
    { arabic: 'وَتَوَكَّلْ عَلَى ٱلْحَيِّ ٱلَّذِى لَا يَمُوتُ', ref: '25:58', en: 'And rely upon the Ever-Living who does not die' },
    { arabic: 'ٱقْرَأْ بِٱسْمِ رَبِّكَ ٱلَّذِى خَلَقَ', ref: '96:1', en: 'Read in the name of your Lord who created' },
    { arabic: 'رَّبِّ ٱرْحَمْهُمَا كَمَا رَبَّيَانِى صَغِيرًا', ref: '17:24', en: 'My Lord, have mercy upon them as they brought me up when I was small' },
    { arabic: 'وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ', ref: '68:4', en: 'And indeed, you are of a great moral character' },
    { arabic: 'فَبِأَيِّ ءَالَآءِ رَبِّكُمَا تُكَذِّبَانِ', ref: '55:13', en: 'So which of the favors of your Lord would you deny' },
    { arabic: 'يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱسْتَعِينُوا۟ بِٱلصَّبْرِ وَٱلصَّلَوٰةِ', ref: '2:153', en: 'O you who believe, seek help through patience and prayer' },
    { arabic: 'وَمَا تَوْفِيقِىٓ إِلَّا بِٱللَّٰهِ', ref: '11:88', en: 'And my success is not but through Allah' },
    { arabic: 'إِنَّا لِلَّٰهِ وَإِنَّآ إِلَيْهِ رَٰجِعُونَ', ref: '2:156', en: 'Indeed we belong to Allah, and indeed to Him we will return' },
    { arabic: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا', ref: '3:8', en: 'Our Lord, let not our hearts deviate after You have guided us' },
    { arabic: 'سَلَٰمٌ قَوْلًا مِّن رَّبٍّ رَّحِيمٍ', ref: '36:58', en: 'Peace — a word from a Merciful Lord' },
];

const AyahOfDay: React.FC = () => {
    const { t } = useLocalization();

    const ayah = useMemo(() => {
        // Pick ayah based on day of year for consistency
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const dayOfYear = Math.floor(((now as any) - (start as any)) / (1000 * 60 * 60 * 24));
        return AYAHS[dayOfYear % AYAHS.length];
    }, []);

    return (
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden group">
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-700" />
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center border border-white/[0.06]">
                    <BookOpen className="text-amber-400" size={14} />
                </div>
                <span className="text-xs font-medium text-amber-400/70 uppercase tracking-wider">
                    {t('ayah.title')}
                </span>
                <Sparkles className="text-amber-400/30 ml-auto" size={12} />
            </div>

            {/* Arabic text */}
            <p className="text-xl text-gray-100 text-center leading-loose font-serif mb-3" dir="rtl">
                {ayah.arabic}
            </p>

            {/* Translation */}
            <p className="text-sm text-gray-400 text-center leading-relaxed italic mb-3">
                "{ayah.en}"
            </p>

            {/* Reference */}
            <p className="text-xs text-gray-600 text-center">
                {t('ayah.source')} {ayah.ref}
            </p>
        </div>
    );
};

export default AyahOfDay;
