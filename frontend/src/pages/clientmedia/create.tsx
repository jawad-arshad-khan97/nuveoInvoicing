import { useGo, useOne } from "@refinedev/core";
import { useForm, useSelect } from "@refinedev/antd";
import { Flex, Form, Modal, Select } from "antd";
import type { ClientMedia } from "@/types";

export const ClientMediaPageCreate = () => {
    const go = useGo();

    const { formProps } = useForm<ClientMedia>();

    const getClientData = async (clientId: string) => {
        return useOne({
            resource: "client",
            id: clientId,
        });
    };

    const { selectProps: selectPropsClient } = useSelect({
        resource: "clients",
        optionLabel: "client_name",
        optionValue: "_id",
    });

    const userData = localStorage.getItem("user");
    let userId = "";
    if (userData) {
        const parsedUserData = JSON.parse(userData);
        userId = parsedUserData.userId;
    }

    return (
        <Modal
            okButtonProps={{ form: "create-clientmedia-form", htmlType: "submit" }}
            title="Add new Client Media"
            open
            onCancel={() => {
                go({
                    to: { resource: "clientmedias", action: "list" },
                    options: { keepQuery: true },
                });
            }}
        >
            <Form
                layout="vertical"
                id="create-client-form"
                {...formProps}
                onFinish={async (values) => {
                    userId;

                    return formProps.onFinish?.({
                        ...values,
                        userId: userId,
                    });
                }}
            >
                <Flex
                    vertical
                    style={{
                        margin: "0 auto",
                        width: "420px",
                    }}
                >
                    <Form.Item
                        name="client"
                        label="Client"
                        rules={[{ required: true }]}
                    >
                        <Select
                            {...selectPropsClient}
                            placeholder="Please select an client"
                        />
                    </Form.Item>
                </Flex>
            </Form>
        </Modal>
    );
};
