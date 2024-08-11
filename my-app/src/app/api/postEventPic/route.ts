import { NextRequest, NextResponse } from 'next/server';
import { auth, storage } from '../../lib/firebaseAdmin';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    if (!decodedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse form data
    const formData = await req.formData();
    const subfolder = formData.get('subfolder') as string;
    const file = formData.get('image') as File;

    if (!subfolder || !file) {
      return NextResponse.json({ error: 'Subfolder and image are required' }, { status: 400 });
    }

    // Convert the file to a buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a reference to the file in Firebase Storage
    const bucket = storage.bucket("mottagningen-7063b.appspot.com");
    const fileRef = bucket.file(`events/${subfolder}/${file.name}`);

    // Upload the file to Firebase Storage
    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type,
      },
    });

    return NextResponse.json({ message: 'Image uploaded successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
