import React from "react";
import {Modal, Text, Button} from "native-base";
import {modalData_YesNoModalDialog} from "../../defines/atoms";
import {useRecoilValue} from "recoil";

const YesNoModalDialog = () => {
    const data = useRecoilValue(modalData_YesNoModalDialog);

    return <Modal isOpen={data.show}>
        <Modal.Content>
            <Modal.Body>
                {data.message}
            </Modal.Body>
            <Modal.Footer justifyContent="flex-end">
                <Button m={2} onPress={data.onSelectNo}>
                    いいえ
                </Button>
                <Button m={2} onPress={data.onSelectYes}>
                    はい
                </Button>
            </Modal.Footer>
        </Modal.Content>
    </Modal>
}

export default YesNoModalDialog;
