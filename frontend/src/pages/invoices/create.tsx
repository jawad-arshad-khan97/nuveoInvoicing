import { Fragment, useState } from "react";
import { NumberField, Show, useForm, useSelect } from "@refinedev/antd";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Typography,
} from "antd";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import type { Invoice, Service } from "@/types";
import { useStyles } from "./create.styled";

export const InvoicesPageCreate = () => {
  const [tax, setTax] = useState<number>(0);
  const [services, setServices] = useState<Service[]>([
    {
      title: "",
      unitPrice: 0,
      quantity: 0,
      discount: 0,
      totalPrice: 0,
      description: "",
    },
  ]);
  const subtotal = services.reduce(
    (acc, service) =>
      acc +
      (service.unitPrice * service.quantity * (100 - service.discount)) / 100,
    0
  );
  const total = subtotal + (subtotal * tax) / 100;

  const { styles } = useStyles();

  const { formProps } = useForm<Invoice>();

  const { selectProps: selectPropsAccounts } = useSelect({
    resource: "accounts",
    optionLabel: "company_name",
    optionValue: "_id",
  });

  const { selectProps: selectPropsClients } = useSelect({
    resource: "clients",
    optionLabel: "name",
    optionValue: "_id",
  });

  const currencyOptions = [
    { value: "INR", label: "₹ INR" },
    { value: "USD", label: "$ USD" },
    { value: "EUR", label: "€ EUR" },
    { value: "GBP", label: "£ GBP" },
    { value: "JPY", label: "¥ JPY" },
    { value: "SAR", label: "﷼ SAR" },
  ];

  const statusOptions = [
    { value: "Draft", label: "Draft", color: "blue" },
    { value: "NotPaid", label: "NotPaid", color: "red" },
    { value: "Paid", label: "Paid", color: "green" },
    { value: "Refunded", label: "Refunded", color: "orange" },
  ];

  const defaultCurrencySymbol = "₹";
  const defaultCurrency = "INR";
  const defaultStatus = "Draft";

  const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency);

  const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useState(
    defaultCurrencySymbol
  );

  const [selectedStatus, setSelectedStatus] = useState(defaultStatus);

  const handleCurrencyChange = (value: React.SetStateAction<string>) => {
    let symbol = "";

    switch (value) {
      case "INR":
        symbol = "₹";
        break;
      case "USD":
        symbol = "$";
        break;
      case "EUR":
        symbol = "€";
        break;
      case "GBP":
        symbol = "£";
        break;
      case "JPY":
        symbol = "¥";
        break;
      case "SAR":
        symbol = "﷼";
        break;
      default:
        symbol = defaultCurrencySymbol;
    }
    setSelectedCurrencySymbol(symbol);
    setSelectedCurrency(value);
  };

  const handleStatusChange = (value: React.SetStateAction<string>) => {
    let status = "";

    switch (value) {
      case "Draft":
        status = "Draft";
        break;
      case "NotPaid":
        status = "NotPaid";
        break;
      case "Paid":
        status = "Paid";
        break;
      case "Refunded":
        status = "Refunded";
        break;
      default:
        status = defaultStatus;
    }
    setSelectedStatus(status);
  };

  const handleServiceNumbersChange = (
    index: number,
    key: "quantity" | "discount" | "unitPrice",
    value: number
  ) => {
    setServices((prev) => {
      const currentService = { ...prev[index] };
      currentService[key] = value;
      currentService.totalPrice =
        currentService.unitPrice *
        currentService.quantity *
        ((100 - currentService.discount) / 100);

      return prev.map((item, i) => (i === index ? currentService : item));
    });
  };

  const userData = localStorage.getItem("user");
  let userId = "";
  if (userData) {
    const parsedUserData = JSON.parse(userData);
    userId = parsedUserData.userId;
  }

  const onFinishHandler = (values: Invoice) => {
    const valuesWithServices = {
      ...values,
      subtotal,
      total,
      tax,
      userId: userId,
      date: new Date().toISOString(),
      services: services.filter((service) => service.title),
    };

    formProps?.onFinish?.(valuesWithServices);
  };

  return (
    <Show
      title="Invoices"
      headerButtons={() => false}
      contentProps={{
        styles: {
          body: {
            padding: 0,
          },
        },
        style: {
          background: "transparent",
          boxShadow: "none",
        },
      }}
    >
      <Form
        {...formProps}
        initialValues={{ status: defaultStatus, currency: defaultCurrency }}
        onFinish={(values) => onFinishHandler(values as Invoice)}
        layout="vertical"
      >
        <Flex vertical gap={32}>
          <Typography.Title level={3}>New Invoice</Typography.Title>
          <Card
            bordered={false}
            styles={{
              body: {
                padding: 0,
              },
            }}
          >
            <Flex
              align="center"
              gap={40}
              wrap="wrap"
              style={{ padding: "32px" }}
            >
              <Form.Item
                label="Account"
                name="account"
                rules={[{ required: true }]}
                style={{ flex: 1, minWidth: "250px" }}
              >
                <Select
                  {...selectPropsAccounts}
                  placeholder="Please select account"
                />
              </Form.Item>
              <Form.Item
                label="Client"
                name="client"
                rules={[{ required: true }]}
                style={{ flex: 1, minWidth: "250px" }}
              >
                <Select
                  {...selectPropsClients}
                  placeholder="Please select client"
                />
              </Form.Item>

              <Form.Item
                label="Invoice Date"
                name="invoiceDate"
                rules={[
                  {
                    required: true,
                  },
                ]}
                style={{ flex: 1, minWidth: "250px" }}
              >
                <DatePicker format="DD-MM-YYYY" />
              </Form.Item>
            </Flex>

            <Flex
              align="center"
              gap={40}
              wrap="wrap"
              style={{ padding: "32px", marginTop: "-75px" }}
            >
              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true }]}
                style={{ flex: 1, minWidth: "250px" }}
              >
                <Select
                  placeholder="Select Status"
                  options={statusOptions}
                  onChange={handleStatusChange}
                />
              </Form.Item>

              <Form.Item
                label="Custom Id"
                name="custom_id"
                rules={[{ required: false }]}
                style={{ flex: 1, minWidth: "250px" }}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Currency"
                name="currency"
                rules={[{ required: true }]}
                style={{ flex: 1, minWidth: "250px" }}
              >
                <Select
                  placeholder="Select Status"
                  options={currencyOptions}
                  onChange={handleCurrencyChange}
                />
              </Form.Item>
            </Flex>

            <Flex
              align="center"
              gap={40}
              wrap="wrap"
              style={{ padding: "32px", marginTop: "-75px" }}
            >
              <Form.Item
                label="Invoice Name"
                name="name"
                rules={[{ required: true }]}
                style={{ flex: 1, minWidth: "250px" }}
              >
                <Input />
              </Form.Item>
            </Flex>

            <Flex
              align="center"
              gap={40}
              wrap="wrap"
              style={{ padding: "32px", marginTop: "-75px" }}
            >
              <Form.Item
                label="Note"
                name="note"
                rules={[{ required: false }]}
                style={{ flex: 1, minWidth: "250px" }}
              >
                <Input.TextArea
                  placeholder="Enter notes here"
                  autoSize={{ minRows: 2, maxRows: 6 }}
                />
              </Form.Item>
            </Flex>

            <Divider style={{ margin: 0 }} />
            <div style={{ padding: "32px" }}>
              <Typography.Title
                level={4}
                style={{ marginBottom: "32px", fontWeight: 400 }}
              >
                Products / Services
              </Typography.Title>
              <div className={styles.serviceTableWrapper}>
                <div className={styles.serviceTableContainer}>
                  <Row className={styles.serviceHeader}>
                    <Col
                      xs={{ span: 7 }}
                      className={styles.serviceHeaderColumn}
                    >
                      Title
                      <Divider
                        type="vertical"
                        className={styles.serviceHeaderDivider}
                      />
                    </Col>
                    <Col
                      xs={{ span: 5 }}
                      className={styles.serviceHeaderColumn}
                    >
                      Unit Price
                      <Divider
                        type="vertical"
                        className={styles.serviceHeaderDivider}
                      />
                    </Col>
                    <Col
                      xs={{ span: 4 }}
                      className={styles.serviceHeaderColumn}
                    >
                      Quantity
                      <Divider
                        type="vertical"
                        className={styles.serviceHeaderDivider}
                      />
                    </Col>
                    <Col
                      xs={{ span: 4 }}
                      className={styles.serviceHeaderColumn}
                    >
                      Discount
                      <Divider
                        type="vertical"
                        className={styles.serviceHeaderDivider}
                      />
                    </Col>
                    <Col
                      xs={{ span: 3 }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                      className={styles.serviceHeaderColumn}
                    >
                      Total Price
                    </Col>
                    <Col xs={{ span: 1 }}> </Col>
                  </Row>
                  <Row>
                    {services.map((service, index) => {
                      return (
                        <Fragment key={index}>
                          <Col
                            xs={{ span: 7 }}
                            className={styles.serviceRowColumn}
                          >
                            <Input
                              placeholder="Title"
                              value={service.title}
                              onChange={(e) => {
                                setServices((prev) =>
                                  prev.map((item, i) =>
                                    i === index
                                      ? { ...item, title: e.target.value }
                                      : item
                                  )
                                );
                              }}
                            />
                          </Col>
                          <Col
                            xs={{ span: 5 }}
                            className={styles.serviceRowColumn}
                          >
                            <InputNumber
                              addonBefore={selectedCurrencySymbol}
                              style={{ width: "100%" }}
                              placeholder="Unit Price"
                              min={0}
                              value={service.unitPrice}
                              onChange={(value) => {
                                handleServiceNumbersChange(
                                  index,
                                  "unitPrice",
                                  value || 0
                                );
                              }}
                            />
                          </Col>
                          <Col
                            xs={{ span: 4 }}
                            className={styles.serviceRowColumn}
                          >
                            <InputNumber
                              style={{ width: "100%" }}
                              placeholder="Quantity"
                              min={0}
                              value={service.quantity}
                              onChange={(value) => {
                                handleServiceNumbersChange(
                                  index,
                                  "quantity",
                                  value || 0
                                );
                              }}
                            />
                          </Col>
                          <Col
                            xs={{ span: 4 }}
                            className={styles.serviceRowColumn}
                          >
                            <InputNumber
                              addonAfter="%"
                              style={{ width: "100%" }}
                              placeholder="Discount"
                              min={0}
                              value={service.discount}
                              onChange={(value) => {
                                handleServiceNumbersChange(
                                  index,
                                  "discount",
                                  value || 0
                                );
                              }}
                            />
                          </Col>
                          <Col
                            xs={{ span: 3 }}
                            className={styles.serviceRowColumn}
                            style={{
                              justifyContent: "flex-end",
                            }}
                          >
                            <NumberField
                              value={service.totalPrice}
                              options={{ style: "currency", currency: "USD" }}
                            />
                          </Col>
                          <Col
                            xs={{ span: 1 }}
                            className={styles.serviceRowColumn}
                            style={{
                              paddingLeft: "0",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Button
                              danger
                              size="small"
                              icon={<DeleteOutlined />}
                              onClick={() => {
                                setServices((prev) =>
                                  prev.filter((_, i) => i !== index)
                                );
                              }}
                            />
                          </Col>
                        </Fragment>
                      );
                    })}
                  </Row>
                  <Divider
                    style={{
                      margin: "0",
                    }}
                  />
                  <div style={{ padding: "12px" }}>
                    <Button
                      icon={<PlusCircleOutlined />}
                      type="text"
                      className={styles.addNewServiceItemButton}
                      onClick={() => {
                        setServices((prev) => [
                          ...prev,
                          {
                            title: "",
                            unitPrice: 0,
                            quantity: 0,
                            discount: 0,
                            totalPrice: 0,
                            description: "",
                          },
                        ]);
                      }}
                    >
                      Add new item
                    </Button>
                  </div>
                </div>
              </div>
              <Flex
                gap={16}
                vertical
                style={{
                  marginLeft: "auto",
                  marginTop: "24px",
                  width: "220px",
                }}
              >
                <Flex
                  justify="space-between"
                  style={{
                    paddingLeft: 32,
                  }}
                >
                  <Typography.Text className={styles.labelTotal}>
                    Subtotal:
                  </Typography.Text>
                  <NumberField
                    value={subtotal}
                    options={{ style: "currency", currency: selectedCurrency }}
                  />
                </Flex>
                <Flex
                  align="center"
                  justify="space-between"
                  style={{
                    paddingLeft: 32,
                  }}
                >
                  <Typography.Text className={styles.labelTotal}>
                    Sales tax:
                  </Typography.Text>
                  <InputNumber
                    addonAfter="%"
                    style={{ width: "96px" }}
                    value={tax}
                    min={0}
                    onChange={(value) => {
                      setTax(value || 0);
                    }}
                  />
                </Flex>
                <Divider
                  style={{
                    margin: "0",
                  }}
                />
                <Flex
                  justify="space-between"
                  style={{
                    paddingLeft: 16,
                  }}
                >
                  <Typography.Text
                    className={styles.labelTotal}
                    style={{
                      fontWeight: 700,
                    }}
                  >
                    Total value:
                  </Typography.Text>
                  <NumberField
                    value={total}
                    options={{ style: "currency", currency: selectedCurrency }}
                  />
                </Flex>
              </Flex>
            </div>
            <Divider style={{ margin: 0 }} />
            <Flex justify="end" gap={8} style={{ padding: "32px" }}>
              <Button>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Flex>
          </Card>
        </Flex>
      </Form>
    </Show>
  );
};
