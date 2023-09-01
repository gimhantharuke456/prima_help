// ProductService.js
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  where,
} from "firebase/firestore";

class ProductService {
  constructor(db) {
    this.db = db;
    this.productsCollection = collection(this.db, "products");
  }

  async addProduct(productData) {
    try {
      const docRef = await addDoc(this.productsCollection, productData);
      return docRef.id;
    } catch (error) {
      throw error;
    }
  }

  async getAllProducts() {
    try {
      const querySnapshot = await getDocs(this.productsCollection);
      const products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return products;
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(productId, newData) {
    try {
      const productRef = doc(this.db, "products", productId);
      await updateDoc(productRef, newData);
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(productId) {
    try {
      const productRef = doc(this.db, "products", productId);
      await deleteDoc(productRef);
      const q = query(
        collection(this.db, "inventory"),
        where("productId", "==", productId)
      );
      const entries = await getDocs(q);
      entries.forEach(async (entry) => {
        const entryDoc = doc(this.db, "inventory", entry.id);
        await deleteDoc(entryDoc);
      });
    } catch (error) {
      throw error;
    }
  }
  async updateProductQuantity(productId, newQuantity) {
    const productRef = doc(this.db, "products", productId);

    try {
      const productSnapshot = await getDoc(productRef);
      if (productSnapshot.exists()) {
        const currentQuantity = productSnapshot.data().instock_amount;
        const updatedQuantity = currentQuantity - newQuantity;

        await updateDoc(productRef, { instock_amount: updatedQuantity });

        console.log("Product quantity updated successfully");
      } else {
        console.log("Product not found");
      }
    } catch (error) {
      console.error("Error updating product quantity:", error);
    }
  }
}

export default ProductService;
