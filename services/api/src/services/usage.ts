import { UsageSummary } from "@easy-read/shared";

const usageStore = new Map<string, { count: number; month: string; subscribed: boolean }>();

function getMonthlyKey(date = new Date()): string {
  return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}`;
}

export function getUsageLimit(): number {
  return Number(process.env.FREE_CONVERSIONS_PER_MONTH ?? 5);
}

export function getUsage(userId: string): UsageSummary {
  const month = getMonthlyKey();
  const record = usageStore.get(userId);

  if (!record || record.month !== month) {
    const fresh = { count: 0, month, subscribed: record?.subscribed ?? false };
    usageStore.set(userId, fresh);
    return { monthCount: 0, limit: getUsageLimit(), isCapped: false };
  }

  const limit = getUsageLimit();
  return { monthCount: record.count, limit, isCapped: !record.subscribed && record.count >= limit };
}

export function incrementUsage(userId: string): UsageSummary {
  const month = getMonthlyKey();
  const existing = usageStore.get(userId);
  if (!existing || existing.month !== month) {
    usageStore.set(userId, { count: 1, month, subscribed: existing?.subscribed ?? false });
  } else {
    existing.count += 1;
    usageStore.set(userId, existing);
  }
  return getUsage(userId);
}

export function markSubscribed(userId: string): void {
  const month = getMonthlyKey();
  const current = usageStore.get(userId);
  if (current && current.month === month) {
    usageStore.set(userId, { ...current, subscribed: true });
  } else {
    usageStore.set(userId, { count: 0, month, subscribed: true });
  }
}
