import React from "react";
import * as firebaseAuth from "firebase/auth";
import * as fireStore from "firebase/firestore";
import { Box, HStack, Text, Button } from "native-base";
import { task } from "../../defines/types";
import {useSetRecoilState} from "recoil";
import {modalData_TodoDetailModal, modalData_CheckListModal, modalData_NoticeModalDialog} from "../../defines/atoms";
import {getErrorMessage} from "../../utils/errorMessage";

const Todo = (props: {data: task; id: string;}) => {
    const setDetailModal = useSetRecoilState(modalData_TodoDetailModal);
    const setCheckListModal = useSetRecoilState(modalData_CheckListModal);
    const setNoticeDialog = useSetRecoilState(modalData_NoticeModalDialog);
    
    const user = firebaseAuth.getAuth().currentUser;
    const db = fireStore.getFirestore();
    const taskDocRef = fireStore.doc(db, "users/" + user?.uid + "/tasks/" + props.id);
    
    const hStatusChange = async () => {
        try {
            await fireStore.runTransaction(db, async (transaction) => {
                if (props.data.status === "yet") {
                    await transaction.update(taskDocRef, {status: "doing"});
                } else if (props.data.status === "doing") {
                    await transaction.update(taskDocRef, {status: "done"});
                }
            });
        } catch (error) {
            setNoticeDialog({show: true, message: getErrorMessage(error.toString()), onClose: ()=>{}});
        }
    }

    const hOpenCheckList = () => {
        setCheckListModal({
            show: true,
            id: props.id,
            name: props.data.name
        });
    }
    
    const hOpenDetail = () => {
        setDetailModal({
            ...props.data,
            show: true,
            id: props.id
        });
    }
    
    let statusText = "";
    let buttonText = "";
    let buttonEnabled = true;
    if (props.data.status === "yet") {
        statusText = "未着手";
        buttonText = "着手する";
    } else if (props.data.status === "doing") {
        statusText = "着手";
        buttonText = "完了した"
    } else {
        statusText = "完了";
        buttonText = "";
        buttonEnabled = false;
    }
    
    return <Box m={2} p={1} _dark={{bg:"rgb(0,0,50)"}} _light={{bg: "rgb(230,230,255)"}}>
        <Text　fontSize="lg">{props.data.name}</Text>
        <Text>{props.data.deadlineAt.toLocaleString()} まで</Text>
        <HStack justifyContent="space-between" alignItems="center">
            <Text>{statusText}</Text>
            <HStack>
                {buttonEnabled &&
                    <Button  onPress={hStatusChange} m={1}>
                        {buttonText}
                    </Button>
                }
                <Button onPress={hOpenDetail} m={1}>
                    詳細
                </Button    >
                <Button onPress={hOpenCheckList} m={1}>
                    チェックリスト
                </Button    >
            </HStack>
        </HStack>
    </Box>;
}

export default Todo;
