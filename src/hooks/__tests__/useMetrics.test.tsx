import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";

import { useMetrics, useChartData } from "../useMetrics";

jest.mock("../../services/metricsService", () => ({
  __esModule: true,
  default: {
    listMetrics: jest.fn(),
    getChartData: jest.fn(),
    createMetric: jest.fn(),
  },
}));

import metricsService from "../../services/metricsService";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useMetrics", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches metrics when userId is provided", async () => {
    (metricsService.listMetrics as jest.Mock).mockResolvedValue({
      data: [],
      pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
    });

    const wrapper = createWrapper();

    const { result } = renderHook(
      () =>
        useMetrics({
          userId: "u1",
          page: 1,
          limit: 10,
        }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(metricsService.listMetrics).toHaveBeenCalledTimes(1);
  });

  it("does not fetch metrics when userId is empty", async () => {
    const wrapper = createWrapper();

    renderHook(
      () =>
        useMetrics({
          userId: "",
          page: 1,
          limit: 10,
        }),
      { wrapper }
    );

    // Give React Query a tick
    await Promise.resolve();
    expect(metricsService.listMetrics).not.toHaveBeenCalled();
  });
});

describe("useChartData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches chart data when params are provided", async () => {
    (metricsService.getChartData as jest.Mock).mockResolvedValue({
      data: [{ date: "2025-12-17", value: 1 }],
      dataPoints: 1,
      startDate: "2025-12-01",
      endDate: "2025-12-17",
    });

    const wrapper = createWrapper();

    const { result } = renderHook(
      () =>
        useChartData({
          userId: "u1",
          type: "distance",
          period: "1month",
          unit: "meter",
        }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(metricsService.getChartData).toHaveBeenCalledTimes(1);
  });
});
