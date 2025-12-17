import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MetricType, ChartPeriod } from "../types";

interface AppState {
  // User
  userId: string;
  setUserId: (id: string) => void;

  // Filters
  selectedType: MetricType | undefined;
  setSelectedType: (type: MetricType | undefined) => void;
  selectedUnit: string | undefined;
  setSelectedUnit: (unit: string | undefined) => void;
  chartPeriod: ChartPeriod;
  setChartPeriod: (period: ChartPeriod) => void;

  // UI State
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const DEFAULT_USER_ID = "550e8400-e29b-41d4-a716-446655440001";

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      userId: DEFAULT_USER_ID,
      setUserId: (id) => set({ userId: id }),

      selectedType: undefined,
      setSelectedType: (type) =>
        set({ selectedType: type, selectedUnit: undefined }),

      selectedUnit: undefined,
      setSelectedUnit: (unit) => set({ selectedUnit: unit }),

      chartPeriod: "1month",
      setChartPeriod: (period) => set({ chartPeriod: period }),

      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      darkMode: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
    }),
    {
      name: "metrics-app-storage",
      partialize: (state) => ({
        userId: state.userId,
        darkMode: state.darkMode,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
