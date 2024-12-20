// import zatcaSchema from "./schema.js";

// const mapInvoiceDataToZATCA = async (invoiceData) => {
//   try {
//     if (!invoiceData) {
//       throw new Error("Invalid invoice data");
//     }

//     const mappedData = {
//       ...zatcaSchema["cac:UBLDocuments"],
//       // "cbc:ID": invoiceData.invoiceNumber,
//       "cbc:IssueDate": invoiceData.invoiceDate,
//       // Map other invoice data fields here
//       "cac:AccountingSupplierParty": {
//         ...zatcaSchema["cac:UBLDocuments"]["cac:AccountingSupplierParty"],
//         "cbc:PartyName": invoiceData.supplierName,
//         "cac:PostalAddress": {
//           ...zatcaSchema["cac:UBLDocuments"]["cac:AccountingSupplierParty"][
//             "cac:PostalAddress"
//           ],
//           "cbc:StreetName": invoiceData.supplierAddress.street,
//           "cbc:CityName": invoiceData.supplierAddress.city,
//           "cbc:PostalZone": invoiceData.supplierAddress.postalCode,
//           "cbc:TaxRegistrationID": invoiceData.supplierTaxID,
//         },
//       },
//       "cac:AccountingCustomerParty": {
//         ...zatcaSchema["cac:UBLDocuments"]["cac:AccountingCustomerParty"],
//         "cbc:PartyName": invoiceData.customerName,
//         "cac:PostalAddress": {
//           ...zatcaSchema["cac:UBLDocuments"]["cac:AccountingCustomerParty"][
//             "cac:PostalAddress"
//           ],
//           "cbc:StreetName": invoiceData.customerAddress.street,
//           "cbc:CityName": invoiceData.customerAddress.city,
//           "cbc:PostalZone": invoiceData.customerAddress.postalCode,
//         },
//       },
//       "cac:TaxTotal": {
//         ...zatcaSchema["cac:UBLDocuments"]["cac:TaxTotal"],
//         "cbc:TaxAmount": invoiceData.taxAmount,
//         "cac:Tax": {
//           ...zatcaSchema["cac:UBLDocuments"]["cac:TaxTotal"]["cac:Tax"],
//           "cbc:TaxRate": invoiceData.taxRate,
//           "cbc:TaxAmount": invoiceData.taxAmount,
//         },
//       },
//       "cac:PaymentTerms": {
//         ...zatcaSchema["cac:UBLDocuments"]["cac:PaymentTerms"],
//         "cbc:PaymentDueDate": invoiceData.paymentDueDate,
//       },
//       "cac:InvoiceLine": {
//         ...zatcaSchema["cac:UBLDocuments"]["cac:InvoiceLine"],
//         "cbc:ID": invoiceData.invoiceLineId,
//         "cbc:InvoicedQuantity": invoiceData.quantity,
//         "cbc:LineExtensionAmount": invoiceData.lineExtensionAmount,
//         "cac:Item": {
//           ...zatcaSchema["cac:UBLDocuments"]["cac:InvoiceLine"]["cac:Item"],
//           "cbc:Name": invoiceData.itemName,
//           "cbc:UnitPriceAmount": invoiceData.unitPrice,
//         },
//       },
//     };

//     return { "cac:UBLDocuments": mappedData };
//   } catch (error) {
//     console.error("Error mapping invoice data to ZATCA schema:", error);
//     throw error; // Re-throw the error for handling in the calling code
//   }
// };

// export default mapInvoiceDataToZATCA;
