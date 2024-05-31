import { NextApiRequest, NextApiResponse } from 'next';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';
import { NextResponse } from 'next/server';

export async function GET(res: NextApiResponse) {
  try {
    const folders: string[] = [];
    const querySnapshot = await getDocs(collection(db, 'events'));
    querySnapshot.forEach((doc) => {
      folders.push(doc.id);
    });
    return NextResponse.json({ folders });
  } catch (error) {
    console.error('Error fetching folders:', error);
    return NextResponse.json({ error: 'Failed to fetch folders' });
  }
}
