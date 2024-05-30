import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../lib/firebaseAdmin'; 
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: NextRequest) {
  try {
    const { uid, title, post } = await req.json();
    console.log('Received data:', { uid, title, post });
    // repond with an error if any of the required fields are missing
    if (!uid || !title || !post) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const postRef = db.collection('posts').doc(); 
    await postRef.set({
        uid,
        title,
        post,
        createdAt: FieldValue.serverTimestamp(), // field which stores the time the post was created, only used to sort posts
      });
    return NextResponse.json({ message: 'Post created successfully', postId: postRef.id }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
