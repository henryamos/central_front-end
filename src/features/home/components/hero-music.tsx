"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Music2, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button/button";
import { Dialog } from "@/components/ui/dialog/dialog";
let memoryChoice: string | null = null;
function readChoice() {
  if (memoryChoice) return memoryChoice;
  try {
    return sessionStorage.getItem("church-music-choice") || "pending";
  } catch {
    return "pending";
  }
}
function subscribeChoice(callback: () => void) {
  window.addEventListener("church-music-choice", callback);
  return () => window.removeEventListener("church-music-choice", callback);
}
function saveChoice(value: string) {
  memoryChoice = value;
  try {
    sessionStorage.setItem("church-music-choice", value);
  } catch {
    /* Optional preference storage. */
  }
  window.dispatchEvent(new Event("church-music-choice"));
}
function serverChoice() {
  return "loading";
}

export function HeroMusic() {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(45);
  const [notice, setNotice] = useState("");
  const trigger = useRef<HTMLButtonElement>(null);
  const audio = useRef<HTMLAudioElement>(null);
  const choice = useSyncExternalStore(
    subscribeChoice,
    readChoice,
    serverChoice,
  );
  const prompt = choice === "pending";
  useEffect(() => {
    const player = audio.current;
    if (!player) return;
    player.volume = 0.45;
    const pauseHidden = () => {
      if (document.hidden) player.pause();
    };
    document.addEventListener("visibilitychange", pauseHidden);
    return () => {
      player.pause();
      document.removeEventListener("visibilitychange", pauseHidden);
    };
  }, []);
  useEffect(() => {
    if (choice !== "enabled") return;
    void audio.current
      ?.play()
      .catch(() => setNotice("Press Play to start the music."));
  }, [choice]);
  async function toggle() {
    const player = audio.current;
    if (!player) return;
    if (!player.paused) {
      player.pause();
      saveChoice("dismissed");
    } else {
      try {
        await player.play();
        saveChoice("enabled");
        setNotice("");
      } catch {
        setNotice("Music could not start. Please try Play again.");
      }
    }
  }
  return (
    <>
      {prompt &&
        createPortal(
          <aside
            data-music-control
            aria-label="Background music invitation"
            className="shadow-sm fixed right-(--page-gutter) bottom-(--page-gutter) z-(--layer-header) grid w-[calc(100%-var(--page-gutter)*2)] max-w-(--music-notice-max) gap-3 rounded-sm border-(length:--control-border-width) border-border bg-background p-4 text-foreground"
          >
            <p className="m-0 text-base font-semibold">
              Music while you browse?
            </p>
            <p className="m-0 text-sm">Gyatabruwa · Osei Boateng</p>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => {
                  void toggle();
                  saveChoice("enabled");
                  trigger.current?.focus({ preventScroll: true });
                }}
              >
                Enable music
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  saveChoice("dismissed");
                  trigger.current?.focus({ preventScroll: true });
                }}
              >
                Not now
              </Button>
            </div>
          </aside>,
          document.body,
        )}
      <audio
        ref={audio}
        src="/audio/gyatabruwa-osei-boateng.mp3"
        preload="none"
        loop
        onPlaying={() => {
          setPlaying(true);
          setNotice("");
        }}
        onPause={() => setPlaying(false)}
        onError={() =>
          setNotice("Music is unavailable. Please try again later.")
        }
      />
      <Button
        data-music-control
        ref={trigger}
        aria-label={
          playing ? "Pause background music" : "Play background music"
        }
        aria-haspopup="dialog"
        aria-expanded={open}
        title={playing ? "Pause background music" : "Play background music"}
        onClick={() => {
          void toggle();
          setOpen(true);
        }}
        className="min-h-12 min-w-12 border-transparent bg-transparent p-0 text-background not-disabled:hover:bg-primary focus-visible:inset-ring-background sm:px-3"
      >
        <span className="flex items-center gap-2">
          {playing ? (
            <Pause aria-hidden="true" className="size-5" />
          ) : (
            <Music2 aria-hidden="true" className="size-5" />
          )}
          <span className="hidden sm:inline">Music</span>
        </span>
      </Button>
      <Dialog
        data-music-control
        open={open}
        onOpenChange={(next) => {
          if (!next && prompt) saveChoice("dismissed");
          setOpen(next);
        }}
        title="Background music"
        closeLabel="Close music controls"
        returnFocusRef={trigger}
      >
        <div className="grid gap-4" data-music-control>
          <p className="m-0 text-lg font-semibold">Gyatabruwa (Psalm 34)</p>
          <p className="m-0 text-base">Osei Boateng</p>
          <Button
            onClick={() => {
              void toggle();
              if (prompt) {
                saveChoice("enabled");
                setOpen(false);
              }
            }}
          >
            {playing ? (
              <Pause aria-hidden="true" className="size-4" />
            ) : (
              <Play aria-hidden="true" className="size-4" />
            )}
            {playing ? "Pause music" : "Play music"}
          </Button>
          {prompt && (
            <Button variant="secondary" onClick={() => saveChoice("dismissed")}>
              Not now
            </Button>
          )}
          <label className="grid gap-2 text-base font-semibold">
            Volume — {volume}%
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              aria-label="Music volume"
              onChange={(event) => {
                const next = Number(event.target.value);
                setVolume(next);
                if (audio.current) audio.current.volume = next / 100;
              }}
              className="min-h-12 w-full accent-primary"
            />
          </label>
          <p role="status" className="m-0 text-sm">
            {notice || (playing ? "Music is playing." : "Music is paused.")}
          </p>
          {notice && (
            <a
              href="https://www.youtube.com/watch?v=2bFoKlf1N64"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center text-base font-semibold underline focus-visible:inset-ring-(length:--focus-width) focus-visible:inset-ring-primary focus-visible:outline-hidden"
            >
              Listen on YouTube (opens a new tab)
            </a>
          )}
        </div>
      </Dialog>
    </>
  );
}
