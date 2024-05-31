import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../lib/firebaseAdmin';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';


/* get posts from firestore */
export async function GET(req: NextRequest) {
  const { uid } = await req.json();

    try {
        const posts = await getDocs(collection(db, "posts"));
        return NextResponse.json(posts.docs.map(doc => doc.data()));
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
