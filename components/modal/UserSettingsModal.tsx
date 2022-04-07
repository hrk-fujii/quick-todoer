import React from "react";
import {Modal, Box, Input, Button, Text} from "native-base";
import {useRecoilState} from "recoil";
import {userInfo, modalShow_UserSettingsModal} from "../../defines/atoms";
import * as firebaseAuth from "firebase/auth";
import * as fireStore from "firebase/firestore";

const UserSettingsModal = () => {
    const [password, setPassword] = React.useState<string>("");
    const [name, setName] = React.useState<string>("");
    const [email, setEmail] = React.useState<string>("");
    const [newPassword, setNewPassword] = React.useState<string>("");
    const [confirmNewPassword, setConfirmNewPassword] = React.useState<string>("");

    const [modalShow, setModalShow] = useRecoilState(modalShow_UserSettingsModal);
    const [getUserInfo, setUserInfo] = useRecoilState(userInfo);

    const auth = firebaseAuth.getAuth();
    
    const hClose = () => {
        setModalShow(false);
    }
    
    return <Modal isOpen={modalShow} size="full">
        <Modal.Content>
            <Modal.Body>
                <Box>
                    <Text>1. 以下の2または3の操作をするには、現在のパスワードを入力してください。</Text>
                    <Input type="password" />
                </Box>
                <Box mt={3}>
                    <Text>2. アカウント情報を変更するには、変更したい項目を入力し「変更を適用」をタップしてください。</Text>
                    <Text numberOfLines={1} ellipsizeMode="tail" mt={2}>ニックネーム: {getUserInfo.name}</Text>
                    <Input placeholder="新しいニックネーム" onChangeText={(text) => {setName(text)}} />
                    <Text numberOfLines={1} ellipsizeMode="tail" mt={2}>メールアドレス: {auth.currentUser?.email}</Text>
                    <Input placeholder="新しいメールアドレス" type="email" keyboardType="email-address" onChangeText={(text) => {setEmail(text)}} />
                    <Text mt={2}>パスワード</Text>
                    <Input placeholder="パスワード" type="password" onChangeText={(text) => {setNewPassword(text)}} />
                    <Input placeholder="パスワードの確認" type="password" onChangeText={(text) => {setConfirmNewPassword(text)}} />
                </Box>
                <Box alignItems="flex-end" mt={2}>
                    <Button width="100px">
                        変更を適用
                    </Button>
                </Box>
                <Box mt={3}>
                    <Text>3. QuickTodoerから退会するには「データを消去して退会」をタップしてください。なお、この操作を実行するとこのアプリ内のあなたのデータがすべて消去され、元に戻せなくなります。</Text>
                </Box>
                <Box alignItems={"flex-end"} mt={1}>
                    <Button width="200px">
                        データを消去して退会
                    </Button>
                </Box>
            </Modal.Body>
            <Modal.Footer>
                <Button onPress={hClose} m={1}>
                    閉じる
                </Button>
            </Modal.Footer>
        </Modal.Content>
    </Modal>
}

export default UserSettingsModal;
