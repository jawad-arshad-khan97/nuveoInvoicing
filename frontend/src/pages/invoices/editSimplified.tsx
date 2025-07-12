import { useForm, useSelect } from "@refinedev/antd";
import {
    Button,
    Card,
    Col,
    DatePicker,
    Divider,
    Flex,
    Form,
    Input,
    Row,
    Select,
    Skeleton,
    Spin,
    Typography,
} from "antd";
import { API_URL } from "@/utils/constants";
import type { SimplifiedInvoice } from "@/types";
import { useStyles } from "./create.styled";
import dayjs from "dayjs";
import { useState } from "react";

export const EditSimplifiedInvoice = () => {
    const { styles } = useStyles();

    const {
        formProps,
        query: queryResult,
        saveButtonProps,
    } = useForm<SimplifiedInvoice>({
        resource: "simplifiedinvoices",
        meta: {
            populate: ["client", "account.logo", "account"],
        },
    });

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

    const loading = queryResult?.isLoading;
    const invoice = queryResult?.data?.data;

    if (loading) return <Spin />;

    return (
        <Card
            bordered={false}
            title={
                <Typography.Text
                    style={{ fontWeight: 400 }}
                >
                    {loading ? (
                        <Skeleton.Button
                            style={{ width: 100, height: 22 }}
                        />
                    ) : (
                        `Invoice ID #${invoice?.id}`
                    )}
                </Typography.Text>
            }
        >
            <Form {...formProps} layout="vertical">
                <Flex
                    align="center"
                    gap={40}
                    wrap="wrap"
                    style={{ padding: "32px" }}
                >
                    <Form.Item
                        label="Account"
                        name={["account", "_id"]}
                        rules={[{ required: true }]}
                        style={{
                            flex: 1,
                            minWidth: "250px",
                        }}
                    >
                        <Select
                            {...selectPropsAccounts}
                            placeholder="Please select account"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Client"
                        name={["client", "_id"]}
                        rules={[{ required: true }]}
                        style={{
                            flex: 1,
                            minWidth: "250px",
                        }}
                    >
                        <Select
                            {...selectPropsClients}
                            placeholder="Please select client"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Invoice Date"
                        name="invoiceDate"
                        getValueProps={(value) => ({
                            value: dayjs(value),
                        })}
                        rules={[{ required: true }]}
                        style={{
                            flex: 1,
                            minWidth: "250px",
                        }}
                    >
                        <DatePicker format="DD-MM-YYYY" />
                    </Form.Item>
                </Flex>
                <Flex
                    align="center"
                    gap={40}
                    wrap="wrap"
                    style={{
                        padding: "32px",
                        marginTop: "-75px",
                    }}
                >
                    <Form.Item
                        label="Status"
                        name="status"
                        rules={[{ required: true }]}
                        style={{
                            flex: 1,
                            minWidth: "250px",
                        }}
                    >
                        <Select
                            placeholder="Select Status"
                            options={statusOptions}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Currency"
                        name="currency"
                        rules={[{ required: true }]}
                        style={{
                            flex: 1,
                            minWidth: "250px",
                        }}
                    >
                        <Select
                            placeholder="Select Currency"
                            options={currencyOptions}
                        />
                    </Form.Item>
                </Flex>
                <Flex
                    align="center"
                    gap={40}
                    wrap="wrap"
                    style={{
                        padding: "32px",
                        marginTop: "-75px",
                    }}
                >
                    <Form.Item
                        label="Invoice Name"
                        name="invoice_name"
                        rules={[{ required: true }]}
                        style={{
                            flex: 1,
                            minWidth: "250px",
                        }}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Total"
                        name="total"
                        rules={[{ required: true }]}
                        style={{
                            flex: 1,
                            minWidth: "250px",
                        }}
                    >
                        <Input type="number" />
                    </Form.Item>
                </Flex>
                <Divider style={{ margin: 0 }} />
                <div style={{ padding: "32px" }}>
                    <Form.Item
                        label="Note"
                        name="note"
                        style={{ minWidth: "250px" }}
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>
                </div>
                <Form.Item>
                    <Button type="primary" htmlType="submit" {...saveButtonProps} style={{ marginTop: 16 }}>Save</Button>
                </Form.Item>
            </Form>
        </Card>
    );
};
