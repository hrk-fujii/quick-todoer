import React from "react";
import { Box, Button } from "native-base";
import * as fireStore from "firebase/firestore";
import * as firebaseAuth from "firebase/auth";

const TodoEditor = () => {
    const db = fireStore.getFirestore();
    const user = firebaseAuth.getAuth().currentUser;

    const hSubmit = async () => {
        const data = {
            name: "試験データ",
            description: "試験用タスク",
            status: "yet",
            type: "normal",
            deadlineAt: fireStore.Timestamp.fromDate(new Date(2022, 11, 30, 12, 0)),
            createdAt: fireStore.serverTimestamp(),
            updatedAt: fireStore.serverTimestamp()
        };

        const userRef = fireStore.collection(db, "users/" + user.uid + "/tasks");
        const result = await fireStore.addDoc(userRef, data);
        console.log(result);
    }

    return <Box>
        <Button onPress={hSubmit}>
            実行
        </Button>
    </Box>;
}

export default TodoEditor;
