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
      populate: ["client", "account.logo", "account", "services"],
    },
    sorters: {
      initial: [{ field: "updatedAt", order: "desc" }],
    },
  });

  let currencySymbol = "$";

  const { selectProps: selectPropsAccounts } = useSelect({
    resource: "accounts",
    optionLabel: "account_name",
    optionValue: "account_name",
  });

  const { selectProps: selectPropsClients } = useSelect({
    resource: "clients",
    optionLabel: "client_name",
    optionValue: "client_name",
  });

  const { selectProps: selectPropsInvoices } = useSelect({
    resource: "invoices",
    optionLabel: "invoice_name",
    optionValue: "invoice_name",
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
          onRow={(record) => ({
            onClick: (event) => {
              if (!(event.target as HTMLElement).closest("button")) {
                go({
                  to: {
                    resource: "invoices",
                    action: "edit",
                    id: record.id,
                  },
                });
              }
            },
            onMouseEnter: (event) => {
              (event.target as HTMLElement).style.cursor = "pointer";
            },
          })}
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
            dataIndex="account.account_name"
            key="account.account_name"
            defaultFilteredValue={getDefaultFilter(
              "account.account_name",
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
              const name = record?.account?.account_name;

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
            dataIndex="client.client_name"
            key="client.client_name"
            render={(_, record: Invoice) => {
              return (
                <Typography.Text>{record.client?.client_name}</Typography.Text>
              );
            }}
            defaultFilteredValue={getDefaultFilter(
              "client_name",
              filters,
              "in"
            )}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Select
                  mode="multiple"
                  placeholder="Search Client Name"
                  style={{ width: 220 }}
                  {...selectPropsClients}
                />
              </FilterDropdown>
            )}
          />
          <Table.Column
            title="Invoice"
            dataIndex="invoice.invoice_name"
            key="invoice.invoice_name"
            render={(_, record: Invoice) => {
              return <Typography.Text>{record?.invoice_name}</Typography.Text>;
            }}
            defaultFilteredValue={getDefaultFilter(
              "invoice_name",
              filters,
              "in"
            )}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Select
                  mode="multiple"
                  placeholder="Search Invoice Name"
                  style={{ width: 220 }}
                  {...selectPropsInvoices}
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
                <DateField value={record.invoiceDate} format="D MMM YYYY" />
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
                    onClick={(event) => {
                      event.stopPropagation(); // Prevent row click event
                      console.log("Navigating to show page for ID:", record.id);
                      go({
                        to: {
                          resource: "invoices",
                          action: "show",
                          id: record.id,
                        },
                      });
                    }}
                  />

                  <DeleteButton
                    size="small"
                    hideText
                    recordItemId={record.id}
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
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
