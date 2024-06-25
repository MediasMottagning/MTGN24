import { NextRequest, NextResponse } from 'next/server';
import { auth, storage} from '../../lib/firebaseAdmin';
import { ref, listAll } from 'firebase/storage';
import { getStorage,  getDownloadURL } from 'firebase-admin/storage';

/* API endpoint for fetching events */
export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }
    // extract the user from the auth token
    const idToken = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await auth.verifyIdToken(idToken);
        // if the token is invalid, return an Unauthorized response
        if (!decodedToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        //console.log(decodedToken);
        const bucket = storage.bucket("mottagningen-7063b.appspot.com"); // Access the default bucket
        const options = {
          prefix: 'events/test/',  
          delimiter: '/'      // To include subdirectories
        };

        const [files] = await bucket.getFiles(options);  // Fetch files under "events" with any subdirectory structure
        const promises = files.map(file =>
            file.getSignedUrl({
                action: 'read',
                expires: '03-09-2491'  // Set a far future expiration date
            })
        );
        
        const signedUrls = await Promise.all(promises);
        const imageUrls = signedUrls.map(url => url[0]);  // Extract the URL from the response
        //console.log(imageUrls);

        return NextResponse.json({ imageUrls });
    } catch (error) {
        console.error('Error fetching events:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
