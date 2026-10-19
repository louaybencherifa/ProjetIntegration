    import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { firebaseApp } from "@/lib/firebase/client";

let analyticsInstance: Analytics | null = null;
let initPromise: Promise<Analytics | null> | null = null;

export async function initializeAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") {
    return null;
  }

  if (analyticsInstance) {
    return analyticsInstance;
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = isSupported()
    .then((supported) => {
      if (!supported) {
        return null;
      }

      analyticsInstance = getAnalytics(firebaseApp);
      return analyticsInstance;
    })
    .catch(() => null);

  return initPromise;
}
