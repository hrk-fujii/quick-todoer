import React from "react";
import * as firebaseFunctions from "firebase/functions";
import * as firebaseAuth from "firebase/auth";
import * as fireStore from "firebase/firestore";
import {Modal, Text, Button} from "native-base";
import {useSetRecoilState, useRecoilState} from "recoil";
import {modalData_TodoReEditModal, modalData_NoticeModalDialog, modalData_YesNoModalDialog, modalData_TodoDetailModal} from "../../defines/atoms";
import {getErrorMessage} from "../../utils/errorMessage";

const TodoDetailModal = () => {
    const [data, setData] = useRecoilState(modalData_TodoDetailModal);
    const [yesNoDialogData, setYesNoDialogData] = useRecoilState(modalData_YesNoModalDialog);
    const setNoticeDialogData = useSetRecoilState(modalData_NoticeModalDialog);
    const setTodoReEditModal = useSetRecoilState(modalData_TodoReEditModal);
    
    const user = firebaseAuth.getAuth().currentUser;
    const db = fireStore.getFirestore();
    const functions = firebaseFunctions.getFunctions();
    
    
    const hDelete = () => {
        setData({...data, show: false});
        
        setYesNoDialogData({
            show: true,
            processing: false,
            message: "「" + data.name + "」を消去しますか。",
            onSelectYes: async () => {
                setYesNoDialogData({...yesNoDialogData, processing: true});
                const docPath = "users/" + user?.uid + "/tasks/" + data.id;
                if (!(data.id)) {
                    return;
                }
                try {
                    const recursiveDeleteFunction = firebaseFunctions.httpsCallable(functions, "fireStoreFunctions-recursiveDelete");
                    await recursiveDeleteFunction({path: docPath});
                } catch (error) {
                    setNoticeDialogData({show: true, message: getErrorMessage(error.toString()), onClose: ()=>{}});
                }
                setYesNoDialogData({...yesNoDialogData, show: false, processing: false});
            },
            onSelectNo: () => {
                setYesNoDialogData({...yesNoDialogData, show: false});
                setData({...data, show: true});
            }
        })
    }

    const hEdit = () => {
        setData({...data, show: false});
        setTodoReEditModal({
            show: true,
            id: data.id,
            name: data.name,
            description: data.description,
            deadlineAt: data.deadlineAt
        });
    }
    
    return <Modal isOpen={data.show} size="full">
        <Modal.Content>
            <Modal.Header>
                {data.name}
            </Modal.Header>
            <Modal.Body>
                <Text>状態： {status2Message(data.status)}</Text>
                <Text>説明：</Text>
                <Text>{data.description}</Text>
                <Text>期限： {data.deadlineAt.toLocaleString()}</Text>
                <Text>作成日時： {data.createdAt.toLocaleString()}</Text>
                <Text>最終更新日時： {data.updatedAt.toLocaleString()}</Text>
            </Modal.Body>
            <Modal.Footer justifyContent="flex-end">
                <Button onPress={hDelete} m={2}>
                    消去
                </Button>
                <Button accessibilityState={{disabled: (data.status === "yet")}} disabled={data.status === "yet"} m={2}>
                    未着手
                </Button>
                <Button onPress={hEdit} m={2}>
                    編集
                </Button>
                <Button onPress={() => {setData({...data, show: false})}} m={2}>
                    閉じる
                </Button>
            </Modal.Footer>
        </Modal.Content>
    </Modal>;
}

const status2Message = (value: string): string => {
    if (value === "yet") {
        return "現在、未着手です。";
    } else if (value === "doing") {
        return "着手しました。";
    } else if (value === "done") {
        return "既に完了しています。";
    } else {
        return "";
    }
}

export default TodoDetailModal;
