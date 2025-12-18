import React from "react";
import { render, screen } from "@testing-library/react";

import LineChart from "../LineChart";

jest.mock("next/dynamic", () => {
  return () => {
    const DynamicComponent = () => <div data-testid="line-chart" />;
    return DynamicComponent;
  };
});

jest.mock("../../../hooks/useMetrics", () => ({
  useChartData: jest.fn(),
}));

import { useChartData } from "../../../hooks/useMetrics";

describe("LineChart", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders date range in YYYY-MM-DD", () => {
    (useChartData as jest.Mock).mockReturnValue({
      data: {
        data: [{ date: "2025-12-17", value: 2 }],
        dataPoints: 1,
        startDate: "2025-12-01",
        endDate: "2025-12-17",
      },
      isLoading: false,
      isError: false,
      isFetching: false,
    });

    render(<LineChart type="distance" title="Distance Trend" />);

    expect(screen.getByText(/2025-12-01 to 2025-12-17/)).toBeInTheDocument();
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });

  it("shows fetching overlay when updating", () => {
    (useChartData as jest.Mock).mockReturnValue({
      data: {
        data: [{ date: "2025-12-17", value: 2 }],
        dataPoints: 1,
        startDate: "2025-12-01",
        endDate: "2025-12-17",
      },
      isLoading: false,
      isError: false,
      isFetching: true,
    });

    const { container } = render(
      <LineChart type="distance" title="Distance Trend" />
    );

    expect(container.querySelector(".ant-spin")).toBeTruthy();
  });
});
