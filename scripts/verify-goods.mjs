/**
 * verify-goods.mjs — service-level contract tests for Ajo-to-Goods.
 *
 * These run against `src/services/api.js` directly (no browser, no DOM), which
 * is where every rule in the brief actually lives: the state machine, the
 * append-only balanced ledger, catalog-only vendors and the refund path.
 *
 *   npm run verify:goods
 */

import * as api from "../src/services/api.js";
import {
  GOODS_TRANSITIONS,
  MIN_GOODS_CONTRIBUTION_KOBO,
  formatNaira,
  getDb,
  isBalanced,
  nairaToKobo,
} from "../src/services/mockDb.js";

let pass = 0;
let fail = 0;
const check = (label, cond, extra = "") => {
  if (cond) {
    pass++;
    console.log(`  PASS  ${label}`);
  } else {
    fail++;
    console.log(`  FAIL  ${label}${extra ? ` — ${extra}` : ""}`);
  }
};

const rejects = async (label, fn, contains) => {
  try {
    await fn();
    check(label, false, "expected an error, got none");
  } catch (err) {
    check(label, !contains || String(err.message).includes(contains), `message: ${err.message}`);
  }
};

const snapshotLedger = () => JSON.parse(JSON.stringify(getDb().ledger));
const sameEntries = (before, after) => {
  const byId = new Map(after.map((e) => [e.id, e]));
  return before.every((e) => JSON.stringify(byId.get(e.id)) === JSON.stringify(e));
};

async function freshTarget({ vendorId = "vnd_homefront", itemId = "itm_rechargeable_lamp", quantity = 1 } = {}) {
  return api.createGoodsTarget({
    vendorId,
    itemId,
    quantity,
    planAmountKobo: nairaToKobo(500),
    frequency: "WEEKLY",
    startDate: "2026-10-01",
  });
}

const driveToReached = async (target) => {
  const half = Math.ceil(target.targetKobo / 2);
  await api.contributeToGoodsTarget(target.id, half);
  return api.contributeToGoodsTarget(target.id, target.targetKobo - half);
};

console.log("\n=== catalog ===");
const vendors = await api.listVendors();
check("4 approved vendors", vendors.length === 4, `got ${vendors.length}`);
check("every vendor is verified", vendors.every((v) => v.verified));
check("every vendor has 2+ catalog items", vendors.every((v) => v.catalog.length >= 2));
check("catalog prices are integer kobo", vendors.every((v) => v.catalog.every((i) => Number.isInteger(i.priceKobo) && i.priceKobo > 0)));
check("vendors expose a read-only payout ref", vendors.every((v) => typeof v.payoutAccountRef === "string" && v.payoutAccountRef.includes("Verified account")));

console.log("\n=== create target ===");
const target = await freshTarget();
check("target created as SAVING", target.status === "SAVING");
check("target = price × quantity", target.targetKobo === nairaToKobo(12_500), `${target.targetKobo}`);
check("starts with nothing saved", target.savedKobo === 0);
check("records an audit entry", getDb().audit.some((a) => a.action === "TARGET_CREATED" && a.entityId === target.id));

await rejects("unknown vendor rejected", () => api.createGoodsTarget({ vendorId: "vnd_made_up", itemId: "itm_rice_50kg", quantity: 1, planAmountKobo: nairaToKobo(500), frequency: "WEEKLY", startDate: "2026-10-01" }), "approved catalog");
await rejects("item from another vendor rejected", () => api.createGoodsTarget({ vendorId: "vnd_homefront", itemId: "itm_rice_50kg", quantity: 1, planAmountKobo: nairaToKobo(500), frequency: "WEEKLY", startDate: "2026-10-01" }), "approved catalog");
await rejects("free-text payout account rejected", () => api.createGoodsTarget({ vendorId: "vnd_homefront", itemId: "itm_rechargeable_lamp", quantity: 1, planAmountKobo: nairaToKobo(500), frequency: "WEEKLY", startDate: "2026-10-01", payoutAccount: "1234567890" }), "verified account");
await rejects("plan under ₦500 rejected", () => api.createGoodsTarget({ vendorId: "vnd_homefront", itemId: "itm_rechargeable_lamp", quantity: 1, planAmountKobo: nairaToKobo(400), frequency: "WEEKLY", startDate: "2026-10-01" }), "at least");
await rejects("quantity 0 rejected", () => api.createGoodsTarget({ vendorId: "vnd_homefront", itemId: "itm_rechargeable_lamp", quantity: 0, planAmountKobo: nairaToKobo(500), frequency: "WEEKLY", startDate: "2026-10-01" }), "whole number");

console.log("\n=== contributions + ledger ===");
const beforeSave = snapshotLedger();
await api.contributeToGoodsTarget(target.id, nairaToKobo(5_000));
let after = getDb();
check("saved amount increased", after.goodsTargets.find((t) => t.id === target.id).savedKobo === nairaToKobo(5_000));
check("one balanced transaction appended", getDb().ledger.length === beforeSave.length + 2 && isBalanced(getDb().ledger.slice(-2)));
check("append-only: old entries untouched", sameEntries(beforeSave, getDb().ledger));
check("saving is tagged Goods", getDb().ledger.slice(-1)[0].type === "GOODS_SAVING");

await rejects("cannot top up after fulfilment", async () => {
  await driveToReached(target);
  await api.confirmGoodsOrder(target.id);
  await api.acceptVendorOffer(target.id);
  await api.markGoodsReceived(target.id);
  await api.contributeToGoodsTarget(target.id, 1);
}, "while the target is FULFILLED");

console.log("\n=== order workflow ===");
const reached = await freshTarget();
await rejects("cannot confirm before the target is reached", () => api.confirmGoodsOrder(reached.id), "only after the target is reached");
await rejects("cannot mark received before the vendor accepts", () => api.markGoodsReceived(reached.id), "vendor has accepted");

const fullyFunded = await driveToReached(reached);
check("reaching the target flips it to TARGET_REACHED", fullyFunded.status === "TARGET_REACHED");
check("target-reached is audited", getDb().audit.some((a) => a.action === "TARGET_REACHED" && a.entityId === reached.id));
check("target-reached notifies the member", getDb().notifications.some((n) => n.title === "Target reached 🎉" && n.link === `/app/goods/${reached.id}`));

const notified = await api.confirmGoodsOrder(reached.id);
check("confirm moves through MEMBER_CONFIRMED", notified.workflow.some((w) => w.status === "MEMBER_CONFIRMED"));
check("confirm lands on VENDOR_NOTIFIED", notified.status === "VENDOR_NOTIFIED");
check("a vendor notification record is created", notified.vendorNotifications.length === 1 && notified.vendorNotifications[0].status === "NOTIFIED");
await rejects("cannot confirm twice", () => api.confirmGoodsOrder(reached.id), "only after the target is reached");
await rejects("cannot cancel once the vendor is notified", () => api.cancelGoodsTarget(reached.id), "no longer be cancelled");

const accepted = await api.acceptVendorOffer(reached.id);
check("vendor acceptance lands on VENDOR_ACCEPTED", accepted.status === "VENDOR_ACCEPTED");
check("the notification record is marked ACCEPTED", accepted.vendorNotifications[0].status === "ACCEPTED");

const beforePayout = snapshotLedger();
const fulfilled = await api.markGoodsReceived(reached.id);
check("marking received lands on FULFILLED", fulfilled.status === "FULFILLED");
check("fulfilment appends a balanced payout", getDb().ledger.length === beforePayout.length + 2 && isBalanced(getDb().ledger.slice(-2)));
check("payout type is GOODS_PAYOUT", getDb().ledger.slice(-1)[0].type === "GOODS_PAYOUT");
check("append-only through fulfilment", sameEntries(beforePayout, getDb().ledger));

console.log("\n=== pause ===");
const p = await freshTarget();
const paused = await api.pauseGoodsTarget(p.id);
check("saving pauses", paused.status === "PAUSED");
const resumed = await api.pauseGoodsTarget(p.id);
check("pause toggles back to SAVING", resumed.status === "SAVING");

console.log("\n=== cancel + refund ===");
const c = await freshTarget();
await api.contributeToGoodsTarget(c.id, nairaToKobo(3_000));
const beforeCancel = snapshotLedger();
const cancelled = await api.cancelGoodsTarget(c.id);
check(
  "cancel walks CANCELLED → REFUNDED",
  cancelled.status === "REFUNDED" &&
    cancelled.workflow.some((w) => w.status === "CANCELLED") &&
    cancelled.workflow.some((w) => w.status === "REFUNDED"),
  `status ${cancelled.status}`,
);
const afterCancel = getDb().ledger;
check("refund appends a compensating pair", afterCancel.length === beforeCancel.length + 2);
check("refund entries are GOODS_REFUND", afterCancel.slice(-2).every((e) => e.type === "GOODS_REFUND"));
check("the refund legs balance", isBalanced(afterCancel.slice(-2)));
check("the refund is for the full saved amount", afterCancel.slice(-1)[0].amountKobo === nairaToKobo(3_000));
check("every original entry is untouched", sameEntries(beforeCancel, afterCancel));
check("no entry was deleted or rewritten", afterCancel.length >= beforeCancel.length && beforeCancel.every((e, i) => afterCancel[i].id === e.id));
await rejects("cannot cancel a refunded target", () => api.cancelGoodsTarget(c.id), "can no longer be cancelled");

console.log("\n=== state machine ===");
/* CANCELLED and MEMBER_CONFIRMED are walked through inside a single call, so
   there is no way to park a record in them and probe the transition guard. */
const parkable = new Set(["SAVING", "PAUSED", "TARGET_REACHED", "VENDOR_NOTIFIED", "VENDOR_ACCEPTED", "FULFILLED", "REFUNDED"]);

const park = async (from) => {
  const t = await freshTarget();
  if (from === "PAUSED") return (await api.pauseGoodsTarget(t.id)).id;
  if (from === "TARGET_REACHED") return (await driveToReached(t)).id;
  if (from === "VENDOR_NOTIFIED") {
    await driveToReached(t);
    return (await api.confirmGoodsOrder(t.id)).id;
  }
  if (from === "VENDOR_ACCEPTED") {
    await driveToReached(t);
    await api.confirmGoodsOrder(t.id);
    return (await api.acceptVendorOffer(t.id)).id;
  }
  if (from === "FULFILLED") {
    await driveToReached(t);
    await api.confirmGoodsOrder(t.id);
    await api.acceptVendorOffer(t.id);
    return (await api.markGoodsReceived(t.id)).id;
  }
  if (from === "REFUNDED") {
    await api.contributeToGoodsTarget(t.id, nairaToKobo(1_000));
    return (await api.cancelGoodsTarget(t.id)).id;
  }
  return t.id; /* SAVING */
};

for (const [from, allowed] of Object.entries(GOODS_TRANSITIONS)) {
  if (!parkable.has(from)) continue;
  const illegal = Object.keys(GOODS_TRANSITIONS).filter((s) => s !== from && !allowed.includes(s));
  const id = await park(from);
  const parked = getDb().goodsTargets.find((x) => x.id === id);
  check(`state ${from} parks correctly`, parked.status === from, `parked at ${parked.status}`);
  if (!illegal.length) continue;
  await rejects(`illegal ${from} → ${illegal[0]} is refused`, () => probe(id, illegal[0]));
}

async function probe(id, next) {
  if (next === "MEMBER_CONFIRMED") return api.confirmGoodsOrder(id);
  if (next === "PAUSED" || next === "SAVING") return api.pauseGoodsTarget(id);
  if (next === "CANCELLED") return api.cancelGoodsTarget(id);
  if (next === "FULFILLED") return api.markGoodsReceived(id);
  if (next === "VENDOR_ACCEPTED") return api.acceptVendorOffer(id);
  return api.contributeToGoodsTarget(id, 1);
}

console.log("\n=== ledger integrity ===");
const all = getDb().ledger;
const byTx = new Map();
for (const e of all) {
  if (!byTx.has(e.txId)) byTx.set(e.txId, []);
  byTx.get(e.txId).push(e);
}
check("every transaction is balanced", [...byTx.values()].every(isBalanced), `${byTx.size} transactions`);
check("every entry uses integer kobo", all.every((e) => Number.isInteger(e.amountKobo) && e.amountKobo >= 0));
check("ledger entry ids are unique", new Set(all.map((e) => e.id)).size === all.length);
check("goods entries carry the Goods tag", all.filter((e) => e.type.startsWith("GOODS_")).length > 0);
check("refund entries exist for cancelled targets", all.some((e) => e.type === "GOODS_REFUND"));

console.log("\n=== audit + notifications ===");
const db = getDb();
check("a target is audited at every transition", ["TARGET_CREATED", "SAVING_ADDED", "TARGET_REACHED", "ORDER_CONFIRMED", "VENDOR_NOTIFIED", "VENDOR_ACCEPTED", "FULFILLED", "TARGET_CANCELLED", "REFUND_ISSUED"].every((a) => db.audit.some((e) => e.action === a)));
check("notifications were written for the flow", db.notifications.filter((n) => n.kind === "GOODS").length > 0);

console.log("\n=== no free-text payout path ===");
const apiSource = (await import("node:fs")).readFileSync(new URL("../src/services/api.js", import.meta.url), "utf8");
const mentions = apiSource.split("\n").filter((l) => /payoutAccount|bankAccount|accountNumber|sortCode|iban/i.test(l));
check(
  "the only payout-account mentions are the read-only ref + the rejected-field list",
  mentions.every((l) => l.includes("banned") || l.includes("payoutAccountRef")),
  mentions.join(" | "),
);
check("no api function takes an account parameter", !/export async function \w+\([^)]*(account|iban|sortCode)/i.test(apiSource));

console.log("\n=== feature flag ===");
const { FEATURES } = await import("../src/config/features.js");
check("FEATURES.ajoToGoods exists and is boolean", typeof FEATURES.ajoToGoods === "boolean");

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail === 0 ? 0 : 1);
