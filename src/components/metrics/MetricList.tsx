"use client";

import React, { useState } from "react";
import { Card, Table, Select, Button, Tag, Empty, Tooltip } from "antd";
import { FilterOutlined, ClearOutlined } from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";

import { useMetrics } from "../../hooks/useMetrics";
import { useAppStore } from "../../lib/store";
import {
  Metric,
  MetricType,
  DISTANCE_UNITS,
  TEMPERATURE_UNITS,
  getUnitSymbol,
} from "../../types";

export default function MetricList() {
  const {
    userId,
    selectedType,
    setSelectedType,
    selectedUnit,
    setSelectedUnit,
  } = useAppStore();

  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

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
      render: (date: string) => dayjs(date).format("YYYY-MM-DD"),
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
      width: 180,
      render: (date: string) => dayjs(date).format("YYYY-MM-DD HH:mm:ss"),
      responsive: ["lg"],
    },
  ];

  const units =
    selectedType === "distance"
      ? DISTANCE_UNITS
      : selectedType === "temperature"
      ? TEMPERATURE_UNITS
      : [];

  return (
    <Card className="h-fit min-w-0 overflow-hidden">
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
  );
}
