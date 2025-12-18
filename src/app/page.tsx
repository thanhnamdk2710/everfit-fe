"use client";

import React, { useState } from "react";
import { Typography, Card, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import MetricList from "../components/metrics/MetricList";
import MetricCharts from "../components/charts/MetricCharts";
import MetricForm from "../components/metrics/MetricForm";

const { Title, Text } = Typography;

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-3 md:space-y-4">
      <Card
        className="bg-gradient-to-r from-blue-500 to-blue-600 border-0"
        styles={{ body: { background: "transparent" } }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-white">
            <Title className="!text-white !mb-1 text-lg sm:text-xl md:text-2xl">
              Metrics Tracking
            </Title>
            <Text className="text-white/80 text-sm md:text-base">
              Track your distance and temperature metrics
            </Text>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => setModalOpen(true)}
            className="!bg-white !text-blue-600 hover:!bg-gray-100 w-full sm:w-auto"
          >
            Add Metric
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 min-w-0">
        <MetricList />
        <MetricCharts />
      </div>

      <MetricForm open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
