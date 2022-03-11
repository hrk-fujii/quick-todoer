import React from "react";
import { Box, Button, FormControl, Input, TextArea, Modal, Text } from "native-base";
import * as fireStore from "firebase/firestore";
import * as firebaseAuth from "firebase/auth";

const TodoEditor = () => {
    const [modalShow, setModalShow] = React.useState<boolean>(false);

    const hClose = () => {
        setModalShow(false);
    }
    
    return <Box>
        <Button onPress={() => {setModalShow(true)}}>
            追加
        </Button>
        <EditModal modalShow={modalShow} onClose={hClose} />
    </Box>;
}

const EditModal = (props: {modalShow: boolean; onClose: () => void;}) => {
    const [name, setName] = React.useState<string>("");
    const [description, setDescription] = React.useState<string>("");
    
    const db = fireStore.getFirestore();
    const user = firebaseAuth.getAuth().currentUser;

    const hSubmit = async () => {
        const data = {
            name: name,
            description: description,
            status: "yet",
            type: "normal",
            deadlineAt: fireStore.Timestamp.fromDate(new Date(2022, 11, 30, 12, 0)),
            createdAt: fireStore.serverTimestamp(),
            updatedAt: fireStore.serverTimestamp()
        };

        const userRef = fireStore.collection(db, "users/" + user.uid + "/tasks");
        const result = await fireStore.addDoc(userRef, data);
        props.onClose();
    }

    return <Modal isOpen={props.modalShow} onClose={props.onClose} size="full">
        <Modal.Content>
            <Modal.Header>
                やることの内容の入力
            </Modal.Header>
            <Modal.Body>
                <FormControl mb={2}>
                    <Text>タイトル</Text>
                    <Input value={name} onChangeText={(text) => {setName(text)}} />
                </FormControl>
                <FormControl mb={2}>
                    <Text>説明</Text>
                    <TextArea height={20} value={description} onChangeText={(text) => {setDescription(text)}}></TextArea>
                </FormControl>
                <FormControl mb={2}>
                    <Text>締め切り日時</Text>
                    <Input />
                </FormControl>
                <Box>
                    <Text>締め切りに自治は、年4桁、月2桁、24時間法の時2桁、分2桁の最大12桁の数字で入力してください。なお、年、時と分、および分は省略できます。</Text>
                    <Text>年を省略すると当年に、時と分を省略すると23時59分に、分を省略すると0分になります。</Text>
                </Box>
            </Modal.Body>
            <Modal.Footer justifyContent="flex-end">
                <Button onPress={props.onClose}>
                    中止
                </Button>
                <Button onPress={hSubmit}>
                    決定
                </Button>
            </Modal.Footer>
        </Modal.Content>
    </Modal>
}

export default TodoEditor;
