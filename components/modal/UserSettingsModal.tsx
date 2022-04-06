import React from "react";
import {Modal, Box, Input, Button, Text} from "native-base";
import * as firebaseAuth from "firebase/auth";
import * as fireStore from "firebase/firestore";

const UserSettingsModal = () => {
    return <Modal>
        <Modal.Content>
            <Modal.Body>
                <Box>
                    <Text>1. 以下の2または3の操作をするには、現在のパスワードを入力してください。</Text>
                    <Input type="password" />
                </Box>
                <Box>
                    <Text>2. アカウント情報を変更するには、変更したい項目を入力し「変更を適用」をタップしてください。</Text>
                    <Input placeholder="ニックネーム" />
                    <Input placeholder="メールアドレス" type="email" keyboardType="email-address" />
                    <Input placeholder="パスワード" type="password" />
                    <Input placeholder="パスワードの確認" type="password" />
                </Box>
                <Box justifyContent="flex-end">
                    <Button>
                        変更を適用
                    </Button>
                </Box>
                <Box>
                    <Text>3. QuickTodoerから退会するには「データを消去して退会」をタップしてください。なお、この操作を実行するとこのアプリ内のあなたのデータがすべて消去され、元に戻せなくなります。</Text>
                </Box>
                <Box>
                    <Button>
                        アカウントの消去
                    </Button>
                </Box>
            </Modal.Body>
            <Modal.Footer>
                <Button m={1}>
                    閉じる
                </Button>
            </Modal.Footer>
        </Modal.Content>
    </Modal>
}

export default UserSettingsModal;
