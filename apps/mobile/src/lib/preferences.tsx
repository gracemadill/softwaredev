import React, { createContext, useContext, useMemo, useState } from "react";

type Alignment = "left" | "center" | "justify";

interface PreferencesState {
  fontSize: number;
  lineHeight: number;
  darkMode: boolean;
  align: Alignment;
}

interface PreferencesContextValue {
  preferences: PreferencesState;
  updatePreferences: (update: Partial<PreferencesState>) => void;
}

const defaultPreferences: PreferencesState = {
  fontSize: 18,
  lineHeight: 1.5,
  darkMode: false,
  align: "left",
};

const PreferencesContext = createContext<PreferencesContextValue>({
  preferences: defaultPreferences,
  updatePreferences: () => undefined,
});

export const PreferencesProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [preferences, setPreferences] = useState<PreferencesState>(defaultPreferences);

  const value = useMemo(
    () => ({
      preferences,
      updatePreferences: (update: Partial<PreferencesState>) =>
        setPreferences((prev) => ({ ...prev, ...update })),
    }),
    [preferences]
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
};

export function usePreferences() {
  return useContext(PreferencesContext);
}
