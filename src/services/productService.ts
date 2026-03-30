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
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Product } from '../types';

const COLLECTION_NAME = 'products';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const subscribeToProducts = (callback: (products: Product[]) => void, category?: string, onError?: (error: any) => void) => {
  let q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  if (category && category !== 'All') {
    q = query(collection(db, COLLECTION_NAME), where('category', '==', category), orderBy('createdAt', 'desc'));
  }

  return onSnapshot(q, (querySnapshot) => {
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data({ serverTimestamps: 'estimate' })
    })) as Product[];
    callback(products);
  }, (error) => {
    console.error("Error subscribing to products:", error);
    if (onError) onError(error);
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
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
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
  }
};

export const addProduct = async (product: Omit<Product, 'id' | 'clicks' | 'createdAt'>) => {
  if (auth.currentUser?.email !== "muddassirbegfarid@gmail.com") {
    throw new Error("Unauthorized: Only the designated admin can add products.");
  }
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...product,
      clicks: 0,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, COLLECTION_NAME);
  }
};

export const updateProduct = async (id: string, product: Partial<Product>) => {
  if (auth.currentUser?.email !== "muddassirbegfarid@gmail.com") {
    // Note: trackClick and updateLastShownDates are allowed for public, 
    // but this function is specifically for admin updates.
    throw new Error("Unauthorized: Only the designated admin can update products.");
  }
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, product);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${id}`);
  }
};

export const deleteProduct = async (id: string) => {
  if (auth.currentUser?.email !== "muddassirbegfarid@gmail.com") {
    throw new Error("Unauthorized: Only the designated admin can delete products.");
  }
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
  }
};

export const trackClick = async (id: string) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      clicks: increment(1),
      lastClickedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error tracking click:", error);
    // Don't throw, we still want to redirect the user
  }
};

export const updateLastShownDates = async (ids: string[]) => {
  try {
    const batch = writeBatch(db);
    ids.forEach(id => {
      const docRef = doc(db, COLLECTION_NAME, id);
      batch.update(docRef, { lastShownDate: serverTimestamp() });
    });
    await batch.commit();
  } catch (error) {
    console.error("Error updating lastShownDates:", error);
  }
};
