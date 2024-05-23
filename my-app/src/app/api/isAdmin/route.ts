import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../lib/firebaseAdmin';

export async function POST(req: NextRequest) {
  const { uid } = await req.json();

  try {
    // Retrieve the user record by UID
    const user = await auth.getUser(uid);

    // Get custom claims
    const claims = user.customClaims;

    if (claims && claims.isAdmin) {
      return NextResponse.json({ isAdmin: true });
    } else {
      return NextResponse.json({ isAdmin: false });
    }
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
