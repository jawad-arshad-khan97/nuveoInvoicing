import {useList, useNavigation} from "@refinedev/core";

import {Show} from "@refinedev/antd";
import {Badge, type BadgeProps, Calendar} from "antd";
import type {CalendarMode} from "antd/lib/calendar/generateCalendar";
import dayjs from "dayjs";

import type {IEvent} from "../../types/index";

import "./index.css";

export const CalendarPage = () => {
    const {show, create} = useNavigation();
    const {data} = useList<IEvent>({
        resource: "events",
        pagination: {
            pageSize: 100,
        },
    });

    const monthCellRender = (value: dayjs.Dayjs) => {
        const listData =
            data?.data?.filter((p) => dayjs(p.date).isSame(value, "month")) ?? [];
        return listData.length > 0 ? (
            <div className="notes-month">
                <section>{listData.length}</section>
                <span>Events</span>
            </div>
        ) : null;
    };

    const panelChange = (value: dayjs.Dayjs, mode: CalendarMode) => {
        console.log(value.format("DD-MM-YYYY"), mode);
    };

    const dateCellRender = (value: dayjs.Dayjs) => {
        const listData = data?.data?.filter((p) =>
            dayjs(p.date).isSame(value, "day"),
        );
        return (
            <ul className="events">
                {listData?.map((item) => (
                    <li key={item.id}>
                        <Badge
                            status={item.type as BadgeProps["status"]}
                            text={item.title}
                            onClick={() => show("events", item.id)}
                        />
                    </li>
                ))}
            </ul>
        );
    };

    return (
        // <Show title={false} headerProps={{extra: null}}>
            <Calendar
                onPanelChange={panelChange}
                onSelect={(date) => create("events", "replace", { date: date.format() })}
                dateCellRender={dateCellRender}
                monthCellRender={monthCellRender}
            />
        // </Show>
    );
};