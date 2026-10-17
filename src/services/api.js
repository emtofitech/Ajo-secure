/**
 * api.js — every read and write the dashboard performs.
 *
 * The app never touches `mockDb` directly; it goes through these functions so
 * the rules live in one place. Each function names the real HTTP endpoint it
 * will become, so swapping the mock for `fetch` is a mechanical change.
 *
 * Invariants enforced here:
 *   - all amounts are integer kobo
 *   - the ledger is append-only; corrections are new compensating entries
 *   - every transaction written is balanced (sum of legs === 0)
 *   - goods state transitions are whitelisted; illegal jumps throw
 *   - no function accepts a free-text vendor payout account
 */

import {
  CANCELLABLE_STATES,
  GOODS_FREQUENCIES,
  GOODS_TRANSITIONS,
  MIN_GOODS_CONTRIBUTION_KOBO,
  commit,
  formatNaira,
  getDb,
  isBalanced,
  koboToNaira,
  nairaToKobo,
  uid,
} from "./mockDb.js";

const wait = (ms = 110) => new Promise((resolve) => setTimeout(resolve, ms));

const fail = (message) => {
  throw new Error(message);
};

/* ── shared helpers ──────────────────────────────────────── */

const nowIso = () => new Date().toISOString();

function writeTx(db, { type, memo, legs, meta = {} }) {
  if (!isBalanced(legs)) fail(`Ledger transaction is not balanced: ${type}`);
  if (legs.some((l) => !Number.isInteger(l.amountKobo) || l.amountKobo < 0)) {
    fail("Ledger amounts must be non-negative integer kobo.");
  }
  const txId = uid("tx");
  const at = nowIso();
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
  db.audit.push({ id: uid("aud"), at: nowIso(), actor: db.user.id, actorName: db.user.name, ...entry });
}

function notify(db, entry) {
  db.notifications.push({
    id: uid("ntf"),
    at: nowIso(),
    read: false,
    userId: db.user.id,
    ...entry,
  });
}

/** Apply a whitelisted workflow step and record it. */
function transition(target, next, { summary }) {
  const allowed = GOODS_TRANSITIONS[target.status] || [];
  if (!allowed.includes(next)) {
    fail(`Cannot move from ${target.status} to ${next}.`);
  }
  target.status = next;
  target.updatedAt = nowIso();
  target.workflow.push({ status: next, at: target.updatedAt, summary });
  return target;
}

const findTarget = (db, id) => {
  const target = db.goodsTargets.find((t) => t.id === id);
  if (!target) fail(`Goods target ${id} not found.`);
  return target;
};

const findVendor = (db, id) => {
  const vendor = db.vendors.find((v) => v.id === id);
  if (!vendor) fail("Vendor not found in the approved catalog.");
  return vendor;
};

const publicVendor = (vendor) => ({
  id: vendor.id,
  name: vendor.name,
  city: vendor.city,
  categories: vendor.categories,
  verified: vendor.verified,
  rating: vendor.rating,
  /* Read-only everywhere. There is no API that can change this from the UI. */
  payoutAccountRef: vendor.payoutAccountRef,
  catalog: vendor.catalog,
});

/* ── core (existing product) ─────────────────────────────── */

/** GET /v1/me */
export async function getUser() {
  await wait(60);
  return { ...getDb().user };
}

/** GET /v1/cycles */
export async function listCycles() {
  await wait(80);
  return getDb().cycles.map((c) => ({ ...c }));
}

/** GET /v1/ledger?scope=ALL|AJO|GOODS */
export async function listLedger({ scope = "ALL" } = {}) {
  await wait(80);
  const db = getDb();
  return db.ledger
    .map((e) => ({ ...e }))
    .filter((e) => {
      if (scope === "ALL") return true;
      if (scope === "GOODS") return e.type.startsWith("GOODS_");
      if (scope === "AJO") return !e.type.startsWith("GOODS_");
      return true;
    })
    .sort((a, b) => (a.at < b.at ? 1 : -1));
}

/** GET /v1/notifications */
export async function listNotifications() {
  await wait(60);
  return getDb()
    .notifications.map((n) => ({ ...n }))
    .sort((a, b) => (a.at < b.at ? 1 : -1));
}

/** PATCH /v1/notifications/:id */
export async function markNotificationRead(id) {
  await wait(40);
  commit((db) => {
    const n = db.notifications.find((x) => x.id === id);
    if (n) n.read = true;
  });
  return { ok: true };
}

/** GET /v1/audit */
export async function listAudit() {
  await wait(60);
  return getDb()
    .audit.map((a) => ({ ...a }))
    .sort((a, b) => (a.at < b.at ? 1 : -1));
}

/* ── Ajo-to-Goods ────────────────────────────────────────── */

/**
 * GET /v1/goods/vendors
 * The approved, verified catalog. Items carry the price; there is no way for a
 * member to supply a vendor or an account of their own.
 */
export async function listVendors() {
  await wait(90);
  return getDb().vendors.map(publicVendor);
}

/** GET /v1/goods/targets */
export async function listGoodsTargets() {
  await wait(90);
  return getDb()
    .goodsTargets.map((t) => ({ ...t }))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

/** GET /v1/goods/targets/:id */
export async function getGoodsTarget(id) {
  await wait(70);
  const db = getDb();
  const target = findTarget(db, id);
  const vendor = findVendor(db, target.vendorId);
  return { ...target, vendor: publicVendor(vendor) };
}

/**
 * GET /v1/goods/fees
 * Fee model for Ajo-to-Goods to be confirmed with legal and finance.
 * TODO: replace the mock 0% with the agreed platform + vendor fee schedule.
 */
export async function getGoodsFees() {
  await wait(50);
  return {
    platformFeePercent: 0,
    vendorFeePercent: 0,
    currency: "NGN",
    note: "Fees are shown before you commit. Nothing is charged at the moment.",
    todo: "Fee model for Ajo-to-Goods to be confirmed with legal and finance.",
  };
}

/**
 * POST /v1/goods/targets
 * Validates the vendor and item against the catalog, so any free-text vendor
 * (or a hand-typed payout account) is rejected outright.
 */
export async function createGoodsTarget(payload = {}) {
  await wait(140);

  /* Reject anything that looks like an attempt to name a payout account. */
  for (const banned of ["payoutAccount", "payout_account", "bankAccount", "accountNumber", "sortCode", "iban"]) {
    if (payload[banned] !== undefined) {
      fail("Vendors are paid only to their verified account. That field is not accepted.");
    }
  }

  const quantity = Number(payload.quantity);
  if (!Number.isInteger(quantity) || quantity < 1) fail("Quantity must be a whole number of 1 or more.");

  const amountKobo = Number(payload.planAmountKobo);
  if (!Number.isInteger(amountKobo) || amountKobo < MIN_GOODS_CONTRIBUTION_KOBO) {
    fail(`A savings plan must be at least ₦${formatNaira(MIN_GOODS_CONTRIBUTION_KOBO)}.`);
  }

  const frequency = GOODS_FREQUENCIES.find((f) => f.value === payload.frequency);
  if (!frequency) fail("Choose a savings frequency.");

  const startDate = payload.startDate || nowIso().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) fail("Choose a valid start date.");

  const created = commit((db) => {
    const vendor = findVendor(db, payload.vendorId);
    if (!vendor.verified) fail("That vendor is not on the approved list.");
    const item = vendor.catalog.find((i) => i.id === payload.itemId);
    if (!item) fail("That item is not in the approved catalog.");

    const targetKobo = item.priceKobo * quantity;
    const target = {
      id: uid("tgt"),
      userId: db.user.id,
      vendorId: vendor.id,
      itemId: item.id,
      itemName: item.name,
      itemPriceKobo: item.priceKobo,
      quantity,
      targetKobo,
      savedKobo: 0,
      status: "SAVING",
      category: item.category,
      plan: { amountKobo, frequency: frequency.value, startDate },
      deliveryNote: "",
      createdAt: nowIso(),
      updatedAt: nowIso(),
      nextContributionAt: nextDateFrom(startDate, frequency.weeks),
      contributions: [],
      vendorNotifications: [],
      workflow: [{ status: "SAVING", at: nowIso() }],
    };

    db.goodsTargets.push(target);
    audit(db, {
      action: "TARGET_CREATED",
      entity: "GOODS_TARGET",
      entityId: target.id,
      summary: `${item.name} × ${quantity} from ${vendor.name} — target ₦${formatNaira(targetKobo)}.`,
    });
    notify(db, {
      kind: "GOODS",
      title: "Goods target created",
      body: `You started saving toward ${item.name}.`,
      link: `/app/goods/${target.id}`,
    });
    return target;
  });

  return { ...created };
}

function nextDateFrom(startDate, weeks) {
  const base = new Date(`${startDate}T09:00:00`);
  const next = new Date(base.getTime() + weeks * 7 * 86_400_000);
  return next.toISOString();
}

/**
 * POST /v1/goods/targets/:id/contributions
 * Appends balanced GOODS_SAVING entries and moves the target to
 * TARGET_REACHED once the saved amount covers it.
 */
export async function contributeToGoodsTarget(id, amountKobo) {
  await wait(150);
  const amount = Number(amountKobo);
  if (!Number.isInteger(amount) || amount <= 0) fail("Enter an amount in kobo.");

  return commit((db) => {
    const target = findTarget(db, id);
    if (target.status !== "SAVING" && target.status !== "PAUSED") {
      fail(`You cannot add savings while the target is ${target.status}.`);
    }

    const txId = writeTx(db, {
      type: "GOODS_SAVING",
      memo: `Goods saving — ${target.itemName}`,
      legs: [
        { accountId: `goods_savings:${db.user.id}`, direction: "CREDIT", amountKobo: amount },
        { accountId: `settlement:${db.user.id}`, direction: "DEBIT", amountKobo: amount },
      ],
      meta: { targetId: target.id },
    });

    target.contributions.push({ id: uid("ctr"), targetId: target.id, amountKobo: amount, txId, at: nowIso(), method: "SIMULATED" });
    target.savedKobo += amount;
    target.updatedAt = nowIso();

    audit(db, {
      action: "SAVING_ADDED",
      entity: "GOODS_TARGET",
      entityId: target.id,
      summary: `₦${formatNaira(amount)} added. ₦${formatNaira(target.savedKobo)} of ₦${formatNaira(target.targetKobo)} saved.`,
    });
    notify(db, {
      kind: "GOODS",
      title: "Savings added",
      body: `₦${formatNaira(amount)} was added to your ${target.itemName} target.`,
      link: `/app/goods/${target.id}`,
    });

    if (target.status === "PAUSED") transition(target, "SAVING", { summary: "resumed" });

    if (target.savedKobo >= target.targetKobo) {
      transition(target, "TARGET_REACHED", { summary: "reached" });
      audit(db, {
        action: "TARGET_REACHED",
        entity: "GOODS_TARGET",
        entityId: target.id,
        summary: `Target fully funded at ₦${formatNaira(target.targetKobo)}.`,
      });
      notify(db, {
        kind: "GOODS",
        title: "Target reached 🎉",
        body: `Your ${target.itemName} target is fully funded. Confirm your order to notify ${findVendor(db, target.vendorId).name}.`,
        link: `/app/goods/${target.id}`,
      });
    }

    return { ...target };
  });
}

/**
 * POST /v1/goods/targets/:id/confirm
 * Only the owner, and only once the target is reached. Records the member's
 * confirmation and the vendor notification, then simulates the vendor
 * accepting the order.
 */
export async function confirmGoodsOrder(id) {
  await wait(160);

  const result = commit((db) => {
    const target = findTarget(db, id);
    if (target.userId !== db.user.id) fail("Only the member who created this target can confirm the order.");
    if (target.status !== "TARGET_REACHED") fail("You can confirm an order only after the target is reached.");

    const vendor = findVendor(db, target.vendorId);

    transition(target, "MEMBER_CONFIRMED", { summary: "order confirmed" });
    audit(db, {
      action: "ORDER_CONFIRMED",
      entity: "GOODS_TARGET",
      entityId: target.id,
      summary: `Order confirmed for ${target.quantity} × ${target.itemName}.`,
    });

    const record = {
      id: uid("vn"),
      vendorId: vendor.id,
      targetId: target.id,
      orderId: uid("ord"),
      status: "NOTIFIED",
      createdAt: nowIso(),
    };
    target.vendorNotifications.push(record);

    transition(target, "VENDOR_NOTIFIED", { summary: "vendor notified" });
    audit(db, {
      action: "VENDOR_NOTIFIED",
      entity: "GOODS_TARGET",
      entityId: target.id,
      summary: `${vendor.name} was notified of order ${record.orderId}.`,
    });
    notify(db, {
      kind: "GOODS",
      title: "Vendor notified",
      body: `${vendor.name} has been notified of your order.`,
      link: `/app/goods/${target.id}`,
    });

    return { ...target };
  });

  /* Simulated vendor response — the mock never touches the member's money. */
  scheduleVendorAcceptance(id);

  return result;
}

const pendingVendorTimers = new Map();

/**
 * POST /v1/goods/targets/:id/vendor-accept
 * The vendor's response. In the browser this is simulated on a timer right
 * after the notification; it is a separate call so the step is explicit.
 */
export async function acceptVendorOffer(id) {
  await wait(120);
  return commit((db) => {
    const target = findTarget(db, id);
    if (target.status !== "VENDOR_NOTIFIED") fail("The vendor has not been notified of this order yet.");
    const vendor = findVendor(db, target.vendorId);
    const record = target.vendorNotifications[target.vendorNotifications.length - 1];
    if (record) record.status = "ACCEPTED";
    transition(target, "VENDOR_ACCEPTED", { summary: "vendor accepted" });
    audit(db, {
      action: "VENDOR_ACCEPTED",
      entity: "GOODS_TARGET",
      entityId: target.id,
      summary: `${vendor.name} accepted the order.`,
    });
    notify(db, {
      kind: "GOODS",
      title: "Vendor accepted",
      body: `${vendor.name} accepted your order. Mark it as received when it arrives.`,
      link: `/app/goods/${target.id}`,
    });
    return { ...target };
  });
}

function scheduleVendorAcceptance(id) {
  if (typeof window === "undefined") return;
  if (pendingVendorTimers.has(id)) return;
  const timer = setTimeout(() => {
    pendingVendorTimers.delete(id);
    acceptVendorOffer(id).catch(() => {
      /* the target moved on while we waited — nothing to do */
    });
  }, 2200);
  pendingVendorTimers.set(id, timer);
}

/** POST /v1/goods/targets/:id/received — the member marks the goods delivered. */
export async function markGoodsReceived(id) {
  await wait(150);
  return commit((db) => {
    const target = findTarget(db, id);
    if (target.userId !== db.user.id) fail("Only the member can mark an order as received.");
    if (target.status !== "VENDOR_ACCEPTED") fail("You can mark an order as received once the vendor has accepted it.");

    /* The pooled goods balance goes to the vendor's verified account. */
    writeTx(db, {
      type: "GOODS_PAYOUT",
      memo: `Order fulfilled — ${target.itemName} × ${target.quantity}`,
      legs: [
        { accountId: `goods_savings:${db.user.id}`, direction: "DEBIT", amountKobo: target.targetKobo },
        { accountId: `vendor:${target.vendorId}`, direction: "CREDIT", amountKobo: target.targetKobo },
      ],
      meta: { targetId: target.id, vendorId: target.vendorId },
    });

    transition(target, "FULFILLED", { summary: "received" });
    audit(db, {
      action: "FULFILLED",
      entity: "GOODS_TARGET",
      entityId: target.id,
      summary: `${target.quantity} × ${target.itemName} marked as received.`,
    });
    notify(db, {
      kind: "GOODS",
      title: "Order fulfilled",
      body: `${target.itemName} was marked as received.`,
      link: `/app/goods/${target.id}`,
    });
    return { ...target };
  });
}

/** PATCH /v1/goods/targets/:id/delivery-note — free text, 200 characters. */
export async function updateGoodsDeliveryNote(id, note) {
  await wait(100);
  const text = String(note ?? "");
  if (text.length > 200) fail("A delivery note can be at most 200 characters.");
  return commit((db) => {
    const target = findTarget(db, id);
    if (target.userId !== db.user.id) fail("Only the member can edit this target.");
    target.deliveryNote = text;
    target.updatedAt = nowIso();
    audit(db, {
      action: "DELIVERY_NOTE_UPDATED",
      entity: "GOODS_TARGET",
      entityId: target.id,
      summary: "Delivery or pickup note updated.",
    });
    return { ...target };
  });
}

/** PATCH /v1/goods/targets/:id/pause — pause and resume a saving target. */
export async function pauseGoodsTarget(id) {
  await wait(110);
  return commit((db) => {
    const target = findTarget(db, id);
    if (target.userId !== db.user.id) fail("Only the member can change this target.");
    const next = target.status === "SAVING" ? "PAUSED" : "SAVING";
    transition(target, next, { summary: next === "PAUSED" ? "paused" : "resumed" });
    audit(db, {
      action: next === "PAUSED" ? "TARGET_PAUSED" : "TARGET_RESUMED",
      entity: "GOODS_TARGET",
      entityId: target.id,
      summary: `${target.itemName} savings ${next === "PAUSED" ? "paused" : "resumed"}.`,
    });
    return { ...target };
  });
}

/**
 * DELETE /v1/goods/targets/:id
 * Cancellation appends a compensating REFUND entry for whatever had been saved
 * and leaves every earlier entry exactly as it was.
 */
export async function cancelGoodsTarget(id) {
  await wait(150);
  return commit((db) => {
    const target = findTarget(db, id);
    if (target.userId !== db.user.id) fail("Only the member can cancel this target.");
    if (!CANCELLABLE_STATES.has(target.status)) {
      fail(`A target that is ${target.status} can no longer be cancelled.`);
    }

    transition(target, "CANCELLED", { summary: "cancelled" });
    audit(db, {
      action: "TARGET_CANCELLED",
      entity: "GOODS_TARGET",
      entityId: target.id,
      summary: `${target.itemName} cancelled. Saved funds return to your payout account after review.`,
    });
    notify(db, {
      kind: "GOODS",
      title: "Target cancelled",
      body: "Saved funds return to your payout account after review.",
      link: `/app/goods/${target.id}`,
    });

    if (target.savedKobo > 0) {
      writeTx(db, {
        type: "GOODS_REFUND",
        memo: `Refund — ${target.itemName}`,
        legs: [
          { accountId: `goods_savings:${db.user.id}`, direction: "DEBIT", amountKobo: target.savedKobo },
          { accountId: `settlement:${db.user.id}`, direction: "CREDIT", amountKobo: target.savedKobo },
        ],
        meta: { targetId: target.id, reverses: "GOODS_SAVING" },
      });
      audit(db, {
        action: "REFUND_ISSUED",
        entity: "GOODS_TARGET",
        entityId: target.id,
        summary: `₦${formatNaira(target.savedKobo)} refunded to your payout account (pending review).`,
      });
    }

    transition(target, "REFUNDED", { summary: "refunded" });
    return { ...target };
  });
}

/** GET /v1/goods/summary — the dashboard + home card roll-up. */
export async function getGoodsSummary() {
  await wait(70);
  const db = getDb();
  const targets = db.goodsTargets;
  const active = targets.filter((t) => ["SAVING", "PAUSED", "TARGET_REACHED", "MEMBER_CONFIRMED", "VENDOR_NOTIFIED", "VENDOR_ACCEPTED"].includes(t.status));
  return {
    activeCount: active.length,
    savedKobo: targets
      .filter((t) => !["CANCELLED", "REFUNDED"].includes(t.status))
      .reduce((sum, t) => sum + t.savedKobo, 0),
    readyCount: targets.filter((t) => t.status === "TARGET_REACHED").length,
    completedCount: targets.filter((t) => t.status === "FULFILLED").length,
  };
}

export { formatNaira, koboToNaira, nairaToKobo };
