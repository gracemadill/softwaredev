import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { UsageSummary } from "@easy-read/shared";
import { getUsage, incrementUsage } from "./api";

interface UsageContextValue {
  usage?: UsageSummary;
  refresh: () => Promise<void>;
  increment: () => Promise<UsageSummary>;
}

const UsageContext = createContext<UsageContextValue>({
  refresh: async () => undefined,
  increment: async () => ({ monthCount: 0, limit: 0, isCapped: false }),
});

export const UsageProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [usage, setUsage] = useState<UsageSummary>();

  const refresh = async () => {
    const summary = await getUsage();
    setUsage(summary);
  };

  useEffect(() => {
    refresh().catch(console.error);
  }, []);

  const value = useMemo(
    () => ({
      usage,
      refresh,
      increment: async () => {
        try {
          const summary = await incrementUsage();
          setUsage(summary);
          return summary;
        } catch (error) {
          console.error(error);
          return usage ?? { monthCount: 0, limit: 0, isCapped: false };
        }
      },
    }),
    [usage]
  );

  return <UsageContext.Provider value={value}>{children}</UsageContext.Provider>;
};

export function useUsage() {
  return useContext(UsageContext);
}
