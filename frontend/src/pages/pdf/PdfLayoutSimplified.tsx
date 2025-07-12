import React from "react";
import type { SimplifiedInvoice } from "@/types";

interface PdfLayoutSimplifiedProps {
  record?: SimplifiedInvoice;
}

export const PdfLayoutSimplified: React.FC<PdfLayoutSimplifiedProps> = ({ record }) => {
  if (!record) return null;
  return (
    <div>
      <h2>Simplified Invoice PDF</h2>
      <div>ID: {record.id}</div>
      <div>Name: {record.invoice_name}</div>
      <div>Date: {record.invoiceDate}</div>
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
