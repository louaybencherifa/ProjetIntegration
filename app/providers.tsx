"use client";

import { useEffect, type PropsWithChildren } from "react";
import { initializeAnalytics } from "@/lib/firebase/analytics";

export default function Providers({ children }: PropsWithChildren) {
  useEffect(() => {
    void initializeAnalytics();
  }, []);

  return children;
}
