import { NextRequest, NextResponse } from 'next/server';
import { collection, doc, getDocs, setDoc} from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';


/* api endpoint for posts */
export async function POST(req: NextRequest) {
  const { uid } = await req.json();
    try {
        const posts = await setDoc(doc(db, "posts", "2"), { title: "New Post", post: "This is a new post" });
        return;
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
