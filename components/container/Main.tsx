import React from "react";
import Loading from "./Loading";
import Signup from "../authentication/Signup";
import TodoViewer from "../todoViewer/TodoViewer";
import TodoEditor from "../todoEditor/TodoEditor";
import * as types from "../../defines/types"
import {modalShow_TodoEditModal} from "../../defines/atoms";
import { RecoilBridge, useRecoilValue } from "recoil";
import { Box, HStack, VStack, Text} from "native-base";
import * as firebaseAuth from "firebase/auth";
import * as fireStore from "firebase/firestore";
import { setDoc } from "firebase/firestore";

import TodoEditModal from "../modal/TodoEditModal";


const MainContainer = () => {
    const showTodoEditModal = useRecoilValue(modalShow_TodoEditModal);
    
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
        <HStack alignItems="center" _dark={{bg: "rgb(255,0,0)"}} _light={{color: "rgb(255,255,255)", bg: "rgb(255,0,0"}} justifyContent="space-between">
            <Text ml={2} fontSize="xl">Quick Todoer</Text>
            <TodoEditor />
        </HStack>
        <TodoViewer />
        <Box overflow="hidden" accessibilityElementsHidden={!showTodoEditModal} accessibilityViewIsModal={showTodoEditModal}><Text height="1px"> </Text><TodoEditModal /></Box>
    </VStack>;
}

export default MainContainer;
