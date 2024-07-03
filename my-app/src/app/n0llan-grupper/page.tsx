'use client'
import { FormEvent, useEffect, useState } from 'react';
import useAuth from "../components/useAuth";
import { doc, getDoc, setDoc, collection, getDocs, DocumentData } from 'firebase/firestore';
import { db} from '../lib/firebaseConfig';
import { getStorage, ref, getDownloadURL } from "firebase/storage"; 

export default function N0llanGrupper(){
    
    const [groupBool, setGroupBool] = useState<boolean[]>([]);

    const [groupsData, setGroupsData] = useState<string[]>([]);
    const [userData, setUserData] = useState<DocumentData[]>([]);
    const { user } = useAuth();
    const storage = getStorage();

    useEffect(() => {
        if (user) {
            getCollectionData();
        }
    }, [user]);

    async function getCollectionData() {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersDataArray = [];
        for (const userDoc of querySnapshot.docs) {
            const userProfileRef = doc(db, "users", userDoc.id);
            const docSnap = await getDoc(userProfileRef);
            if (docSnap.exists()) {
                var userData = docSnap.data();
                if (userData.profilePic)
                    {
                        try {
                            const picRef = ref(storage, userData.profilePic);
                            const url = await getDownloadURL(picRef);
                            userData.profilePic = url;
                        } catch (error) {
                            console.error("Error fetching profile picture:", error);
                        }
                    }
                usersDataArray.push(userData);
            }
        }
        const groups = usersDataArray
            .map(obj => obj.group)
            .filter((group, index, self) => self.indexOf(group) === index)
        
        setGroupsData(groups);
        setUserData(usersDataArray);
        setGroupBool(Array(groups.length).fill(false));
        
    }

    const toggleGroupBool = (index: number) => {
        setGroupBool(prevState => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            return newState;
        });
    };

    async function test() {
        console.log(groupsData);
        console.log(groupBool)
    }

    function groupSeparation(group: string, index: number) {

        if (group == undefined) {
            return "some people have not been assinged groups!!"
        }
        const groupUsers = userData.filter(user => {if (user.group == group) return user});
        
        return(<div key={group + "1"}>
            <button onClick={() => toggleGroupBool(index)} className='bg-black'>{group}</button>
            <div className={`flexible top-full right-0 mt-2 w-full bg-white shadow-md z-10 flex flex-col items-center gap-4 p-4 transition-opacity duration-300 portrait:flex ${groupBool[index] ? "opacity-100 portrait:block" : "opacity-0 hidden portrait:hidden"}`}>
                
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {groupUsers.map((user, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                            <img src={user.profilePic} alt={`User ${index + 1}`} className="w-full h-auto" />
                            <h1 className="bg-black">{user.funFact /*n0llan-namn???*/}</h1>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        )
    }
    
    if (!user){ return <h1>Please login :|</h1>;}

    return (
        <main>
            <h1>n0llan-grupper:</h1>
            <div>{groupsData.map((group, index) => groupSeparation(group, index))}</div>
            <div>
                <button onClick={test}>test</button>
            </div>
        </main>
    )
}