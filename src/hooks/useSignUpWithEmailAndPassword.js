import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, firestore } from "../firebase/firebase";
import { collection, doc, getDocs, query, setDoc, where, } from 'firebase/firestore';
import useShowToast from './useShowToast';
import useAuthStore from '../store/authStore';

const useSignUpWithEmailAndPassword = () => {
  const [createUserWithEmailAndPassword, , loading, error,]= useCreateUserWithEmailAndPassword(auth);
  const showToast = useShowToast();
  const loginUser = useAuthStore(state => state.login);

  const signup = async (inputs) => {
    if(!inputs.email || !inputs.password || !inputs.username || !inputs.fullName){
        showToast("Error", "Please fill all the fields", "error");
        return;
    }
    const userRef = collection(firestore, "users");
    const q = query(userRef,where("username", "==", inputs.username));
    const querySnapshot = await getDocs(q);
    
    if(!querySnapshot.empty){
        showToast("Error", "Username already exists","error");
        return;
    }

    try {
        const newUser = await createUserWithEmailAndPassword(inputs.email,inputs.password)
        if(!newUser && error){
          showToast("Error", error.message, "error");
          return;
        }
        if(newUser){
            const userDoc = {
                uid:newUser.user.uid,
                email:inputs.email,
                username:inputs.username,
                fullName:inputs.fullName,
                bio:"",
                profilePicURL:"",
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

  return {loading, error, signup};
}

export default useSignUpWithEmailAndPassword;
