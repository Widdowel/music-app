import webpush from "web-push";
import { prisma } from "./prisma";

const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const rawContact = process.env.VAPID_CONTACT_EMAIL || "mailto:admin@example.com";
const contact = /^(mailto:|https?:)/i.test(rawContact) ? rawContact : `mailto:${rawContact}`;

if (publicKey && privateKey) {
  webpush.setVapidDetails(contact, publicKey, privateKey);
}

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
  icon?: string;
};

export async function broadcastNotification(payload: PushPayload) {
  if (!publicKey || !privateKey) {
    console.warn("VAPID keys not configured, skipping push notification");
    return;
  }

  const subs = await prisma.pushSubscription.findMany();
  const body = JSON.stringify(payload);

  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          body
        );
      } catch (err: unknown) {
        const status = (err as { statusCode?: number })?.statusCode;
        // 404 or 410 means the subscription is gone — clean it up.
        if (status === 404 || status === 410) {
          await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
        } else {
          console.error("Push notification error:", err);
        }
      }
    })
  );
}
