import { getStorage } from "firebase/storage";
import { firebaseApp } from "@/lib/firebase/client";

export const storage = getStorage(firebaseApp);
