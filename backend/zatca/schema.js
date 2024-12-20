// schema.js

const zatcaSchema = {
  UBLDocuments: {
    "@xmlns:cac":
      "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
    "@xmlns:cbc":
      "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
    "cbc:UBLVersionID": "2.1",
    "cbc:ID": "",
    "cbc:IssueDate": "",
    "cac:AccountingSupplierParty": {
      "cbc:PartyName": "",
      "cac:PostalAddress": {
        "cbc:StreetName": "",
        "cbc:CityName": "",
        "cbc:CountryName": "Saudi Arabia",
        "cbc:PostalZone": "",
      },
      "cbc:TaxRegistrationID": "",
    },
    "cac:AccountingCustomerParty": {
      "cbc:PartyName": "",
      "cac:PostalAddress": {
        "cbc:StreetName": "",
        "cbc:CityName": "",
        "cbc:CountryName": "Saudi Arabia",
        "cbc:PostalZone": "",
      },
    },
    "cac:TaxTotal": {
      "cbc:TaxAmount": "",
      "cac:Tax": {
        "cbc:TaxName": "VAT",
        "cbc:TaxRate": "",
        "cbc:TaxAmount": "",
      },
    },
    "cac:PaymentTerms": {
      "cbc:PaymentDueDate": "",
    },
    "cac:InvoiceLine": {
      "cbc:ID": "",
      "cbc:InvoicedQuantity": "",
      "cbc:LineExtensionAmount": "",
      "cac:Item": {
        "cbc:Name": "",
        "cbc:UnitPriceAmount": "",
      },
    },
  },
};

export default zatcaSchema;
