import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { Service } from "@/types";

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 12,
    lineHeight: 1.5,
  },
  header: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    flex: 1,
    textAlign: "center",
    padding: 5,
  },
  tableHeader: {
    backgroundColor: "#f3f3f3",
    fontWeight: "bold",
  },
});

// Create PDF component
export const InvoicePdf = ({ data }: { data: any }) => {
  const { account, client, services, subtotal, tax, total } = data;

  return (
    <Document>
      <Page style={styles.page}>
        {/* Header */}
        <Text style={styles.header}>Invoice</Text>

        {/* Account and Client Information */}
        <View style={styles.section}>
          <Text>Account: {account}</Text>
          <Text>Client: {client}</Text>
          <Text>Date: {new Date().toLocaleDateString()}</Text>
        </View>

        {/* Services Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCol}>Title</Text>
            <Text style={styles.tableCol}>Unit Price</Text>
            <Text style={styles.tableCol}>Quantity</Text>
            <Text style={styles.tableCol}>Discount</Text>
            <Text style={styles.tableCol}>Total Price</Text>
          </View>

          {/* Table Rows */}
          {services.map((service: Service, index: number) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCol}>{service.title}</Text>
              <Text style={styles.tableCol}>
                ${service.unitPrice.toFixed(2)}
              </Text>
              <Text style={styles.tableCol}>{service.quantity}</Text>
              <Text style={styles.tableCol}>{service.discount}%</Text>
              <Text style={styles.tableCol}>
                ${service.totalPrice.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Subtotal, Tax, and Total */}
        <View style={styles.section}>
          <Text>Subtotal: ${subtotal.toFixed(2)}</Text>
          <Text>Sales Tax: {tax}%</Text>
          <Text>Total: ${total.toFixed(2)}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePdf;
