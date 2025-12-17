"use client";

import React, { useState } from "react";
import {
  Typography,
  Card,
  Button,
  Tabs,
  Table,
  Select,
  Tag,
  Empty,
  Tooltip,
} from "antd";
import { PlusOutlined, FilterOutlined, ClearOutlined } from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";

import MetricChart from "../components/charts/MetricChart";
import CreateMetricModal from "../components/metrics/CreateMetricModal";
import { useMetrics } from "../hooks/useMetrics";
import { useAppStore } from "../lib/store";
import {
  Metric,
  MetricType,
  DISTANCE_UNITS,
  TEMPERATURE_UNITS,
  getUnitSymbol,
} from "../types";

const { Title, Text } = Typography;

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState<string>("distance");

  // Filters state
  const {
    userId,
    selectedType,
    setSelectedType,
    selectedUnit,
    setSelectedUnit,
  } = useAppStore();
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

  // Fetch metrics data
  const { data, isLoading, isFetching } = useMetrics({
    userId,
    type: selectedType,
    unit: selectedUnit,
    page: pagination.page,
    limit: pagination.limit,
  });

  const handleTableChange = (paginationConfig: TablePaginationConfig) => {
    setPagination({
      page: paginationConfig.current || 1,
      limit: paginationConfig.pageSize || 10,
    });
  };

  const clearFilters = () => {
    setSelectedType(undefined);
    setSelectedUnit(undefined);
    setPagination({ page: 1, limit: 10 });
  };

  const columns: ColumnsType<Metric> = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 120,
      render: (date: string) => dayjs(date).format("MMM DD, YYYY"),
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 140,
      render: (type: MetricType) => (
        <Tag color={type === "distance" ? "blue" : "orange"}>
          {type === "distance" ? "Distance" : "Temperature"}
        </Tag>
      ),
    },
    {
      title: "Value",
      key: "value",
      width: 150,
      render: (_, record) => (
        <span className="font-medium">
          {record.value.toFixed(2)} {getUnitSymbol(record.type, record.unit)}
        </span>
      ),
    },
    {
      title: "Original",
      key: "original",
      width: 150,
      responsive: ["md"],
      render: (_, record) => (
        <Tooltip title="Original value as entered">
          <span className="text-gray-500">
            {record.originalValue.toFixed(2)}{" "}
            {getUnitSymbol(record.type, record.originalUnit)}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      render: (date: string) => dayjs(date).format("MMM DD, YYYY HH:mm"),
      responsive: ["lg"],
    },
  ];

  const units =
    selectedType === "distance"
      ? DISTANCE_UNITS
      : selectedType === "temperature"
      ? TEMPERATURE_UNITS
      : [];

  const chartTabs = [
    {
      key: "distance",
      label: (
        <span className="flex items-center gap-2">
          <span className="hidden sm:inline">Distance</span>
        </span>
      ),
      children: <MetricChart type="distance" title="Distance Trend" />,
    },
    {
      key: "temperature",
      label: (
        <span className="flex items-center gap-2">
          <span className="hidden sm:inline">Temperature</span>
        </span>
      ),
      children: <MetricChart type="temperature" title="Temperature Trend" />,
    },
  ];

  return (
    <div className="space-y-3 md:space-y-4">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 border-0">
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
            className="bg-white !text-blue-600 hover:!bg-gray-100 w-full sm:w-auto"
          >
            Add Metric
          </Button>
        </div>
      </Card>

      {/* Main Content - Side by side on iPad and larger (768px+) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 min-w-0">
        {/* Metrics List */}
        <Card className="h-fit min-w-0 overflow-hidden">
          {/* Filters */}
          <div className="bg-gray-50 px-3 py-3 sm:px-4 rounded-lg mb-3">
            <div className="flex items-center gap-2 mb-2">
              <FilterOutlined className="text-gray-500" />
              <span className="font-medium text-gray-700 text-sm">Filters</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              <Select
                placeholder="All Types"
                allowClear
                value={selectedType}
                onChange={(value) => setSelectedType(value)}
                className="w-full"
                size="middle"
              >
                <Select.Option value="distance">Distance</Select.Option>
                <Select.Option value="temperature">Temperature</Select.Option>
              </Select>

              <Select
                placeholder="Convert to unit"
                allowClear
                disabled={!selectedType}
                value={selectedUnit}
                onChange={(value) => setSelectedUnit(value)}
                className="w-full"
                size="middle"
              >
                {units.map((unit) => (
                  <Select.Option key={unit.value} value={unit.value}>
                    {unit.label} ({unit.symbol})
                  </Select.Option>
                ))}
              </Select>

              <Button
                icon={<ClearOutlined />}
                onClick={clearFilters}
                className="w-full"
                size="middle"
              >
                Clear
              </Button>
            </div>
          </div>

          {/* Table */}
          <Table
            columns={columns}
            dataSource={data?.data}
            rowKey="id"
            loading={isLoading || isFetching}
            pagination={{
              current: pagination.page,
              pageSize: pagination.limit,
              total: data?.pagination.total || 0,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} metrics`,
              pageSizeOptions: ["10", "20", "50"],
              size: "default",
            }}
            onChange={handleTableChange}
            scroll={{ x: 420 }}
            size="middle"
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No metrics found"
                />
              ),
            }}
          />
        </Card>

        {/* Charts with Tabs */}
        <Card className="h-fit min-w-0 overflow-hidden">
          <Tabs
            activeKey={activeChartTab}
            onChange={setActiveChartTab}
            items={chartTabs}
          />
        </Card>
      </div>

      {/* Create Metric Modal */}
      <CreateMetricModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
