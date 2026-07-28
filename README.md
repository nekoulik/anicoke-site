# 🌸 Club Anicoke

![License: MIT](https://img.shields.io/badge/License-MIT-ff9ec7.svg)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-live-8ecbff.svg)
![статус](https://img.shields.io/badge/набор-открыт-6fe3c1.svg)

Лендинг аниме‑клуба во ВКонтакте + набор браузерных студий в едином визуальном коде.

**Сайт:** [nekoulik.github.io/anicoke-site](https://nekoulik.github.io/anicoke-site)
**Группа ВК:** [vk.ru/anicoke](https://vk.ru/anicoke)

## Что внутри

| Инструмент | Назначение | Открыть |
|---|---|---|
| `index.html` · `style.css` · `script.js` | Лендинг клуба: кино‑заставка, туториал вступления, FAQ, интерактивный чат, таймер до первого сбора | [сайт](https://nekoulik.github.io/anicoke-site/) |
| `cover-studio.html` | Генератор обложек (главная 1920×768 / живая 1080×1920) | [↗](https://nekoulik.github.io/anicoke-site/cover-studio.html) |
| `avatar-studio.html` | Аватарка с превью кругового кропа ВК | [↗](https://nekoulik.github.io/anicoke-site/avatar-studio.html) |
| `chat-banner-studio.html` | Баннер виджета «Чат» (376×256) | [↗](https://nekoulik.github.io/anicoke-site/chat-banner-studio.html) |
| `music-cover-studio.html` | Обложка плейлиста / виджета музыки | [↗](https://nekoulik.github.io/anicoke-site/music-cover-studio.html) |
| `post-forge.html` | Редактор постов с живым превью ленты ВК | [↗](https://nekoulik.github.io/anicoke-site/post-forge.html) |
| `meme-forge.html` | Мем‑мейкер на реакциях Юки | [↗](https://nekoulik.github.io/anicoke-site/meme-forge.html) |
| `og-maker.html` | Картинка‑превью ссылки для соцсетей (1200×630) | [↗](https://nekoulik.github.io/anicoke-site/og-maker.html) |

## Маскот

**Юки** — хранительница опенингов и чата: кошко‑девочка с длинными розовыми волосами, ушками, наушниками и гетерохромией (фиолетовый + бирюзовый глаз). Полностью нарисована кодом — в проекте **нет ни одной растровой картинки персонажа**: лицо, тории, лепестки сакуры и бегущие чибики генерируются как SVG/Canvas прямо в браузере.

## Как сделано

- Чистые **HTML / CSS / JS** — без фреймворков, сборщиков и внешних библиотек.
- Персонаж и декор — генеративный **SVG**; фоны, эффекты и экспорт картинок — **Canvas API**.
- Шрифты: **Unbounded**, **Golos Text**, **DotGothic16**, **JetBrains Mono** (Google Fonts).
- Каждая студия — самодостаточный один файл: открыл и работаешь, ничего ставить не нужно.

## Структура проекта

```
anicoke-site/
├── index.html              # лендинг клуба
├── style.css
├── script.js
├── favicon.svg             # иконка вкладки — мордочка Юки
├── og-image.png            # превью ссылки для соцсетей (1200×630)
├── robots.txt              # лендинг открыт, студии закрыты от индексации
├── LICENSE                 # MIT
├── README.md
├── cover-studio.html       # студии-инструменты
├── avatar-studio.html
├── chat-banner-studio.html
├── music-cover-studio.html
├── post-forge.html
├── meme-forge.html
└── og-maker.html
```

## Запуск локально

```bash
npx serve
# или
python -m http.server
```

Открой `http://localhost:3000` (или порт, который покажет команда). Запускай через локальный сервер, а не двойным кликом по файлу — так корректно подтягиваются шрифты, работает буфер обмена и консоль остаётся чистой.

<!-- Скриншоты: положи картинки в папку docs/ и раскомментируй
## Скриншоты
![Лендинг](docs/landing.png)
![Мем-мейкер](docs/meme-forge.png)
-->

## Лицензия

[MIT](LICENSE) — форкай, меняй, открывай свой клуб. Предложить тайтл или задать вопрос можно в сообщения группы ВК.

Сделано с 🌸 на энтузиазме и опенингах.
