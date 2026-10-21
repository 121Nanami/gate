import "./style.css";
import { LINKS } from "./links";
import { mountWorkspace } from "./workspace";

type Stats = {
  target_usd: number;
  revenue_usd: number;
  spend_usd: number;
  profit_usd: number;
  deadline: string;
  days_left: number;
  skus: number;
  hn: string;
  updated_at: string;
  needed_per_day: number;
  on_pace: boolean;
  products?: { name: string; price: number; url: string }[];
  compound?: {
    bank_usd: number;
    reinvest_budget_usd: number;
    reinvest_available_usd: number;
    reinvest_pct: number;
    bank_pct: number;
    dynamic_soft_cap_usd: number;
    dynamic_daily_cap_usd: number;
    bet_target_hit: boolean;
  };
};

const FALLBACK: Stats = {
  target_usd: 1000,
  revenue_usd: 0,
  spend_usd: 0,
  profit_usd: 0,
  deadline: "2026-10-31",
  days_left: 10,
  skus: 10,
  hn: "Making1ktm",
  updated_at: new Date().toISOString(),
  needed_per_day: 100,
  on_pace: false,
};

function route(): string {
  const h = location.hash.replace(/^#\/?/, "") || "home";
  return h.split("?")[0] || "home";
}

function money(n: number) {
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function shell(active: string, body: string) {
  return `
    <header class="topnav">
      <a class="brand" href="#/home">Shipgate</a>
      <nav>
        <a href="#/home" class="${active === "home" ? "on" : ""}">Home</a>
        <a href="#/gate" class="${active === "gate" ? "on" : ""}">GATE</a>
        <a href="#/templates" class="${active === "templates" ? "on" : ""}">Templates</a>
        <a href="#/pricing" class="${active === "pricing" ? "on" : ""}">Pricing</a>
        <a href="#/bet" class="${active === "bet" ? "on" : ""}">Public bet</a>
      </nav>
      <a class="btn nav-cta" href="${LINKS.actionRepo}" target="_blank" rel="noreferrer">Action</a>
    </header>
    <main>${body}</main>
    <footer class="site-foot">
      Ethical · Legal · Autonomous ops · HN/${FALLBACK.hn}
      · <a href="${LINKS.github}" target="_blank" rel="noreferrer">Source</a>
      · <a href="${LINKS.store}" target="_blank" rel="noreferrer">Store</a>
    </footer>
  `;
}

function home(stats: Stats) {
  const progress = Math.min(100, (stats.revenue_usd / stats.target_usd) * 100);
  return shell(
    "home",
    `
    <section class="bet">
      <div class="bet-top">
        <div>
          <div class="kicker" style="color:#a89f90">Public company · October bet</div>
          <h1>Ship AI code you can defend</h1>
          <p class="sub">Shipgate is pre-merge control for AI-written pull requests: free GATE workspace, installable GitHub Action, and paid audits — operated toward a public $${stats.target_usd} goal.</p>
        </div>
        <a class="btn secondary" style="border-color:#cfc6b8;color:#f4efe6" href="#/gate">Open GATE</a>
      </div>
      <div class="meters">
        <div class="meter"><div class="label">Revenue</div><div class="value">${money(stats.revenue_usd)}</div></div>
        <div class="meter"><div class="label">Target</div><div class="value">${money(stats.target_usd)}</div></div>
        <div class="meter"><div class="label">Days left</div><div class="value">${stats.days_left}</div></div>
        <div class="meter"><div class="label">SKUs</div><div class="value">${stats.skus}</div></div>
      </div>
      <div class="bar"><span style="width:${progress}%"></span></div>
    </section>

    <section class="grid-3">
      <div class="panel">
        <div class="kicker">01</div>
        <h2>GATE workspace</h2>
        <p class="lead">Intent, trust zones, hard checks, PR export. Offline in your browser.</p>
        <a class="btn" href="#/gate">Use free tool</a>
      </div>
      <div class="panel">
        <div class="kicker">02</div>
        <h2>GitHub Action</h2>
        <p class="lead">Comment Hot/Warm/Cold hints on every PR. License unlocks fuller rules.</p>
        <a class="btn" href="${LINKS.actionRepo}" target="_blank" rel="noreferrer">Install Action</a>
      </div>
      <div class="panel">
        <div class="kicker">03</div>
        <h2>Human audits</h2>
        <p class="lead">Async AI PR risk memo in 48h. Ship / ship-with-flags / no-ship.</p>
        <a class="btn" href="${LINKS.audit}" target="_blank" rel="noreferrer">Buy audit $299</a>
      </div>
    </section>
  `
  );
}

function templates() {
  const items = [
    { name: "Notion Creator OS", price: "$29", blurb: "Content, offers, money, weekly review.", href: LINKS.notionCreator },
    { name: "Notion Freelance CRM", price: "$24", blurb: "Leads, stages, next actions.", href: LINKS.notionCrm },
    { name: "Notion SaaS Launch OS", price: "$27", blurb: "Interviews → launch kill criteria.", href: LINKS.notionSaas },
    { name: "Notion Content Engine", price: "$19", blurb: "50 hooks + batching system.", href: LINKS.notionContent },
    { name: "Shopify Dawn Presets", price: "$39", blurb: "Hero, features, FAQ Liquid sections.", href: LINKS.shopifyDawn },
    { name: "Everything bundle", price: "$149", blurb: "AI packs + Notion + Shopify.", href: LINKS.bundle },
  ];
  return shell(
    "templates",
    `
    <section class="panel">
      <div class="kicker">Templates</div>
      <h2>Notion + Shopify packs that install in minutes</h2>
      <p class="lead">Real downloadable zips — CSV/schema for Notion, Dawn Liquid sections for Shopify. No fluff PDFs.</p>
    </section>
    <section class="grid-3" style="margin-top:1rem">
      ${items
        .map(
          (t) => `
        <div class="panel price-card">
          <div class="kicker">${t.price}</div>
          <h2>${t.name}</h2>
          <p class="lead">${t.blurb}</p>
          <a class="btn" href="${t.href}" target="_blank" rel="noreferrer">Get pack</a>
        </div>`
        )
        .join("")}
    </section>
  `
  );
}

function pricing() {
  const tiers = [
    {
      name: "GATE workspace",
      price: "Free",
      blurb: "Full interactive pre-merge tool in the browser.",
      cta: "Open GATE",
      href: "#/gate",
    },
    {
      name: "Notion / Shopify templates",
      price: "$19–39",
      blurb: "Creator OS, CRM, SaaS launch, Dawn presets.",
      cta: "Browse templates",
      href: "#/templates",
    },
    {
      name: "Operator pack",
      price: "$19",
      blurb: "AI PR worksheets and policy one-pager.",
      cta: "Buy pack",
      href: LINKS.pack,
    },
    {
      name: "Full kit bundle",
      price: "$149",
      blurb: "AI + Notion + Shopify in one purchase.",
      cta: "Buy bundle",
      href: LINKS.bundle,
    },
    {
      name: "AI PR Risk Audit",
      price: "$299",
      blurb: "Async 48h trust-zone map + ship verdict on your PR.",
      cta: "Book audit",
      href: LINKS.audit,
    },
    {
      name: "Product sprint",
      price: "$499",
      blurb: "Offer, pricing, listing rebuild in 5 days.",
      cta: "Start sprint",
      href: LINKS.sprint,
    },
  ];
  return shell(
    "pricing",
    `
    <section class="panel">
      <div class="kicker">Pricing</div>
      <h2>Simple offers. No dark patterns.</h2>
      <p class="lead">Free tool forever. Pay only when you want Action depth or human review.</p>
    </section>
    <section class="grid-3" style="margin-top:1rem">
      ${tiers
        .map(
          (t) => `
        <div class="panel price-card">
          <div class="kicker">${t.price}</div>
          <h2>${t.name}</h2>
          <p class="lead">${t.blurb}</p>
          <a class="btn" href="${t.href}" ${t.href.startsWith("http") ? 'target="_blank" rel="noreferrer"' : ""}>${t.cta}</a>
        </div>`
        )
        .join("")}
    </section>
  `
  );
}

function bet(stats: Stats) {
  const progress = Math.min(100, (stats.revenue_usd / stats.target_usd) * 100);
  const products = stats.products || [];
  const c = stats.compound;
  const reinvestPct = c ? Math.round(c.reinvest_pct * 100) : 40;
  const bankPct = c ? Math.round(c.bank_pct * 100) : 60;
  return shell(
    "bet",
    `
    <section class="bet">
      <div class="bet-top">
        <div>
          <div class="kicker" style="color:#a89f90">Live ledger · updated ${stats.updated_at}</div>
          <h1>Public $1,000 October bet</h1>
          <p class="sub">Transparent P&amp;L + compounding flywheel. Revenue banks toward the bet and recycles into growth.</p>
        </div>
      </div>
      <div class="meters">
        <div class="meter"><div class="label">Revenue</div><div class="value">${money(stats.revenue_usd)}</div></div>
        <div class="meter"><div class="label">Spend</div><div class="value">${money(stats.spend_usd)}</div></div>
        <div class="meter"><div class="label">Profit</div><div class="value">${money(stats.profit_usd)}</div></div>
        <div class="meter"><div class="label">Need / day</div><div class="value">${money(stats.needed_per_day)}</div></div>
      </div>
      <div class="bar"><span style="width:${progress}%"></span></div>
    </section>
    <section class="grid-2" style="margin-top:1rem">
      <div class="panel">
        <div class="kicker">Compound flywheel</div>
        <h2>Bank ${bankPct}% · Reinvest ${reinvestPct}%</h2>
        <p class="lead">Every dollar in splits: bank holds bet progress; reinvest buys more distribution for winners. Caps rise with revenue.</p>
        <div class="meters" style="grid-template-columns:1fr 1fr">
          <div class="meter" style="background:#1c1814;border-color:#4a4338;color:#f4efe6">
            <div class="label">Banked</div>
            <div class="value">${money(c?.bank_usd ?? 0)}</div>
          </div>
          <div class="meter" style="background:#1c1814;border-color:#4a4338;color:#f4efe6">
            <div class="label">Reinvest free</div>
            <div class="value">${money(c?.reinvest_available_usd ?? 0)}</div>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="kicker">Dynamic caps</div>
        <h2>Spend limits scale with sales</h2>
        <p class="lead">Soft per-action / daily burn rise as revenue grows (floors ${money(50)} / ${money(150)}, ceilings ${money(200)} / ${money(500)}).</p>
        <ul class="plain-list">
          <li>Soft cap now: ${money(c?.dynamic_soft_cap_usd ?? 50)}</li>
          <li>Daily cap now: ${money(c?.dynamic_daily_cap_usd ?? 150)}</li>
          <li>Bet floor hit: ${c?.bet_target_hit ? "yes — 70% reinvest mode" : "not yet — 40% reinvest mode"}</li>
        </ul>
      </div>
    </section>
    <section class="panel" style="margin-top:1rem">
      <h2>Catalog</h2>
      <ul class="plain-list">
        ${products
          .map(
            (p) =>
              `<li><a href="${p.url}" target="_blank" rel="noreferrer">${p.name}</a> — $${p.price}</li>`
          )
          .join("")}
      </ul>
      <p class="footer-note">Pace: ${stats.on_pace ? "on track" : "behind"} · Deadline ${stats.deadline} · ${stats.days_left} days left</p>
    </section>
  `
  );
}

async function loadStats(): Promise<Stats> {
  try {
    const res = await fetch(`stats.json?t=${Date.now()}`);
    if (!res.ok) return FALLBACK;
    return { ...FALLBACK, ...(await res.json()) };
  } catch {
    return FALLBACK;
  }
}

async function render() {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  const r = route();
  const stats = await loadStats();

  if (r === "gate") {
    app.innerHTML = shell("gate", `<div id="workspace"></div>`);
    mountWorkspace(app.querySelector("#workspace")!);
    return;
  }
  if (r === "templates") {
    app.innerHTML = templates();
    return;
  }
  if (r === "pricing") {
    app.innerHTML = pricing();
    return;
  }
  if (r === "bet") {
    app.innerHTML = bet(stats);
    return;
  }
  app.innerHTML = home(stats);
}

window.addEventListener("hashchange", () => {
  void render();
});
void render();
