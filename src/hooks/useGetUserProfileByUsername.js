import { useState } from 'react';
import useShowToast from "./useShowToast";
import useUserProfileStore from '../store/userProfileStore';
import { useEffect } from 'react';
import {query, collection, where, getDocs} from "firebase/firestore";
import {firestore} from "../firebase/firebase";

const useGetUserProfileByUsername = (username) => {
  const [isLoading,setIsLoading] = useState(true);
  const showToast = useShowToast();
  const {userProfile,setUserProfile} = useUserProfileStore();

  useEffect(() => {
        const getUserProfile = async () => {
            setIsLoading(true);
            try {
                const q = query(collection(firestore,"users"), where("username", "==" ,username));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) return setUserProfile(null);
                let userDoc;
                querySnapshot.forEach((doc) => {
                    userDoc = doc.data();
                });
                setUserProfile(userDoc);
                console.log(userDoc);
            } catch (error) {
                showToast("Erro",error.message,"error");
            }finally{
                setIsLoading(false);
            }
        };
        getUserProfile();
    }, [setUserProfile,username,showToast]);
    return {isLoading,userProfile};
};

export default useGetUserProfileByUsername;
