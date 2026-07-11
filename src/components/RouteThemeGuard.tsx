"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Keep the document root dark — dashboard light theme is scoped to .creator-shell only. */
export default function RouteThemeGuard() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add("dark");
  }, [pathname]);

  return null;
}
