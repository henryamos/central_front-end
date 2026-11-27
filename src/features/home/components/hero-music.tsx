"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Music2, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button/button";
import { Dialog } from "@/components/ui/dialog/dialog";
const subscribeToBody = () => () => {};
const clientBody = () => document.body;
const serverBody = () => null;

export function HeroMusic() {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(45);
  const [notice, setNotice] = useState("");
  const trigger = useRef<HTMLButtonElement>(null);
  const audio = useRef<HTMLAudioElement>(null);
  const portalTarget = useSyncExternalStore(
    subscribeToBody,
    clientBody,
    serverBody,
  );
  const [prompt, setPrompt] = useState(true);
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
  async function toggle() {
    const player = audio.current;
    if (!player) return;
    if (!player.paused) {
      player.pause();
    } else {
      try {
        await player.play();
        setNotice("");
      } catch {
        setNotice("Music could not start. Please try Play again.");
        setOpen(true);
      }
    }
  }
  return (
    <>
      {prompt &&
        portalTarget &&
        createPortal(
          <aside
            data-music-control
            aria-label="Background music invitation"
            className="shadow-sm fixed right-(--page-gutter) bottom-(--page-gutter) z-(--layer-header) grid w-[calc(100%-var(--page-gutter)*2)] max-w-(--music-notice-max) gap-1 rounded-sm border-(length:--control-border-width) border-border bg-background px-4 pt-3 pb-2 text-foreground"
          >
            <p className="m-0 text-base font-semibold">
              Music while you browse?
            </p>
            <p className="m-0 text-sm">Gyatabruwa · Osei Boateng</p>
            <div className="flex flex-wrap items-center gap-1">
              <Button
                variant="secondary"
                className="border-transparent bg-transparent px-0 py-0 not-disabled:hover:bg-transparent"
                onClick={() => {
                  setPrompt(false);
                  void toggle();
                  trigger.current?.focus({ preventScroll: true });
                }}
              >
                <span className="inline-flex items-center gap-1 rounded-sm bg-primary px-2 py-1 text-sm text-primary-foreground">
                  <Play aria-hidden="true" className="size-4" />
                  Enable music
                </span>
              </Button>
              <Button
                variant="secondary"
                className="border-transparent px-2 py-0 text-sm"
                onClick={() => {
                  setPrompt(false);
                  trigger.current?.focus({ preventScroll: true });
                }}
              >
                Not now
              </Button>
            </div>
          </aside>,
          portalTarget,
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
          setPrompt(false);
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
        onOpenChange={setOpen}
        title="Background music"
        closeLabel="Close music controls"
        returnFocusRef={trigger}
      >
        <div className="grid gap-4" data-music-control>
          <p className="m-0 text-lg font-semibold">Gyatabruwa (Psalm 34)</p>
          <p className="m-0 text-base">Osei Boateng</p>
          <Button onClick={() => void toggle()}>
            {playing ? (
              <Pause aria-hidden="true" className="size-4" />
            ) : (
              <Play aria-hidden="true" className="size-4" />
            )}
            {playing ? "Pause music" : "Play music"}
          </Button>
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
