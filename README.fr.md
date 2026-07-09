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

Multilingue (anglais, français, allemand, espagnol, italien, néerlandais, portugais, russe — détecté automatiquement depuis Home Assistant).

Carte Lovelace pour l'intégration [PoolLab](https://github.com/dala318/python_poollab) (photomètres PoolLab 1.0 / 2.0).
Elle affiche proprement vos analyses d'eau : pour chaque paramètre, la valeur actuelle **colorée selon votre cible**,
les mesures précédentes datées, et une gestion correcte des mesures **OVER** (au-delà de la plage du test).

> Non affiliée à PoolLab® / Water-i.d. — carte communautaire indépendante.

> 🇬🇧 [Read in English](README.md)

![Carte PoolLab](https://raw.githubusercontent.com/ADNPolymerase/poollab-card/main/docs/screenshot.png)

## Fonctionnalités

- Une ligne par paramètre : nom, date réelle de mesure, les 2 valeurs précédentes, valeur actuelle, cible, pastille d'état (`OK` / `Trop haut` / `Trop bas` / `OVER`).
- **Cibles automatiques** : la plage idéale réglée dans l'app PoolLab (`ideal_low` / `ideal_high`) est lue depuis l'entité — aucun seuil à configurer, surchargeable par paramètre, conservée dans `localStorage` pour les mesures sans cible.
- **Flèche de tendance** comparant la mesure actuelle à la précédente (vers la cible = vert, en s'éloignant = orange).
- **Gestion OVER** : quand un test dépasse sa plage mesurable, la carte affiche `> max` (table intégrée des plafonds PoolLab : pH 8.4, chlore 6, CYA 100, TA 200…) au lieu d'une valeur aberrante.
- Éditeur natif HA (sélecteur d'entités) + contrôle YAML complet.

## Installation (HACS)

1. **HACS → ⋮ → Dépôts personnalisés**
2. Ajouter `https://github.com/ADNPolymerase/poollab-card` en catégorie **Dashboard**
3. Installer **PoolLab Card**, puis recharger le navigateur en vidant le cache (Ctrl+Maj+R / Cmd+Maj+R)

Alternative manuelle : copiez `poollab-card.js` depuis la [dernière version](https://github.com/ADNPolymerase/poollab-card/releases) vers `config/www/`, puis ajoutez `/local/poollab-card.js` comme ressource module JavaScript.

## Utilisation

Ajouter la carte depuis l'interface du tableau de bord (rechercher "PoolLab") — vos entités `sensor.*_pl_*` sont détectées automatiquement.
Ou en YAML :

```yaml
type: custom:poollab-card
title: PoolLab
measurements: 3        # 1 = dernière uniquement, jusqu'à 3 (avec dates)
show_date: true
show_target: true
entities:
  - sensor.my_pool_pl_ph
  - sensor.my_pool_pl_chlorine_free
  - sensor.my_pool_pl_chlorine_total
  - sensor.my_pool_pl_cyanuric_acid
  - sensor.my_pool_pl_alkalinity
```

Les surcharges par paramètre utilisent la forme objet (modifiable aussi depuis l'éditeur visuel) :

```yaml
entities:
  - entity: sensor.my_pool_pl_ph
    name: pH
    min: 7.0          # surcharge la cible basse (zone verte)
    max: 7.4          # surcharge la cible haute
    trend: true       # afficher/masquer la flèche de tendance pour ce paramètre
    decimals: 2       # nombre de décimales affichées (avancé, YAML uniquement)
  - entity: sensor.my_pool_pl_chlorine_total
    test_max: 6       # valeur utilisée pour l'affichage OVER "> max" (avancé)
```

## Options

| Option | Défaut | Description |
|---|---|---|
| `title` | PoolLab | Titre de la carte |
| `language` | _auto_ | Langue de l'interface : `en`, `fr`, `de`, `es`, `it`, `nl`, `pt`, `ru`. Détectée automatiquement depuis Home Assistant si omise (repli anglais). Sélectionnable aussi dans l'éditeur |
| `translations` | — | Ajouter ou surcharger des traductions depuis YAML, indexées par code langue (voir ci-dessous) |
| `measurements` | `3` | Nombre de mesures affichées par paramètre : `1` (dernière uniquement), `2`, ou `3` — les précédentes sont affichées avec leur date |
| `entities` | — | Liste des entités capteur PoolLab (chaînes, ou objets avec surcharges) — ne mettre que les paramètres réellement utilisés |
| `show_date` | `true` | Afficher la date réelle de chaque mesure (`measured_at`) |
| `show_target` | `true` | Afficher la plage idéale sous la pastille d'état |

Par entité (forme objet, `icon` / `name` / `min` / `max` / `trend` modifiables dans l'éditeur visuel) : `name`, `icon`, `unit`, `min`, `max`, `trend`, `decimals`, `test_max`.

La détection OVER est fixe (l'intégration renvoie une valeur très élevée quand un test dépasse sa plage mesurable) ; la carte affiche `> max` en utilisant une table intégrée des plages maximales PoolLab.

### Éditeur

Chaque capteur choisi a sa propre section repliable (icône, nom affiché, seuils, bascule de tendance) ; réorganisez les puces en haut pour réordonner les lignes. Les champs de seuils sont pré-remplis depuis les valeurs de l'app PoolLab (ou le cache du navigateur) — laissez-les tels quels pour suivre l'app, ou modifiez-les pour une surcharge spécifique à la carte.

## Fonctionnement des cibles

Priorité des seuils : attributs de la mesure (app PoolLab) → config de la carte (`min`/`max`) → cache du navigateur (`localStorage`) → valeurs par défaut intégrées. Les seuils n'ont besoin de venir du cloud PoolLab qu'une seule fois — ils sont ensuite mémorisés localement et réutilisés pour les mesures sans cible.

## Langues

8 langues (EN, FR, DE, ES, IT, NL, PT, RU), détectées automatiquement depuis Home Assistant avec repli anglais ; forcez avec `language:` ou dans l'éditeur. Ajoutez une langue ou surchargez n'importe quelle chaîne depuis YAML — sans PR — via `translations`, indexé par code langue :

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

Les contributions de traduction relues sont les bienvenues. Merci à [@hmmbob](https://github.com/hmmbob) pour la
traduction néerlandaise et l'idée de surcharge YAML `translations`.

## Licence

[MIT](https://github.com/ADNPolymerase/poollab-card/blob/main/LICENSE)
