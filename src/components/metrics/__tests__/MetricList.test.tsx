import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import MetricList from "../MetricList";
import { useAppStore } from "../../../lib/store";

jest.mock("../../../hooks/useMetrics", () => ({
  useMetrics: jest.fn(),
}));

import { useMetrics } from "../../../hooks/useMetrics";

describe("MetricList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAppStore.setState({
      userId: "u1",
      selectedType: "distance",
      selectedUnit: "meter",
      chartPeriod: "1month",
    } as any);
  });

  it("renders rows with YYYY-MM-DD date format", () => {
    (useMetrics as jest.Mock).mockReturnValue({
      data: {
        data: [
          {
            id: "m1",
            userId: "u1",
            type: "distance",
            value: 10,
            unit: "meter",
            originalValue: 10,
            originalUnit: "meter",
            date: "2025-12-17",
            createdAt: "2025-12-17T10:00:00Z",
          },
        ],
        pagination: { total: 1, page: 1, limit: 10, totalPages: 1 },
      },
      isLoading: false,
      isFetching: false,
    });

    render(<MetricList />);

    expect(screen.getByText("2025-12-17")).toBeInTheDocument();
    expect(screen.getByText("10.00 m")).toBeInTheDocument();
  });

  it("clears filters when clicking Clear", async () => {
    (useMetrics as jest.Mock).mockReturnValue({
      data: {
        data: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
      },
      isLoading: false,
      isFetching: false,
    });

    render(<MetricList />);

    await userEvent.click(screen.getByRole("button", { name: /clear/i }));

    expect(useAppStore.getState().selectedType).toBeUndefined();
    expect(useAppStore.getState().selectedUnit).toBeUndefined();
  });
});
