import React from "react";
import Loading from "./Loading";
import * as Signup from "../authentication/Signup";
import TodoViewer from "../todoViewer/TodoViewer";
import TodoEditor from "../todoEditor/TodoEditor";
import InformationBar from "../informationBar/InformationBar";
import * as types from "../../defines/types"
import {
    createUserData,
    modalData_TodoReEditModal,
    modalData_NoticeModalDialog,
    modalData_YesNoModalDialog,
    modalShow_TodoEditModal,
    modalData_TodoDetailModal,
    modalData_CheckListModal,
    modalShow_UserSettingsModal,
    userInfo
} from "../../defines/atoms";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { Button, Box, HStack, VStack, Text} from "native-base";
import * as firebaseAuth from "firebase/auth";
import * as fireStore from "firebase/firestore";
import { setDoc } from "firebase/firestore";

import NoticeModalDialog from "../modal/NoticeDialog";
import TodoReEditModal from "../modal/TodoReEditModal";
import YesNoModalDialog from "../modal/YesNoModalDialog";
import TodoEditModal from "../modal/TodoEditModal";
import TodoDetailModal from "../modal/TodoDetailModal";
import CheckListModal from "../modal/CheckListModal";
import { createUserWithEmailAndPassword } from "firebase/auth";
import UserSettingsModal from "../modal/UserSettingsModal";



const MainContainer = () => {
    const noticeModalDialogData = useRecoilValue(modalData_NoticeModalDialog);
    const todoReEditModalData = useRecoilValue(modalData_TodoReEditModal);
    const yesNoModalDialogData = useRecoilValue(modalData_YesNoModalDialog);
    const showTodoEditModal = useRecoilValue(modalShow_TodoEditModal);
    const todoDetailModalData = useRecoilValue(modalData_TodoDetailModal);
    const checkListModalData = useRecoilValue(modalData_CheckListModal);
    const getCreateUserData = useRecoilValue(createUserData);
    const showUserSettingsModal = useRecoilValue(modalShow_UserSettingsModal);
    const setUserInfo = useSetRecoilState(userInfo);
    
    const [dbStatus, setDbStatus] = React.useState<string>("loading");
    
    const db = fireStore.getFirestore();
    const user = firebaseAuth.getAuth().currentUser;
    const uid = user?.uid;
    const userDocRef = fireStore.doc(db, "users/" + uid);
    
    firebaseAuth.onAuthStateChanged(firebaseAuth.getAuth(), (user) => {
        if (!(user)) {
            setUserInfo({name: ""});
        }
    });
    
    const getUserData = () => {
        fireStore.getDoc(userDocRef).then((doc) => {
            if (doc.exists()) {
                setUserInfo({name: doc.data().name});
                setDbStatus("exists")
            } else {
                setDbStatus("loading");
                Signup.createUser(getCreateUserData.name).then(() => {
                    setDbStatus("exists");
                }, (e) => {
                    console.log(e);
                });
            }
        }, (e) => {
            console.log(e);
        });
    }
    
    React.useEffect(() => {
        getUserData();
    }, []);


    if (dbStatus === "loading") {
        return (<Loading />);
    }
    let modalIsOpen = false;
    if (noticeModalDialogData.show || todoReEditModalData.show || yesNoModalDialogData.show || showTodoEditModal || todoDetailModalData.show || checkListModalData.show || showUserSettingsModal) {
        modalIsOpen = true;
    }
    
    return <VStack mt={10}>
        <HStack alignItems="center" _dark={{bg: "rgb(0,0,255)"}} _light={{color: "rgb(255,255,255)", bg: "rgb(0,0,255)"}} justifyContent="space-between">
            <Text ml={2} fontSize="xl">Quick Todoer</Text>
            <TodoEditor />
        </HStack>
        <TodoViewer />
        <Box overflow="hidden" accessibilityElementsHidden={!modalIsOpen} accessibilityViewIsModal={modalIsOpen}>
            <Text height="1px"> </Text>
            <TodoReEditModal />
            <NoticeModalDialog />
            <YesNoModalDialog />
            <TodoEditModal />
            <TodoDetailModal />
            <CheckListModal />
            <UserSettingsModal />
        </Box>
        <InformationBar />
    </VStack>;
}

export default MainContainer;
