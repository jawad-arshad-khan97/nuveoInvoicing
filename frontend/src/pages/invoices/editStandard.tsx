import { NumberField, useForm, useSelect } from "@refinedev/antd";
import {
    DeleteOutlined,
    FilePdfOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";
import {
    Avatar,
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
    Skeleton,
    Spin,
    Table,
    Typography,
} from "antd";
import { API_URL } from "@/utils/constants";
import { getRandomColorFromString } from "@/utils/get-random-color";
import type { StandardInvoice, Service } from "@/types";
import { useStyles } from "./create.styled";
import { Fragment, useEffect, useState } from "react";
import dayjs from "dayjs";
import { useOne } from "@refinedev/core";

export const EditStandardInvoice = () => {
    const { styles } = useStyles();

    const {
        formProps,
        query: queryResult,
        saveButtonProps,
    } = useForm<StandardInvoice>({
        resource: "standardinvoices",
        meta: {
            populate: ["client", "account.logo", "services"],
        },
    });

    const invoice = queryResult?.data?.data;
    const loading = queryResult?.isLoading;
    const logoUrl = invoice?.account?.logo
        ? `${API_URL}${invoice?.account?.logo}`
        : undefined;

    const [services, setServices] = useState<Service[]>(invoice?.services || []);
    useEffect(() => {
        if (queryResult?.data?.data?.services) {
            setServices(queryResult?.data?.data?.services);
        }
    }, [queryResult]);

    const { selectProps: selectPropsClients } = useSelect({
        resource: "clients",
        optionLabel: "client_name",
        optionValue: "_id",
    });

    const { selectProps: selectPropsAccounts } = useSelect({
        resource: "accounts",
        optionLabel: "account_name",
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
    const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency);
    const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useState(defaultCurrencySymbol);
    const [tax, setTax] = useState<number>(queryResult?.data?.data?.tax || 0);

    const subtotal = services.reduce(
        (acc, service) =>
            acc +
            (service.unitPrice * service.quantity * (100 - service.discount)) / 100,
        0
    );
    const total = subtotal + (subtotal * tax) / 100;

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

    if (loading) return <Spin />;

    return (
        <Card bordered={false} title={<Typography.Text style={{ fontWeight: 400 }}>{loading ? <Skeleton.Button style={{ width: 100, height: 22 }} /> : `Invoice ID #${invoice?.id}`}</Typography.Text>}>
            <Form
                {...formProps}
                layout="vertical"
                onFinish={async (values) => {
                    return formProps.onFinish?.({
                        ...values,
                        services: services,
                        subtotal: subtotal,
                        total: total,
                        tax: tax,
                    });
                }}
            >
                <Flex align="center" gap={40} wrap="wrap" style={{ padding: "32px" }}>
                    <Form.Item label="Account" name={["account", "_id"]} rules={[{ required: true }]} style={{ flex: 1, minWidth: "250px" }}>
                        <Select {...selectPropsAccounts} placeholder="Please select account" />
                    </Form.Item>
                    <Form.Item label="Client" name={["client", "_id"]} rules={[{ required: true }]} style={{ flex: 1, minWidth: "250px" }}>
                        <Select {...selectPropsClients} placeholder="Please select client" />
                    </Form.Item>
                    <Form.Item label="Invoice Date" name="invoiceDate" getValueProps={(value) => ({ value: dayjs(value) })} rules={[{ required: true }]} style={{ flex: 1, minWidth: "250px" }}>
                        <DatePicker format="DD-MM-YYYY" />
                    </Form.Item>
                </Flex>
                <Flex align="center" gap={40} wrap="wrap" style={{ padding: "32px", marginTop: "-75px" }}>
                    <Form.Item label="Status" name="status" rules={[{ required: true }]} style={{ flex: 1, minWidth: "250px" }}>
                        <Select placeholder="Select Status" options={statusOptions} />
                    </Form.Item>
                    <Form.Item label="Custom Id" name="custom_id" rules={[{ required: false }]} style={{ flex: 1, minWidth: "250px" }}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Currency" name="currency" rules={[{ required: true }]} style={{ flex: 1, minWidth: "250px" }}>
                        <Select placeholder="Select Currency" options={currencyOptions} onChange={(value) => {
                            let symbol = defaultCurrencySymbol;
                            switch (value) {
                                case "INR": symbol = "₹"; break;
                                case "USD": symbol = "$"; break;
                                case "EUR": symbol = "€"; break;
                                case "GBP": symbol = "£"; break;
                                case "JPY": symbol = "¥"; break;
                                case "SAR": symbol = "﷼"; break;
                                default: symbol = defaultCurrencySymbol;
                            }
                            setSelectedCurrencySymbol(symbol);
                            setSelectedCurrency(value);
                        }} />
                    </Form.Item>
                </Flex>
                <Flex align="center" gap={40} wrap="wrap" style={{ padding: "32px", marginTop: "-75px" }}>
                    <Form.Item label="Invoice Name" name="invoice_name" rules={[{ required: true }]} style={{ flex: 1, minWidth: "250px" }}>
                        <Input />
                    </Form.Item>
                </Flex>
                <Divider style={{ margin: 0 }} />
                <div style={{ padding: "32px" }}>
                    <Typography.Title level={4} style={{ marginBottom: "32px", fontWeight: 400 }}>
                        Products / Services
                    </Typography.Title>
                    <div className={styles.serviceTableWrapper}>
                        <div className={styles.serviceTableContainer}>
                            <Row className={styles.serviceHeader}>
                                <Col xs={{ span: 7 }} className={styles.serviceHeaderColumn}>Title<Divider type="vertical" className={styles.serviceHeaderDivider} /></Col>
                                <Col xs={{ span: 5 }} className={styles.serviceHeaderColumn}>Unit Price<Divider type="vertical" className={styles.serviceHeaderDivider} /></Col>
                                <Col xs={{ span: 4 }} className={styles.serviceHeaderColumn}>Quantity<Divider type="vertical" className={styles.serviceHeaderDivider} /></Col>
                                <Col xs={{ span: 4 }} className={styles.serviceHeaderColumn}>Discount<Divider type="vertical" className={styles.serviceHeaderDivider} /></Col>
                                <Col xs={{ span: 3 }} style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }} className={styles.serviceHeaderColumn}>Total Price</Col>
                                <Col xs={{ span: 1 }}> </Col>
                            </Row>
                            <Form.List name="services">
                                {(fields, { add, remove }) => (
                                    <>
                                        <Row>
                                            {services.map((service, index) => (
                                                <Fragment key={index}>
                                                    <Col xs={{ span: 7 }} className={styles.serviceRowColumn}>
                                                        <Input placeholder="Title" value={service.title} onChange={(e) => {
                                                            setServices((prev) => prev.map((item, i) => i === index ? { ...item, title: e.target.value } : item));
                                                        }} />
                                                    </Col>
                                                    <Col xs={{ span: 5 }} className={styles.serviceRowColumn}>
                                                        <InputNumber addonBefore={selectedCurrencySymbol} style={{ width: "100%" }} placeholder="Unit Price" min={0} value={service.unitPrice} onChange={(value) => {
                                                            handleServiceNumbersChange(index, "unitPrice", value || 0);
                                                        }} />
                                                    </Col>
                                                    <Col xs={{ span: 4 }} className={styles.serviceRowColumn}>
                                                        <InputNumber style={{ width: "100%" }} placeholder="Quantity" min={0} value={service.quantity} onChange={(value) => {
                                                            handleServiceNumbersChange(index, "quantity", value || 0);
                                                        }} />
                                                    </Col>
                                                    <Col xs={{ span: 4 }} className={styles.serviceRowColumn}>
                                                        <InputNumber addonAfter="%" style={{ width: "100%" }} placeholder="Discount" min={0} value={service.discount} onChange={(value) => {
                                                            handleServiceNumbersChange(index, "discount", value || 0);
                                                        }} />
                                                    </Col>
                                                    <Col xs={{ span: 3 }} className={styles.serviceRowColumn} style={{ justifyContent: "flex-end" }}>
                                                        <NumberField value={service.totalPrice} options={{ style: "currency", currency: selectedCurrency }} />
                                                    </Col>
                                                    <Col xs={{ span: 1 }} className={styles.serviceRowColumn} style={{ paddingLeft: "0", justifyContent: "flex-end" }}>
                                                        <Button danger size="small" icon={<DeleteOutlined />} onClick={() => {
                                                            setServices((prev) => prev.filter((_, i) => i !== index));
                                                        }} />
                                                    </Col>
                                                </Fragment>
                                            ))}
                                        </Row>
                                    </>
                                )}
                            </Form.List>
                            <Divider style={{ margin: "0" }} />
                            <div style={{ padding: "12px" }}>
                                <Button icon={<PlusCircleOutlined />} type="text" className={styles.addNewServiceItemButton} onClick={() => {
                                    setServices((prev) => [
                                        ...prev,
                                        { title: "", unitPrice: 0, quantity: 0, discount: 0, totalPrice: 0, description: "" },
                                    ]);
                                }}>
                                    Add new item
                                </Button>
                            </div>
                        </div>
                    </div>
                    <Flex gap={16} vertical style={{ marginLeft: "auto", marginTop: "24px", width: "220px" }}>
                        <Flex justify="space-between" style={{ paddingLeft: 32 }}>
                            <Typography.Text className={styles.labelTotal}>Subtotal:</Typography.Text>
                            <NumberField value={subtotal} options={{ style: "currency", currency: selectedCurrency }} />
                        </Flex>
                        <Flex align="center" justify="space-between" style={{ paddingLeft: 32 }}>
                            <Typography.Text className={styles.labelTotal}>Tax:</Typography.Text>
                            <InputNumber addonAfter="%" style={{ width: "96px" }} value={tax} min={0} onChange={(value) => { setTax(value || 0); }} />
                        </Flex>
                        <Divider style={{ margin: "0" }} />
                        <Flex justify="space-between" style={{ paddingLeft: 16 }}>
                            <Typography.Text className={styles.labelTotal} style={{ fontWeight: 700 }}>Total value:</Typography.Text>
                            <NumberField value={total} options={{ style: "currency", currency: selectedCurrency }} />
                        </Flex>
                    </Flex>
                </div>
            </Form>
        </Card>
    );
};
