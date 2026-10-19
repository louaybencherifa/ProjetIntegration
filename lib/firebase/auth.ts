import { getAuth } from "firebase/auth";
import { firebaseApp } from "@/lib/firebase/client";

export const auth = getAuth(firebaseApp);
