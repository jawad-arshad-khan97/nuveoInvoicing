import React from "react";
import {Card, Col, Row} from "antd";
import MonthlyIncomeChart from "../../components/charts/MonthlyIncomeChart";
import {CalendarPage} from "@/components/calendar/Calendar";

export const DashboardPage: React.FC = () => {
    return (
        <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
                <Card title="Monthly Income Overview" bordered={false}>
                    <MonthlyIncomeChart/>
                </Card>
            </Col>
            <Col xs={24} lg={24}>
                <Card title="Appointments" bordered={false}>
                    <CalendarPage/>
                </Card>
            </Col>
        </Row>
    );
};
