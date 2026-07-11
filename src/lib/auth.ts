export async function signOut(): Promise<void> {
  try {
    await fetch("/api/creator/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // Still redirect locally if the logout request fails.
  }

  if (typeof window !== "undefined") {
    for (const key of Object.keys(sessionStorage)) {
      if (key.startsWith("ctom-")) {
        sessionStorage.removeItem(key);
      }
    }

    window.location.href = "/creator/login";
  }
}
