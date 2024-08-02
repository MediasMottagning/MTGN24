import { NextRequest, NextResponse } from 'next/server';
import { auth, storage } from '../../lib/firebaseAdmin';

/* API for fetching event pictures */
export async function GET(req: NextRequest) {
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
        const bucket = storage.bucket("mottagningen-7063b.appspot.com");
        const options = {
            prefix: 'events/',
        };

        const [files] = await bucket.getFiles(options);

        // collect all event subfolders from "events" folder
        const eventFolders = new Set();
        files.forEach(file => {
            const pathParts = file.name.split('/');
            if (pathParts.length > 2) {
                eventFolders.add(pathParts[1]);
            }
        });

        //console.log('subfolders:', eventFolders);

        // fetch URLs for all images in each event folder
        const eventPromises = Array.from(eventFolders).map(async (eventFolder) => {
            const eventOptions = {
                prefix: `events/${eventFolder}/`,
            };

            const [eventFiles] = await bucket.getFiles(eventOptions);
            // filter out first entry (which is the folder itself)
            //const imageFiles = eventFiles.filter(file => !file.name.endsWith('/'));

            const eventImagePromises = eventFiles.map(file =>
                file.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                })
            );

            const eventImageUrls = await Promise.all(eventImagePromises);
            const imageUrls = eventImageUrls.map(url => url[0]);

            return {
                event: eventFolder,
                imageUrls
            };
        });

        const events = await Promise.all(eventPromises);

        return NextResponse.json({ events });
    } catch (error) {
        console.error('Error fetching events:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
