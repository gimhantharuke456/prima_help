// ProductService.js
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
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
    } catch (error) {
      throw error;
    }
  }
}

export default ProductService;
