import React from "react";
import {Modal, Text, Button} from "native-base";
import {modalData_NoticeModalDialog} from "../../defines/atoms";
import {useRecoilState} from "recoil";

const NoticeModalDialog = () => {
    const [data, setData] = useRecoilState(modalData_NoticeModalDialog);

    const hClose = () => {
        data.onClose();
        setData({
            show: false,
            message: "",
            onClose: () => {}
        });
    }
    
    return <Modal isOpen={data.show}>
        <Modal.Content>
            <Modal.Body>
                {data.message}
            </Modal.Body>
            <Modal.Footer justifyContent="flex-end">
                <Button m={2} onPress={hClose}>
                    OK
                </Button>
            </Modal.Footer>
        </Modal.Content>
    </Modal>
}

export default NoticeModalDialog;
