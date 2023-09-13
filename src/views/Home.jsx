import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, Alert } from "@mui/material";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useProductsContext } from "../store/product_store";
import { useLoading } from "../store/loading_store";
import ProductService from "../services/ProductService";
import { db } from "../firebaseConfig";
import { useInventoryContext } from "../store/inventory_store";
ChartJS.register(ArcElement, Tooltip, Legend);
const Home = () => {
  const productsService = new ProductService(db);
  const { productState, productDispatch } = useProductsContext();
  const { inventoryState } = useInventoryContext();
  const { loadingDispatch } = useLoading();

  const [productsOutOfStock, setProductsOutOfStock] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Products",
        data: [],
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
    options: {
      plugins: {
        legend: {
          display: false, // This will hide the legend (titles)
        },
      },
    },
  });
  useEffect(() => {
    if (productState.products.length == 0) {
      loadingDispatch({
        type: "SET_LOADING",
      });
      productsService
        .getAllProducts()
        .then((res) => {
          productDispatch({
            type: "GET_PRODUCTS",
            payload: {
              products: res,
            },
          });
          let names = [];
          let values = [];
          productState.products.forEach((product) => {
            names.push(product.name);
            values.push(product.instock_amount);
          });

          setChartData({
            labels: names,
            datasets: [
              {
                label: "Products",
                data: values,
                backgroundColor: "rgba(75,192,192,0.8)",
                borderColor: "rgba(75,192,192,1)",
                borderWidth: 1,
              },
            ],
            options: {
              plugins: {
                legend: {
                  display: false,
                },
              },
            },
          });
        })
        .catch((err) => {
          setErrorFun(`${err}`);
        });
      loadingDispatch({
        type: "SET_NOT_LOADING",
      });
    } else {
      let names = [];
      let values = [];
      productState.products.forEach((product) => {
        names.push(product.name);
        values.push(product.instock_amount);
      });
      setChartData({
        labels: names,
        datasets: [
          {
            label: "Products",
            data: values,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderWidth: 1,
          },
        ],
      });
    }
  }, []);
  useEffect(() => {
    const threshold = 10;
    const productsSoonOutOfStock = productState.products.filter(
      (product) => product.instock_amount <= threshold
    );
    productsSoonOutOfStock.sort((a, b) => a.instock_amount - b.instock_amount);
    const topTwoProducts = productsSoonOutOfStock.slice(0, 2);
    setProductsOutOfStock(topTwoProducts);
    console.log(productsOutOfStock);
  }, [productState.products]);
  useEffect(() => {
    const calculateBestSellingProducts = () => {
      const productSales = {}; // Object to store total sales quantity per product

      // Calculate total sales quantity for each product
      inventoryState.entries.forEach((entry) => {
        if (productSales[entry.productId]) {
          productSales[entry.productId] += entry.quantity;
        } else {
          productSales[entry.productId] = entry.quantity;
        }
      });

      // Convert productSales object to an array of objects
      const productSalesArray = Object.entries(productSales).map(
        ([productId, totalSales]) => ({
          productId,
          totalSales,
        })
      );

      // Sort products by total sales in descending order
      productSalesArray.sort((a, b) => b.totalSales - a.totalSales);

      const topBestSellingProducts = productSalesArray.slice(0, 2);

      const bestSellingProductDetails = topBestSellingProducts.map(
        (productSale) => {
          const product = productState.products.find(
            (p) => p.id === productSale.productId
          );
          return {
            ...product,
            totalSales: productSale.totalSales,
          };
        }
      );

      setBestSellingProducts(bestSellingProductDetails);
    };

    calculateBestSellingProducts();
  }, [productState.products, inventoryState.entries]);
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Product Stocks
              </Typography>
              <Doughnut
                data={chartData}
                options={{
                  plugins: {
                    legend: false,
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Going to out of stock soon
              </Typography>
              <div>
                <Card>
                  <CardContent>
                    {productsOutOfStock.map((product) => (
                      <Alert
                        severity="warning"
                        key={product.id}
                        sx={{ marginBottom: 2 }}
                      >
                        {`${product.name} - In stock: ${product.instock_amount}`}
                      </Alert>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
          <Card sx={{ marginTop: 8 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Best selling items
              </Typography>
              <div>
                <Card>
                  <CardContent>
                    {bestSellingProducts.map((product) => (
                      <Alert key={product.id} sx={{ marginBottom: 2 }}>
                        {`${product.name} - Total Sales: ${product.totalSales}`}
                      </Alert>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
