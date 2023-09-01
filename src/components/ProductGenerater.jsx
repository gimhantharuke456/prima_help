import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import ProductPDF from "./ProductPdf";

const PDFGenerator = ({ products, title, date }) => (
  <PDFViewer style={{ width: "100%", height: "100vh" }}>
    <ProductPDF products={products} title={title} date={date} />
  </PDFViewer>
);

export default PDFGenerator;
