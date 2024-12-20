import { useMemo, useState } from "react";
import { Button, Flex, Form, Upload, UploadFile, message, theme } from "antd";
import { CloudUploadOutlined, PictureOutlined } from "@ant-design/icons";
import type { RcFile, UploadChangeParam } from "antd/lib/upload";
import { axiosInstance } from "@/providers/axios";
import { API_URL, TOKEN_KEY } from "@/utils/constants";
import type { Media, UploadResponse } from "@/types";
import { useStyles } from "./styled";

type Props = {
  name?: string;
  onFileChange?: (file: RcFile | null) => void;
};

export const FormItemUploadLogoDraggable = ({
  name = "logo",
  onFileChange,
}: Props) => {
  const [preview, setPreview] = useState<string | null>(null); // Preview URL

  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
    }
    return isImage || Upload.LIST_IGNORE;
  };

  const { styles } = useStyles();
  const { token } = theme.useToken();

  const form = Form.useFormInstance();
  const fieldValue = Form.useWatch(name, form) as string;

  const src = useMemo(() => fieldValue || null, [fieldValue]);

  const handleFileChange = (info: UploadChangeParam<UploadFile<any>>) => {
    const uploadedFile = info.file.originFileObj as RcFile | undefined;
    if (uploadedFile) {
      setPreview(URL.createObjectURL(uploadedFile)); // Generate preview URL
      onFileChange?.(uploadedFile); // Pass file back to parent
    } else {
      setPreview(null);
      onFileChange?.(null); // Reset file
    }
  };

  return (
    <Flex gap={16} vertical>
      <div className={styles.container}>
        <Form.Item
          name="logo"
          valuePropName="file"
          // getValueProps={(data) => {
          //   return getValueProps(data, API_URL);
          // }}
          noStyle
        >
          <Upload.Dragger
            name="files"
            listType="picture"
            accept="image/*"
            beforeUpload={beforeUpload}
            multiple={false}
            showUploadList={false}
            style={{
              padding: 0,
            }}
            onChange={handleFileChange}
            customRequest={() => {}}
          >
            {src && (
              <img
                src={src}
                alt="preview"
                style={{
                  width: "148px",
                  height: "148px",
                  objectFit: "cover",
                }}
              />
            )}
            {!src && (
              <PictureOutlined
                style={{
                  fontSize: "48px",
                  color: token.colorTextTertiary,
                }}
              />
            )}
          </Upload.Dragger>
        </Form.Item>
      </div>
      <Form.Item
        name="logo"
        valuePropName="fileList"
        // getValueProps={(data) => {
        //   return getValueProps(data, API_URL);
        // }}
        noStyle
      >
        <Upload
          name="files"
          listType="picture"
          accept="image/*"
          multiple={false}
          showUploadList={false}
          onChange={handleFileChange}
          customRequest={() => {}}
        >
          <Button
            style={{
              width: "148px",
            }}
            icon={<CloudUploadOutlined />}
          >
            Upload Logo
          </Button>
        </Upload>
      </Form.Item>
    </Flex>
  );
};
