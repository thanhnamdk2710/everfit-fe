"use client";

import React from "react";
import { Card, Select, Typography, Spin, Empty } from "antd";
import dynamic from "next/dynamic";
import dayjs from "dayjs";

import { useChartData } from "../../hooks/useMetrics";
import { useAppStore } from "../../lib/store";
import {
  MetricType,
  ChartPeriod,
  DISTANCE_UNITS,
  TEMPERATURE_UNITS,
  getUnitSymbol,
} from "../../types";

const Line = dynamic(
  () => import("@ant-design/charts").then((mod) => mod.Line),
  {
    ssr: false,
    loading: () => (
      <Spin className="w-full h-64 flex items-center justify-center" />
    ),
  }
);

const { Title, Text } = Typography;

interface LineChartProps {
  type: MetricType;
  title?: string;
}

export default function LineChart({ type, title }: LineChartProps) {
  const { userId, chartPeriod, setChartPeriod } = useAppStore();
  const [selectedUnit, setSelectedUnit] = React.useState<string>(
    type === "distance" ? "meter" : "kelvin"
  );

  const { data, isLoading, isError, isFetching } = useChartData({
    userId,
    type,
    period: chartPeriod,
    unit: selectedUnit,
  });

  const hasData = (data?.data?.length ?? 0) > 0;
  const isInitialLoading = isLoading && !hasData;

  const units = type === "distance" ? DISTANCE_UNITS : TEMPERATURE_UNITS;

  const chartConfig = {
    data: data?.data || [],
    xField: "date",
    yField: "value",
    smooth: true,
    animation: {
      appear: {
        animation: "wave-in",
        duration: 1000,
      },
    },
    point: {
      size: 4,
      shape: "circle",
      style: {
        fill: "white",
        stroke: type === "distance" ? "#1677ff" : "#fa8c16",
        lineWidth: 2,
      },
    },
    color: type === "distance" ? "#1677ff" : "#fa8c16",
  };

  const renderChart = () => {
    if (isInitialLoading) {
      return (
        <div className="h-64 flex items-center justify-center">
          <Spin size="large" />
        </div>
      );
    }

    if (isError) {
      return (
        <div className="h-64 flex items-center justify-center">
          <Empty description="Failed to load chart data" />
        </div>
      );
    }

    if (!hasData) {
      return (
        <div className="h-64 flex items-center justify-center">
          <Empty description="No data available for this period" />
        </div>
      );
    }

    return <Line {...chartConfig} height={300} />;
  };

  return (
    <Card className="chart-container">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <Title level={5} className="mb-1">
            {title ||
              (type === "distance" ? "Distance Trend" : "Temperature Trend")}
          </Title>
          {data && (
            <Text type="secondary" className="text-sm">
              {dayjs(data.startDate).format("YYYY-MM-DD")} to{" "}
              {dayjs(data.endDate).format("YYYY-MM-DD")}
            </Text>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Select
            value={chartPeriod}
            onChange={(value) => setChartPeriod(value as ChartPeriod)}
            className="w-28"
          >
            <Select.Option value="1month">1 Month</Select.Option>
            <Select.Option value="2month">2 Months</Select.Option>
          </Select>

          <Select
            value={selectedUnit}
            onChange={(value) => setSelectedUnit(value)}
            className="w-32"
          >
            {units.map((unit) => (
              <Select.Option key={unit.value} value={unit.value}>
                {unit.label} ({unit.symbol})
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>

      <div className="relative">
        {renderChart()}
        {isFetching && hasData && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <Spin />
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {data?.data && data.data.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {Math.min(...data.data.map((d) => d.value)).toFixed(1)}
            </div>
            <div className="text-sm text-gray-500">Min</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-500">
              {(
                data.data.reduce((sum, d) => sum + d.value, 0) /
                data.data.length
              ).toFixed(1)}
            </div>
            <div className="text-sm text-gray-500">Average</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {Math.max(...data.data.map((d) => d.value)).toFixed(1)}
            </div>
            <div className="text-sm text-gray-500">Max</div>
          </div>
        </div>
      )}
    </Card>
  );
}
