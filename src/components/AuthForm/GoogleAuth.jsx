import { Flex, Image, Text } from "@chakra-ui/react";
import React from 'react';

import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../firebase/firebase";
import useShowToast from "../../hooks/useShowToast";
import useAuthStore from "../../store/authStore";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";

const GoogleAuth = ({prefix}) => {
  const [signInWithGoogle, , , error] = useSignInWithGoogle(auth);
  const showToast = useShowToast();
  const loginUser = useAuthStore((state) => state.login);

  const handleGoogleAuth = async () => {
    try {
      const newUser = await signInWithGoogle();
      if(!newUser && error){
        showToast("Error",error.message,"error");
        return;
      }
      const userRef = doc(firestore, "users", newUser.user.uid);
      const userSnap = await getDoc(userRef);

      
      if(userSnap.exists()){
        const userDoc = userSnap.data();
        localStorage.setItem("user-info" , JSON.stringify(userDoc));
        loginUser(userDoc);
      }else{
        const userDoc = {
            uid:newUser.user.uid,
            email:newUser.user.email,
            username:newUser.user.email.split("@")[0],
            fullName:newUser.user.displayName,
            bio:"",
            profilePicURL:newUser.user.photoURL,
            followers:[],
            following:[],
            posts:[],
            createdAt:Date.now()
        };
        await setDoc(doc(firestore,"users",newUser.user.uid),userDoc);
        localStorage.setItem("user-info",JSON.stringify(userDoc));
        loginUser(userDoc);
      }
    }catch (error) {
      showToast("Error" ,error.message, "error");
    }
  };

  const updateExistingUsers = async () => {
    const userRef = collection(firestore, "users");
    const querySnapshot = await getDocs(userRef);
    querySnapshot.forEach(async (docSnapshot) => {
      const docData = docSnapshot.data();
      const updates = {};
      if (!docData.following) {
        updates.following = [];
      }
      if (docData.ceratedAt) {
        updates.createdAt = docData.ceratedAt;
        delete updates.ceratedAt;
      }
      if (Object.keys(updates).length > 0) {
        await updateDoc(doc(firestore, "users", docSnapshot.id), updates);
      }
    });
  };
  updateExistingUsers();
  return (
    <Flex alignItems={"center"} justifyContent={"center"} cursor={"pointer"} onClick={handleGoogleAuth}>
        <Image src='/google.png' w={5} alt='Google Logo' />
        <Text mx="2" color={"blue.500"}>{prefix} with Google</Text>
    </Flex>
  );
};

export default GoogleAuth;
