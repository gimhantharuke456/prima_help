// InventoryService.js
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  setDoc,
  query,
  deleteDoc,
} from "firebase/firestore";
import { useProductsContext } from "../store/product_store";

class InventoryService {
  constructor(db) {
    this.db = db;
    this.inventoryCollection = collection(this.db, "inventory");
  }

  async addInventory(inventory) {
    try {
      const docRef = doc(
        this.inventoryCollection,
        `${inventory.productId}-${inventory.date}`
      );
      await setDoc(docRef, inventory);
    } catch (error) {
      throw error;
    }
  }

  async updateInventory(productId, newStock) {
    try {
      const inventoryRef = doc(this.inventoryCollection, productId);
      await updateDoc(inventoryRef, { stock: newStock });
    } catch (error) {
      throw error;
    }
  }

  async getInventory(productId) {
    try {
      const inventoryRef = doc(this.inventoryCollection, productId);
      const inventorySnapshot = await getDocs(inventoryRef);
      if (!inventorySnapshot.empty) {
        const inventoryData = inventorySnapshot.docs[0].data();
        return inventoryData;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
  async getInventories() {
    const snap = await getDocs(this.inventoryCollection);
    const entries = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return entries;
  }
  async deleteInventies(id) {
    const productRef = doc(this.db, "inventory", id);
    await deleteDoc(productRef);
  }
}

export default InventoryService;
