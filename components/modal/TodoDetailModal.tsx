import React from "react";
import {Modal, Text, Button} from "native-base";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {modalData_TodoDetailModal} from "../../defines/atoms";

const TodoDetailModal = () => {
    const data = useRecoilValue(modalData_TodoDetailModal);
    
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
                <Button m={2}>
                    削除
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
