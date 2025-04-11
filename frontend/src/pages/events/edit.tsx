import {file2Base64, type HttpError, useNavigation} from "@refinedev/core";
import {
    DateField,
    DeleteButton,
    EditButton,
    NumberField,
    Show,
    ShowButton,
    useForm, useSelect,
} from "@refinedev/antd";
import {Card, Divider, Flex, Form, SelectProps, Table, Typography} from "antd";
import {
    BankOutlined,
    EnvironmentOutlined, ExportOutlined,
    FieldTimeOutlined,
    PhoneOutlined,
} from "@ant-design/icons";
import {Col, Row} from "antd";
import {
    FormItemEditableInputText, FormItemEditableSelectStatic,
    FormItemEditableText,
} from "@/components/form";
import type {IEvent} from "@/types";
import {FormItemEditableInputDateTime} from "@/components/form/form-item-editable-input-datetime";
import dayjs from "dayjs";

export const EventsPageEdit = () => {
    const {listUrl} = useNavigation();

    const {formProps, query: queryResult} = useForm<
        IEvent,
        HttpError
    >({
        redirect: false,
        // meta: {
        //     populate: ["logo", "clients", "invoices.client"],
        // },
    });
    const event = queryResult?.data?.data;
    const status = event?.status;
    const date = event?.date
        ? dayjs(event.date)
        : null;
    const isLoading = queryResult?.isLoading;

    const statusOptions = [
        {label: "New", value: "new" as IEvent["status"]},
        {label: "Done", value: "done"},
        {label: "Cancelled", value: "cancelled"},
    ];

    const getStatusColor = (status: string | undefined) => {
        switch (status) {
            case "done":
                return "green";
            case "new":
                return "orange";
            case "cancelled":
                return "red";
            default:
                return "default";
        }
    };

    const userData = localStorage.getItem("user");
    let userId = "";
    if (userData) {
        const parsedUserData = JSON.parse(userData);
        userId = parsedUserData.userId;
    }

    return (
        <Show
            title="Events"
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
                initialValues={{
                    ...queryResult?.data?.data,
                    date: date,
                    status: status,
                }}
                onFinish={async (values) => {
                    return formProps.onFinish?.({
                        ...values,
                        userId: userId,
                    });
                }}
                layout="vertical"
            >
                <Row>
                    <Col span={24}>
                        <Flex gap={16}>
                            <FormItemEditableText
                                loading={isLoading}
                                formItemProps={{
                                    name: "event_name",
                                    rules: [{required: true}],
                                }}
                            />
                        </Flex>
                    </Col>
                </Row>
                <Row
                    gutter={32}
                    style={{
                        marginTop: "32px",
                    }}
                >
                    <Col xs={{span: 24}} xl={{span: 8}}>
                        <Card
                            bordered={false}
                            styles={{body: {padding: 0}}}
                            title={
                                <Flex gap={12} align="center">
                                    <BankOutlined/>
                                    <Typography.Text>Event info</Typography.Text>
                                </Flex>
                            }
                        >

                            <FormItemEditableInputText
                                loading={isLoading}
                                icon={<PhoneOutlined/>}
                                placeholder="Add phone number"
                                formItemProps={{
                                    name: "phone",
                                    label: "Phone",
                                    rules: [{required: false}],
                                }}
                            />
                            <Divider style={{margin: 0}}/>
                            <FormItemEditableInputDateTime
                                loading={isLoading}
                                icon={<FieldTimeOutlined/>}
                                placeholder="Add date time"
                                formItemProps={{
                                    name: "date",
                                    label: "date",
                                    rules: [{required: true}],
                                }}
                            />
                            <Divider style={{margin: 0}}/>
                            <FormItemEditableSelectStatic
                                loading={isLoading}
                                icon={<BankOutlined />}
                                editIcon={<ExportOutlined />}
                                placeholder="Select status"
                                options={[
                                    { label: "New", value: "new" },
                                    { label: "Done", value: "done" },
                                    { label: "Cancelled", value: "cancelled" },
                                ]}
                                formItemProps={{
                                    name: "status",
                                    label: "Status",
                                    rules: [{ required: true }],
                                }}
                            />

                            <Divider style={{margin: 0}}/>
                            <FormItemEditableInputText
                                loading={isLoading}
                                icon={<EnvironmentOutlined/>}
                                placeholder="Add agenda"
                                formItemProps={{
                                    name: "agenda",
                                    label: "agenda",
                                    rules: [{required: false}],
                                }}
                            />
                        </Card>
                        <DeleteButton
                            type="text"
                            style={{
                                marginTop: "16px",
                            }}
                            onSuccess={() => {
                                window.location.href = listUrl("events");
                            }}
                        >
                            Delete event
                        </DeleteButton>
                    </Col>
                </Row>
            </Form>
        </Show>
    );
};
