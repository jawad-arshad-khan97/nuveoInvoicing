import React from "react";
import { Card } from "antd";
import MonthlyIncomeChart from "../../components/charts/MonthlyIncomeChart";

export const DashboardPage: React.FC = () => {
  return (
    <Card title="Monthly Income Overview">
      <MonthlyIncomeChart />
    </Card>
  );
};
