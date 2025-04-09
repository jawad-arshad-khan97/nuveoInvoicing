import { useState } from "react";
import {
    Button,
    DatePicker,
    Flex,
    Form,
    Skeleton,
    Typography,
    type FormItemProps,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useStyles } from "./styled";
import dayjs from "dayjs";

type Props = {
    icon?: React.ReactNode;
    placeholder?: string;
    formItemProps?: FormItemProps;
    loading?: boolean;
    onEditClick?: () => void;
    onCancelClick?: () => void;
    onSave?: () => void;
};

export const FormItemEditableInputDateTime = ({
                                                  icon,
                                                  placeholder,
                                                  formItemProps,
                                                  loading,
                                                  onEditClick,
                                                  onCancelClick,
                                                  onSave,
                                              }: Props) => {
    const [disabled, setDisabled] = useState(true);

    const { styles, cx } = useStyles();
    const form = Form.useFormInstance();

    const handleEdit = () => {
        setDisabled(false);
        onEditClick?.();
    };

    const handleOnCancel = () => {
        setDisabled(true);
        form.resetFields([formItemProps?.name]);
        onCancelClick?.();
    };

    const handleOnSave = async () => {
        try {
            await form.validateFields();
            form.submit();
            setDisabled(true);
            onSave?.();
        } catch (error) {}
    };

    return (
        <Flex align="center" vertical={!disabled} className={styles.container}>
            <Form.Item
                {...formItemProps}
                rules={disabled ? [] : formItemProps?.rules}
                className={cx(styles.formItem, {
                    [styles.formItemDisabled]: disabled,
                    [styles.formItemEnabled]: !disabled,
                })}
                label={
                    formItemProps?.label && (
                        <Flex gap={16} align="center">
                            <Typography.Text type="secondary">{icon}</Typography.Text>
                            <Typography.Text type="secondary">
                                {formItemProps?.label}
                            </Typography.Text>
                        </Flex>
                    )
                }
            >
                {loading ? (
                    <Skeleton.Input style={{ height: "22px", marginLeft: "32px" }} active />
                ) : (
                    <DatePicker
                        disabled={disabled}
                        showTime={{ format: "hh:mm A" }}
                        format="DD-MM-YYYY hh:mm A"
                        placeholder={placeholder}
                        style={{ width: "100%" }}
                        use12Hours
                    />
                )}
            </Form.Item>
            {disabled ? (
                <Button icon={<EditOutlined />} onClick={handleEdit} />
            ) : (
                <Flex gap={8} style={{ alignSelf: "flex-end", marginTop: "8px" }}>
                    <Button onClick={handleOnCancel}>Cancel</Button>
                    <Button type="primary" onClick={handleOnSave}>
                        Save
                    </Button>
                </Flex>
            )}
        </Flex>
    );
};
