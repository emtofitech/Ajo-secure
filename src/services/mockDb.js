/**
 * mockDb.js — the browser-side mock datastore.
 *
 * Everything the UI shows comes through `services/api.js`, which reads and
 * writes this store. It is an in-memory object persisted to localStorage so a
 * refresh keeps your data, and `window.__seedDemo()` restores the demo state.
 *
 * Money is **always integer kobo** (`nairaToKobo`). Nothing here ever stores a
 * float naira value.
 *
 * The ledger is **append-only**: entries are only ever pushed. A correction or
 * a reversal is a new compensating entry, never an edit of an old one.
 */

const STORAGE_KEY = "ajo-secure:db:v1";

/* ── ids + money ─────────────────────────────────────────── */
let idCounter = 0;
export const uid = (prefix) =>
  `${prefix}_${Date.now().toString(36)}${(idCounter++).toString(36)}${Math
    .random()
    .toString(36)
    .slice(2, 6)}`;

export const nairaToKobo = (naira) => Math.round(Number(naira) * 100);
export const koboToNaira = (kobo) => Number(kobo) / 100;

/** ₦85,000 — grouped, no decimals. Pure formatting, no currency symbol mixing. */
export const formatNaira = (kobo) =>
  koboToNaira(kobo).toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

/* ── ledger types ────────────────────────────────────────── */
export const LEDGER_TYPES = {
  CONTRIBUTION: { label: "Contribution", tag: "Ajo" },
  PLATFORM_FEE: { label: "Platform fee", tag: "Ajo" },
  PAYOUT: { label: "Payout", tag: "Ajo" },
  GOODS_SAVING: { label: "Goods saving", tag: "Goods" },
  GOODS_PAYOUT: { label: "Goods payout", tag: "Goods" },
  GOODS_REFUND: { label: "Goods refund", tag: "Goods" },
};

export const GOODS_LEDGER_TYPES = ["GOODS_SAVING", "GOODS_PAYOUT", "GOODS_REFUND"];

/* ── goods workflow ──────────────────────────────────────── */
export const GOODS_STATES = [
  "SAVING",
  "TARGET_REACHED",
  "MEMBER_CONFIRMED",
  "VENDOR_NOTIFIED",
  "VENDOR_ACCEPTED",
  "FULFILLED",
  "CANCELLED",
  "REFUNDED",
];

/**
 * The only legal moves. `api.js` refuses anything not listed here, so an
 * illegal jump (confirming before the target is reached, for example) is a
 * clear error rather than a silently broken record.
 */
export const GOODS_TRANSITIONS = {
  SAVING: ["PAUSED", "TARGET_REACHED", "CANCELLED"],
  PAUSED: ["SAVING", "TARGET_REACHED", "CANCELLED"],
  TARGET_REACHED: ["MEMBER_CONFIRMED", "CANCELLED"],
  MEMBER_CONFIRMED: ["VENDOR_NOTIFIED"],
  VENDOR_NOTIFIED: ["VENDOR_ACCEPTED"],
  VENDOR_ACCEPTED: ["FULFILLED"],
  FULFILLED: [],
  CANCELLED: ["REFUNDED"],
  REFUNDED: [],
};

/** Once an order is with the vendor the member can no longer cancel it. */
export const CANCELLABLE_STATES = new Set(["SAVING", "PAUSED", "TARGET_REACHED"]);

export const GOODS_CATEGORIES = [
  "Foodstuff",
  "Kitchen equipment",
  "Household",
  "Other approved goods",
];

export const GOODS_FREQUENCIES = [
  { value: "WEEKLY", label: "Weekly", weeks: 1 },
  { value: "BIWEEKLY", label: "Bi-weekly", weeks: 2 },
  { value: "MONTHLY", label: "Monthly", weeks: 4 },
];

/** Minimum first contribution, in kobo (₦500). */
export const MIN_GOODS_CONTRIBUTION_KOBO = nairaToKobo(500);

/* ── seed ────────────────────────────────────────────────── */

const DAY = 86_400_000;

function seedVendors() {
  return [
    {
      id: "vnd_mama_nkechi",
      name: "Mama Nkechi Foodstuff Hub",
      city: "Lagos",
      categories: ["Foodstuff"],
      verified: true,
      /* Held by us, never typed by a member. Read-only everywhere in the UI. */
      payoutAccountRef: "Verified account •••• 4821",
      rating: 4.8,
      catalog: [
        { id: "itm_rice_50kg", name: "50kg bag of rice", priceKobo: nairaToKobo(85_000), category: "Foodstuff" },
        { id: "itm_groundnut_oil", name: "25L groundnut oil", priceKobo: nairaToKobo(32_000), category: "Foodstuff" },
        { id: "itm_yam", name: "Yam tubers (bundle of 10)", priceKobo: nairaToKobo(18_000), category: "Foodstuff" },
        { id: "itm_beans", name: "50kg bag of beans", priceKobo: nairaToKobo(42_000), category: "Foodstuff" },
      ],
    },
    {
      id: "vnd_lagos_kitchen",
      name: "Lagos Kitchen Depot",
      city: "Lagos",
      categories: ["Kitchen equipment"],
      verified: true,
      payoutAccountRef: "Verified account •••• 9134",
      rating: 4.6,
      catalog: [
        { id: "itm_gas_cooker", name: "4-burner gas cooker", priceKobo: nairaToKobo(145_000), category: "Kitchen equipment" },
        { id: "itm_blender", name: "Countertop blender", priceKobo: nairaToKobo(58_000), category: "Kitchen equipment" },
        { id: "itm_pressure_cooker", name: "Pressure cooker 6L", priceKobo: nairaToKobo(47_500), category: "Kitchen equipment" },
        { id: "itm_microwave", name: "Microwave oven 25L", priceKobo: nairaToKobo(72_000), category: "Kitchen equipment" },
      ],
    },
    {
      id: "vnd_homefront",
      name: "Homefront Appliances",
      city: "Abuja",
      categories: ["Household"],
      verified: true,
      payoutAccountRef: "Verified account •••• 2207",
      rating: 4.5,
      catalog: [
        { id: "itm_standing_fan", name: "Standing fan", priceKobo: nairaToKobo(38_000), category: "Household" },
        { id: "itm_rechargeable_lamp", name: "Rechargeable lamp", priceKobo: nairaToKobo(12_500), category: "Household" },
        { id: "itm_storage_set", name: "Plastic storage set", priceKobo: nairaToKobo(24_000), category: "Household" },
      ],
    },
    {
      id: "vnd_emtoofi_supplies",
      name: "Emtoofi General Supplies",
      city: "Ibadan",
      categories: ["Other approved goods"],
      verified: true,
      payoutAccountRef: "Verified account •••• 7750",
      rating: 4.7,
      catalog: [
        { id: "itm_school_bundle", name: "School supplies bundle", priceKobo: nairaToKobo(35_000), category: "Other approved goods" },
        { id: "itm_solar_controller", name: "Solar charge controller", priceKobo: nairaToKobo(96_000), category: "Other approved goods" },
      ],
    },
  ];
}

/* Balance check for every transaction we write. */
export function isBalanced(legs) {
  return legs.reduce((sum, leg) => {
    const sign = leg.direction === "CREDIT" ? 1 : -1;
    return sum + sign * leg.amountKobo;
  }, 0) === 0;
}

function makeTx(db, { type, memo, legs, meta = {} }) {
  const txId = uid("tx");
  const at = new Date().toISOString();
  for (const leg of legs) {
    db.ledger.push({
      id: uid("led"),
      txId,
      type,
      accountId: leg.accountId,
      direction: leg.direction,
      amountKobo: leg.amountKobo,
      memo: leg.memo || memo,
      at,
      meta,
    });
  }
  return txId;
}

function audit(db, entry) {
  db.audit.push({ id: uid("aud"), at: new Date().toISOString(), ...entry });
}

function notify(db, entry) {
  db.notifications.push({ id: uid("ntf"), at: new Date().toISOString(), read: false, ...entry });
}

function seedTarget(db, { id, vendorId, itemId, quantity, status, savedKobo, planAmountKobo, frequency, ageDays, vendorNotified }) {
  const vendor = db.vendors.find((v) => v.id === vendorId);
  const item = vendor.catalog.find((i) => i.id === itemId);
  const targetKobo = item.priceKobo * quantity;
  const startedAt = new Date(Date.now() - ageDays * DAY).toISOString();
  const contributions = [];

  /* Split the saved amount into a few contributions so the timeline has
     something to show. */
  const parts = status === "SAVING" ? 2 : 4;
  const perPart = Math.floor(savedKobo / parts);
  for (let i = 0; i < parts; i++) {
    const amount = i === parts - 1 ? savedKobo - perPart * (parts - 1) : perPart;
    if (amount <= 0) continue;
    const partTx = makeTx(db, {
      type: "GOODS_SAVING",
      memo: `Goods saving — ${item.name}`,
      legs: [
        { accountId: `goods_savings:${db.user.id}`, direction: "CREDIT", amountKobo: amount },
        { accountId: `settlement:${db.user.id}`, direction: "DEBIT", amountKobo: amount },
      ],
      meta: { targetId: id },
    });
    const at = new Date(Date.now() - (parts - i) * 6 * DAY).toISOString();
    db.ledger.filter((e) => e.txId === partTx).forEach((e) => {
      e.at = at;
    });
    contributions.push({ id: uid("ctr"), targetId: id, amountKobo: amount, txId: partTx, at, method: "SIMULATED" });
  }

  const target = {
    id,
    userId: db.user.id,
    vendorId,
    itemId,
    itemName: item.name,
    itemPriceKobo: item.priceKobo,
    quantity,
    targetKobo,
    savedKobo,
    status,
    plan: { amountKobo: planAmountKobo, frequency, startDate: startedAt.slice(0, 10) },
    category: item.category,
    deliveryNote: "",
    createdAt: startedAt,
    updatedAt: new Date().toISOString(),
    nextContributionAt: new Date(Date.now() + 7 * DAY).toISOString(),
    contributions,
    vendorNotifications: [],
    workflow: [{ status: "SAVING", at: startedAt }],
  };

  if (status !== "SAVING") target.workflow.push({ status: "TARGET_REACHED", at: new Date(Date.now() - 5 * DAY).toISOString() });
  if (["MEMBER_CONFIRMED", "VENDOR_NOTIFIED", "VENDOR_ACCEPTED", "FULFILLED"].includes(status)) {
    target.workflow.push({ status: "MEMBER_CONFIRMED", at: new Date(Date.now() - 4 * DAY).toISOString() });
  }
  if (["VENDOR_NOTIFIED", "VENDOR_ACCEPTED", "FULFILLED"].includes(status)) {
    const n = { id: uid("vn"), vendorId, targetId: id, orderId: uid("ord"), status: "NOTIFIED", createdAt: new Date(Date.now() - 4 * DAY).toISOString() };
    target.vendorNotifications.push(n);
    target.workflow.push({ status: "VENDOR_NOTIFIED", at: n.createdAt });
    if (vendorNotified !== false) {
      audit(db, { actor: db.user.id, actorName: db.user.name, action: "VENDOR_NOTIFIED", entity: "GOODS_TARGET", entityId: id, summary: `${vendor.name} was notified of order ${n.orderId}.` });
      notify(db, { userId: db.user.id, kind: "GOODS", title: "Vendor notified", body: `${vendor.name} has been notified of your order.`, link: `/app/goods/${id}` });
    }
  }
  if (["VENDOR_ACCEPTED", "FULFILLED"].includes(status)) {
    const n = target.vendorNotifications[0];
    if (n) n.status = "ACCEPTED";
    target.workflow.push({ status: "VENDOR_ACCEPTED", at: new Date(Date.now() - 2 * DAY).toISOString() });
  }
  if (status === "FULFILLED") {
    const payoutTx = makeTx(db, {
      type: "GOODS_PAYOUT",
      memo: `Order fulfilled — ${item.name} × ${quantity}`,
      legs: [
        { accountId: `goods_savings:${db.user.id}`, direction: "DEBIT", amountKobo: targetKobo },
        { accountId: `vendor:${vendorId}`, direction: "CREDIT", amountKobo: targetKobo },
      ],
      meta: { targetId: id, vendorId },
    });
    db.ledger.filter((e) => e.txId === payoutTx).forEach((e) => {
      e.at = new Date(Date.now() - 1 * DAY).toISOString();
    });
    target.workflow.push({ status: "FULFILLED", at: new Date(Date.now() - 1 * DAY).toISOString() });
    audit(db, { actor: db.user.id, actorName: db.user.name, action: "FULFILLED", entity: "GOODS_TARGET", entityId: id, summary: `${item.name} marked as received.` });
    notify(db, { userId: db.user.id, kind: "GOODS", title: "Order fulfilled", body: `${item.name} was marked as received.`, link: `/app/goods/${id}` });
  }

  db.goodsTargets.push(target);
}

function seed(db) {
  const now = Date.now();

  /* Ajo cycles — the pre-existing product, untouched by the goods feature. */
  db.cycles = [
    {
      id: "cyc_lagos_traders_4",
      name: "Lagos Traders Cycle 4",
      contributionKobo: nairaToKobo(50_000),
      memberCount: 20,
      paidCount: 17,
      status: "FUNDING",
      nextPayoutAt: new Date(now + 6 * DAY).toISOString(),
      recipientName: "Adaeze O.",
      createdAt: new Date(now - 40 * DAY).toISOString(),
    },
    {
      id: "cyc_ajegunle_savers_2",
      name: "Ajegunle Savers Cycle 2",
      contributionKobo: nairaToKobo(25_000),
      memberCount: 12,
      paidCount: 12,
      status: "SETTLED",
      nextPayoutAt: new Date(now - 12 * DAY).toISOString(),
      recipientName: "Musa B.",
      createdAt: new Date(now - 90 * DAY).toISOString(),
    },
  ];

  const cycle = db.cycles[0];
  for (let i = 0; i < 5; i++) {
    const amount = cycle.contributionKobo;
    const txId = makeTx(db, {
      type: "CONTRIBUTION",
      memo: `${cycle.name} — contribution`,
      legs: [
        { accountId: `ajo_pool:${cycle.id}`, direction: "CREDIT", amountKobo: amount },
        { accountId: `member:${db.user.id}:receivable`, direction: "DEBIT", amountKobo: amount },
      ],
      meta: { cycleId: cycle.id },
    });
    db.ledger.filter((e) => e.txId === txId).forEach((e) => {
      e.at = new Date(now - (5 - i) * 7 * DAY).toISOString();
    });
  }
  const fee = nairaToKobo(600);
  const feeTx = makeTx(db, {
    type: "PLATFORM_FEE",
    memo: "Platform fee (0.1%)",
    legs: [
      { accountId: "platform:fees", direction: "CREDIT", amountKobo: fee },
      { accountId: `ajo_pool:${cycle.id}`, direction: "DEBIT", amountKobo: fee },
    ],
    meta: { cycleId: cycle.id },
  });
  db.ledger.filter((e) => e.txId === feeTx).forEach((e) => {
    e.at = new Date(now - 3 * DAY).toISOString();
  });

  const settled = db.cycles[1];
  const payoutTx = makeTx(db, {
    type: "PAYOUT",
    memo: `${settled.name} — payout`,
    legs: [
      { accountId: `ajo_pool:${settled.id}`, direction: "DEBIT", amountKobo: nairaToKobo(300_000) },
      { accountId: "recipient:musa_b", direction: "CREDIT", amountKobo: nairaToKobo(300_000) },
    ],
    meta: { cycleId: settled.id },
  });
  db.ledger.filter((e) => e.txId === payoutTx).forEach((e) => {
    e.at = new Date(now - 12 * DAY).toISOString();
  });

  /* Goods targets — 2 vendors, 3 states (the `__seedDemo()` shape). */
  seedTarget(db, {
    id: "tgt_rice_x2",
    vendorId: "vnd_mama_nkechi",
    itemId: "itm_rice_50kg",
    quantity: 2,
    status: "SAVING",
    savedKobo: nairaToKobo(68_000),
    planAmountKobo: nairaToKobo(34_000),
    frequency: "BIWEEKLY",
    ageDays: 18,
  });
  seedTarget(db, {
    id: "tgt_cooker",
    vendorId: "vnd_lagos_kitchen",
    itemId: "itm_gas_cooker",
    quantity: 1,
    status: "TARGET_REACHED",
    savedKobo: nairaToKobo(145_000),
    planAmountKobo: nairaToKobo(25_000),
    frequency: "WEEKLY",
    ageDays: 34,
  });
  seedTarget(db, {
    id: "tgt_oil_x4",
    vendorId: "vnd_mama_nkechi",
    itemId: "itm_groundnut_oil",
    quantity: 4,
    status: "FULFILLED",
    savedKobo: nairaToKobo(128_000),
    planAmountKobo: nairaToKobo(32_000),
    frequency: "MONTHLY",
    ageDays: 62,
  });

  db.notifications.unshift({
    id: uid("ntf"),
    at: new Date(now - 1 * DAY).toISOString(),
    read: false,
    userId: db.user.id,
    kind: "GOODS",
    title: "Target reached",
    body: "Your gas cooker target is fully funded. Confirm your order when you are ready.",
    link: "/app/goods/tgt_cooker",
  });
  db.notifications.unshift({
    id: uid("ntf"),
    at: new Date(now - 6 * DAY).toISOString(),
    read: true,
    userId: db.user.id,
    kind: "AJO",
    title: "Contribution received",
    body: "Your ₦50,000 contribution to Lagos Traders Cycle 4 was recorded.",
    link: "/app/ledger",
  });

  audit(db, { actor: "system", actorName: "System", action: "SEEDED", entity: "DB", entityId: null, summary: "Demo data seeded." });
}

export function createDb() {
  return {
    version: 1,
    user: {
      id: "usr_adaeze",
      name: "Adaeze Okafor",
      email: "adaeze@example.com",
      phone: "08012345678",
      kycStatus: "VERIFIED",
      payoutAccountRef: "GTBank •••• 3390",
      createdAt: new Date(Date.now() - 120 * DAY).toISOString(),
    },
    vendors: seedVendors(),
    cycles: [],
    goodsTargets: [],
    ledger: [],
    notifications: [],
    audit: [],
  };
}

/* ── persistence + change bus ────────────────────────────── */

const hasStorage = typeof window !== "undefined" && typeof window.localStorage !== "undefined";

let db = null;
const listeners = new Set();

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit() {
  if (hasStorage) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch {
      /* quota / private mode — keep the in-memory copy authoritative */
    }
  }
  for (const fn of listeners) fn(db);
}

export function getDb() {
  if (db) return db;
  if (hasStorage) {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        db = JSON.parse(raw);
        return db;
      }
    } catch {
      /* fall through to a fresh seed */
    }
  }
  db = createDb();
  seed(db);
  emit();
  return db;
}

/** Replace the whole store (used by `__seedDemo`). */
export function setDb(next) {
  db = next;
  emit();
  return db;
}

/** Mutate in place, then persist + notify subscribers. Returns what `fn` returns. */
export function commit(fn) {
  const current = getDb();
  const result = fn(current);
  emit();
  return result === undefined ? current : result;
}

export function resetDb() {
  const fresh = createDb();
  seed(fresh);
  return setDb(fresh);
}

/* Re-seed the demo whenever someone asks for it. */
if (typeof window !== "undefined") {
  window.__seedDemo = () => {
    const fresh = createDb();
    seed(fresh);
    setDb(fresh);
    return fresh;
  };
}
