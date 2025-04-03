import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useList } from "@refinedev/core";
import { Spin, theme as antdTheme } from "antd";

const MonthlyIncomeChart: React.FC = () => {
  const { data, isLoading } = useList({
    resource: "monthly-income", // Make sure this matches your API endpoint
  });

  const { token } = antdTheme.useToken(); // Get Ant Design theme tokens
  const isDarkMode = token.colorBgBase === "#000"; // Check if using dark mode
  console.log(token);

  const [chartData, setChartData] = useState<{
    options: {
      chart: { id: string };
      xaxis: { categories: string[] };
      yaxis: { title: { text: string } };
      colors: string[];
      tooltip: { theme: "light" | "dark" };
      menu: { background: string; borderColor: string; textColor: string }; // 👈 Add tooltip theme
    };
    series: { name: string; data: number[] }[];
  }>({
    options: {
      chart: { id: "monthly-income-chart" },
      xaxis: { categories: [] },
      yaxis: { title: { text: "Income" } },
      colors: ["#4CAF50"],
      tooltip: { theme: isDarkMode ? "dark" : "light" }, // 👈 Set theme dynamically
      menu: {
        background: isDarkMode ? "#1e1e1e" : "#ffffff",
        borderColor: isDarkMode ? "#444" : "#ccc",
        textColor: isDarkMode ? "#ffffff" : "#000000",
      },
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
        tooltip: { theme: isDarkMode ? "dark" : "light" },
        menu: {
          background: isDarkMode ? "#1e1e1e" : "#ffffff",
          borderColor: isDarkMode ? "#444" : "#ccc",
          textColor: isDarkMode ? "#ffffff" : "#000000",
        },
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
