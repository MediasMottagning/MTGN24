import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../lib/firebaseAdmin'; 
import { NextResponse } from 'next/server';


const getCollectionData = async () => {
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return users;
};

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    try {
        const users = await getCollectionData();
        return NextResponse.json({ users });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
