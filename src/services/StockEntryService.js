// StockEntryService.js
import { collection, addDoc, getDocs, doc, orderBy } from "firebase/firestore";

class StockEntryService {
  constructor(db) {
    this.db = db;
    this.stockEntriesCollection = collection(this.db, "stockEntries");
  }

  async addStockEntry(stockEntryData) {
    try {
      const docRef = await addDoc(this.stockEntriesCollection, stockEntryData);
      return docRef.id;
    } catch (error) {
      throw error;
    }
  }

  async getStockEntries(productId) {
    try {
      const querySnapshot = await getDocs(
        collection(this.stockEntriesCollection, productId, "entries"),
        orderBy("timestamp", "desc")
      );
      const stockEntries = querySnapshot.docs.map((doc) => doc.data());
      return stockEntries;
    } catch (error) {
      throw error;
    }
  }
}

export default StockEntryService;
