"use client";

import React from "react";
import { Modal, Form, InputNumber, Select, DatePicker, Row, Col } from "antd";
import dayjs from "dayjs";

import { useCreateMetric } from "../../hooks/useMetrics";
import { useAppStore } from "../../lib/store";
import {
  CreateMetricRequest,
  DISTANCE_UNITS,
  TEMPERATURE_UNITS,
} from "../../types";

const { Option } = Select;

interface CreateMetricModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateMetricModal({
  open,
  onClose,
}: CreateMetricModalProps) {
  const [form] = Form.useForm();
  const { userId } = useAppStore();
  const createMetric = useCreateMetric();

  const metricType = Form.useWatch("type", form);
  const units = metricType === "distance" ? DISTANCE_UNITS : TEMPERATURE_UNITS;

  const handleSubmit = async (values: any) => {
    const data: CreateMetricRequest = {
      userId,
      type: values.type,
      value: values.value,
      unit: values.unit,
      date: values.date.format("YYYY-MM-DD"),
    };

    await createMetric.mutateAsync(data);
    form.resetFields();
    onClose();
  };

  const handleTypeChange = () => {
    form.setFieldValue("unit", undefined);
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={
        <span style={{ fontSize: "18px", fontWeight: 600 }}>
          Add New Metric
        </span>
      }
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okText="Save Metric"
      confirmLoading={createMetric.isPending}
      destroyOnHidden
      width={520}
      styles={{
        body: { paddingTop: 20 },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          date: dayjs(),
        }}
        requiredMark={false}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="type"
              label={<span style={{ fontWeight: 500 }}>Metric Type</span>}
              rules={[
                { required: true, message: "Please select a metric type" },
              ]}
            >
              <Select
                placeholder="Select type"
                size="large"
                onChange={handleTypeChange}
              >
                <Option value="distance">Distance</Option>
                <Option value="temperature">Temperature</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="unit"
              label={<span style={{ fontWeight: 500 }}>Unit</span>}
              rules={[{ required: true, message: "Select unit" }]}
            >
              <Select placeholder="Unit" size="large" disabled={!metricType}>
                {units.map((unit) => (
                  <Option key={unit.value} value={unit.value}>
                    {unit.symbol}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="value"
              label={<span style={{ fontWeight: 500 }}>Value</span>}
              rules={[
                { required: true, message: "Please enter a value" },
                { type: "number", message: "Value must be a number" },
              ]}
            >
              <InputNumber
                placeholder="0.00"
                size="large"
                style={{ width: "100%" }}
                step={0.1}
                precision={2}
                controls={false}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="date"
              label={<span style={{ fontWeight: 500 }}>Date</span>}
              rules={[{ required: true, message: "Please select a date" }]}
            >
              <DatePicker
                size="large"
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
                disabledDate={(current) =>
                  current && current > dayjs().endOf("day")
                }
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
