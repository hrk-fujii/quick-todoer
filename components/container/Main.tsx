import React from "react";
import Loading from "./Loading";
import Signup from "../authentication/Signup";
import TodoViewer from "../todoViewer/TodoViewer";
import TodoEditor from "../todoEditor/TodoEditor";
import * as types from "../../defines/types"
import {
    modalData_YesNoModalDialog,
    modalShow_TodoEditModal,
    modalData_TodoDetailModal,
    modalData_CheckListModal
} from "../../defines/atoms";
import { RecoilBridge, useRecoilValue } from "recoil";
import { Box, HStack, VStack, Text} from "native-base";
import * as firebaseAuth from "firebase/auth";
import * as fireStore from "firebase/firestore";
import { setDoc } from "firebase/firestore";

import YesNoModalDialog from "../modal/YesNoModalDialog";
import TodoEditModal from "../modal/TodoEditModal";
import TodoDetailModal from "../modal/TodoDetailModal";
import CheckListModal from "../modal/CheckListModal";



const MainContainer = () => {
    const yesNoModalDialogData = useRecoilValue(modalData_YesNoModalDialog);
    const showTodoEditModal = useRecoilValue(modalShow_TodoEditModal);
    const todoDetailModalData = useRecoilValue(modalData_TodoDetailModal);
    const checkListModalData = useRecoilValue(modalData_CheckListModal)
    
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
    
    let modalIsOpen = false;
    if (yesNoModalDialogData.show || showTodoEditModal || todoDetailModalData.show || checkListModalData.show) {
        modalIsOpen = true;
    }
    
    return <VStack mt={10}>
        <HStack alignItems="center" _dark={{bg: "rgb(255,0,0)"}} _light={{color: "rgb(255,255,255)", bg: "rgb(255,0,0)"}} justifyContent="space-between">
            <Text ml={2} fontSize="xl">Quick Todoer</Text>
            <TodoEditor />
        </HStack>
        <TodoViewer />
        <Box overflow="hidden" accessibilityElementsHidden={!modalIsOpen} accessibilityViewIsModal={modalIsOpen}>
            <Text height="1px"> </Text>
            <YesNoModalDialog />
            <TodoEditModal />
            <TodoDetailModal />
            <CheckListModal />
        </Box>
    </VStack>;
}

export default MainContainer;
