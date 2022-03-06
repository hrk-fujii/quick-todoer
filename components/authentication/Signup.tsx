import React from "react";
import * as firebaseAuth from "firebase/auth";
import * as fireStore from "firebase/firestore";
import {Box, Button, HStack, VStack, Text, Input } from "native-base";


const Signup = (props: {email: string; uid: string; reload: () => void}) => {
    const auth = firebaseAuth.getAuth();
    const db = fireStore.getFirestore();
    const [name, setName] = React.useState<string>("");
    const hNameInputChange = (textValue: string) => {
        setName(textValue);
    }

    const hSubmit = async () => {
        const userDocRef = fireStore.doc(db, "users/" + props.uid);
        await fireStore.setDoc(userDocRef, {
            email: props.email,
            name: name,
            type: "free",
            planDeadlineAt: fireStore.serverTimestamp(),
            updatedAt: fireStore.serverTimestamp(),
            createdAt: fireStore.serverTimestamp()
        });
        props.reload();
    }

    const hLogout = () => {
        auth.signOut();
    }
    
    return (<VStack space={4}>
        <Box>
            <Text>はじめに会員登録を行います。</Text>
            <Text>ニックネームを入力し、登録ボタンを押してください。</Text>
        </Box>
        <Box>
            <Text>ニックネーム</Text>
            <Input value={name} onChangeText={hNameInputChange} />
        </Box>
        <Box>
            <Text>メールアドレス</Text>
            <Text>{props.email}</Text>
        </Box>
        <Box alignItems="flex-end">
            <HStack>
                <Button onPress={hLogout} width="150px" m={2}>
                    サインアウト
                </Button>
                <Button onPress={hSubmit} width="150px" m={2}>
                    登　録
                </Button>
            </HStack>
        </Box>
    </VStack>);
}

export default Signup
