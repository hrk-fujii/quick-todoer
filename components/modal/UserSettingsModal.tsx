import React from "react";
import {Modal, Box, Input, Button, Text} from "native-base";
import {useSetRecoilState, useRecoilState} from "recoil";
import {modalData_NoticeModalDialog, userInfo, modalShow_UserSettingsModal} from "../../defines/atoms";
import * as firebaseAuth from "firebase/auth";
import * as fireStore from "firebase/firestore";
import * as firebaseFunctions from "firebase/functions";
import {getErrorMessage} from "../../utils/errorMessage";

const UserSettingsModal = () => {
    const [password, setPassword] = React.useState<string>("");
    const [name, setName] = React.useState<string>("");
    const [email, setEmail] = React.useState<string>("");
    const [newPassword, setNewPassword] = React.useState<string>("");
    const [confirmNewPassword, setConfirmNewPassword] = React.useState<string>("");

    const [modalShow, setModalShow] = useRecoilState(modalShow_UserSettingsModal);
    const [getUserInfo, setUserInfo] = useRecoilState(userInfo);
    const setNoticeModalData = useSetRecoilState(modalData_NoticeModalDialog);

    const auth = firebaseAuth.getAuth();
    const db = fireStore.getFirestore();
    const functions = firebaseFunctions.getFunctions();
    const userDoc = fireStore.doc(db, "users/" + auth.currentUser?.uid);
        
    const hClose = () => {
        setEmail("");
        setPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        // setModalShow(false);
    }
    
    const hChange = async () => {
        try {
            if (name) {
                await fireStore.runTransaction(db, async (transaction) => {
                    await transaction.update(userDoc, {name: name});
                });
                setUserInfo({...getUserInfo, name: name});
            }
            if (email || newPassword) {
                // const credential = firebaseAuth.EmailAuthProvider.credential(auth.currentUser?.email, password);
                // const userCredential = await firebaseAuth.reauthenticateWithCredential(user, credential);
                if (email) {
                    const updateEmailFunction = firebaseFunctions.httpsCallable(functions, "authFunctions-updateEmail");
                    await updateEmailFunction({password: password, newEmail: email});
                }
                if (newPassword) {
                    const updatePasswordFunction = firebaseFunctions.httpsCallable(functions, "authFunctions-updatePassword");
                    await updatePasswordFunction({password: password, newPassword: newPassword});
                }
                auth.signOut();
            }
        } catch (error) {
            setModalShow(false);
            setNoticeModalData({
                show: true,
                message: getErrorMessage(error.toString()),
                onClose: () => {setModalShow(true)}
            });
        }
    }
    
    return <Modal isOpen={modalShow} size="full">
        <Modal.Content>
            <Modal.Body>
                <Box>
                    <Text>1. メールアドレス、パスワードの変更、および退会するには、現在のパスワードを入力してください。</Text>
                    <Input type="password" placeholder="現在のパスワード" onChangeText={(text) => {setPassword(text)}} />
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
                    <Button onPress={() => {hChange()}} width="100px">
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
