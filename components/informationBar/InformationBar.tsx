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
    
    return <Box alignItems="center" justifyContent="space-between" flexDirection="row">
        <Text flex={1}>{userInfoValue.name}さん</Text>
        <Button onPress={hOpen} m={2}>ユーザー設定</Button>
        <Button onPress={() => {hLogout()}} m={2}>ログアウト</Button>
    </Box>
}

export default InformationBar;
