import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const fetchUserDetails = async (userId) => {
  const userRef = doc(firestore, "users", userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    console.log("No such document!");
  }
};

const fetchUsersDetails = async (userIds) => {
  const userPromises = userIds.map(fetchUserDetails);
  return await Promise.all(userPromises);
};

export { fetchUserDetails, fetchUsersDetails };
