import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../lib/firebaseAdmin';

/* API endpoint to check custom claim if user is admin */
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const claims = decodedToken;

    if (claims && claims.isAdmin) {
      return NextResponse.json({ isAdmin: true });
    } else {
      return NextResponse.json({ isAdmin: false });
    }
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}