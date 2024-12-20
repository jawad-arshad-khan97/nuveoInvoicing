// pdfGenerator.js
import fs from "fs";
import PDFDocument from "pdfkit";
import xml2js from "xml2js";
import zatcaSchema from "./schema.js";

const generatePDF = (invoiceData) => {
  const doc = new PDFDocument();
  const xmlBuilder = new xml2js.Builder();

  const dummyInvoiceData = {
    invoiceNumber: "INV-20240001",
    invoiceDate: "2024-03-29",
    supplierName: "My Company Ltd.",
    supplierAddress: {
      street: "123 Main Street",
      city: "Anytown",
      postalCode: "12345",
    },
    supplierTaxID: "1234567890",
    customerName: "Customer Company",
    customerAddress: {
      street: "456 Elm Street",
      city: "Big City",
      postalCode: "54321",
    },
    taxAmount: "10.00",
    taxRate: "0.15",
    paymentDueDate: "2024-04-29",
    invoiceLineId: "1",
    quantity: "2",
    lineExtensionAmount: "20.00",
    itemName: "Product A",
    unitPrice: "10.00",
  };

  // Build XML data based on zatcaSchema and invoiceData
  const xmlData = xmlBuilder.buildObject({
    "xsd:schema": {
      "@xmlns": "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2",
      "@xmlns:cac":
        "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
      "@xmlns:cbc":
        "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
      "@xmlns:ext":
        "urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2",
      "@xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
      "@xmlns:ccts": "urn:un:unece:uncefact:documentation:2",
      "@targetNamespace":
        "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2",
      "@elementFormDefault": "qualified",
      "@attributeFormDefault": "unqualified",
      "@version": "2.1",
      "xsd:element": {
        "@name": "Invoice",
        "@type": "InvoiceType",
        "xsd:annotation": {
          "xsd:documentation":
            "This element MUST be conveyed as the root element in any instance document based on this Schema expression",
        },
      },
      "xsd:complexType": {
        "@name": "InvoiceType",
        "xsd:annotation": {
          "xsd:documentation": {
            "ccts:Component": {
              "ccts:ComponentType": "ABIE",
              "ccts:DictionaryEntryName": "Invoice. Details",
              "ccts:Definition": "A document used to request payment.",
              "ccts:ObjectClass": "Invoice",
            },
          },
        },
        "xsd:sequence": {
          "xsd:element": [
            {
              "@ref": "ext:UBLExtensions",
              "@minOccurs": "0",
              "@maxOccurs": "1",
              "xsd:annotation": {
                "xsd:documentation":
                  "A container for all extensions present in the document.",
              },
            },
            {
              "@ref": "cbc:UBLVersionID",
              "@minOccurs": "0",
              "@maxOccurs": "1",
              "xsd:annotation": {
                "xsd:documentation": {
                  "ccts:Component": {
                    "ccts:ComponentType": "BBIE",
                    "ccts:DictionaryEntryName":
                      "Invoice. UBL Version Identifier. Identifier",
                    "ccts:Definition":
                      "Identifies the earliest version of the UBL 2 schema for this document type that defines all of the elements that might be encountered in the current instance.",
                    "ccts:Cardinality": "0..1",
                    "ccts:ObjectClass": "Invoice",
                    "ccts:PropertyTerm": "UBL Version Identifier",
                    "ccts:RepresentationTerm": "Identifier",
                    "ccts:DataType": "Identifier. Type",
                    "ccts:Examples": "2.0.5",
                  },
                },
              },
            },
            // Add other elements based on the ZATCA schema structure
            // Follow the structure provided in the ZATCA schema
          ],
        },
      },
    },
  });

  // Embed XML into PDF
  doc.text("Embedded XML:", 50, 50);
  doc.text(xmlData, 50, 70);

  // Save PDF to a file
  doc.pipe(fs.createWriteStream("invoice.pdf"));
  doc.end();
};

export default generatePDF;
