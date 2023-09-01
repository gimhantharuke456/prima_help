import React from "react";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { dateFormatter } from "../services/date_formatter";

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  date: {
    fontSize: 10,
  },
  page: {
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    padding: 20,
  },
  tableContainer: {
    width: "100%",
    marginVertical: 10,
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: { flexDirection: "row" },
  tableColHeader: {
    width: "50%",
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    backgroundColor: "#f0f0f0",
    padding: 8,
    fontSize: 12,
  },
  tableCol: {
    width: "50%",
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    padding: 8,
    fontSize: 12,
  },
});

const ProductPDF = ({ products, title, date }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{dateFormatter(date)}</Text>
      </View>
      <View style={styles.tableContainer}>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Item Name</Text>
            <Text style={styles.tableColHeader}>In Stock Amount</Text>
          </View>
          {products.map((product, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCol}>{product.name}</Text>
              <Text style={styles.tableCol}>{product.instock_amount}</Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

export default ProductPDF;
