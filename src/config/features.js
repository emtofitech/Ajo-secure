/**
 * Phase 2: keep behind a flag until the secure contribution and payout system
 * is proven.
 *
 * Flip `ajoToGoods` to `false` and the sidebar item, the `/app/goods/*` routes
 * and the dashboard card all disappear — there is no other code path that can
 * show the feature.
 */
export const FEATURES = {
  ajoToGoods: true,
};

export const isOn = (feature) => Boolean(FEATURES[feature]);
