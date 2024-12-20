import express from "express";
import Invoice from "../mongodb/models/invoice.js";
import generatePDF from "./pdfGenerator.js";
import generateZatcaXML from "./zatcaGen.js";
// import zatcaSchema from "./schema.js";
// import jsUBL from "js-UBL";
// import pdf from "html-pdf-node";

// Import your XML parsing library
import xml2js from "xml2js";

// Import your data mapping function (mapInvoiceDataToZATCA)
// import mapInvoiceDataToZATCA from "./invoiceDataMapper.js"; // Adjust the path accordingly

const router = express.Router();
// API endpoint for invoice generation
router.post("/", async (req, res) => {
  try {
    const id = req.body.invoiceId;
    // 1. Retrieve invoice data from the database (replace with your data fetching logic)
    const invoiceData = await Invoice.findOne({
      _id: id,
    }).populate("items");

    generateZatcaXML();

    // 2. Generate ZATCA compliant XML
    // const mappedData = mapInvoiceDataToZATCA(invoiceData);
    // const builder = new xml2js.Builder();
    // const xmlString = builder.buildObject(mappedData);

    // 3. Further processing (e.g., PDF generation, ZATCA API submission in later steps)
    // ...

    res.status(200).json(); // Response for clarity
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate XML" });
  }
});

// ... other backend routes

export default router;
