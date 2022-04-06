import React from "react";
import {Box, Text, Button} from "native-base";
import * as firebaseAuth from "firebase/auth";
import {useRecoilState, useSetRecoilState} from "recoil";
import {userInfo, modalShow_UserSettingsModal} from "../../defines/atoms";


const InformationBar = () => {
    const [userInfoValue, setUserInfo] = useRecoilState(userInfo);
    const setModalShow = useSetRecoilState(modalShow_UserSettingsModal);
    const auth = firebaseAuth.getAuth();

    const hOpen = () => {
        setModalShow(true);
    }

    const hLogout = async () => {
        await firebaseAuth.signOut(auth);
        setUserInfo({name: ""})
    }
    
    return <Box justifyContent="space-between" flexDirection="row">
        <Text>{userInfoValue.name}さん</Text>
        <Button onPress={hOpen} m={1}>ユーザー設定</Button>
        <Button onPress={() => {hLogout()}} m={1}>ログアウト</Button>
    </Box>
}

export default InformationBar;
