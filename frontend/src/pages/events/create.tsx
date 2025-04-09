import {type HttpError, useGo } from "@refinedev/core";
import { useForm } from "@refinedev/antd";
import {DatePicker, Flex, Form, Input, Modal, Select} from "antd";
import InputMask from "react-input-mask";
import type { IEvent, User } from "@/types";

export const EventsPageCreate = () => {
    const go = useGo();

    const { formProps, formLoading } = useForm<IEvent, HttpError>();
    const userData = localStorage.getItem("user");
    let userId = "";
    if (userData) {
        const parsedUserData = JSON.parse(userData);
        userId = parsedUserData.userId;
    }

    return (
        <Modal
            okButtonProps={{ form: "create-event-form", htmlType: "submit" }}
            title="Add new event"
            open
            onCancel={() => {
                go({
                    to: { resource: "events", action: "list" },
                    options: { keepQuery: true },
                });
            }}
        >
            <Form
                layout="vertical"
                id="create-event-form"
                {...formProps}
                onFinish={async (values) => {
                    userId;

                    return formProps.onFinish?.({
                        ...values,
                        userId: userId,
                    });
                }}
            >
                <Flex gap={40}>
                    <Flex
                        vertical
                        style={{
                            width: "420px",
                        }}
                    >
                        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="phone" label="Phone" rules={[{ required: false }]}>
                            <InputMask mask="(999) 999-9999">
                                {/* @ts-expect-error  <InputMask /> expects JSX.Element but we are using React.ReactNode */}
                                {(props: InputProps) => (
                                    <Input {...props} placeholder="Please enter phone number" />
                                )}
                            </InputMask>
                        </Form.Item>
                        <Form.Item label="Date" name="date" rules={[{ required: true }]}>
                            <DatePicker style={{ width: "100%" }} showTime={{ format: "mm:hh A" }}
                                        format="DD-MM-YYYY mm:HH" />
                        </Form.Item>
                        <Form.Item label="Agenda" name="agenda" rules={[{ required: false }]}>
                            <Input.TextArea
                                placeholder="Enter agenda here"
                                autoSize={{ minRows: 2, maxRows: 6 }}
                            />
                        </Form.Item>
                        <Form.Item label="Status" name="status" initialValue="new" rules={[{ required: true }]}>
                            <Select options={[
                                { label: "New", value: "new" },
                                { label: "Completed", value: "completed" },
                                { label: "Cancelled", value: "cancelled" },
                            ]} />
                        </Form.Item>
                    </Flex>
                </Flex>
            </Form>
        </Modal>
    );
};
