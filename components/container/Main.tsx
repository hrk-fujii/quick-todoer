import React from "react";
import Loading from "./Loading";
import Signup from "../authentication/Signup";
import * as types from "../../defines/types"
import { HStack, VStack, Text} from "native-base";
import * as firebaseAuth from "firebase/auth";
import * as fireStore from "firebase/firestore";
import { setDoc } from "firebase/firestore";

const MainContainer = () => {
    const [userData, setUserData] = React.useState<types.user | null>(null);
    const [dbStatus, setDbStatus] = React.useState<string>("loading");

    const getUserData = () => {
        fireStore.getDoc(userDocRef).then((doc) => {
            if (doc.exists()) {
                setUserData(doc.data());
                setDbStatus("exists")
            } else {
                setDbStatus("not exists")
            }
        });
    }
    
    const db = fireStore.getFirestore();
    const user = firebaseAuth.getAuth().currentUser;
    const uid = user?.uid;
    const userDocRef = fireStore.doc(db, "users/" + uid);
    
    React.useEffect(() => {
        getUserData();
    }, []);
    
    if (dbStatus === "loading") {
        return (<Loading />);
    } else if (dbStatus === "not exists") {
        return <VStack m={5} mt={10}>
            <Signup email={user?.email} uid={uid} reload={getUserData} />
        </VStack>;
    }
    
    return <VStack m={5} mt={10}>
        <Text>{uid}</Text>
        <Text>{JSON.stringify(userData)}</Text>
    </VStack>
}

export default MainContainer;
