import { getDatabase } from "firebase/database";
import { firebaseApp } from "@/lib/firebase/client";

export const database = getDatabase(firebaseApp);
