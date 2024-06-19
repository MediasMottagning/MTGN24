import { customInitApp } from "@/app/lib/firebaseAdmin";
import { auth } from "firebase-admin";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// init firebase SDK when server is called
customInitApp();

// login user
export async function POST(request: NextRequest) {
  const authorization = request.headers.get("Authorization");
  if (authorization?.startsWith("Bearer ")) {
    const idToken = authorization.split("Bearer ")[1];
    const decodedToken = await auth().verifyIdToken(idToken);

    if (decodedToken) {
        //console.log("DECODEDTOKEEEEN:",decodedToken);
        //create session cookies
        const expiresIn = 60 * 60 * 24 * 5 * 1000;
        const sessionCookie = await auth().createSessionCookie(idToken, {
          expiresIn,
        });
        const options = {
          name: "session",
          value: sessionCookie,
          maxAge: expiresIn,
          httpOnly: true,
          secure: true,
        };
  
        // add cookies to the browser
        cookies().set(options);
        //console.log("COOKIE:",cookies().get("session")?.value);
      }
    return NextResponse.json({ success: "Logged in" }, { status: 200 });
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// validate user
export async function GET(request: NextRequest) {
  const session = request.cookies.get("session")?.value || "";
  
  // validate if cookies exist in the request
  if (!session) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }
  
  // use firebaSE admin to validate the session cookie
  try {
    const decodedClaims = await auth().verifySessionCookie(session, true);
    if (decodedClaims) {
      return NextResponse.json({ isLogged: true }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }
}
