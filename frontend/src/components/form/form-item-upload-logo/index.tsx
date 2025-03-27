import { useMemo, useState } from "react";
import { Avatar, Form, message, Skeleton, Typography, Upload } from "antd";
import { CloudUploadOutlined } from "@ant-design/icons";
import type { RcFile, UploadChangeParam } from "antd/lib/upload";
import { getRandomColorFromString } from "@/utils/get-random-color";
import { useStyles } from "./styled";
import { file2Base64 } from "@refinedev/core";
import { useApiUrl } from "@refinedev/core";
import { useParams } from "react-router-dom";

type Props = {
  label: string;
  formName?: string;
  isLoading?: boolean;
  onUpload?: (params: string) => void;
};

export const FormItemUploadLogo = ({
  formName = "logo",
  label,
  isLoading,
  onUpload,
}: Props) => {
  const { styles } = useStyles();
  const [fileList, setFileList] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = useApiUrl();
  const { id } = useParams();

  const form = Form.useFormInstance();

  const fieldValue = Form.useWatch(formName, form) as string;

  const src = useMemo(() => fieldValue || null, [fieldValue]);

  const handleImageChange = async (info: UploadChangeParam) => {
    const { fileList: newFileList } = info;
    const latestFileList = newFileList.slice(-1); // Only allow one file
    setFileList(latestFileList);

    if (latestFileList.length > 0) {
      const file = latestFileList[0]?.originFileObj;

      if (file) {
        try {
          const base64String = await file2Base64(latestFileList[0]);
          form.setFieldsValue({ [formName]: base64String }); // Update form field
          onUpload?.(base64String); // Invoke the callback
        } catch (err) {
          console.error("Error converting file to base64:", err);
          message.error("Failed to upload the file.");
        }
      } else {
        message.error("Invalid file selected.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <Form.Item
        name={formName}
        valuePropName="src"
        getValueFromEvent={(e) => e && e.fileList}
      >
        {isLoading && (
          <Skeleton.Avatar
            active
            shape="square"
            size={96}
            style={{ borderRadius: "6px" }}
          />
        )}
        {!isLoading && (
          <Upload
            className={styles.upload}
            name="files"
            listType="picture"
            multiple={false}
            showUploadList={false}
            onChange={handleImageChange}
            fileList={fileList}
            beforeUpload={() => false} // Prevent automatic upload
            customRequest={() => {}}
          >
            <Avatar
              key={src}
              size={96}
              shape="square"
              src={src}
              alt={label}
              onError={() => {
                setError("Error loading image");
                return true;
              }}
              style={{
                zIndex: 1,
                cursor: "pointer",
                borderRadius: "6px",
                background:
                  error || !src ? getRandomColorFromString(label) : "none",
              }}
            >
              {
                <Typography.Text
                  style={{
                    fontSize: "50px",
                    position: "relative",
                    top: "-15px",
                  }}
                >
                  {label[0].toUpperCase()}
                </Typography.Text>
              }
            </Avatar>

            <div className={styles.overlayContainer}>
              {/* <div className={styles.overlayIconContainer}> */}
              <CloudUploadOutlined className={styles.overlayIcon} />
            </div>
            {/* </div> */}
          </Upload>
        )}
      </Form.Item>
    </div>
  );
};
