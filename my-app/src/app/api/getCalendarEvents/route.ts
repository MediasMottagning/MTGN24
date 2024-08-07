import { google } from "googleapis"; // Using this import requires disabling 'net' in the webpack config (see next.config.js)
import { NextResponse } from "next/server";
import { storage } from '../../lib/firebaseAdmin';


export async function GET() {
    // Provide the required configuration
    const calendarId = process.env.GCAL_ID;

    // Google calendar API settings
    const SCOPES = 'https://www.googleapis.com/auth/calendar';
    const calendar = google.calendar({version : "v3"});

    const auth = new google.auth.JWT(
        process.env.GCAL_CLIENT_EMAIL,
        undefined,
        process.env.GCAL_PRIVATE_KEY?.replace(/\\n/g, '\n'), 
        SCOPES
    );

    try {
        // get events from Google calendar
        let response = await calendar.events.list({
            auth: auth,
            calendarId: calendarId,
            timeMin: (new Date()).toISOString(),
            showDeleted: false,
            singleEvents: true,
            maxResults: 2, // Number of events to fetch
            orderBy: 'startTime',
        });
    
        let items = response['data']['items'];
        //console.log("ITEMS INSIDE FUNCTION: ",items);

        // get pictures from Firebase based on Google event location
        const bucket = storage.bucket("mottagningen-7063b.appspot.com");
        const eventOptions = {
            prefix: `eventCovers/`,
        };
        const [eventFiles] = await bucket.getFiles(eventOptions);
        // Error handling if no files are found
        if (eventFiles.length === 0) {
            console.error(`No files found for event: ${event}`);
            return NextResponse.json({ error: 'No files found for this event' }, { status: 404 });
        };
        // get signed URLs for the images (otherwise they are private) and remove the first entry (the folder itself)
        const eventImagePromises = eventFiles.map(file =>
            file.getSignedUrl({
                action: 'read',
                expires: '03-09-2491'
            })
        );
        // get the URLs with the signed URLs
        const eventImageUrls = await Promise.all(eventImagePromises);
        const imageUrls = eventImageUrls.map(url => url[0]);

        const eventPicsMap: { [key: string]: string } = {};
        for (let i = 0; i < eventFiles.length; i++) {
            const fileNameWithExt = eventFiles[i].name.split('/').pop();

            if (fileNameWithExt) {
                const fileName = fileNameWithExt.split('.').slice(0, -1).join('.').toLowerCase().normalize("NFC"); // remove extension and convert to lowercase
                eventPicsMap[fileName] = imageUrls[i] || null;            }            
        }

        // pair up the event with corresponding picture URLs and add them to items array of dictonaries
        items = items.map(event => {
            const location = event.location?.toLowerCase(); // convert location to lowercase
            const pictureUrl = location ? eventPicsMap[location] : null;
            return {
                ...event,
                pictureUrl: pictureUrl || '/Loke_i_Dubrovnik.png'
            };
        });
        return NextResponse.json({ items });
    } catch (error) {
        return NextResponse.json({ error: "Error fetching events" }, { status: 500 });
    }
  }
