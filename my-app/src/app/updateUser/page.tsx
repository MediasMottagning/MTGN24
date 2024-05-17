"use client";
import { useState, FormEvent, ChangeEvent } from "react";
import useAuth from "../components/useAuth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { storage, db } from "../lib/firebaseConfig";

/* THIS IS AN ADMIN PAGE USED TO GIVE USERS DISPLAYNAMES IN FIREBASE */
/* Om ngn har tid och orkar: Fixa så att bara vi i webbgruppen kan accessa denna sidan */
const UpdateUser = () => {
  const [uid, setUid] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const { user } = useAuth();

  /* function to update display names of users */
  const handleSubmitName = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/updateDisplayName", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid, displayName }),
      });

      if (!response.ok) {
        console.error("HTTP error", response.status);
        alert("Failed to update user: " + response.statusText);
        return;
      }

      const data = await response.json();
      console.log("Success:", data);
      alert("User updated successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to update user: " + error.message);
    }
  };

  /* function to handle image upload */
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async (event: FormEvent) => {
    event.preventDefault();
    if (image && uid) {
      // Check if the current user is an admin
      //console.log(user?.uid)
      //console.log(user?.)
      const currentUserDoc = await getDoc(doc(db, "users", user?.uid || ""));
      const currentUserData = currentUserDoc.data();
      console.log(currentUserData?.isAdmin);

      if (!currentUserData?.isAdmin) {
        alert("You are not authorized to perform this action.");
        return;
      }

      const storageRef = ref(storage, `profilepics/${uid}`);
      try {
        await uploadBytes(storageRef, image);
        const gsUrl = `gs://${storageRef.bucket}/${storageRef.fullPath}`;
        await updateDoc(doc(db, "users", uid), {
          profilePic: gsUrl,
        });
        alert("Profile picture updated successfully!");
      } catch (error) {
        console.error("Error uploading image: ", error);
        alert("Failed to upload image: " + error.message);
      }
    } else {
      alert("Please provide both a user ID and a profile picture.");
    }
  };

  // Redirect if user is not logged in or not an admin
  if (!user) {
    return <h1>Please login</h1>;
  } else if (!user.isAdmin) {
    return <h1>Only admins can access this page</h1>;
  }

  return (
    <>
      <form onSubmit={handleSubmitName}>
        <h1 className={`mb-3 text-2xl font-semibold`}>
          Update User DisplayName
        </h1>
        <label htmlFor="uid">
          User ID:
          <input
            className="border border-gray-300 rounded-lg p-2 text-black"
            type="text"
            id="uid"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            required
          />
        </label>
        <label htmlFor="displayName">
          Display Name:
          <input
            className="border border-gray-300 rounded-lg p-2 text-black"
            type="text"
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </label>
        <button
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          type="submit"
        >
          Update User
        </button>
      </form>

      <form onSubmit={handleUpload}>
        <h1 className={`mb-3 text-2xl font-semibold`}>
          Update User ProfilePic
        </h1>
        <label htmlFor="uid">
          User ID:
          <input
            className="border border-gray-300 rounded-lg p-2 text-black"
            type="text"
            id="uid"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            required
          />
        </label>
        <label htmlFor="profilePicture">
          Profile Picture:
          <input
            className="border border-gray-300 rounded-lg p-2 text-black"
            type="file"
            id="profilePicture"
            onChange={handleImageChange}
            required
          />
        </label>
        <button
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          type="submit"
        >
          Update User
        </button>
      </form>
    </>
  );
};

export default UpdateUser;
