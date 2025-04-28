import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';

export interface PaymentRecord {
  userId: string;
  toolId: string;
  amount: number;
  status: 'completed' | 'failed' | 'refunded';
  sessionId: string;
  timestamp: Timestamp;
  expiresAt: Timestamp;
}

export async function createPaymentRecord(paymentData: Omit<PaymentRecord, 'timestamp'>) {
  try {
    const paymentRef = collection(db, 'payments');
    const paymentRecord = {
      ...paymentData,
      timestamp: Timestamp.now()
    };
    await addDoc(paymentRef, paymentRecord);
    return true;
  } catch (error) {
    console.error('Error creating payment record:', error);
    return false;
  }
}

export async function checkUserAccess(userId: string, toolId: string): Promise<boolean> {
  try {
    const paymentsRef = collection(db, 'payments');
    const q = query(
      paymentsRef,
      where('userId', '==', userId),
      where('toolId', '==', toolId),
      where('status', '==', 'completed'),
      where('expiresAt', '>', Timestamp.now())
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking user access:', error);
    return false;
  }
} 