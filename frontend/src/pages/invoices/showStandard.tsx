import { useModal, useShow } from "@refinedev/core";
import { FilePdfOutlined } from "@ant-design/icons";
import {
  Button,
  Avatar,
  Card,
  Col,
  Divider,
  Flex,
  Row,
  Skeleton,
  Spin,
  Table,
  Typography,
  Modal,
} from "antd";
import { DateField, NumberField, Show } from "@refinedev/antd";
import { API_URL } from "@/utils/constants";
import { getRandomColorFromString } from "@/utils/get-random-color";
import type { StandardInvoice } from "@/types";
import { useStyles } from "./show.styled";
import { useState } from "react";
import { PdfLayoutStandard } from "../pdf/PdfLayoutStandard";

export const ShowStandardInvoice = () => {
  const { styles } = useStyles();

  const { query: queryResult } = useShow<StandardInvoice>({
    resource: "standardinvoices",
    meta: {
      populate: ["client", "account.logo", "account", "services"],
    },
  });

  const [record, setRecord] = useState<StandardInvoice>();

  const invoice = queryResult?.data?.data;
  const loading = queryResult?.isLoading;
  const logoUrl = invoice?.account?.logo
    ? `${API_URL}${invoice?.account?.logo}`
    : undefined;

  const { show, visible, close } = useModal();

  return (
    <>
      <Show
        title="Standard Invoice"
        headerButtons={() => (
          <>
            <Button
              disabled={!invoice}
              icon={<FilePdfOutlined />}
              onClick={(event) => {
                event.stopPropagation();
                setRecord(invoice);
                show();
              }}
            >
              Preview PDF
            </Button>
          </>
        )}
        contentProps={{
          styles: {
            body: {
              padding: 0,
            },
          },
          style: {
            background: "transparent",
          },
        }}
      >
        <div className={styles.container}>
          <Card bordered={false}>
            <Typography.Title level={3}>
              Invoice #{invoice?.invoice_name}
            </Typography.Title>
            <Typography.Text>
              Status:{" "}
              <span
                style={{
                  color: invoice?.status === "Paid" ? "green" : "red",
                }}
              >
                {invoice?.status}
              </span>
            </Typography.Text>
            <Divider />
            <Row gutter={16}>
              <Col span={12}>
                <Typography.Title level={5}>Bill To</Typography.Title>
                <Typography.Text>
                  {invoice?.client?.client_name}
                  <br />
                  {invoice?.client?.phone}
                </Typography.Text>
              </Col>
              <Col span={12}>
                <Typography.Title level={5}>Invoice Details</Typography.Title>
                <Typography.Text>
                  Invoice Date:{" "}
                  <DateField
                    value={invoice?.invoiceDate}
                    format="YYYY-MM-DD"
                  />
                  <br />
                  Total:{" "}
                  <NumberField
                    value={invoice?.total ?? 0}
                    options={{
                      style: "currency",
                      currency: invoice?.currency || "USD",
                    }}
                  />
                </Typography.Text>
              </Col>
            </Row>
            <Divider />
            <Typography.Title level={5}>Services Rendered</Typography.Title>
            <Table
              dataSource={invoice?.services}
              pagination={false}
              rowKey="id"
              loading={loading}
            >
              <Table.Column
                title="Description"
                dataIndex="description"
                key="description"
              />
              <Table.Column
                title="Quantity"
                dataIndex="quantity"
                key="quantity"
                render={(text) => <NumberField value={text} />}
              />
              <Table.Column
                title="Unit Price"
                dataIndex="unitPrice"
                key="unitPrice"
                render={(text) => (
                  <NumberField
                    value={text}
                    options={{
                      style: "currency",
                      currency: invoice?.currency || "USD",
                    }}
                  />
                )}
              />
              <Table.Column
                title="Total"
                dataIndex="totalPrice"
                key="totalPrice"
                render={(text) => (
                  <NumberField
                    value={text}
                    options={{
                      style: "currency",
                      currency: invoice?.currency || "USD",
                    }}
                  />
                )}
              />
            </Table>
          </Card>
        </div>
      </Show>
      <Modal visible={visible} onCancel={close} width="80%" footer={null}>
        <PdfLayoutStandard record={record} />
      </Modal>
    </>
  );
};
