"use client"
import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import useAuth from '../components/useAuth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { storage, db } from '../lib/firebaseConfig';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { set } from 'firebase/database';
import { get } from 'http';

/* Admin page for updating user information, posting new posts and more */
const UpdateUser = () => {
  const [uid, setUid] = useState('');
  // for display name
  const [displayName, setDisplayName] = useState('');
  // for profile picture
  const [image, setImage] = useState<File | null>(null);
  // for admin check
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  // for posting new posts
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        // get user auth token and send to API endpoint /api/isAdmin
        if (user) {
          try {
            const idToken = await user.getIdToken();
            const response = await fetch('/api/isAdmin', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
              },
            });

            if (!response.ok) {
              // Error response from the server, only for debugging
              console.error('Response error:', response.status, response.statusText);
              const errorText = await response.text(); 
              console.error('Response text:', errorText);
              throw new Error('Failed to fetch admin status');
            }

            const data = await response.json();
            setIsAdmin(data.isAdmin);
            console.log("Admin status:", data.isAdmin);
          } catch (error) {
            console.error('Error:', error);
          } finally {
            setLoading(false);
          }
        } else {
          setLoading(false); // set loading to false if user is not admin
        }
      });
    };

    checkAdminStatus();
  }, []); // run only once

  // image change handler
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };
  // set user as admin
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
      if (error instanceof Error) {
        console.error('Error:', error.message);
        alert('Failed to set admin: ' + error.message);
      }
    }
  };
  // update user display name
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
      if (error instanceof Error) {
        console.error('Error:', error);
        alert('Failed to update user: ' + error.message);
      }
    }
  };
  // upload profile picture
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
          if(error instanceof Error) {
            console.error('Error updating profile picture URL in Firestore: ', error);
            alert('Failed to update profile picture URL in Firestore: ' + error.message);
          }
        }
        alert('Profile picture updated successfully!');
      } catch (error) {
        if(error instanceof Error){
          console.error('Error uploading image: ', error);
          alert('Failed to upload image: ' + error.message);
        }
      }
    } else {
      alert('Please provide both a user ID and a profile picture.');
    }
  };
  // upload posts
  const handleUploadPosts = async (event: FormEvent) => {
    event.preventDefault();
    // user feedback if post is created successfully or not
    /* OM NGN HAR TID KAN NI FIXA SÅNNA HÄR PÅ DE ANDRA HANDLERNSERNA? */
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/postPosts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }), 
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setSuccess('Post created successfully!');
      // clear input fields
      setTitle('');
      setDescription('');
    } catch (error) {
      setError((error as Error).message);
    }
  };
  // get event folders/ids
  const getFolders = async () => {
    try {
      const response = await fetch('/api/getEvents', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
      );
      const data = await response.json();
      if (response.ok) {
        return data.folders;
      } else {
        throw new Error(data.error || 'Failed to fetch folders');
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
      return [];
    }
  };
  console.log(getFolders());

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
        <form className="" onSubmit={handleUploadPosts}>
          <h1 className="mb-3 text-2xl font-semibold">Create Post</h1>
          <label htmlFor="title">Title
            <input
              className="border border-gray-300 rounded-lg p-2 text-black"
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label htmlFor="post">Post
            <textarea
              className="border border-gray-300 rounded-lg p-2 text-black w-full h-64 resize-none"
              id="post"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </label>
        <button type="submit">Create Post</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </form>

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
