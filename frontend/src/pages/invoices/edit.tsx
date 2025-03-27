import { useForm, useSelect } from "@refinedev/antd";
import { FilePdfOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Skeleton,
  Spin,
  Table,
  Typography,
} from "antd";
import { Edit } from "@refinedev/antd";
import { API_URL } from "@/utils/constants";
import { getRandomColorFromString } from "@/utils/get-random-color";
import type { Invoice, Service } from "@/types";
import { useStyles } from "./show.styled";

export const InvoicesPageEdit = () => {
  const { styles } = useStyles();

  const {
    formProps,
    query: queryResult,
    saveButtonProps,
  } = useForm<Invoice>({
    meta: {
      populate: ["client", "account.logo"],
    },
  });

  const invoice = queryResult?.data?.data;
  const loading = queryResult?.isLoading;
  const logoUrl = invoice?.account?.logo
    ? `${API_URL}${invoice?.account?.logo}`
    : undefined;

  const { selectProps: clientSelectProps } = useSelect({
    resource: "clients",
    optionLabel: "name",
    optionValue: "_id",
  });

  const { selectProps: accountSelectProps } = useSelect({
    resource: "accounts",
    optionLabel: "name",
    optionValue: "_id",
  });

  const userData = localStorage.getItem("user");
  let userId = "";
  if (userData) {
    const parsedUserData = JSON.parse(userData);
    userId = parsedUserData.userId;
  }

  return (
    <Edit
      title="Edit Invoice"
      saveButtonProps={saveButtonProps}
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
      <Spin spinning={loading}>
        <Form
          {...formProps}
          layout="vertical"
          initialValues={queryResult?.data?.data}
          onFinish={async (values) => {
            userId;

            return formProps.onFinish?.({
              ...values,
              userId: userId,
            });
          }}
        >
          <Card
            bordered={false}
            title={
              <Typography.Text style={{ fontWeight: 400 }}>
                {loading ? (
                  <Skeleton.Button style={{ width: 100, height: 22 }} />
                ) : (
                  `Invoice ID #${invoice?.id}`
                )}
              </Typography.Text>
            }
          >
            <Row className={styles.fromToContainer}>
              <Col xs={24} md={12}>
                <Form.Item
                  name={["account", "company_name"]}
                  label="From (Account Name)"
                  rules={[
                    { required: true, message: "Account name is required" },
                  ]}
                >
                  <Select {...accountSelectProps} />
                </Form.Item>
                <Form.Item
                  name={["account", "address"]}
                  label="Address"
                  rules={[{ required: true, message: "Address is required" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={["account", "phone"]}
                  label="Phone"
                  rules={[{ required: true, message: "Phone is required" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name={["client", "id"]}
                  label="To (Client)"
                  rules={[{ required: true, message: "Client is required" }]}
                >
                  <Select {...clientSelectProps} />
                </Form.Item>
                <Form.Item
                  name={["client", "address"]}
                  label="Address"
                  rules={[{ required: true, message: "Address is required" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={["client", "phone"]}
                  label="Phone"
                  rules={[{ required: true, message: "Phone is required" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Divider />

            <Typography.Title level={4} style={{ margin: 0, fontWeight: 400 }}>
              Product / Services
            </Typography.Title>
            <Form.List name="services">
              {(fields, { add, remove }) => (
                <>
                  <Table
                    dataSource={fields}
                    rowKey="name"
                    pagination={false}
                    scroll={{ x: 960 }}
                  >
                    <Table.Column
                      title="Title"
                      render={(_, field) => (
                        <Form.Item
                          {...field}
                          name={[field.name, "title"]}
                          rules={[
                            { required: true, message: "Title is required" },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      )}
                    />
                    <Table.Column
                      title="Unit Price"
                      render={(_, field) => (
                        <Form.Item
                          {...field}
                          name={[field.name, "unitPrice"]}
                          rules={[
                            {
                              required: true,
                              message: "Unit price is required",
                            },
                          ]}
                        >
                          <InputNumber min={0} />
                        </Form.Item>
                      )}
                    />
                    <Table.Column
                      title="Quantity"
                      render={(_, field) => (
                        <Form.Item
                          {...field}
                          name={[field.name, "quantity"]}
                          rules={[
                            { required: true, message: "Quantity is required" },
                          ]}
                        >
                          <InputNumber min={1} />
                        </Form.Item>
                      )}
                    />
                    <Table.Column
                      title="Discount"
                      render={(_, field) => (
                        <Form.Item
                          {...field}
                          name={[field.name, "discount"]}
                          rules={[
                            { required: true, message: "Discount is required" },
                          ]}
                        >
                          <InputNumber min={0} max={100} />
                        </Form.Item>
                      )}
                    />
                    <Table.Column
                      title="Actions"
                      render={(_, field) => (
                        <Button danger onClick={() => remove(field.name)}>
                          Remove
                        </Button>
                      )}
                    />
                  </Table>
                  <Button onClick={() => add()} type="dashed" block>
                    Add Service
                  </Button>
                </>
              )}
            </Form.List>
            <Divider />

            <Form.Item label="Tax (%)" name="tax">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item label="Total" name="total">
              <InputNumber min={0} disabled />
            </Form.Item>
          </Card>
        </Form>
      </Spin>
    </Edit>
  );
};
