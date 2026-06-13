# PoolLab Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://badgen.net/github/release/ADNPolymerase/poollab-card)](https://github.com/ADNPolymerase/poollab-card/releases)
[![HACS Action](https://github.com/ADNPolymerase/poollab-card/actions/workflows/hacs.yml/badge.svg)](https://github.com/ADNPolymerase/poollab-card/actions/workflows/hacs.yml)
[![HA Version](https://img.shields.io/badge/Home%20Assistant-2024.1%2B-blue.svg)](https://www.home-assistant.io)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A clean Lovelace card for the [PoolLab](https://github.com/Production-Wright/poollab) water analysis integration.
Shows your latest reading for each parameter, the previous measurements, and colors the current value
against its ideal target — with proper handling of **OVER** readings (values above the test's measurable range).

> Not affiliated with PoolLab® / Water-i.d. — independent community card.

## Why this card

The PoolLab integration already exposes, for each parameter, the ideal range (`ideal_low` / `ideal_high`)
and a status — the same targets you set in the PoolLab app. This card reads them automatically, so:

- The current value is colored green (in range) or orange (out of range) with **no threshold config needed**.
- It still lets you **override** the target per parameter if you want.
- It shows the **two previous measurements** with a trend arrow, so you can see whether you're correcting
  in the right direction (e.g. cyanuric acid `80 → 79 → 70` trending down toward range).
- It detects **OVER** readings (the integration reports a huge value when a test is above its measurable
  ceiling) and displays `> max` instead of a meaningless number.

## Features

- One row per parameter: name, real measurement date, previous values, current value, target, status pill
- Current value colored by its target (green / orange), pill shows `OK` / `Trop haut` / `Trop bas` / `OVER`
- Trend arrow comparing the current reading to the previous one (toward the range = green, away = orange)
- Automatic target from the entity, overridable per parameter
- OVER handling with a built-in table of PoolLab test ceilings (pH 8.4, chlorine 6, CYA 100, TA 200, …)
- Native HA editor (entity picker) + full YAML control

## Installation (HACS)

1. HACS → three dots → **Custom repositories**
2. Add `https://github.com/ADNPolymerase/poollab-card` with category **Dashboard**
3. Install **PoolLab Card**, then hard-refresh your browser (Ctrl+Shift+R / Cmd+Shift+R)

## Manual installation

1. Download `poollab-card.js` from the [latest release](https://github.com/ADNPolymerase/poollab-card/releases)
2. Copy it to `/config/www/`
3. Add the resource: Settings → Dashboards → three dots → Resources → Add
   `/local/poollab-card.js` as a **JavaScript Module**

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
| `measurements` | `3` | How many measurements to show per parameter: `1` (latest only), `2`, or `3` — previous ones shown with their date |
| `entities` | — | List of PoolLab sensor entities (strings, or objects with overrides) — pick only the parameters you actually use |
| `show_date` | `true` | Show each measurement's real date (`measured_at`) |
| `show_target` | `true` | Show the ideal range under the status pill |

Per-entity (object form, `min` / `max` / `trend` editable in the UI editor): `name`, `icon`, `unit`, `min`, `max`, `trend`, `decimals`, `test_max`.

OVER detection is fixed (the integration reports a very large value when a test exceeds its measurable range); the card shows `> max` using a built-in table of PoolLab test ceilings.

## How targets & colors work

- Target comes from the entity attributes `ideal_low` / `ideal_high` (what you set in the PoolLab app),
  unless you set `min` / `max` in the card config.
- Value is green when within the range, orange when below (`Trop bas`) or above (`Trop haut`).
- When the integration reports an OVER value (≥ `over_threshold`), the card shows `> max` where `max`
  is the test's measurable ceiling (`test_max` override, else a built-in PoolLab lookup, else the target high).
- The trend arrow compares the current reading to the previous one. When out of range, it's green if the
  value moved toward the target midpoint, orange if it moved away.

## License

[MIT](LICENSE)
