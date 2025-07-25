import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function GET() {
  try {
    // Test Firestore connection
    const testData = {
      message: 'Firebase connection test',
      timestamp: serverTimestamp(),
      environment: process.env.NODE_ENV,
    };

    const docRef = await addDoc(collection(db, 'test'), testData);
    
    return NextResponse.json({
      success: true,
      message: 'Firebase connected successfully!',
      docId: docRef.id,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  } catch (error) {
    console.error('Firebase connection error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}