"use client";

import React, { useState } from "react";
import { Card, Tabs } from "antd";

import LineChart from "../charts/LineChart";

export default function MetricCharts() {
  const [activeChartTab, setActiveChartTab] = useState<string>("distance");

  const chartTabs = [
    {
      key: "distance",
      label: (
        <span className="flex items-center gap-2">
          <span className="hidden sm:inline">Distance</span>
        </span>
      ),
      children: <LineChart type="distance" title="Distance Trend" />,
    },
    {
      key: "temperature",
      label: (
        <span className="flex items-center gap-2">
          <span className="hidden sm:inline">Temperature</span>
        </span>
      ),
      children: <LineChart type="temperature" title="Temperature Trend" />,
    },
  ];

  return (
    <Card className="h-fit min-w-0 overflow-hidden">
      <Tabs
        activeKey={activeChartTab}
        onChange={setActiveChartTab}
        items={chartTabs}
      />
    </Card>
  );
}
