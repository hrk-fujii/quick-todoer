import React from "react";
import * as firebaseAuth from "firebase/auth";
import * as fireStore from "firebase/firestore";
import { Box, HStack, Text, Button } from "native-base";
import { task } from "../../defines/types";
import {useSetRecoilState} from "recoil";
import {modalData_TodoDetailModal, modalData_CheckListModal} from "../../defines/atoms";

const Todo = (props: {data: task; id: string;}) => {
    const setDetailModal = useSetRecoilState(modalData_TodoDetailModal);
    const setCheckListModal = useSetRecoilState(modalData_CheckListModal);
    
    const user = firebaseAuth.getAuth().currentUser;
    const db = fireStore.getFirestore();
    const taskDocRef = fireStore.doc(db, "users/" + user?.uid + "/tasks/" + props.id);
    
    const hStatusChange = async () => {
        if (props.data.status === "yet") {
            await fireStore.updateDoc(taskDocRef, {status: "doing"});
        } else if (props.data.status === "doing") {
            await fireStore.updateDoc(taskDocRef, {status: "done"});
        }
    }

    const hOpenCheckList = () => {
        setCheckListModal({
            show: true,
            id: props.id,
            name: props.data.name
        })
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
    
    return <Box m={2} p={1} _dark={{bg:"rgb(0,0,150)"}} _light={{bg: "rgb(220,220,255)"}}>
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
