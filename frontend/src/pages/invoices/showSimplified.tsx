import { useModal, useShow } from "@refinedev/core";
import { FilePdfOutlined } from "@ant-design/icons";
import {
  Button,
  Modal,
} from "antd";
import { Show } from "@refinedev/antd";
import { API_URL } from "@/utils/constants";
import { useState } from "react";
import { PdfLayoutSimplified } from "../pdf/PdfLayoutSimplified";
import { useStyles } from "./show.styled";
import type { SimplifiedInvoice } from "@/types";

// This page shows a single simplified invoice using the shared ShowInvoice logic but points to the simplifiedinvoices resource.
export const ShowSimplifiedInvoice = () => {
  const { styles } = useStyles();

  const { query: queryResult } = useShow<SimplifiedInvoice>({
    resource: "simplifiedinvoices",
    meta: {
      populate: ["client", "account.logo", "account"],
    },
  });

  const [record, setRecord] = useState<SimplifiedInvoice>();

  const invoice = queryResult?.data?.data;
  const loading = queryResult?.isLoading;
  const logoUrl = invoice?.account?.logo
    ? `${API_URL}${invoice?.account?.logo}`
    : undefined;

  const { show, visible, close } = useModal();

  return (
    <>
      <Show
        title="Simplified Invoice"
        headerButtons={() => (
          <>
            <Button
              disabled={!invoice}
              icon={<FilePdfOutlined />}
              onClick={(event) => {
                event.stopPropagation();
                setRecord(invoice);
                show();
              }}
            >
              Preview PDF
            </Button>
          </>
        )}
        contentProps={{
          styles: {
            body: {
              padding: 0,
            },
          },
          style: {
            background: "transparent",
          },
        }}
      >
        {/* ...render simplified invoice details here... */}
      </Show>
      <Modal visible={visible} onCancel={close} width="80%" footer={null}>
        <PdfLayoutSimplified record={record} />
      </Modal>
    </>
  );
};
