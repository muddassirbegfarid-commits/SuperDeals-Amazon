import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy, 
  increment,
  serverTimestamp,
  where,
  getDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';

const COLLECTION_NAME = 'products';

export const subscribeToProducts = (callback: (products: Product[]) => void, category?: string) => {
  let q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  if (category && category !== 'All') {
    q = query(collection(db, COLLECTION_NAME), where('category', '==', category), orderBy('createdAt', 'desc'));
  }

  return onSnapshot(q, (querySnapshot) => {
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
    callback(products);
  }, (error) => {
    console.error("Error subscribing to products:", error);
  });
};

export const getProducts = async (category?: string) => {
  try {
    let q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    if (category && category !== 'All') {
      q = query(collection(db, COLLECTION_NAME), where('category', '==', category), orderBy('createdAt', 'desc'));
    }
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const addProduct = async (product: Omit<Product, 'id' | 'clicks' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...product,
      clicks: 0,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

export const updateProduct = async (id: string, product: Partial<Product>) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, product);
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const trackClick = async (id: string) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      clicks: increment(1)
    });
  } catch (error) {
    console.error("Error tracking click:", error);
    // Don't throw, we still want to redirect the user
  }
};
