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
      name: "Operator pack",
      price: "$19",
      blurb: "Downloadable depth: worksheets, policy one-pager, PR templates.",
      cta: "Buy pack",
      href: LINKS.pack,
    },
    {
      name: "Action license",
      price: "$49",
      blurb: "Paid Shipgate Action rules + license key for private repos.",
      cta: "Get license",
      href: LINKS.actionLicense,
    },
    {
      name: "Full kit bundle",
      price: "$129",
      blurb: "All operator packs in one download.",
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
  return shell(
    "bet",
    `
    <section class="bet">
      <div class="bet-top">
        <div>
          <div class="kicker" style="color:#a89f90">Live ledger · updated ${stats.updated_at}</div>
          <h1>Public $1,000 October bet</h1>
          <p class="sub">Transparent P&amp;L for an autonomous ethical business. Operator only clears captchas and card unlocks.</p>
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
