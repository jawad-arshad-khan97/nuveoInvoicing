import { getDefaultFilter, useGo, useModal } from "@refinedev/core";
import {
  CreateButton,
  List,
  useTable,
} from "@refinedev/antd";
import { Table, Modal } from "antd";
import { useState } from "react";
import type { StandardInvoice } from "@/types";
import { PdfLayoutStandard } from "../pdf/PdfLayoutStandard";

export const ListStandardInvoices = () => {
  const [record, setRecord] = useState<StandardInvoice | undefined>();
  const go = useGo();
  const { tableProps } = useTable<StandardInvoice>({
    resource: "standardinvoices",
    sorters: {
      initial: [{ field: "invoiceDate", order: "desc" }],
    },
  });
  const { show, visible, close } = useModal();

  return (
    <>
      <List
        title="Standard Invoices"
        headerButtons={() => (
          <CreateButton
            size="large"
            onClick={() => go({ to: "/standardinvoices/new" })}
          >
            Add new invoice
          </CreateButton>
        )}
      >
        <Table {...tableProps} rowKey={"id"}>
          <Table.Column title="ID" dataIndex="id" key="id" />
          <Table.Column title="Invoice Number" dataIndex="invoiceNumber" key="invoiceNumber" />
          <Table.Column title="Invoice Date" dataIndex="invoiceDate" key="invoiceDate" />
          <Table.Column title="Seller Name" dataIndex="sellerName" key="sellerName" />
          <Table.Column title="Buyer Name" dataIndex="buyerName" key="buyerName" />
          <Table.Column title="Total" dataIndex="total" key="total" />
          <Table.Column
            title="Actions"
            key="actions"
            render={(_, rec) => (
              <>
                <a onClick={() => go({ to: `/standardinvoices/show/${rec.id}` })}>Show</a> |{' '}
                <a onClick={() => go({ to: `/standardinvoices/edit/${rec.id}` })}>Edit</a> |{' '}
                <a onClick={() => { setRecord(rec as StandardInvoice); show(); }}>PDF</a>
              </>
            )}
          />
        </Table>
      </List>
      <Modal
        open={visible}
        onCancel={close}
        footer={null}
        width={900}
        title="Standard Invoice PDF Preview"
      >
        {record && <PdfLayoutStandard record={record} />}
      </Modal>
    </>
  );
};
