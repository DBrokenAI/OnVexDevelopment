"use client";

import { useEffect, useState, useTransition } from "react";
import {
  IconBellOff,
  IconBellRinging,
  IconDeviceMobile,
  IconShare2,
  IconSquarePlus,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { sendTestPush, subscribePush, unsubscribePush } from "@/lib/push-actions";

type Status =
  | "checking"
  | "unsupported"
  | "ios-install" // iPhone/iPad in the browser: must add to Home Screen first
  | "denied"
  | "off"
  | "on";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

function isIOS() {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    // iPadOS reports itself as a Mac with touch.
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function isInstalled() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

async function getRegistration() {
  return navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" });
}

export function PushAlertsCard() {
  const [status, setStatus] = useState<Status>("checking");
  const [note, setNote] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    let settled = false;
    const settle = (next: Status) => {
      if (settled) return;
      settled = true;
      setStatus(next);
    };
    // Never leave the card on "Checking": if the browser stalls, offer the button.
    const timer = window.setTimeout(() => settle("off"), 5000);

    (async () => {
      const supported =
        "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
      if (!supported) return settle(isIOS() && !isInstalled() ? "ios-install" : "unsupported");
      if (Notification.permission === "denied") return settle("denied");
      // Only look up an existing registration here; installing the service
      // worker waits until the person clicks "Turn on".
      const reg = await navigator.serviceWorker.getRegistration("/");
      const sub = reg ? await reg.pushManager.getSubscription() : null;
      settle(sub ? "on" : "off");
    })().catch((err) => {
      console.error("Push status check failed:", err);
      settle("off");
    });

    return () => {
      settled = true;
      window.clearTimeout(timer);
    };
  }, []);

  function turnOn() {
    setNote(null);
    startTransition(async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          setStatus(permission === "denied" ? "denied" : "off");
          return;
        }
        const reg = await getRegistration();
        await navigator.serviceWorker.ready;
        const sub =
          (await reg.pushManager.getSubscription()) ??
          (await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
          }));
        const res = await subscribePush(sub.toJSON());
        if (!res.ok) {
          await sub.unsubscribe();
          setNote({ tone: "error", text: res.error });
          return;
        }
        setStatus("on");
        setNote({ tone: "ok", text: "Alerts are on. Send a test to see one." });
      } catch (err) {
        console.error(err);
        setNote({ tone: "error", text: "This browser couldn't turn on alerts." });
      }
    });
  }

  function turnOff() {
    setNote(null);
    startTransition(async () => {
      const reg = await getRegistration();
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await unsubscribePush(sub.endpoint);
        await sub.unsubscribe();
      }
      setStatus("off");
      setNote({ tone: "ok", text: "Alerts are off for this device." });
    });
  }

  function sendTest() {
    setNote(null);
    startTransition(async () => {
      const res = await sendTestPush();
      setNote(
        res.ok
          ? { tone: "ok", text: `${res.message ?? "Sent."} It should appear in a few seconds.` }
          : { tone: "error", text: res.error },
      );
    });
  }

  return (
    <section className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
          <IconDeviceMobile size={20} aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-[15px] font-medium">Phone alerts</h2>
          <p className="mt-0.5 text-[13px] text-[var(--ink-2)]">
            Get a lock-screen alert when a site goes down, a client messages you, or a task is due.
            Turn it on separately on each phone or computer you use.
          </p>
        </div>
      </div>

      <div className="mt-5" aria-live="polite">
        {status === "checking" && (
          <p className="text-[13px] text-[var(--ink-3)]">Checking this device…</p>
        )}

        {status === "off" && (
          <Button onClick={turnOn} disabled={pending}>
            <IconBellRinging size={16} aria-hidden="true" />
            {pending ? "Turning on…" : "Turn on alerts for this device"}
          </Button>
        )}

        {status === "on" && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ok-soft)] px-2.5 py-1 text-xs font-medium text-[var(--ok)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--ok)]" aria-hidden="true" />
              On for this device
            </span>
            <Button onClick={sendTest} disabled={pending}>
              {pending ? "Sending…" : "Send test alert"}
            </Button>
            <Button variant="ghost" onClick={turnOff} disabled={pending}>
              <IconBellOff size={16} aria-hidden="true" />
              Turn off
            </Button>
          </div>
        )}

        {status === "ios-install" && (
          <div className="rounded-lg bg-[var(--surface-2)] p-4 text-[13px]">
            <p className="font-medium">On iPhone, add OnVex to your Home Screen first</p>
            <ol className="mt-2 flex flex-col gap-1.5 text-[var(--ink-2)]">
              <li className="flex items-center gap-2">
                1. Tap the Share button <IconShare2 size={16} aria-label="Share" /> in Safari.
              </li>
              <li className="flex items-center gap-2">
                2. Choose <strong className="font-medium text-[var(--ink)]">Add to Home Screen</strong>{" "}
                <IconSquarePlus size={16} aria-hidden="true" />
              </li>
              <li>3. Open OnVex from your Home Screen and come back to this page.</li>
            </ol>
          </div>
        )}

        {status === "denied" && (
          <p className="text-[13px] text-[var(--ink-2)]">
            Alerts are blocked for OnVex in this browser. Allow notifications for this site in your
            browser or phone settings, then reload the page.
          </p>
        )}

        {status === "unsupported" && (
          <p className="text-[13px] text-[var(--ink-2)]">
            This browser can&apos;t receive alerts. Try Chrome, Edge, Firefox or Safari, or on iPhone
            add OnVex to your Home Screen.
          </p>
        )}

        {note && (
          <p
            className={
              note.tone === "ok"
                ? "mt-3 text-[13px] text-[var(--ok)]"
                : "mt-3 text-[13px] text-[var(--danger)]"
            }
          >
            {note.text}
          </p>
        )}
      </div>
    </section>
  );
}
