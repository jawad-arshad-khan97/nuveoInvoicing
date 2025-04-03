import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useList } from "@refinedev/core";
import { Spin } from "antd";

const MonthlyIncomeChart: React.FC = () => {
  const { data, isLoading } = useList({
    resource: "monthly-income", // Make sure this matches your API endpoint
  });

  const [chartData, setChartData] = useState<{
    options: {
      chart: { id: string };
      xaxis: { categories: string[] };
      yaxis: { title: { text: string } };
      colors: string[];
    };
    series: { name: string; data: number[] }[];
  }>({
    options: {
      chart: { id: "monthly-income-chart" },
      xaxis: { categories: [] },
      yaxis: { title: { text: "Income" } },
      colors: ["#4CAF50"],
    },
    series: [{ name: "Income", data: [] }],
  });

  useEffect(() => {
    if (data?.data) {
      const months = data.data.map((item) => item.month);
      const income = data.data.map((item) => item.income);

      setChartData((prev) => ({
        ...prev,
        options: { ...prev.options, xaxis: { categories: months } },
        series: [{ name: "Income", data: income }],
      }));
    }
  }, [data]);

  return (
    <Spin spinning={isLoading}>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={350}
      />
    </Spin>
  );
};

export default MonthlyIncomeChart;
