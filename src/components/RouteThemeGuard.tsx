"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const FORCE_DARK_ROUTES = [
  "/",
  "/login",
  "/creator/signup",
  "/creator/login",
  "/creator-signup",
];

const STORAGE_KEY = "ctom-creator-theme";

export default function RouteThemeGuard() {
  const pathname = usePathname();

  useEffect(() => {
    const forceDark = FORCE_DARK_ROUTES.includes(pathname);

    if (forceDark) {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(stored === "light" ? "light" : "dark");
  }, [pathname]);

  return null;
}
