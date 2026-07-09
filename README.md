<p align="center"><img src="https://raw.githubusercontent.com/ADNPolymerase/poollab-card/main/docs/logo.png" alt="PoolLab Card" height="130"></p>

# PoolLab Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/v/release/ADNPolymerase/poollab-card?sort=semver)](https://github.com/ADNPolymerase/poollab-card/releases)
[![HACS Action](https://github.com/ADNPolymerase/poollab-card/actions/workflows/hacs.yml/badge.svg)](https://github.com/ADNPolymerase/poollab-card/actions/workflows/hacs.yml)
[![HA Version](https://img.shields.io/badge/Home%20Assistant-2024.1%2B-blue.svg)](https://www.home-assistant.io)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ADNPolymerase/poollab-card/blob/main/LICENSE)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow.svg?logo=buy-me-a-coffee)](https://buymeacoffee.com/adnpolymerase)

<a href="https://buymeacoffee.com/adnpolymerase" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-orange.png" alt="Buy Me A Coffee" height="60"></a>
<a href="https://adnpolymerase.github.io/HA/" target="_blank"><img src="https://raw.githubusercontent.com/ADNPolymerase/HA/main/assets/site-button.svg" alt="Link to my github.io for my other projects" height="60"></a>

Multilingual (English, French, German, Spanish, Italian, Dutch, Portuguese, Russian — auto-detected from Home Assistant).

A clean Lovelace card for the [PoolLab](https://github.com/Production-Wright/poollab) water analysis integration.
Shows your latest reading for each parameter, the previous measurements, and colors the current value
against its ideal target — with proper handling of **OVER** readings (values above the test's measurable range).

> Not affiliated with PoolLab® / Water-i.d. — independent community card.

> 🇫🇷 [Lire en français](README.fr.md)

![PoolLab Card](https://raw.githubusercontent.com/ADNPolymerase/poollab-card/main/docs/screenshot.png)

## Features

- One row per parameter: name, real measurement date, the two previous values, current value, target, status pill (`OK` / `Too high` / `Too low` / `OVER`).
- **Automatic targets**: the ideal range you set in the PoolLab app (`ideal_low` / `ideal_high`) is read from the entity — no threshold config needed, overridable per parameter, cached in `localStorage` for measurements without targets.
- **Trend arrow** comparing the current reading to the previous one (toward the range = green, away = orange).
- **OVER handling**: when a test exceeds its measurable ceiling, the card shows `> max` (built-in table of PoolLab ceilings: pH 8.4, chlorine 6, CYA 100, TA 200…) instead of a meaningless number.
- Native HA editor (entity picker) + full YAML control.

## Installation (HACS)

1. HACS → three dots → **Custom repositories**
2. Add `https://github.com/ADNPolymerase/poollab-card` with category **Dashboard**
3. Install **PoolLab Card**, then hard-refresh your browser (Ctrl+Shift+R / Cmd+Shift+R)

Manual alternative: copy `poollab-card.js` from the [latest release](https://github.com/ADNPolymerase/poollab-card/releases) to `config/www/`, then add `/local/poollab-card.js` as a JavaScript-module resource.

## Usage

Add the card from the dashboard UI (search "PoolLab") — your `sensor.*_pl_*` entities are auto-detected.
Or in YAML:

```yaml
type: custom:poollab-card
title: PoolLab
measurements: 3        # 1 = latest only, up to 3 (with dates)
show_date: true
show_target: true
entities:
  - sensor.my_pool_pl_ph
  - sensor.my_pool_pl_chlorine_free
  - sensor.my_pool_pl_chlorine_total
  - sensor.my_pool_pl_cyanuric_acid
  - sensor.my_pool_pl_alkalinity
```

Per-parameter overrides use the object form (also editable from the UI editor):

```yaml
entities:
  - entity: sensor.my_pool_pl_ph
    name: pH
    min: 7.0          # override ideal target low (green zone)
    max: 7.4          # override ideal target high
    trend: true       # show/hide the trend arrow for this parameter
    decimals: 2       # number of decimals shown (advanced, YAML only)
  - entity: sensor.my_pool_pl_chlorine_total
    test_max: 6       # value used for the "> max" OVER display (advanced)
```

## Options

| Option | Default | Description |
|---|---|---|
| `title` | PoolLab | Card title |
| `language` | _auto_ | UI language: `en`, `fr`, `de`, `es`, `it`, `nl`, `pt`, `ru`. Auto-detected from Home Assistant when omitted (English fallback). Also selectable in the editor |
| `translations` | — | Add or override translations from YAML, keyed by language code (see below) |
| `measurements` | `3` | How many measurements to show per parameter: `1` (latest only), `2`, or `3` — previous ones shown with their date |
| `entities` | — | List of PoolLab sensor entities (strings, or objects with overrides) — pick only the parameters you actually use |
| `show_date` | `true` | Show each measurement's real date (`measured_at`) |
| `show_target` | `true` | Show the ideal range under the status pill |

Per-entity (object form, `icon` / `name` / `min` / `max` / `trend` editable in the UI editor): `name`, `icon`, `unit`, `min`, `max`, `trend`, `decimals`, `test_max`.

OVER detection is fixed (the integration reports a very large value when a test exceeds its measurable range); the card shows `> max` using a built-in table of PoolLab test ceilings.

### Editor

Each chosen sensor gets its own expandable section (icon, display name, thresholds, trend toggle); reorder the chips at the top to reorder the rows. Threshold fields are pre-filled from the PoolLab app values (or the browser cache) — leave them untouched to follow the app, or change them to set a card-specific override.

## How targets work

Threshold priority: measurement attributes from the PoolLab app → card config (`min`/`max`) → browser cache (`localStorage`) → built-in defaults. Thresholds only need to come from the PoolLab cloud once — they're then remembered locally and reused for measurements without targets.

## Languages

8 languages (EN, FR, DE, ES, IT, NL, PT, RU), auto-detected from Home Assistant with English fallback; force with `language:` or in the editor. Add a language or override any string from YAML — no PR needed — via `translations`, keyed by language code:

```yaml
type: custom:poollab-card
language: sv
translations:
  sv:
    last: senaste mätning
    target: mål
    high: För högt
    low: För lågt
    ok: OK
    p:
      "chlorine free": Fritt klor
```

Reviewed translation contributions are very welcome. Thanks to [@hmmbob](https://github.com/hmmbob) for the
Dutch translation and the YAML `translations` override idea.

## License

[MIT](https://github.com/ADNPolymerase/poollab-card/blob/main/LICENSE)
