const google = require('@googleapis/calendar') // Using this import requires disabling 'net' in the webpack config (see next.config.js)
import { NextResponse } from "next/server";


export async function GET() {
    // Provide the required configuration
    const calendarId = process.env.GCAL_ID;

    // Google calendar API settings
    const SCOPES = 'https://www.googleapis.com/auth/calendar';
    const calendar = google.calendar({version : "v3"});

    const auth = new google.auth.JWT(
        process.env.GCAL_CLIENT_EMAIL,
        undefined,
        process.env.GCAL_PRIVATE_KEY,
        SCOPES
    );

    try {
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
        return NextResponse.json({ items });
    } catch (error) {
        return NextResponse.json({ error: "Error fetching events" }, { status: 500 });
    }
  }