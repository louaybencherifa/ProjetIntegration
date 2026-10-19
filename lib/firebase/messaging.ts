import { getMessaging, isSupported, type Messaging } from "firebase/messaging";
import { firebaseApp } from "@/lib/firebase/client";

let messagingInstance: Messaging | null = null;
let initPromise: Promise<Messaging | null> | null = null;

export async function initializeMessaging(): Promise<Messaging | null> {
  if (typeof window === "undefined") {
    return null;
  }

  if (messagingInstance) {
    return messagingInstance;
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = isSupported()
    .then((supported) => {
      if (!supported) {
        return null;
      }

      messagingInstance = getMessaging(firebaseApp);
      return messagingInstance;
    })
    .catch(() => null);

  return initPromise;
}
