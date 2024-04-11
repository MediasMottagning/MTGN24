'use client'
import useAuth from "../components/useAuth";

export default function N0llanGrupper(){
    // check if user is logged in
    const { user }= useAuth();
    // if user is not logged in, redirect to login page
    if (!user){ return <h1>Please login u dumb fuq</h1>;}
}