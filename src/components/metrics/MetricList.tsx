"use client";

import React, { useState } from "react";
import {
  Table,
  Card,
  Space,
  Button,
  Select,
  DatePicker,
  Tag,
  Popconfirm,
  Typography,
  Empty,
  Tooltip,
} from "antd";
import {
  DeleteOutlined,
  ReloadOutlined,
  FilterOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
import { useMetrics, useDeleteMetric } from "../../hooks/useMetrics";
import { useAppStore } from "../../lib/store";
import {
  Metric,
  MetricType,
  DISTANCE_UNITS,
  TEMPERATURE_UNITS,
  getUnitSymbol,
} from "../../types";

const { Title } = Typography;
const { RangePicker } = DatePicker;

export default function MetricList() {
  const {
    userId,
    selectedType,
    setSelectedType,
    selectedUnit,
    setSelectedUnit,
  } = useAppStore();

  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  const { data, isLoading, refetch } = useMetrics({
    userId,
    type: selectedType,
    unit: selectedUnit,
    startDate: dateRange?.[0],
    endDate: dateRange?.[1],
    page: pagination.page,
    limit: pagination.limit,
  });

  const deleteMetric = useDeleteMetric();

  const handleDelete = async (id: string) => {
    await deleteMetric.mutateAsync(id);
  };

  const handleTableChange = (paginationConfig: TablePaginationConfig) => {
    setPagination({
      page: paginationConfig.current || 1,
      limit: paginationConfig.pageSize || 10,
    });
  };

  const clearFilters = () => {
    setSelectedType(undefined);
    setSelectedUnit(undefined);
    setDateRange(null);
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
      width: 120,
      render: (type: MetricType) => (
        <Tag color={type === "distance" ? "blue" : "orange"}>
          {type === "distance" ? "📏 Distance" : "🌡️ Temperature"}
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
    {
      title: "Actions",
      key: "actions",
      width: 80,
      align: "center",
      render: (_, record) => (
        <Popconfirm
          title="Delete this metric?"
          description="This action cannot be undone."
          onConfirm={() => handleDelete(record.id)}
          okText="Delete"
          cancelText="Cancel"
          okButtonProps={{ danger: true }}
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            loading={deleteMetric.isPending}
          />
        </Popconfirm>
      ),
    },
  ];

  const units =
    selectedType === "distance"
      ? DISTANCE_UNITS
      : selectedType === "temperature"
      ? TEMPERATURE_UNITS
      : [];

  return (
    <Card className="metric-card">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <Title level={4} className="mb-0">
          Metrics History
        </Title>
        <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FilterOutlined className="text-gray-500" />
          <span className="font-medium text-gray-700">Filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Type Filter */}
          <Select
            placeholder="All Types"
            allowClear
            value={selectedType}
            onChange={(value) => setSelectedType(value)}
            className="w-full"
          >
            <Select.Option value="distance">📏 Distance</Select.Option>
            <Select.Option value="temperature">🌡️ Temperature</Select.Option>
          </Select>

          {/* Unit Filter (Convert to) */}
          <Select
            placeholder="Convert to unit"
            allowClear
            disabled={!selectedType}
            value={selectedUnit}
            onChange={(value) => setSelectedUnit(value)}
            className="w-full"
          >
            {units.map((unit) => (
              <Select.Option key={unit.value} value={unit.value}>
                {unit.label} ({unit.symbol})
              </Select.Option>
            ))}
          </Select>

          {/* Date Range */}
          <RangePicker
            value={
              dateRange ? [dayjs(dateRange[0]), dayjs(dateRange[1])] : null
            }
            onChange={(dates) => {
              if (dates) {
                setDateRange([
                  dates[0]!.format("YYYY-MM-DD"),
                  dates[1]!.format("YYYY-MM-DD"),
                ]);
              } else {
                setDateRange(null);
              }
            }}
            className="w-full"
          />

          {/* Clear Filters */}
          <Button icon={<ClearOutlined />} onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={data?.data}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: data?.pagination.total || 0,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} metrics`,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        onChange={handleTableChange}
        className="metrics-table"
        scroll={{ x: 800 }}
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
  );
}
