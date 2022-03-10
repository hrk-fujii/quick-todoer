import React from "react";
import * as firebaseAuth from "firebase/auth";
import * as fireStore from "firebase/firestore";
import { Box, HStack, Text, Button } from "native-base";
import { task } from "../../defines/types";

const Todo = (props: {data: task; id: string;}) => {
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
    
    let statusText = "";
    let buttonText = "";
    let buttonDisabled = false;
    if (props.data.status === "yet") {
        statusText = "未着手";
        buttonText = "着手する";
    } else if (props.data.status === "doing") {
        statusText = "着手";
        buttonText = "完了した"
    } else {
        statusText = "完了";
        buttonText = "";
        buttonDisabled = true;
    }
    
    return <Box m={2} p={1} _dark={{bg:"rgb(0,0,150)"}} _light={{bg: "rgb(220,220,255)"}}>
        <Text>{props.data.name}</Text>
        <Text>{props.data.description}</Text>
        <Text>期限: {props.data.deadlineAt.toLocaleString()} ({props.data.createdAt.toLocaleDateString()}作成)</Text>
        <HStack justifyContent="space-between" alignItems="center">
            <Text>状態: {statusText}</Text>
            <HStack>
                <Button  onPress={hStatusChange} disabled={buttonDisabled} m={1}>
                    {buttonText}
                </Button>
                <Button m={1}>
                    詳細
                </Button    >
            </HStack>
        </HStack>
    </Box>;
}

export default Todo;
