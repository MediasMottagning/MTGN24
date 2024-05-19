"use client"
import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import useAuth from '../components/useAuth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { storage, db } from '../lib/firebaseConfig';

const UpdateUser = () => {
  const [uid, setUid] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const currentUserDoc = await getDoc(doc(db, "users", user.uid));
        const currentUserData = currentUserDoc.data();
        setIsAdmin(currentUserData?.isAdmin || false);
      }
      setLoading(false);
    };

    checkAdminStatus();
  }, [user]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const setAdmin = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/setAdmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid }),
      });

      if (!response.ok) {
        console.error("HTTP error", response.status);
        alert('Failed to set admin: ' + response.statusText);
        return;
      }

      const data = await response.json();
      console.log('Success:', data);
      alert('User is now an admin.');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to set admin: ' + error.message);
    }
  };

  const handleSubmitName = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/updateDisplayName', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid, displayName }),
      });

      if (!response.ok) {
        console.error("HTTP error", response.status);
        alert('Failed to update user: ' + response.statusText);
        return;
      }

      const data = await response.json();
      console.log('Success:', data);
      alert('User updated successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update user: ' + error.message);
    }
  };

  const handleUpload = async (event: FormEvent) => {
    event.preventDefault();
    if (image && uid) {
      if (!isAdmin) {
        alert('You are not authorized to perform this action.');
        return;
      }

      const storageRef = ref(storage, `profilepics/${uid}`);
      try {
        await uploadBytes(storageRef, image);
        const gsUrl = `gs://${storageRef.bucket}/${storageRef.fullPath}`;
        try {
          await updateDoc(doc(db, "users", uid), {
            profilePic: gsUrl,
          });
        } catch (error) {
          console.error('Error updating profile picture URL in Firestore: ', error);
          alert('Failed to update profile picture URL in Firestore: ' + error.message);
        }
        alert('Profile picture updated successfully!');
      } catch (error) {
        console.error('Error uploading image: ', error);
        alert('Failed to upload image: ' + error.message);
      }
    } else {
      alert('Please provide both a user ID and a profile picture.');
    }
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!user) {
    return <h1>Please login</h1>;
  } else if (!isAdmin) {
    return <h1>Only admins can access this page</h1>;
  }

  return (
    <>
      <form onSubmit={handleSubmitName}>
        <h1 className={`mb-3 text-2xl font-semibold`}>Update User DisplayName</h1>
        <label htmlFor="uid">User ID:
          <input
            className="border border-gray-300 rounded-lg p-2 text-black"
            type="text"
            id="uid"
            value={uid}
            onChange={e => setUid(e.target.value)}
            required
          />
        </label>
        <label htmlFor="displayName">Display Name:
          <input
            className="border border-gray-300 rounded-lg p-2 text-black"
            type="text"
            id="displayName"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            required
          />
        </label>
        <button className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30" type="submit">Update User</button>
      </form>

      <form onSubmit={handleUpload}>
        <h1 className={`mb-3 text-2xl font-semibold`}>Update User ProfilePic</h1>
        <label htmlFor="uid">User ID:
          <input
            className="border border-gray-300 rounded-lg p-2 text-black"
            type="text"
            id="uid"
            value={uid}
            onChange={e => setUid(e.target.value)}
            required
          />
        </label>
        <label htmlFor="profilePicture">Profile Picture:
          <input
            className="border border-gray-300 rounded-lg p-2 text-black"
            type="file"
            id="profilePicture"
            onChange={handleImageChange}
            required
          />
        </label>
        <button className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30" type="submit">Update User</button>
      </form>

      <form onSubmit={setAdmin}>
        <h1 className={`mb-3 text-2xl font-semibold`}>Set User as Admin</h1>
        <label htmlFor="uid">User ID:
          <input
            className="border border-gray-300 rounded-lg p-2 text-black"
            type="text"
            id="uid"
            value={uid}
            onChange={e => setUid(e.target.value)}
            required
          />
        </label>
        <button className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30" type="submit">Set Admin</button>
      </form>
    </>
  );
};

export default UpdateUser;
