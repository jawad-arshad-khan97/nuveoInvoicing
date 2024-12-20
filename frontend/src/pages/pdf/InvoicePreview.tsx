import React from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePdf";

export const InvoicePreview = ({ invoiceData }: { invoiceData: any }) => {
  return (
    <div>
      {/* PDF Viewer */}
      <PDFViewer style={{ width: "100%", height: "500px" }}>
        <InvoicePDF data={invoiceData} />
      </PDFViewer>

      {/* Download Link */}
      <PDFDownloadLink
        document={<InvoicePDF data={invoiceData} />}
        fileName="invoice.pdf"
      >
        "Download Invoice PDF"
      </PDFDownloadLink>
    </div>
  );
};

export default InvoicePreview;
