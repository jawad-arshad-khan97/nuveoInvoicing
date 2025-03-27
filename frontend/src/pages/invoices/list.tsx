import { getDefaultFilter, useGo, useModal } from "@refinedev/core";
import {
  CreateButton,
  DateField,
  DeleteButton,
  EditButton,
  FilterDropdown,
  List,
  NumberField,
  ShowButton,
  TagField,
  getDefaultSortOrder,
  useSelect,
  useTable,
} from "@refinedev/antd";
import {
  Avatar,
  Button,
  Flex,
  Input,
  Modal,
  Select,
  Table,
  Typography,
} from "antd";
import {
  EditOutlined,
  EyeOutlined,
  FilePdfOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { API_URL } from "@/utils/constants";
import { getRandomColorFromString } from "@/utils/get-random-color";
import type { Invoice } from "@/types";
import { PdfLayout } from "../pdf";
import { useState } from "react";

export const InvoicePageList = () => {
  const [record, setRecord] = useState<Invoice>();
  const go = useGo();

  const { tableProps, filters, sorters } = useTable<Invoice>({
    meta: {
      populate: ["client", "account.logo", "account"],
    },
    sorters: {
      initial: [{ field: "updatedAt", order: "desc" }],
    },
  });

  let currencySymbol = "$";

  const { selectProps: selectPropsAccounts } = useSelect({
    resource: "accounts",
    optionLabel: "company_name",
    optionValue: "company_name",
  });

  const { selectProps: selectPropsClients } = useSelect({
    resource: "clients",
    optionLabel: "name",
    optionValue: "name",
  });

  const { show, visible, close } = useModal();

  return (
    <>
      <List
        title="Invoices"
        headerButtons={() => {
          return (
            <CreateButton
              size="large"
              onClick={() =>
                go({
                  to: { resource: "invoices", action: "create" },
                  options: { keepQuery: true },
                })
              }
            >
              Add new invoice
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
            title="Account"
            dataIndex="account.company_name"
            key="account.company_name"
            defaultFilteredValue={getDefaultFilter(
              "account.company_name",
              filters,
              "in"
            )}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Select
                  mode="multiple"
                  placeholder="Search Account"
                  style={{ width: 220 }}
                  {...selectPropsAccounts}
                />
              </FilterDropdown>
            )}
            render={(_, record: Invoice) => {
              const logoUrl = record?.account?.logo;
              const src = logoUrl ? `${API_URL}${logoUrl}` : undefined;
              const name = record?.account?.company_name;

              return (
                <Flex align="center" gap={8}>
                  <Avatar
                    alt={name}
                    src={src}
                    shape="square"
                    style={{
                      backgroundColor: src
                        ? "none"
                        : getRandomColorFromString(name || ""),
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
            title="Client"
            dataIndex="client.name"
            key="client.name"
            render={(_, record: Invoice) => {
              return <Typography.Text>{record.client?.name}</Typography.Text>;
            }}
            defaultFilteredValue={getDefaultFilter(
              "company_name",
              filters,
              "in"
            )}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Select
                  mode="multiple"
                  placeholder="Search Company Name"
                  style={{ width: 220 }}
                  {...selectPropsClients}
                />
              </FilterDropdown>
            )}
          />
          <Table.Column
            title="Date"
            dataIndex="invoice.invoiceDate"
            key="invoice.invoiceDate"
            width={120}
            sorter
            defaultSortOrder={getDefaultSortOrder(
              "invoice.invoiceDate",
              sorters
            )}
            render={(_, record: Invoice) => {
              return (
                <DateField value={record.invoiceDate} format="DD/MM/YYYY" />
              );
            }}
          />
          <Table.Column
            title="Total"
            dataIndex="total"
            key="total"
            width={132}
            align="end"
            sorter
            defaultSortOrder={getDefaultSortOrder("total", sorters)}
            render={(total) => {
              return (
                <TagField value={`${currencySymbol} ${total}`} color="green" />
              );
            }}
          />
          <Table.Column
            title="Actions"
            key="actions"
            fixed="right"
            align="end"
            width={120}
            render={(_, record: Invoice) => {
              return (
                <Flex align="center" gap={8}>
                  <ShowButton
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
                  <Button
                    size="small"
                    icon={<FilePdfOutlined />}
                    onClick={(event) => {
                      event.stopPropagation();
                      setRecord(record);
                      show();
                    }}
                  />
                </Flex>
              );
            }}
          />
        </Table>
      </List>
      <Modal visible={visible} onCancel={close} width="80%" footer={null}>
        <PdfLayout record={record} />
      </Modal>
    </>
  );
};
