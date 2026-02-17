# Continuity Ledger — Noorix Redesign

## Goal
Полный визуальный редизайн приложения Noorix (молитвенный трекер) с сохранением оригинального вида и функционала, но со значительным улучшением эстетики. Особый акцент — боковое меню (sidebar).

## Constraints/Assumptions
- React + TypeScript + Tailwind CSS 3 + framer-motion
- Сохранять оригинальную функциональность и структуру навигации
- Тёмная тема остаётся основной
- Зеленый акцент сохраняется но улучшается
- RTL поддержка остаётся
- Мобильная и десктопная адаптивность

## Key Decisions
- Sidebar: glassmorphism + компактнее + лучшие hover-эффекты
- Карточки: backdrop-blur + утонченные borders + тени
- Типографика: Inter вместо Roboto для основного текста
- Цвета: более изысканная палитра зеленых (emerald vs plain green)
- Анимации: плавные micro-transitions на всех интерактивных элементах

## State

### Done
- Изучены все 13 компонентов приложения
- Изучены Layout.tsx, Navigation.tsx, index.css, tailwind.config.js
- Определена текущая цветовая схема и визуальный стиль

### Now
- Составление плана редизайна (implementation_plan.md)

### Next
- Утверждение плана пользователем
- Реализация редизайна

## Open Questions
- UNCONFIRMED: точные предпочтения по стилю sidebar (минималистичный icons-only vs полный)

## Working Set
- `src/components/Layout.tsx` — основной layout с sidebar
- `src/components/Navigation.tsx` — навигация
- `src/index.css` — глобальные стили
- `tailwind.config.js` — конфиг Tailwind
- `index.html` — шрифты
- Все Tab-компоненты (PrayerTimesTab, SettingsTab, etc.)
