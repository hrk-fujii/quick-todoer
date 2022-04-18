import React from "react";
import { Box, Button, FormControl, Input, TextArea, Modal, Text } from "native-base";
import * as fireStore from "firebase/firestore";
import * as firebaseAuth from "firebase/auth";
import {useSetRecoilState, useRecoilState} from "recoil";
import {modalData_NoticeModalDialog, modalShow_TodoEditModal} from "../../defines/atoms";
import {getErrorMessage} from "../../utils/errorMessage";


const EditModal = () => {
    const [modalShow, setModalShow] = useRecoilState(modalShow_TodoEditModal);
    const setNoticeDialog = useSetRecoilState(modalData_NoticeModalDialog);
    const [name, setName] = React.useState<string>("");
    const [description, setDescription] = React.useState<string>("");
    const [deadlineString, setDeadlineString] = React.useState<string>("");
    const [isLoading, setIsLoading] = React.useState(false);
    let buttonDisabled = true;
    const deadline = string2Date(deadlineString);
    const nameRef = React.useRef<HTMLInputElement>(null);
    const descriptionRef = React.useRef<HTMLInputElement>(null);
    const deadlineStrRef = React.useRef<HTMLOrSVGScriptElement>(null);
    
    const db = fireStore.getFirestore();
    const user = firebaseAuth.getAuth().currentUser;

    const hClose = () => {
        setName("");
        setDescription("");
        setDeadlineString("");
        setIsLoading(false);
        nameRef.current.clear();
        descriptionRef.current.clear();
        deadlineStrRef.current.clear();
        setModalShow(false);
    }
    
    const hSubmit = async () => {
        setIsLoading(true);
        const data = {
            name: name,
            description: description,
            status: "yet",
            type: "normal",
            deadlineAt: fireStore.Timestamp.fromDate(deadline),
            createdAt: fireStore.serverTimestamp(),
            updatedAt: fireStore.serverTimestamp()
        };

        const userRef = fireStore.collection(db, "users/" + user.uid + "/tasks");
        try {
            await fireStore.addDoc(userRef, data);
            hClose();
        } catch (error) {
            setModalShow(false);
            setNoticeDialogData({show: true, message: getErrorMessage(error.toString()), onClose: () => {setModalShow(true)}});
        }
        setIsLoading(false);
    }

    if (deadline !== null) {
        buttonDisabled = false;
    }

    return <Modal isOpen={modalShow} onClose={hClose} size="full">
        <Modal.Content>
            <Modal.Header>
                やることの内容の入力
            </Modal.Header>
            <Modal.Body>
                <FormControl mb={2}>
                    <Text>タイトル</Text>
                    <Input ref={nameRef} onChangeText={(text) => {setName(text)}} />
                </FormControl>
                <FormControl mb={2}>
                    <Text>説明</Text>
                    <TextArea ref={descriptionRef} height={20} onChangeText={(text) => {setDescription(text)}}></TextArea>
                </FormControl>
                <FormControl mb={2}>
                    <Text>締め切り日時</Text>
                    <Input ref={deadlineStrRef} keyboardType="numeric" value={deadlineString} onChangeText={(text) => {setDeadlineString(text)}} />
                </FormControl>
                <Box>
                    <Text>締め切りに自治は、年4桁、月2桁、24時間法の時2桁、分2桁の最大12桁の数字で入力してください。なお、年、時と分、および分は省略できます。</Text>
                    <Text>年を省略すると当年に、時と分を省略すると23時59分に、分を省略すると0分になります。</Text>
                </Box>
            </Modal.Body>
            <Modal.Footer justifyContent="flex-end">
                <Button disabled={isLoading} onPress={hClose}>
                    中止
                </Button>
                <Button disabled={(buttonDisabled || isLoading)} accessibilityState={{disabled: (buttonDisabled || isLoading)}} onPress={hSubmit}>
                    決定
                </Button>
            </Modal.Footer>
        </Modal.Content>
    </Modal>
}

const string2Date = (value: string): Date|null => {
    if (isNaN(Number(value))) {
        return null;
    }
    if (!((value.length <= 12) && (value.length % 2 === 0))) {
        return null;
    }
    let year = 0;
    let month = 0;
    let date = 0;
    let hour = 0;
    let minute = 0;
    if (Number(value.slice(0, 2)) === 20) {
        if (value.length >= 8) {
            year = Number(value.slice(0, 4));
            month = Number(value.slice(4, 6)) - 1;
            date = Number(value.slice(6, 8));
            hour = 23;
            minute = 59;
        }
        if (value.length >= 10) {
            hour = Number(value.slice(8, 10));
            minute = 0;
        }
        if (value.length >= 12) {
            minute = Number(value.slice(10, 12));
        }
    } else if (Number(value.slice(0, 2)) <= 12) {
        if (value.length >= 4) {
            year = (new Date()).getFullYear();
            month = Number(value.slice(0, 2)) - 1;
            date = Number(value.slice(2, 4));
            hour = 23;
            minute = 59;
        }
        if (value.length >= 6) {
            hour = Number(value.slice(4, 6));
            minute = 0;
        }
        if (value.length >= 8) {
            minute = Number(value.slice(6, 8));
        }
    } else {
        return null;
    }

    if (year < (new Date()).getFullYear()) {
        return null;
    }
    if ((month < 0) || (month > 11)) {
        return null;
    }
    const endDate = (new Date(year, month + 1, 0)).getDate();
    if ((date < 1) || (date > endDate)) {
        return null;
    }
    if ((hour > 23) || (minute > 59)) {
        return null;
    }
    
    return (new Date(year, month, date, hour, minute));
}

export default EditModal;