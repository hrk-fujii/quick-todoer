import React from "react";
import {Modal, Text, Button} from "native-base";
import {useRecoilState} from "recoil";
import {modalData_YesNoModalDialog, modalData_TodoDetailModal} from "../../defines/atoms";

const TodoDetailModal = () => {
    const [data, setData] = useRecoilState(modalData_TodoDetailModal);
    const [yesNoDialogData, setYesNoDialogData] = useRecoilState(modalData_YesNoModalDialog);
    
    const hDelete = () => {
        setData({...data, show: false});
        setYesNoDialogData({
            show: true,
            message: "「" + data.name + "」を消去しますか。",
            onSelectYes: () => {},
            onSelectNo: () => {
                setYesNoDialogData({...yesNoDialogData, show: false});
                setData({...data, show: true});
            }
        })
    }
    
    return <Modal isOpen={data.show} size="full">
        <Modal.Content>
            <Modal.Header>
                {data.name}
            </Modal.Header>
            <Modal.Body>
                <Text>状態： {data.status}</Text>
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
                <Button m={2}>
                    編集
                </Button>
                <Button m={2}>
                    閉じる
                </Button>
            </Modal.Footer>
        </Modal.Content>
    </Modal>;
}

export default TodoDetailModal;
