import { getDefaultFilter, useGo, useModal } from "@refinedev/core";
import {
  CreateButton,
  List,
  useTable,
} from "@refinedev/antd";
import { Table, Modal } from "antd";
import { useState } from "react";
import type { SimplifiedInvoice } from "@/types";
import { PdfLayoutSimplified } from "../pdf/PdfLayoutSimplified";

export const ListSimplifiedInvoices = () => {
  const [record, setRecord] = useState<SimplifiedInvoice | undefined>();
  const go = useGo();
  const { tableProps } = useTable<SimplifiedInvoice>({
    resource: "simplifiedinvoices",
    sorters: {
      initial: [{ field: "invoiceDate", order: "desc" }],
    },
  });
  const { show, visible, close } = useModal();

  return (
    <>
      <List
        title="Simplified Invoices"
        headerButtons={() => (
          <CreateButton
            size="large"
            onClick={() => go({ to: "/simplifiedinvoices/new" })}
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
                <a onClick={() => go({ to: `/simplifiedinvoices/show/${rec.id}` })}>Show</a> |{' '}
                <a onClick={() => go({ to: `/simplifiedinvoices/edit/${rec.id}` })}>Edit</a> |{' '}
                <a onClick={() => { setRecord(rec as SimplifiedInvoice); show(); }}>PDF</a>
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
        title="Simplified Invoice PDF Preview"
      >
        {record && <PdfLayoutSimplified record={record} />}
      </Modal>
    </>
  );
};
