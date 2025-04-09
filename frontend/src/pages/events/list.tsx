import type { PropsWithChildren } from "react";
import { getDefaultFilter, useGo } from "@refinedev/core";
import {
    CreateButton,
    DeleteButton,
    EditButton,
    FilterDropdown,
    List,
    NumberField,
    getDefaultSortOrder,
    useSelect,
    useTable, DateField,
} from "@refinedev/antd";
import {EyeOutlined, MailOutlined, SearchOutlined} from "@ant-design/icons";
import { Avatar, Flex, Input, Select, Table, Typography } from "antd";
import { API_URL } from "@/utils/constants";
import { getRandomColorFromString } from "@/utils/get-random-color";
import type {IEvent, Invoice} from "@/types";

export const EventsPageList = ({ children }: PropsWithChildren) => {
    const go = useGo();

    const { tableProps, filters, sorters } = useTable<IEvent>({
        sorters: {
            initial: [{ field: "updatedAt", order: "desc" }],
        },
        filters: {
            initial: [
                {
                    field: "event_name",
                    operator: "contains",
                    value: "",
                },
            ],
        },
        // meta: {
        //     populate: ["logo", "invoices"],
        // },
    });

    const { selectProps: eventNameSelectProps } = useSelect({
        resource: "events",
        optionLabel: "event_name",
        optionValue: "event_name",
    });

    const { selectProps: eventStatusSelectProps } = useSelect({
        resource: "events",
        optionLabel: "status",
        optionValue: "status",
    });

    return (
        <>
            <List
                title="Appointments/Events"
                headerButtons={() => {
                    return (
                        <CreateButton
                            size="large"
                            onClick={() =>
                                go({
                                    to: { resource: "events", action: "create" },
                                    options: { keepQuery: true },
                                })
                            }
                        >
                            Add new event
                        </CreateButton>
                    );
                }}
            >
                <Table
                    {...tableProps}
                    rowKey={"id"}
                    pagination={{
                        ...tableProps.pagination,
                        showSizeChanger: true,
                    }}
                    scroll={{ x: "960px" }}
                >
                    <Table.Column
                        title="ID"
                        dataIndex="id"
                        key="id"
                        width={80}
                        defaultFilteredValue={getDefaultFilter("id", filters)}
                        filterIcon={<SearchOutlined />}
                        filterDropdown={(props) => {
                            return (
                                <FilterDropdown {...props}>
                                    <Input placeholder="Search ID" />
                                </FilterDropdown>
                            );
                        }}
                    />
                    <Table.Column
                        title="Event Name"
                        dataIndex="event_name"
                        key="event_name"
                        sorter
                        defaultSortOrder={getDefaultSortOrder("event_name", sorters)}
                        defaultFilteredValue={getDefaultFilter(
                            "event_name",
                            filters,
                            "in"
                        )}
                        filterDropdown={(props) => (
                            <FilterDropdown {...props}>
                                <Select
                                    mode="multiple"
                                    placeholder="Search Event Name"
                                    style={{ width: 220 }}
                                    {...eventNameSelectProps}
                                />
                            </FilterDropdown>
                        )}
                        render={(name: string, record: IEvent) => {
                            const src = null;

                            return (
                                <Flex align="center" gap={8}>
                                    <Avatar
                                        alt={name}
                                        src={src}
                                        shape="square"
                                        style={{
                                            backgroundColor: src
                                                ? "none"
                                                : getRandomColorFromString(name),
                                        }}
                                    >
                                        <Typography.Text>
                                            {name?.[0]?.toUpperCase()}
                                        </Typography.Text>
                                    </Avatar>
                                    <Typography.Text>{name}</Typography.Text>
                                </Flex>
                            );
                        }}
                    />

                    <Table.Column
                        title="Phone"
                        dataIndex="phone"
                        key="phone"
                        width={154}
                        defaultFilteredValue={getDefaultFilter(
                            "phone",
                            filters,
                            "contains"
                        )}
                        filterIcon={<SearchOutlined />}
                        filterDropdown={(props) => {
                            return (
                                <FilterDropdown {...props}>
                                    <Input placeholder="Search Phone" />
                                </FilterDropdown>
                            );
                        }}
                    />
                    <Table.Column
                        title="Date"
                        dataIndex="date"
                        key="date"
                        width={120}
                        sorter
                        defaultSortOrder={getDefaultSortOrder(
                            "date",
                            sorters
                        )}
                        render={(_, record: Invoice) => {
                            return (
                                <DateField value={record.invoiceDate}
                                           format="D MMM YYYY hh:mm A" />
                            );
                        }}
                    />
                    <Table.Column
                        title="Status"
                        dataIndex="status"
                        key="status"
                        sorter
                        defaultSortOrder={getDefaultSortOrder("status", sorters)}
                        defaultFilteredValue={getDefaultFilter(
                            "status",
                            filters,
                            "in"
                        )}
                        filterDropdown={(props) => (
                            <FilterDropdown {...props}>
                                <Select
                                    mode="multiple"
                                    placeholder="Search status"
                                    style={{ width: 220 }}
                                    {...eventStatusSelectProps}
                                />
                            </FilterDropdown>
                        )}
                    />
                    <Table.Column
                        title="Actions"
                        key="actions"
                        fixed="right"
                        align="end"
                        width={106}
                        render={(_, record: IEvent) => {
                            return (
                                <Flex align="center" gap={8}>
                                    <EditButton
                                        size="small"
                                        hideText
                                        recordItemId={record.id}
                                        icon={<EyeOutlined />}
                                    />
                                    <DeleteButton
                                        size="small"
                                        hideText
                                        recordItemId={record.id}
                                    />
                                </Flex>
                            );
                        }}
                    />
                </Table>
            </List>
            {children}
        </>
    );
};
