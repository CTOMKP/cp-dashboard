const EARNINGS_SOUND_SRC = "/sounds/earnings-notification.mp3";

let earningsAudio: HTMLAudioElement | null = null;
let audioUnlocked = false;
let pendingPlayback = false;
let listenersAttached = false;

function getEarningsAudio(): HTMLAudioElement {
  if (!earningsAudio) {
    earningsAudio = new Audio(EARNINGS_SOUND_SRC);
    earningsAudio.preload = "auto";
    earningsAudio.volume = 1;
  }
  return earningsAudio;
}

async function tryPlayAudio(): Promise<boolean> {
  const audio = getEarningsAudio();

  try {
    audio.currentTime = 0;
    await audio.play();
    pendingPlayback = false;
    return true;
  } catch {
    return false;
  }
}

export async function unlockEarningsNotificationSound(): Promise<void> {
  if (audioUnlocked || typeof window === "undefined") return;

  const audio = getEarningsAudio();
  const previousVolume = audio.volume;

  try {
    audio.volume = 0.01;
    audio.currentTime = 0;
    await audio.play();
    audio.pause();
    audio.currentTime = 0;
    audio.volume = previousVolume;
    audioUnlocked = true;

    if (pendingPlayback) {
      await tryPlayAudio();
    }
  } catch {
    // Still blocked; will retry on the next interaction.
  }
}

export function setupEarningsNotificationSoundUnlock() {
  if (typeof window === "undefined" || listenersAttached) return;
  listenersAttached = true;

  const unlock = () => {
    void unlockEarningsNotificationSound();
  };

  window.addEventListener("pointerdown", unlock, { passive: true });
  window.addEventListener("keydown", unlock);
  window.addEventListener("touchstart", unlock, { passive: true });
}

export async function playEarningsNotificationSound(): Promise<void> {
  if (typeof window === "undefined") return;

  if (!audioUnlocked) {
    pendingPlayback = true;
    return;
  }

  const played = await tryPlayAudio();
  if (!played) {
    pendingPlayback = true;
  }
}

export function preloadEarningsNotificationSound() {
  if (typeof window === "undefined") return;
  getEarningsAudio().load();
}
