import { useCallback, useEffect, useRef, useState } from "react";
import * as api from "../../services/api.js";
import { subscribe } from "../../services/mockDb.js";

/**
 * Re-renders whenever the mock store changes, so a write from one component is
 * reflected everywhere without a manual refetch.
 */
export function useStoreVersion() {
  const [version, setVersion] = useState(0);
  useEffect(() => subscribe(() => setVersion((v) => v + 1)), []);
  return version;
}

/** Minimal async wrapper: data / loading / error, cancelled on unmount. */
export function useAsync(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const alive = useRef(true);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    alive.current = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    fnRef
      .current()
      .then((data) => {
        if (alive.current) setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (alive.current) setState({ data: null, loading: false, error });
      });
    return () => {
      alive.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const reload = useCallback(() => setState((s) => ({ ...s, loading: true })), []);
  return { ...state, reload };
}

export const useUser = () => useAsync(() => api.getUser(), []);
export const useCycles = () => {
  const v = useStoreVersion();
  return useAsync(() => api.listCycles(), [v]);
};
export const useAudit = () => {
  const v = useStoreVersion();
  return useAsync(() => api.listAudit(), [v]);
};
export const useGoodsVendors = () => {
  const v = useStoreVersion();
  return useAsync(() => api.listVendors(), [v]);
};
export const useGoodsTargets = () => {
  const v = useStoreVersion();
  return useAsync(() => api.listGoodsTargets(), [v]);
};
export const useGoodsSummary = () => {
  const v = useStoreVersion();
  return useAsync(() => api.getGoodsSummary(), [v]);
};
export const useGoodsFees = () => useAsync(() => api.getGoodsFees(), []);
export const useNotifications = () => {
  const v = useStoreVersion();
  return useAsync(() => api.listNotifications(), [v]);
};
export const useLedger = (scope = "ALL") => {
  const v = useStoreVersion();
  return useAsync(() => api.listLedger({ scope }), [v, scope]);
};

/** Loads one target by id and keeps it fresh as the store changes. */
export function useGoodsTarget(id) {
  const v = useStoreVersion();
  return useAsync(() => api.getGoodsTarget(id), [id, v]);
}
