import { Card } from "antd";
import { useList, useNavigation  } from "@refinedev/core";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import dayjs from "dayjs";

const STATUS_COLORS: Record<string, string> = {
    new: "#2F54EB",        // blue
    done: "#4caf50",  // green
    cancelled: "#f44336",  // red
};

export const AppointmentsTodayCard = () => {
    const { data, isLoading } = useList({
        resource: "events", // or "appointments"
        pagination: { pageSize: 1000 }, // get all for today
    });

    const { push } = useNavigation(); // ⬅️ for navigation
    // Get today’s date in 'YYYY-MM-DD' format
    const today = dayjs().startOf("day");

    // Filter today's appointments
    const todaysAppointments = data?.data?.filter((event) =>
        dayjs(event.date).isSame(today, "day")
    ) || [];

    // Count statuses
    const statusCounts = todaysAppointments.reduce((acc, curr) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const handleChartClick = (status: string) => {
        const date = dayjs().format("YYYY-MM-DD");

        const queryParams = new URLSearchParams();

        queryParams.append("filters[0][field]", "status");
        queryParams.append("filters[0][operator]", "eq");
        queryParams.append("filters[0][value]", status);

        queryParams.append("filters[1][field]", "date");
        queryParams.append("filters[1][operator]", "eq");
        queryParams.append("filters[1][value]", date);

        push(`/events?${queryParams.toString()}`);
    };

    const chartData = Object.keys(statusCounts).map((status) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: statusCounts[status],
    }));

    return (
        <Card title="Appointments" loading={isLoading}>
            <p style={{ fontSize: "24px", marginBottom: "1rem" }}>
                Today: {todaysAppointments.length}
            </p>

            <PieChart width={250} height={250}>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    label
                    dataKey="value"
                    onClick={(data) => {
                        if (data && data.name) {
                            const clickedStatus = data.name.toLowerCase(); // "Done" -> "done"
                            handleChartClick(clickedStatus);
                        }
                    }}
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name.toLowerCase()]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </Card>
    );
};
