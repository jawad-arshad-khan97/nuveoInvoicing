import { Form, Input, DatePicker, Select } from "antd";
import dayjs from "dayjs";
import type { IEvent } from "../../types/index";
import InputMask from "react-input-mask";

export const EventForm = ({ modalProps, formProps }: any) => {
    return (
        <Form {...formProps} layout="vertical">
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
        </Form>
    );
};
