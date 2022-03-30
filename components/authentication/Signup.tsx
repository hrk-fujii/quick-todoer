import React from "react";
import {useSetRecoilState} from "recoil";
import {createUserData} from "../../defines/atoms";
import * as firebaseAuth from "firebase/auth";
import * as fireStore from "firebase/firestore";
import {Box, Button, HStack, VStack, Text, Input } from "native-base";


const Signup = (props: {setSignup: () => void;}) => {
    const auth = firebaseAuth.getAuth();
    const [name, setName] = React.useState<string>("");
    const [email, setEmail] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    const [confirmPassword, setConfirmPassword] = React.useState<string>("");
    const setCreateUserData = useSetRecoilState(createUserData);
    
    const hSubmit = async () => {
        setCreateUserData({
            name: name
        });
        await firebaseAuth.createUserWithEmailAndPassword(auth, email, password);
    }

    const hLogout = () => {
        props.setSignup();
    }
    
    return (<VStack space={4}>
        <Box safeArea>
            <Text>はじめに会員登録を行います。</Text>
            <Text>以下のフォームに入力し、登録ボタンを押してください。</Text>
        </Box>
        <Box>
            <Text>メールアドレス</Text>
            <Input type="email" keyboardType="email-address" onChangeText={(text)=>{setEmail(text)}} />
        </Box>
        <Box>
            <Text>パスワード</Text>
            <Input type="password" onChangeText={(text)=>{setPassword(text)}} />
        </Box>
        <Box>
            <Text>ニックネーム</Text>
            <Input onChangeText={(text)=>{setName(text)}} />
        </Box>
        <Box alignItems="flex-end">
            <HStack>
                <Button onPress={hLogout} width="150px" m={2}>
                    戻る
                </Button>
                <Button onPress={hSubmit} width="150px" m={2}>
                    登　録
                </Button>
            </HStack>
        </Box>
    </VStack>);
}

export const createUser = async (name: string) => {
    const user = firebaseAuth.getAuth().currentUser;
    const db = fireStore.getFirestore();
    const userDocRef = fireStore.doc(db, "users/" + user?.uid);
    await fireStore.runTransaction(db, async(transaction) => {
        await transaction.set(userDocRef, {
            email: user?.email,
            name: name,
            type: "free",
            planDeadlineAt: fireStore.serverTimestamp(),
            updatedAt: fireStore.serverTimestamp(),
            createdAt: fireStore.serverTimestamp()
        });
    });
}

export default Signup
