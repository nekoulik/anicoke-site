# 🌸 Club Anicoke

Лендинг аниме‑клуба во ВКонтакте + набор браузерных студий в едином визуальном коде.

**Сайт:** [nekoulik.github.io/club-anicoke](https://nekoulik.github.io/club-anicoke)

## Что внутри
- `index.html` / `style.css` / `script.js` — лендинг клуба (заставка, туториал, FAQ, маскот Юки на чистом SVG).
- `cover-studio.html` — генератор обложек (главная 1920×768 / живая 1080×1920).
- `avatar-studio.html` — аватарка с превью кругового кропа ВК.
- `chat-banner-studio.html` — баннер виджета «Чат» (376×256).
- `music-cover-studio.html` — обложка плейлиста / виджета музыки.
- `post-forge.html` — редактор постов с превью ленты ВК.
- `meme-forge.html` — мем‑мейкер на реакциях Юки.

Всё без внешних картинок и библиотек — Юки, тории и лепестки рисуются кодом.

## Запуск локально
```bash
npx serve        # или: python -m http.server
