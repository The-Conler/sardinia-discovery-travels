# HUD barche — Sardinia Discovery Travels

Overlay riutilizzabile per le scene Spline delle quattro tipologie di barca. Lo stile e i comandi restano quelli del prototipo yacht (pannello, hint, toolbar CORE / X-RAY / WIRE, griglia, spin, reset, telemetria). Le misure sotto sono **indicative**: taglie tipiche da flotta charter in Sardegna, non riferite a un’imbarcazione reale.

## Come cambiare barca

- Parametro URL: `boat-hud.html?boat=gommone` (oppure `vela`, `catamarano`, `yacht`).
- Attributo HTML: `<body data-boat="gommone">`. Il parametro URL ha priorità.
- Alias accettati: `rib` → gommone; `sail`, `sailboat`, `barca-a-vela` → vela; `cat`, `catamaran` → catamarano; `motoryacht`, `my` → yacht.
- Se il valore manca o non è riconosciuto, si usa `yacht`.

`boat-hud.html` si incolla come overlay nella scena Spline. `boat-hud-runtime.html` è la versione standalone con `@splinetool/runtime`: sostituisci i placeholder `SCENE_URLS` con l’URL `scene.splinecode` di ogni barca.

## Convenzione dei nomi Spline

I nomi devono coincidere **esattamente** (maiuscole/minuscole incluse). I core e le parti animate vanno messi come **figli del gruppo radice**, così ruotano insieme allo yaw. La griglia si chiama sempre `Mapping_Rig` in tutte le scene. Gli oggetti assenti vengono ignorati senza bloccare l’HUD.

### Gommone (`?boat=gommone`)

| Ruolo | Nome oggetto |
| --- | --- |
| Gruppo radice | `Gommone` |
| Core scafo | `Gommone_Hull_Core` |
| Core tubolari | `Gommone_Tubes_Core` |
| Core consolle | `Gommone_Console_Core` |
| Elica (spin sull’asse Z, opzionale) | `Gommone_Prop` |
| Griglia di rilievo | `Mapping_Rig` |

Dimensioni indicative: LOA 7,50 m · baglio 2,80 m · pescaggio 0,50 m · tubolari Ø 0,53 m · fuoribordo 250 HP.

Note di modellazione: volumi pieni solo sui tre core (modalità CORE / X-RAY / WIRE). I tubolari restano un volume distinto dallo scafo rigido. L’elica può essere un sotto-oggetto del piede del motore; se manca, lo spin della barca funziona lo stesso.

### Barca a vela (`?boat=vela`)

| Ruolo | Nome oggetto |
| --- | --- |
| Gruppo radice | `Vela` |
| Core scafo | `Vela_Hull_Core` |
| Core cabina | `Vela_Cabin_Core` |
| Core pozzetto | `Vela_Cockpit_Core` |
| Albero (fisso, non è un core) | `Vela_Mast` |
| Randa (oscillazione, opzionale) | `Vela_Sail_Main` |
| Fiocco (oscillazione, opzionale) | `Vela_Sail_Jib` |
| Anemometro / wind vane (spin Y, opzionale) | `Vela_Wind_Vane` |
| Griglia di rilievo | `Mapping_Rig` |

Dimensioni indicative: LOA 13,90 m · baglio 4,30 m · pescaggio 2,15 m · altezza albero 19,80 m. Taglia tipo monoscafo 45 ft da charter.

Note di modellazione: albero e vele restano visibili anche in modalità WIRE (definiscono la sagoma). L’oscillazione agisce sulla rotazione locale Z delle vele; ancora il pivot sul pennone / strallo. Eventuale chiglia o bulbo possono stare nel gruppo `Vela` senza entrare nei core, oppure aggiungersi come `Vela_Keel_Core` in un secondo momento (oggi l’HUD non lo cerca).

### Catamarano (`?boat=catamarano`)

| Ruolo | Nome oggetto |
| --- | --- |
| Gruppo radice | `Catamarano` |
| Core scafo di babordo | `Catamarano_Hull_Port_Core` |
| Core scafo di tribordo | `Catamarano_Hull_Starboard_Core` |
| Core bridgedeck / salone | `Catamarano_Bridgedeck_Core` |
| Radar (spin Y, opzionale) | `Catamarano_Radar_Scanner` |
| Griglia di rilievo | `Mapping_Rig` |

Dimensioni indicative: LOA 12,80 m · baglio 7,70 m · pescaggio 1,25 m · interscasco (asse-asse) 6,00 m. Taglia tipo Lagoon / Bali 42 da charter.

Note di modellazione: i due scafi devono essere oggetti distinti, simmetrici rispetto all’asse longitudinale. Il bridgedeck è il volume tra gli scafi (salone + fly, se presente). Il radar va sul tetto o sull’arco, figlio del gruppo radice.

### Yacht (`?boat=yacht`)

| Ruolo | Nome oggetto |
| --- | --- |
| Gruppo radice | `Yacht` |
| Core scafo | `Yacht_Hull_Core` |
| Core salone | `Yacht_Saloon_Core` |
| Core flybridge | `Yacht_Flybridge_Core` |
| Radar (spin Y, opzionale) | `Yacht_Radar_Scanner` |
| Griglia di rilievo | `Mapping_Rig` |

Dimensioni indicative: LOA 28,0 m · baglio 6,4 m · pescaggio 1,3 m · 2×1.200 HP. Stessa scala del prototipo originale.

Note di modellazione: i nomi restano quelli della scena yacht già impostata, così l’overlay è retrocompatibile. Il radar deve poter ruotare in locale sull’asse Y.

## Comportamento dell’overlay

- **VIEW**: cicla CORE (core visibili, alpha 92), X-RAY (alpha 32), WIRE (core nascosti; non viene passato `material` vuoto).
- **GRID**: mostra o nasconde `Mapping_Rig`.
- **SPIN**: yaw automatico del gruppo radice (~10°/s). Durante il drag si ferma.
- **RESET YAW**: riporta la rotazione Y a 0.
- Le rotazioni verso Spline sono in **radianti** (`SPLINE_ROTATION_UNIT = π/180`). Se un host usasse i gradi, basta impostare la costante a `1`. La telemetria continua a mostrare i gradi.
- API usata: `spline.ready`, `spline.findObjectByName`, `spline.updateObject`, dietro un adattatore piccolo (`createSplineAdapter`) così si può passare a `@splinetool/runtime` senza riscrivere l’HUD.

## File

- `boat-hud.html` — overlay unico, autosufficiente, da incollare in Spline.
- `boat-hud.js` — stesso script, estratto per la pagina runtime e per i test.
- `boat-hud-runtime.html` — pagina standalone: canvas + runtime Spline + HUD. Funziona anche in anteprima senza scena (mostra un avviso finché gli URL sono placeholder).
