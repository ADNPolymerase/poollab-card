const CARD_VERSION = "0.2.0";
const _D = String.fromCharCode(176);
const _e = String.fromCharCode(233);
const _eg = String.fromCharCode(232);
const _A = String.fromCharCode(224);
const _o = String.fromCharCode(244);
const OVER_THRESHOLD = 100000;

console.info(
  "%c POOLLAB-CARD %c v" + CARD_VERSION + " ",
  "color:white;background:#0984e3;font-weight:700;",
  "color:#0984e3;background:white;font-weight:700;"
);

const PL_TEST_MAX = {
  "ph": 8.4, "chlorine free": 6, "chlorine": 6, "chlorine total": 6,
  "chlorine hr": 200, "cyanuric acid": 100, "alkalinity": 200, "bromine": 13,
  "chloramine": 6, "monochloramine": 6, "dichloramine": 6, "trichloramine": 6,
  "chlorine dioxide": 11, "iron": 1, "calcium hardness": 500, "total hardness": 500,
  "potassium": 12, "copper": 5, "nitrate": 50, "nitrite": 1.5, "ozone": 4,
  "phmb": 60, "phosphate lr": 4, "phosphate hr": 80, "sulfate": 100,
  "active oxygen": 20, "ammonia": 1.2, "aluminium": 0.3, "aluminum": 0.3,
  "zinc": 1, "urea": 2.5, "hydrogen peroxide lr": 2.4, "hydrogen peroxide hr": 180,
};

const PL_MONTHS = ["janv.", "f" + _e + "vr.", "mars", "avr.", "mai", "juin",
  "juil.", "ao" + String.fromCharCode(251) + "t", "sept.", "oct.", "nov.", "d" + _e + "c."];

function plTestMax(param) {
  if (!param) return null;
  const p = String(param).toLowerCase().replace(/^pl\s+/, "").trim();
  if (p in PL_TEST_MAX) return PL_TEST_MAX[p];
  for (const k in PL_TEST_MAX) if (p.indexOf(k) !== -1) return PL_TEST_MAX[k];
  return null;
}

function plCleanName(st) {
  const a = st.attributes;
  let n = a.parameter ? String(a.parameter).replace(/^PL\s+/i, "") : (a.friendly_name || "");
  n = n.replace(/^Ma\s+Piscine\s+PL\s+/i, "").replace(/\s+PL\s+/i, " ");
  const map = {
    "ph": "pH", "chlorine free": "Chlore libre", "chlorine total": "Chlore total",
    "cyanuric acid": "Acide cyanurique", "alkalinity": "Alcalinit" + _e,
    "monochloramine": "Monochloramine", "dichloramine": "Dichloramine",
  };
  const key = n.toLowerCase().trim();
  return map[key] || n;
}

function plKey(id) { return "e_" + String(id).replace(/[^a-z0-9]/gi, "_"); }

class PoolLabCard extends HTMLElement {
  static getConfigElement() { return document.createElement("poollab-card-editor"); }

  static getStubConfig(hass) {
    const order = ["_ph", "chlorine_free", "chlorine_total", "cyanuric", "alkalinity"];
    const all = Object.keys(hass.states).filter((e) => /^sensor\..*_pl_/.test(e));
    all.sort((a, b) => {
      const ia = order.findIndex((k) => a.includes(k));
      const ib = order.findIndex((k) => b.includes(k));
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });
    return { title: "PoolLab", measurements: 3, show_date: true, entities: all };
  }

  setConfig(config) {
    const ents = (config.entities || []).map((e) => (typeof e === "string" ? { entity: e } : { ...e }));
    let m = parseInt(config.measurements, 10);
    if (!(m >= 1 && m <= 3)) m = 3;
    this._config = {
      title: "PoolLab", show_date: true, show_target: true,
      ...config, measurements: m, entities: ents,
    };
    this._built = false;
    this._hist = this._hist || {};
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._built) { this._build(); this._built = true; }
    this._update();
  }

  connectedCallback() {
    this._tick = setInterval(() => { if (this._hass && this._built) { this._histAt = 0; this._update(); } }, 600000);
  }
  disconnectedCallback() { clearInterval(this._tick); }
  getCardSize() { return 1 + (this._config ? this._config.entities.length : 3); }

  _state(id) {
    if (!id || !this._hass.states[id]) return null;
    return this._hass.states[id];
  }

  _build() {
    this.innerHTML = "";
    const card = document.createElement("ha-card");
    card.innerHTML = `
      <style>
        .pl-wrap { padding: 16px; }
        .pl-title { font-size: 1.2em; font-weight: 600; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
        .pl-sub { margin-left: auto; font-size: 0.62em; font-weight: 400; color: var(--secondary-text-color); }
        .pl-row { display: grid; grid-template-columns: 1fr auto auto; align-items: center; gap: 12px; padding: 11px 0; border-top: 1px solid var(--divider-color); }
        .pl-name { display: flex; align-items: center; gap: 10px; min-width: 0; }
        .pl-name ha-icon { color: var(--secondary-text-color); --mdc-icon-size: 22px; flex: none; }
        .pl-pname { font-size: 0.95em; font-weight: 500; }
        .pl-trend { display: flex; align-items: flex-end; gap: 8px; }
        .pl-m { display: flex; flex-direction: column; align-items: flex-end; line-height: 1.15; }
        .pl-mval { font-size: 0.82em; color: var(--secondary-text-color); }
        .pl-mdate { font-size: 0.62em; color: var(--secondary-text-color); opacity: 0.8; }
        .pl-curline { display: flex; align-items: baseline; gap: 4px; }
        .pl-cur { font-size: 1.4em; font-weight: 700; }
        .pl-unit { font-size: 0.72em; color: var(--secondary-text-color); }
        .pl-arrow { --mdc-icon-size: 16px; align-self: center; }
        .pl-right { text-align: right; min-width: 88px; }
        .pl-pill { display: inline-block; font-size: 0.72em; font-weight: 600; padding: 3px 9px; border-radius: 9px; }
        .pl-target { font-size: 0.74em; color: var(--secondary-text-color); margin-top: 3px; }
        .pl-ok { color: #00b894; }
        .pl-warn { color: #e17055; }
        .pl-neutral { color: var(--primary-text-color); }
        .pl-pill-ok { background: rgba(0,184,148,0.15); color: #00b894; }
        .pl-pill-warn { background: rgba(225,112,85,0.15); color: #e17055; }
        .pl-pill-neutral { background: var(--secondary-background-color); color: var(--secondary-text-color); }
        .pl-unavailable { opacity: 0.4; }
      </style>
      <div class="pl-wrap">
        <div class="pl-title"><ha-icon icon="mdi:flask-outline"></ha-icon><span id="pl-title-text"></span><span class="pl-sub" id="pl-sub"></span></div>
        <div id="pl-rows"></div>
      </div>
    `;
    this.appendChild(card);
  }

  _fmtDate(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return d.getDate() + " " + PL_MONTHS[d.getMonth()];
  }

  _decimals(cfg, val) {
    if (cfg.decimals != null) return cfg.decimals;
    const v = Math.abs(val);
    if (v < 10) return 2;
    if (v < 100) return 1;
    return 0;
  }

  _num(v, dec) { return isFinite(v) ? v.toFixed(dec).replace(".", ",") : String(v); }

  _clean(v) { return isFinite(v) ? String(Math.round(v * 1000) / 1000).replace(".", ",") : String(v); }

  _fetchHistory() {
    const ids = this._config.entities.map((e) => e.entity).filter(Boolean);
    if (!ids.length) return;
    const now = Date.now();
    if (this._histBusy || now - (this._histAt || 0) < 600000) return;
    this._histBusy = true;
    this._hass.callWS({
      type: "history/history_during_period",
      start_time: new Date(now - 365 * 86400000).toISOString(),
      end_time: new Date(now).toISOString(),
      entity_ids: ids,
      minimal_response: false,
      no_attributes: false,
      significant_changes_only: false,
    }).then((resp) => {
      const out = {};
      for (const id of ids) {
        const states = (resp && resp[id]) || [];
        const seen = new Set();
        const list = [];
        for (let i = states.length - 1; i >= 0; i--) {
          const s = states[i];
          const a = s.a || {};
          const v = parseFloat(s.s);
          if (!isFinite(v) || v >= OVER_THRESHOLD || a.measure == null) continue;
          if (seen.has(a.measure)) continue;
          seen.add(a.measure);
          list.push({ value: v, measured_at: a.measured_at });
          if (list.length >= 4) break;
        }
        out[id] = list;
      }
      this._hist = out;
      this._histAt = Date.now();
      this._histBusy = false;
      if (this._built) this._update();
    }).catch(() => { this._histBusy = false; this._histAt = Date.now(); });
  }

  _measHtml(val, date, dec, cls) {
    const dateHtml = (this._config.show_date && date) ? "<span class=\"pl-mdate\">" + this._fmtDate(date) + "</span>" : "";
    return "<div class=\"pl-m\"><span class=\"" + (cls || "pl-mval") + "\">" + this._num(val, dec) + "</span>" + dateHtml + "</div>";
  }

  _rowHtml(cfg) {
    const st = this._state(cfg.entity);
    if (!st) {
      return "<div class=\"pl-row pl-unavailable\"><div class=\"pl-name\"><ha-icon icon=\"mdi:help-circle-outline\"></ha-icon><div class=\"pl-pname\">" + (cfg.name || cfg.entity) + "</div></div><div class=\"pl-trend\"><span class=\"pl-cur\">" + String.fromCharCode(8212) + "</span></div><div class=\"pl-right\"></div></div>";
    }
    const a = st.attributes;
    const name = cfg.name || plCleanName(st);
    const icon = cfg.icon || a.icon || "mdi:water-percent";
    const unit = cfg.unit != null ? cfg.unit : (a.unit_of_measurement || "");
    const val = parseFloat(st.state);
    const over = isFinite(val) && val >= OVER_THRESHOLD;
    const N = this._config.measurements || 3;

    let lo = cfg.min != null && cfg.min !== "" ? parseFloat(cfg.min) : (a.ideal_low != null && parseFloat(a.ideal_low) !== -1 ? parseFloat(a.ideal_low) : null);
    let hi = cfg.max != null && cfg.max !== "" ? parseFloat(cfg.max) : (a.ideal_high != null && parseFloat(a.ideal_high) !== -1 ? parseFloat(a.ideal_high) : null);

    const dec = this._decimals(cfg, isFinite(val) ? val : 0);
    let cls = "pl-neutral", pill = "", pillCls = "pl-pill-neutral", valTxt;
    if (over) {
      cls = "pl-warn"; pill = "OVER"; pillCls = "pl-pill-warn";
      const tmax = cfg.test_max != null ? cfg.test_max : (plTestMax(a.parameter) != null ? plTestMax(a.parameter) : hi);
      valTxt = tmax != null ? ("> " + tmax) : "OVER";
    } else {
      valTxt = isFinite(val) ? this._num(val, dec) : st.state;
      if (lo != null && val < lo) { cls = "pl-warn"; pill = "Trop bas"; pillCls = "pl-pill-warn"; }
      else if (hi != null && val > hi) { cls = "pl-warn"; pill = "Trop haut"; pillCls = "pl-pill-warn"; }
      else if (lo != null || hi != null) { cls = "pl-ok"; pill = "OK"; pillCls = "pl-pill-ok"; }
    }

    const hist = (this._hist && this._hist[cfg.entity]) || [];
    const curDate = over ? a.measured_at : (hist[0] ? hist[0].measured_at : a.measured_at);

    let trendHtml = "";
    if (!over && N > 1) {
      const prevs = hist.slice(1, N).reverse();
      trendHtml += prevs.map((p) => this._measHtml(p.value, p.measured_at, dec, "pl-mval")).join("");
      if (cfg.trend !== false && hist.length >= 2 && Math.abs(val - hist[1].value) > 1e-9) {
        const prev1 = hist[1].value;
        let acls = "pl-mval";
        if (lo != null && hi != null) {
          const mid = (lo + hi) / 2;
          acls = Math.abs(val - mid) < Math.abs(prev1 - mid) ? "pl-ok" : "pl-warn";
        }
        trendHtml += "<ha-icon class=\"pl-arrow " + acls + "\" icon=\"" + (val > prev1 ? "mdi:arrow-top-right" : "mdi:arrow-bottom-right") + "\"></ha-icon>";
      }
    }

    const curDateHtml = (this._config.show_date && curDate) ? "<span class=\"pl-mdate\">" + this._fmtDate(curDate) + "</span>" : "";
    const unitHtml = (unit && !over) ? "<span class=\"pl-unit\">" + unit + "</span>" : "";
    const curHtml = "<div class=\"pl-m\"><div class=\"pl-curline\"><span class=\"pl-cur " + cls + "\">" + valTxt + "</span>" + unitHtml + "</div>" + curDateHtml + "</div>";

    let targetHtml = "";
    if (this._config.show_target !== false) {
      if (lo != null && hi != null) targetHtml = "cible " + this._clean(lo) + String.fromCharCode(8211) + this._clean(hi);
      else if (hi != null) targetHtml = "max " + this._clean(hi);
      else if (lo != null) targetHtml = "min " + this._clean(lo);
    }
    const pillHtml = pill ? "<span class=\"pl-pill " + pillCls + "\">" + pill + "</span>" : "";

    return "<div class=\"pl-row\">" +
      "<div class=\"pl-name\"><ha-icon icon=\"" + icon + "\"></ha-icon><div class=\"pl-pname\">" + name + "</div></div>" +
      "<div class=\"pl-trend\">" + trendHtml + curHtml + "</div>" +
      "<div class=\"pl-right\">" + pillHtml + (targetHtml ? "<div class=\"pl-target\">" + targetHtml + "</div>" : "") + "</div>" +
      "</div>";
  }

  _update() {
    if (!this._config) return;
    this.querySelector("#pl-title-text").textContent = this._config.title || "PoolLab";
    this._fetchHistory();

    const sub = this.querySelector("#pl-sub");
    const dates = this._config.entities
      .map((c) => { const st = this._state(c.entity); return st && st.attributes.measured_at; })
      .filter(Boolean).map((d) => new Date(d).getTime());
    if (this._config.show_date !== false && dates.length) {
      sub.textContent = "dernier relev" + _e + " " + this._fmtDate(new Date(Math.max(...dates)).toISOString());
    } else sub.textContent = "";

    this.querySelector("#pl-rows").innerHTML = this._config.entities.map((c) => this._rowHtml(c)).join("");
  }
}

class PoolLabCardEditor extends HTMLElement {
  setConfig(config) {
    const ents = (config.entities || []).map((e) => (typeof e === "string" ? { entity: e } : { ...e }));
    let m = parseInt(config.measurements, 10);
    if (!(m >= 1 && m <= 3)) m = 3;
    this._config = { title: "PoolLab", show_date: true, show_target: true, ...config, measurements: m, entities: ents };
    this._render();
  }
  set hass(hass) { this._hass = hass; this._render(); }

  _render() {
    if (!this._hass || !this._config) return;
    const c = this._config;
    if (!this._form) {
      this.innerHTML = "";
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (s) => s.label || s.name;
      this._form.addEventListener("value-changed", (ev) => {
        const v = ev.detail.value;
        const ids = v.entities || [];
        const prevMap = {};
        (c.entities || []).forEach((e) => { prevMap[e.entity] = e; });
        const ents = ids.map((id) => {
          const o = v[plKey(id)] || {};
          const r = { entity: id };
          const old = prevMap[id] || {};
          const nm = o.name != null ? o.name : old.name;
          if (nm) r.name = nm;
          const mn = o.min != null ? o.min : old.min;
          if (mn != null && mn !== "") r.min = mn;
          const mx = o.max != null ? o.max : old.max;
          if (mx != null && mx !== "") r.max = mx;
          const tr = o.trend != null ? o.trend : old.trend;
          if (tr === false) r.trend = false;
          if (old.icon) r.icon = old.icon;
          if (old.unit != null) r.unit = old.unit;
          if (old.decimals != null) r.decimals = old.decimals;
          if (old.test_max != null) r.test_max = old.test_max;
          return r;
        });
        let m = parseInt(v.measurements, 10); if (!(m >= 1 && m <= 3)) m = 3;
        this._config = {
          title: v.title, measurements: m,
          show_date: v.show_date !== false, show_target: v.show_target !== false,
          entities: ents,
        };
        this._render();
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true }));
      });
      this.appendChild(this._form);
    }

    const data = {
      title: c.title, measurements: String(c.measurements || 3),
      show_date: c.show_date !== false, show_target: c.show_target !== false,
      entities: c.entities.map((e) => e.entity),
    };
    for (const e of c.entities) {
      data[plKey(e.entity)] = {
        name: e.name || "", min: e.min != null ? e.min : "", max: e.max != null ? e.max : "",
        trend: e.trend !== false,
      };
    }

    const schema = [
      { name: "title", label: "Titre", selector: { text: {} } },
      { name: "measurements", label: "Mesures affich" + _e + "es", selector: { select: { mode: "dropdown", options: [
        { value: "1", label: "Derni" + _eg + "re seulement" },
        { value: "2", label: "2 derni" + _eg + "res" },
        { value: "3", label: "3 derni" + _eg + "res" },
      ] } } },
      { name: "show_date", label: "Afficher les dates de mesure", selector: { boolean: {} } },
      { name: "show_target", label: "Afficher la cible", selector: { boolean: {} } },
      { name: "entities", label: "Capteurs PoolLab", selector: { entity: { multiple: true, domain: "sensor" } } },
    ];
    for (const e of c.entities) {
      const st = this._hass.states[e.entity];
      const title = e.name || (st ? plCleanName(st) : e.entity);
      schema.push({
        type: "expandable", name: plKey(e.entity), title: title,
        schema: [
          { name: "name", label: "Nom affich" + _e, selector: { text: {} } },
          { name: "min", label: "Seuil bas (cible)", selector: { number: { mode: "box", step: "any" } } },
          { name: "max", label: "Seuil haut (cible)", selector: { number: { mode: "box", step: "any" } } },
          { name: "trend", label: "Afficher la tendance", selector: { boolean: {} } },
        ],
      });
    }

    this._form.hass = this._hass;
    this._form.data = data;
    this._form.schema = schema;
  }
}

customElements.define("poollab-card", PoolLabCard);
customElements.define("poollab-card-editor", PoolLabCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "poollab-card", name: "PoolLab Card",
  description: "Water analysis card for the PoolLab integration: latest readings, previous measurements, value colored against its target, with OVER handling.",
  preview: true, documentationURL: "https://github.com/ADNPolymerase/poollab-card",
});
