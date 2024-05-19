'use client';

import { FormEvent, useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from "firebase/storage"; // for profile pic
import { getAuth, updatePassword } from "firebase/auth";
import { db } from '../lib/firebaseConfig';
import LogoutButton from "../components/LogoutBtn";
import useAuth from "../components/useAuth";
import { Montserrat_Alternates } from 'next/font/google';

const Home = () => {
    const [funFact, setFunFact] = useState<string>(''); // displayed fun fact
    const [inputFact, setInputFact] = useState<string>(''); //form fun fact
    const [inputPassword, setInputPassword] = useState<string>(''); //form password
    const [inputPassword1, setInputPassword1] = useState<string>(''); //form1 password, used to confirm password
    const [profilePic, setProfilePic] = useState<string>(''); // profile pic url
    const { user } = useAuth();

    // fetch the fun fact from the users profile on firestore
    useEffect(() => {
        if (user) {
            const fetchUserData = async () => {
                const userProfileRef = doc(db, "users", user.uid);
                try {
                    const docSnap = await getDoc(userProfileRef);
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        // fun fact
                        setFunFact(userData.funFact || '');
                        // setInputFact(userData.funFact || '');
                        const picUrl = userData.profilePic;
                        //console.log("Profile picture URL: ", picUrl);
                        /* Get profile picture */
                        if (picUrl) {
                            const storage = getStorage();
                            const picRef = ref(storage, picUrl);
                            console.log("Profile picture ref: ", picRef);
                            getDownloadURL(picRef)
                                .then((url) => {
                                    //console.log("Profile picture URL: ", url);
                                    setProfilePic(url);
                                })
                                .catch((error) => {
                                    console.error("Error fetching profile picture:", error);
                                });
                        }
                    } else {
                        console.log("No such document!");
                    }
                } catch (error) {
                    console.error("Error fetching fun fact: ", error);
                }
            };

            fetchUserData();
        }
    }, [user]);
    // if user is not logged in, show a message to login
    if (!user) {
        return <h1>Please login to update your profile.</h1>;
    }
    // update the fun fact in the users profile on firestore from the form input
    const updateFunFact = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (user) {
            const userProfileRef = doc(db, "users", user.uid);
            try {
                await setDoc(userProfileRef, { funFact: inputFact }, { merge: true });
                setFunFact(inputFact); // update displayed fact 
                console.log("User fun fact updated!");
                alert("Fun fact updated successfully!");
            } catch (error) {
                console.error("Error updating fun fact: ", error);
                alert("Failed to update fun fact.");
            }
        }
    };
     // update password in the users profile on firbase auth from the form input
     const newPassword = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (user) {
            // check if the two passwords match
            if (inputPassword !== inputPassword1) {
                alert("Passwords do not match!");
            }else{
            updatePassword(user, inputPassword).then(() => {
            // successful change of password
                console.log("User password updated!");
                alert("Password updated successfully!");
              }).catch((error) => {
            // error handling
                console.error("Error updating password: ", error);
                alert("Failed to update password. \nMake sure your password is at least 6 characters long.");
              });
            }
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div>
                {profilePic && <img src={profilePic} alt="Profile" />}

                <h2>{user?.email}</h2>
                <h2>{user?.displayName}</h2>
                <h2>{funFact}</h2>
            </div>
            <form onSubmit={updateFunFact}>
                <input
                    className="border border-gray-300 rounded-lg p-2 text-black"
                    type="text"
                    value={inputFact}
                    onChange={(e) => setInputFact(e.target.value)}
                    placeholder="Fun Fact"
                    required
                />
                <button type="submit">Submit Fun Fact</button>
            </form>

            <form onSubmit={newPassword}>
                <input
                    className="border border-gray-300 rounded-lg p-2 text-black"
                    type="password"
                    onChange={(e) => setInputPassword(e.target.value)}
                    placeholder="New Password"
                    required
                />
                <input
                    className="border border-gray-300 rounded-lg p-2 text-black"
                    type="password"
                    onChange={(e) => setInputPassword1(e.target.value)}
                    placeholder="Confirm New Password"
                    required
                />
                <button type="submit">Change password</button>
            </form>
        </main>
    );
};

export default Home;
