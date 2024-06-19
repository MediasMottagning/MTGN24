import { NextRequest, NextResponse } from 'next/server';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';
import { auth } from '../../lib/firebaseAdmin';

/* API endpoint for fetching posts */
export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }
    // extract the user from the auth token
    const idToken = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await auth.verifyIdToken(idToken);

        if (!decodedToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const postRef = await getDocs(collection(db, 'posts'));
        const posts = postRef.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return NextResponse.json({ posts });
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
