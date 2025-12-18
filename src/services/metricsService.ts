import axios, { AxiosInstance, AxiosError } from "axios";

import {
  Metric,
  CreateMetricRequest,
  ListMetricsParams,
  ListMetricsResponse,
  ChartDataParams,
  ChartDataResponse,
  ApiResponse,
} from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class MetricsService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });

    // Error interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiResponse<unknown>>) => {
        if (error.response?.data?.error) {
          throw new Error(error.response.data.error.message);
        }
        throw error;
      }
    );
  }

  async createMetric(data: CreateMetricRequest): Promise<Metric> {
    const response = await this.client.post<ApiResponse<Metric>>(
      "/v1/api/metrics",
      data
    );
    return response.data.data!;
  }

  async listMetrics(params: ListMetricsParams): Promise<ListMetricsResponse> {
    const response = await this.client.get<ListMetricsResponse>(
      "/v1/api/metrics",
      { params }
    );
    return response.data;
  }

  async getChartData(params: ChartDataParams): Promise<ChartDataResponse> {
    const response = await this.client.get<ChartDataResponse>(
      "/v1/api/metrics/chart",
      { params }
    );
    return response.data;
  }
}

export const metricsService = new MetricsService();
export default metricsService;
