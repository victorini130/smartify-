# Modern Smartschool - Modular Script Architecture

Dit project is herschikt van één monolithisch `content.js` bestand naar meerdere gespecialiseerde modules voor betere onderhoudsbaarheid en code-organisatie.

## Module Structuur

### 1. **utils.js** - Hulpprogramma's
- DOM selectoren (`$`, `$$`)
- LocalStorage helpers (`gS`, `sS`, `gI`, `sI`, `gJ`, `sJ`)
- Highscore management
- User settings management
- Streak tracking
- HTML escaping

**Afhankelijkheden:** Geen

---

### 2. **config.js** - Configuratie
- SVG Icon Set (`IC`)
- Spellijst (`GAMES`)
- Spelpictogrammen (`GAME_ICONS`)

**Afhankelijkheden:** Geen

---

### 3. **styles.js** - CSS Styling
- `buildStyles(accent)` - Bouwt alle globale CSS

**Afhankelijkheden:** `Config`

---

### 4. **popup.js** - Pop-up Systeem
- `cFP()` - Maakt zwevende pop-ups
- Drag & resize functionaliteit
- Pinned widgets management
- Widget positioning

**Afhankelijkheden:** `Utils`, `Config`

---

### 5. **tools.js** - Tool Pop-ups
- `createTimerPopup()` - Timer & Stopwatch
- `createCalcPopup()` - Rekenmachine
- `createNotesPopup()` - Notities
- `createRulerPopup()` - Liniaal
- `createClockPopup()` - Klok
- `createMusicPopup()` - Spotify
- `createThemePopup()` - Themakiezer

**Afhankelijkheden:** `Utils`, `Config`, `Popup`, `Styles`

---

### 6. **games.js** - Alle Spelimplementaties
- Snake
- Flappy Bird
- Whack-a-Mole
- 2048
- Galgje
- Quiz
- Tetris
- Memory
- Pong
- Breakout
- TicTacToe

**Afhankelijkheden:** `Utils`, `Config`

---

### 7. **dashboard.js** - Dashboard Widgets
- Widget rendering
- Game cards op dashboard
- Widget toevoeging/verwijdering
- Specifieke widget implementaties (klok, weer, taken, etc.)

**Afhankelijkheden:** `Utils`, `Config`, `Popup`, `Games`

---

### 8. **layout.js** - Hoofdlayout
- Bouwt de hoofdinterface
- Sidebar navigation
- Header met gebruikersinformatie
- Settings popup
- Game Center pop-up

**Afhankelijkheden:** Alle andere modules

---

### 9. **index.js** - Initialisatie
- Entry point
- Voert Layout.buildLayout() uit

**Afhankelijkheden:** Alle andere modules

---

## Laadvolgorde

Scripts MOETEN in deze volgorde geladen worden:

```html
<script src="utils.js"></script>
<script src="config.js"></script>
<script src="styles.js"></script>
<script src="popup.js"></script>
<script src="tools.js"></script>
<script src="games.js"></script>
<script src="dashboard.js"></script>
<script src="layout.js"></script>
<script src="index.js"></script>
```

Zie `index.html` voor een voorbeeld.

---

## Migratie van Monolithisch naar Modulair

### Wat veranderde:

✅ **Voordelen:**
- **Betere code-organisatie** - Elk module heeft een duidelijke verantwoordelijkheid
- **Gemakkelijker onderhoud** - Wijzigingen in één module beïnvloeden anderen niet
- **Herbruikbaarheid** - Modules kunnen gemakkelijk gehaald/toegevoegd worden
- **Schaalbaar** - Gemakkelijk om nieuwe functies toe te voegen
- **Testbaar** - Individuele modules kunnen in isolatie getest worden

### Wat hetzelfde blijft:

- ✓ Alle functionaliteit
- ✓ Alle spellen
- ✓ Alle UI/UX
- ✓ Lokale opslag
- ✓ Gebruikersinstellingen

---

## Module Interactie Diagram

```
index.js
   ↓
layout.js → popup.js → config.js
   ↓         ↓         ↓
tools.js   dashboard.js  styles.js
   ↓         ↓
games.js ← utils.js ← config.js
```

---

## Voorstel: Toekomstige Verbeteringen

1. **Bundlen** - Gebruik webpack/rollup om één geoptimaliseerd bestand te maken
2. **Modulair laden** - Dynamisch laden van modules wanneer nodig
3. **TypeScript** - Type-safety toevoegen
4. **Unit Tests** - Testen per module
5. **Package Manager** - npm package structuur

---

## Gebruik in Je Project

Als je dit in Smartschool wilt gebruiken, vervang dan alle scripts met:

```html
<script src="path/to/utils.js"></script>
<script src="path/to/config.js"></script>
<script src="path/to/styles.js"></script>
<script src="path/to/popup.js"></script>
<script src="path/to/tools.js"></script>
<script src="path/to/games.js"></script>
<script src="path/to/dashboard.js"></script>
<script src="path/to/layout.js"></script>
<script src="path/to/index.js"></script>
```

---

**Gemaakt op: 2026-07-03**
