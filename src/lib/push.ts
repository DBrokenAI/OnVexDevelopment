import "server-only";
import webpush, { WebPushError } from "web-push";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { PREVIEW_MODE } from "@/lib/preview";

export type PushPayload = {
  title: string;
  body?: string;
  /** Page to open when the alert is tapped, e.g. "/admin/tasks". */
  url?: string;
  /** Alerts with the same tag replace each other instead of stacking. */
  tag?: string;
};

export type StoredSubscription = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

let configured = false;
function configure() {
  if (configured) return;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT;
  if (!publicKey || !privateKey || !subject) {
    throw new Error("Web push env vars are not set (see .env.example)");
  }
  webpush.setVapidDetails(subject, publicKey, privateKey);
  configured = true;
}

// Preview mode has no signed-in user, so devices live in server memory
// (kept on globalThis so they survive dev hot reloads).
const previewStore = ((globalThis as { __onvexPreviewPush?: Map<string, StoredSubscription> })
  .__onvexPreviewPush ??= new Map<string, StoredSubscription>());

export async function savePushSubscription(
  userId: string,
  sub: StoredSubscription,
  userAgent: string | null,
) {
  if (PREVIEW_MODE) {
    previewStore.set(sub.endpoint, sub);
    return;
  }
  // The signed-in user's own client: RLS only lets them save their own devices.
  const supabase = await createClient();
  const { error } = await supabase
    .from("push_subscriptions")
    .upsert({ user_id: userId, ...sub, user_agent: userAgent }, { onConflict: "endpoint" });
  if (error) throw new Error(error.message);
}

export async function removePushSubscription(userId: string, endpoint: string) {
  if (PREVIEW_MODE) {
    previewStore.delete(endpoint);
    return;
  }
  const supabase = await createClient();
  await supabase.from("push_subscriptions").delete().eq("user_id", userId).eq("endpoint", endpoint);
}

/**
 * Sends an alert to every device the user has turned alerts on for.
 * Devices that have been switched off or uninstalled are cleaned up.
 * Returns how many devices it reached.
 */
export async function sendPushToUser(userId: string, payload: PushPayload): Promise<number> {
  configure();

  let subs: StoredSubscription[];
  const admin = PREVIEW_MODE ? null : createAdminClient();
  if (admin) {
    const { data, error } = await admin
      .from("push_subscriptions")
      .select("endpoint, p256dh, auth")
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    subs = data ?? [];
  } else {
    subs = [...previewStore.values()];
  }

  const body = JSON.stringify(payload);
  const results = await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          body,
          { TTL: 60 * 60 * 24 },
        );
        return { sub, ok: true, gone: false };
      } catch (err) {
        // 404/410: the browser dropped this subscription; stop sending to it.
        const gone = err instanceof WebPushError && (err.statusCode === 404 || err.statusCode === 410);
        if (!gone) console.error("Push send failed:", err);
        return { sub, ok: false, gone };
      }
    }),
  );

  const gone = results.filter((r) => r.gone).map((r) => r.sub.endpoint);
  if (gone.length) {
    if (admin) await admin.from("push_subscriptions").delete().in("endpoint", gone);
    else gone.forEach((e) => previewStore.delete(e));
  }
  const reached = results.filter((r) => r.ok).map((r) => r.sub.endpoint);
  if (admin && reached.length) {
    await admin
      .from("push_subscriptions")
      .update({ last_used_at: new Date().toISOString() })
      .in("endpoint", reached);
  }
  return reached.length;
}
