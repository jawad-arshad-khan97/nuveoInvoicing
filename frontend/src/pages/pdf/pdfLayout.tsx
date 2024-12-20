import {
  Document,
  Image,
  Page,
  StyleSheet,
  View,
  Text,
  PDFViewer,
} from "@react-pdf/renderer";

import { Invoice } from "../../types/index";
const API_URL = import.meta.env.VITE_BACKEND_SERVER_URL;

type PdfProps = {
  record: Invoice | undefined;
};

export const PdfLayout: React.FC<PdfProps> = ({ record }) => {
  const subtotal =
    record?.services?.reduce((prev, cur) => {
      return prev + cur?.quantity * cur?.unitPrice;
    }, 0) ?? 0;

  console.log(record?.account?.logo);

  const logoUrl = record?.account?.logo
    ? `${API_URL}${record?.account?.logo}`
    : undefined;

  return (
    <PDFViewer style={styles.viewer}>
      <Document>
        <Page style={styles.page} size="A4">
          <View>
            <Image
              src={API_URL + "/api/v1" + record?.account?.logo}
              style={{ width: "70px", height: "auto" }}
            />
            <View style={styles.inoviceTextNumberContainer}>
              <Text style={styles.inoviceText}>
                {`Invoice: ${record?.id}${record?.name}`}
              </Text>
              <Text
                style={styles.inoviceId}
              >{`Invoice ID: INVOICE_#${record?.id}`}</Text>
            </View>
          </View>
          <View style={styles.divider} />

          <View style={styles.inoviceForFromContainer}>
            <View>
              <Text style={styles.inoviceForFromTitle}>From:</Text>
              <View>
                <Text style={styles.inoviceForFromText}>
                  {record?.account?.company_name}
                </Text>
                <Text style={styles.inoviceForFromText}>
                  {record?.account?.address}, {record?.account?.country}
                </Text>
              </View>
            </View>

            <View>
              <Text style={styles.inoviceForFromTitle}>Inovice For:</Text>
              <View>
                <Text style={styles.inoviceForFromText}>
                  {record?.client?.name}
                </Text>
                {/* <Text style={styles.inoviceForFromText}>
                  {record?.client?.first_name}
                </Text>
                <Text style={styles.inoviceForFromText}>
                  {record?.client?.last_name}
                </Text> */}
                <Text style={styles.inoviceForFromText}>
                  {record?.client?.address}
                </Text>
              </View>
              <View>
                <Text
                  style={styles.inoviceForFromText}
                >{`Invoice ID: ${record?.id}`}</Text>
                <Text
                  style={styles.inoviceForFromText}
                >{`Invoice Custom ID: ${record?.custom_id}`}</Text>
                <Text
                  style={styles.inoviceForFromText}
                >{`Invoice Date: ${record?.invoiceDate}`}</Text>
              </View>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderItem, { width: "20%" }]}>
                Services/Product
              </Text>
              <Text style={[styles.tableHeaderItem, { width: "20%" }]}>
                Quantity
              </Text>
              <Text style={[styles.tableHeaderItem, { width: "20%" }]}>
                Price PerItem
              </Text>
              <Text style={[styles.tableHeaderItem, { width: "20%" }]}>
                Discount
              </Text>
              <Text style={[styles.tableHeaderItem, { width: "20%" }]}>
                Total
              </Text>
            </View>
            {record?.services.map((item, index) => {
              return (
                <View
                  key={item.title}
                  style={[
                    styles.tableRow,
                    ...(index % 2 === 1 ? [styles.alternateRow] : []),
                  ]}
                >
                  <Text style={[styles.tableCol, { width: "20%" }]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.tableCol, { width: "20%" }]}>
                    {item?.unitPrice}
                  </Text>
                  <Text style={[styles.tableCol, { width: "20%" }]}>
                    {item?.quantity}
                  </Text>
                  <Text style={[styles.tableCol, { width: "20%" }]}>
                    {item?.discount}
                  </Text>
                  <Text style={[styles.tableCol, { width: "20%" }]}>
                    {item?.totalPrice}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={styles.signatureTotalContainer}>
            <View style={styles.signatureContainer}>
              <Text style={styles.signatureText}>
                Signature: ________________
              </Text>
              <Text style={styles.signatureText}>
                Date: {record?.invoiceDate.toString()}
              </Text>
            </View>

            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>SUBTOTAL: {record?.subTotal}</Text>
              <Text style={styles.totalText}>
                Discount(%): {record?.discount}
              </Text>
              <Text style={styles.totalText}>Tax(%): {record?.tax}</Text>
              <Text style={styles.totalText}>Total($): {record?.total}</Text>
            </View>
          </View>
          <View style={styles.footer}>
            {/* <Text style={styles.footerText}>{record?.account?.city}</Text> */}
            <Text style={styles.footerText}>
              {record?.account.address}, {record?.account.country}
            </Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

const styles = StyleSheet.create({
  viewer: {
    paddingTop: 32,
    width: "100%",
    height: "80vh",
    border: "none",
  },
  page: {
    padding: "0.5in",
    fontSize: 10,
    color: "#333",
    backgroundColor: "#f9f9f9", // Light background for a polished look
    fontFamily: "Helvetica",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: "auto",
  },
  headerDetails: {
    textAlign: "right",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  inoviceTextNumberContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  inoviceText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  inoviceId: {
    fontSize: 10,
    color: "#555",
  },
  inoviceForFromContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  inoviceForFromTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  inoviceForFromText: {
    fontSize: 10,
    color: "#555",
    marginBottom: 2,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 10,
  },
  table: {
    marginTop: 20,
    border: "1px solid #000",
    borderRadius: 3,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#b9b9b9",
    paddingVertical: 5,
    // borderBottom: "1px solid #ddd",
  },
  tableHeaderItem: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    padding: 5,
    flex: 1,
  },
  tableRow: {
    flexDirection: "row",
    // borderBottom: "1px solid #ddd",
  },
  tableCol: {
    fontSize: 10,
    textAlign: "center",
    padding: 5,
    flex: 1,
  },
  alternateRow: {
    backgroundColor: "#d9d9d9",
  },
  signatureTotalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  signatureContainer: {
    flex: 1,
  },
  totalContainer: {
    flex: 1,
    textAlign: "right",
  },
  signatureText: {
    fontSize: 10,
    color: "#333",
    marginBottom: 5,
  },
  totalText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  footer: {
    borderTop: "1px solid #ddd",
    marginTop: 30,
    paddingTop: 10,
    textAlign: "center",
  },
  footerText: {
    fontSize: 10,
    color: "#777",
  },
});
