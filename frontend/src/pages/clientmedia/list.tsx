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
    useTable, DateField, TagField,
} from "@refinedev/antd";
import {EyeOutlined, MailOutlined, SearchOutlined} from "@ant-design/icons";
import { Avatar, Flex, Input, Select, Table, Typography } from "antd";
import { API_URL } from "@/utils/constants";
import { getRandomColorFromString } from "@/utils/get-random-color";
import type {ClientMedia, Invoice} from "@/types";

export const ClientMediaPageList = ({ children }: PropsWithChildren) => {
    const go = useGo();

    const { tableProps, filters, sorters } = useTable<ClientMedia>({
        sorters: {
            initial: [{ field: "updatedAt", order: "desc" }],
        },
        // filters: {
        //     initial: [
        //         {
        //             field: "client",
        //             operator: "contains",
        //             value: "",
        //         },
        //     ],
        // },
        // meta: {
        //     populate: ["client"],
        // },
    });


    return (
        <>
            <List
                title="ClientMedia"
                headerButtons={() => {
                    return (
                        <CreateButton
                            size="large"
                            onClick={() =>
                                go({
                                    to: { resource: "clientmedias", action: "create" },
                                    options: { keepQuery: true },
                                })
                            }
                        >
                            Add New Client Archives
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
                        render={(_, record: ClientMedia) => {
                            return (
                                <DateField value={record.date}
                                           format="D MMM YYYY hh:mm A" />
                            );
                        }}
                    />

                    <Table.Column
                        title="Actions"
                        key="actions"
                        fixed="right"
                        align="end"
                        width={106}
                        render={(_, record: ClientMedia) => {
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
