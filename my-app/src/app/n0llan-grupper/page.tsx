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

    const [popUpBool, setPopUpBool] = useState(false);
    const [popUpName, setPopUpName] = useState("");
    const [popUpPic, setPopUpPic] = useState("");
    const [popUpFunFact, setPopUpFunFact] = useState("");

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

    const togglePopUpBool = () => {
        setPopUpBool(!popUpBool);
    };

    async function test() {
        console.log(groupsData);
        console.log(groupBool);
    }

    async function showUserProfile(profilePic: string, name: string, funFact: string){
        togglePopUpBool();
        setPopUpPic(profilePic);
        setPopUpName(name);
        setPopUpFunFact(funFact);
    }

    function groupSeparation(group: string, index: number) {

        if (group == undefined) {
            return "some people have not been assinged groups!!"
        }
        const groupUsers = userData.filter(user => {if (user.group == group) return user});
        
        return(<div key={group + "1"} className='flex items-center flex-col'>
            <button onClick={() => toggleGroupBool(index)} className='bg-white text-black font-bold p-4 mt-4 rounded-lg w-1/3 whitespace-nowrap drop-shadow-lg outline outline-1 outline-black hover:bg-slate-200'>{group}</button>
            <div className={`mt-2 gap-4 p-4  ${groupBool[index] ? "opacity-100" : "opacity-0 hidden"}`}>
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
                    {groupUsers.map((user, index) => (
                        <button onClick={() => showUserProfile(user.profilePic, user.name, user.funFact)} key={index} className="bg-white p-2 rounded-lg drop-shadow-lg  outline outline-1 outline-black hover:bg-slate-200">
                            <img src={user.profilePic} alt={`User ${index + 1}`} className="w-full aspect-square rounded-lg outline outline-1 outline-black"/>
                            <h1 className="text-black pt-2 whitespace-nowrap">{user.name}</h1>
                        </button>
                    ))}
                </div>
            </div>
        </div>
        )
    }
    
    if (!user){ return <h1>Please login :|</h1>;}
    return (
        <main className="min-h-screen bg-gradient-to-r from-[#A5CACE] to-[#4FC0A0]">
            <div>{groupsData.map((group, index) => groupSeparation(group, index))}</div>
            <div>
                <button onClick={test}>test</button>
            </div>
            <div onClick={togglePopUpBool} className='flex items-center justify-center '>
            <div className={`fixed aspect-square text-center top-20 h-1/3 sm:h-2/5 drop-shadow-lg  ${popUpBool ? "" : "opacity-0 hidden"}`}>
                <div className="bg-white p-8 rounded-lg shadow-lg outline outline-1 outline-black hover:bg-slate-200">
                    <img src={popUpPic} className="w-full aspect-square rounded-lg outline outline-1 outline-black"/>
                    <h1 className="text-black text-xl font-bold p-1">{popUpName}</h1>
                    <h1 className= "text-black">Fun fact: {popUpFunFact}</h1>
                </div>
            </div>
            </div>
        </main>
    )
}