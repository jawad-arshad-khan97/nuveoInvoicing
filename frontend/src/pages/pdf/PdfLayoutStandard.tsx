import React from "react";
import type { StandardInvoice } from "@/types";

interface PdfLayoutStandardProps {
  record?: StandardInvoice;
}

export const PdfLayoutStandard: React.FC<PdfLayoutStandardProps> = ({ record }) => {
  if (!record) return null;
  return (
    <div>
      <h2>Standard Invoice PDF</h2>
      <div>ID: {record.id}</div>
      <div>Name: {record.invoice_name}</div>
      <div>Date: {record.invoiceDate}</div>
      <div>Subtotal: {record.subtotal}</div>
      <div>Discount: {record.discount}</div>
      <div>Tax: {record.tax}</div>
      <div>Total: {record.total}</div>
      <div>Client: {record.client?.client_name}</div>
      <div>Account: {record.account?.account_name}</div>
      <div>Note: {record.note}</div>
      <div>Currency: {record.currency}</div>
      <div>Status: {record.status}</div>
      {/* Add more fields as needed */}
    </div>
  );
};
