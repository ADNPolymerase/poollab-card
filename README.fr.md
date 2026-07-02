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

Multilingue (anglais, français, allemand, espagnol, italien, néerlandais, portugais — détecté automatiquement depuis Home Assistant).

Carte Lovelace pour l'intégration [PoolLab](https://github.com/dala318/python_poollab) (photomètres PoolLab 1.0 / 2.0).
Elle affiche proprement vos analyses d'eau : pour chaque paramètre, la valeur actuelle **colorée selon votre cible**,
les mesures précédentes datées, et une gestion correcte des mesures **OVER** (au-delà de la plage du test).

> Non affiliée à PoolLab® / Water-i.d. — carte communautaire indépendante.

> 🇬🇧 [Read in English](README.md)

![Carte PoolLab](https://raw.githubusercontent.com/ADNPolymerase/poollab-card/main/docs/screenshot.png)

## Pourquoi cette carte

L'intégration PoolLab expose déjà, pour chaque paramètre, la plage idéale (`ideal_low` / `ideal_high`) — les mêmes
seuils que ceux réglés dans l'application PoolLab. La carte les lit automatiquement :

- La valeur est **verte** (dans la plage) ou **orange** (hors plage), sans aucun seuil à configurer.
- Vous pouvez quand même **surcharger** la cible par paramètre si besoin.
- Elle affiche les **2 mesures précédentes datées** avec une **flèche de tendance**, pour voir si vous corrigez
  dans le bon sens (ex : acide cyanurique `80 → 79 → 70`, en baisse vers la plage).
- Elle gère les mesures **OVER** (le boîtier renvoie une valeur énorme quand un test dépasse sa plage mesurable)
  et affiche `> seuil` au lieu d'une valeur aberrante.

## Fonctionnalités

- Une ligne par paramètre : nom, date réelle de mesure, valeurs précédentes, valeur actuelle, cible, pastille d'état
- Valeur colorée selon sa cible (vert / orange), pastille `OK` / `Trop haut` / `Trop bas` / `OVER`
- Flèche de tendance comparant la mesure actuelle à la précédente (vers la cible = vert, en s'éloignant = orange)
- Cible automatique depuis l'entité, surchargeable par paramètre
- **Cache des seuils** : les seuils sont conservés dans `localStorage` — si une nouvelle mesure arrive sans cible configurée, les derniers seuils connus sont réutilisés automatiquement
- Gestion des mesures OVER avec une table intégrée des plages maximales PoolLab (pH 8.4, chlore 6, CYA 100, TA 200, …)
- Éditeur natif HA (sélecteur d'entités) + contrôle YAML complet

## Installation (HACS)

1. **HACS → ⋮ → Dépôts personnalisés**
2. Ajouter `https://github.com/ADNPolymerase/poollab-card` en catégorie **Dashboard**
3. Installer **PoolLab Card**, puis recharger le navigateur en vidant le cache (Ctrl+Maj+R / Cmd+Maj+R)

## Installation manuelle

1. Télécharger `poollab-card.js` depuis la [dernière version](https://github.com/ADNPolymerase/poollab-card/releases)
2. Le copier dans `/config/www/`
3. Ajouter la ressource : Paramètres → Tableaux de bord → ⋮ → Ressources → Ajouter
   `/local/poollab-card.js` en tant que **module JavaScript**

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
| `language` | _auto_ | Langue de l'interface : `en`, `fr`, `de`, `es`, `it`, `nl`, `pt`. Détectée automatiquement depuis Home Assistant si omise (repli anglais). Sélectionnable aussi dans l'éditeur |
| `translations` | — | Ajouter ou surcharger des traductions depuis YAML, indexées par code langue (voir ci-dessous) |
| `measurements` | `3` | Nombre de mesures affichées par paramètre : `1` (dernière uniquement), `2`, ou `3` — les précédentes sont affichées avec leur date |
| `entities` | — | Liste des entités capteur PoolLab (chaînes, ou objets avec surcharges) — ne mettre que les paramètres réellement utilisés |
| `show_date` | `true` | Afficher la date réelle de chaque mesure (`measured_at`) |
| `show_target` | `true` | Afficher la plage idéale sous la pastille d'état |

Par entité (forme objet, `icon` / `name` / `min` / `max` / `trend` modifiables dans l'éditeur visuel) : `name`, `icon`, `unit`, `min`, `max`, `trend`, `decimals`, `test_max`.

La détection OVER est fixe (l'intégration renvoie une valeur très élevée quand un test dépasse sa plage mesurable) ; la carte affiche `> max` en utilisant une table intégrée des plages maximales PoolLab.

### Éditeur

L'éditeur visuel regroupe chaque capteur choisi dans sa propre section repliable (icône, nom affiché, seuils, bascule de tendance). Réorganiser les puces de capteurs en haut pour réordonner les lignes affichées. Les champs de seuils sont **pré-remplis avec les valeurs réglées dans l'app PoolLab** (`ideal_low` / `ideal_high`), ou depuis le cache du navigateur si la dernière mesure n'a pas de cible configurée. Les laisser tels quels pour suivre l'app automatiquement, ou les modifier pour définir une surcharge spécifique à la carte (la surcharge est aussi enregistrée dans le cache et réutilisée pour les futures mesures sans cible).

## Fonctionnement des cibles et des couleurs

Ordre de priorité pour la résolution des seuils (du plus prioritaire au moins prioritaire) :

1. **Attributs de la mesure** (`ideal_low` / `ideal_high` depuis l'app PoolLab) — utilisés automatiquement, écrits dans le cache du navigateur.
2. **Config de la carte** (`min` / `max` réglés dans l'éditeur ou en YAML) — utilisés et écrits dans le cache du navigateur.
3. **Cache du navigateur** (`localStorage`) — les derniers seuils connus, réutilisés quand une nouvelle mesure n'en a pas.
4. **Valeurs par défaut intégrées** (`PL_DEFAULT_TARGETS`) — ex : pH 7.2–7.6.

Cela signifie que vous n'avez besoin de récupérer les seuils depuis le cloud PoolLab qu'une seule fois : ensuite, ils sont mémorisés localement et réutilisés pour toutes les mesures suivantes, même si l'app ne renvoie aucune cible.

Autres règles :
- La valeur est verte quand elle est dans la plage, orange en dessous ou au-dessus.
- Quand l'intégration renvoie une valeur OVER, la carte affiche `> max` où `max`
  est la plage maximale mesurable du test (surcharge `test_max`, sinon une table PoolLab intégrée, sinon la cible haute).
- La flèche de tendance compare la mesure actuelle à la précédente. Hors plage, elle est verte si la
  valeur s'est rapprochée du milieu de la cible, orange si elle s'en est éloignée.

## Langues

La carte est multilingue (anglais, français, allemand, espagnol, italien, néerlandais, portugais) et suit
automatiquement la langue de Home Assistant, avec l'anglais en repli. Forcer une langue avec `language:` ou en
choisir une dans l'éditeur.

Vous pouvez ajouter une nouvelle langue ou surcharger n'importe quelle chaîne depuis YAML — sans PR nécessaire — via `translations`, indexé par code langue :

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
