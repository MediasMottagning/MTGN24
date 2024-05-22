import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../lib/firebaseAdmin';

/* set Custom claim that a UID has admin rights */
export async function POST(req: NextRequest) {
  const { uid } = await req.json();

  try {
    await auth.verifyIdToken((claims) => {
        if (claims.isAdmin === true) {
            return true;
        } else {
            return false;
        }
    });
    return true;
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
