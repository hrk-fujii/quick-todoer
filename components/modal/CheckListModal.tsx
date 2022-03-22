import React from "react";
import * as fireStore from "firebase/firestore";
import * as firebaseAuth from "firebase/auth";
import {useRecoilState} from "recoil";
import { Text, Modal, Button, Checkbox, ScrollView } from "native-base";
import {modalData_CheckListModal} from "../../defines/atoms";
import {checkListItem} from "../../defines/types";
import { ItemClick } from "native-base/lib/typescript/components/composites/Typeahead/useTypeahead/types";
import { onAuthStateChanged } from "firebase/auth";

const CheckListModal = (props: {id: string; name: string;}) => {
    const db = fireStore.getFirestore();
    const user = firebaseAuth.getAuth().currentUser;

    const [changed, setChanged] = React.useState<object>({});
    const [checkListData , setCheckListData] = React.useState<{id: string; data: checkListItem;}[]>([]);
    const [modalData, setModalData] = useRecoilState(modalData_CheckListModal);
    
    React.useEffect(() => {
        let taskId = "_";
        if (modalData.id !== "") {
            taskId = modalData.id;
        }
        const checkListRef = fireStore.collection(db, "users/" + user.uid + "/tasks/" + taskId + "/check_list");
        const unSubscribe = fireStore.onSnapshot(checkListRef, {
            includeMetadataChanges: true
        }, hChangeCheckList);
    }, [modalData]);

    const hNewItem = () => {
        const checkListCollectionRef = fireStore.collection(db, "users/" + user?.uid + "/tasks/" + modalData.id + "/check_list");
        fireStore.addDoc(checkListCollectionRef, {
            name: "test item",
            isChecked: false,
            updatedAt: fireStore.serverTimestamp(),
            createdAt: fireStore.serverTimestamp()
        })
    }
    
    const hChangeCheckList = (docs: fireStore.QuerySnapshot) => {
        if (docs.metadata.hasPendingWrites) {
            return;
        }
        let result: {id: string; data: checkListItem;}[] = [];
        docs.forEach((item) => {
            const itemData = item.data();
            const data: checkListItem = {
                name: itemData.name,
                isChecked: itemData.isChecked,
                createdAt: itemData.createdAt.toDate(),
                updatedAt: itemData.createdAt.toDate()
            }
            result.push({id: item.id, data: itemData});
        })
        
        setCheckListData(result);
    }
    
    let checkedListProps: React.FC[] = [];
    let unCheckedListProps: React.FC[] = [];

    checkListData.forEach((item) => {
        console.log(changed);
        if (item.data.isChecked) {
            checkedListProps.push(<Checkbox defaultIsChecked key={"check_list_item_" + item.id} accessibilityLabel={item.data.name} onChange={(state) => {setChanged(val => {
                val[item.id] = state;
                return {...val};
            })}}>{item.data.name}</Checkbox>);
        } else {
            unCheckedListProps.push(<Checkbox key={"check_list_item_" + item.id} accessibilityLabel={item.data.name} onChange={(state) => {setChanged(val => {
                val[item.id] = state;
                return {...val};
            })}}>{item.data.name}</Checkbox>);
        }
    })

    const hChangeCheckState = (id: string, state: boolean) => {
        changed.forEach((item) => {
            if (item.id === id) {
                newChanged.push({id: item.id, state: state});
            } else {
                newChanged.push({id: item.id, state: item.state});
            }
        });
        if (!newChanged.some(item => item.id === id)) {
            newChanged.push({id: id, state: state});
        }
        setChanged(newChanged);
    }

    const hApplyChange = async () => {
        const checkListPath = "users/" + user?.uid + "/tasks/" + modalData.id + "/check_list/";
        await fireStore.runTransaction(db, async (transaction) => {
            await Object.entries(changed).forEach(async ([key, state]) => {
                const itemRef = fireStore.doc(db, checkListPath + key);
                await transaction.update(itemRef, {
                    isChecked: state,
                    updatedAt: fireStore.serverTimestamp()
                });
            });
        });
        setChanged({});
    }

    return <Modal isOpen={modalData.show}>
        <Modal.Content>
            <Modal.Header>
                チェックリスト
            </Modal.Header>
            <Modal.Body>
                <ScrollView flex={1}>
                    {checkedListProps}
                    <Text>UNCHECKED</Text>
                    {unCheckedListProps}
                </ScrollView>
            </Modal.Body>
            <Modal.Footer>
                <Button onPress={hNewItem} m={2}>
                    テスト値追加
                </Button>
                <Button onPress={hApplyChange} m={2}>
                    変更を保存
                </Button>
            </Modal.Footer>
        </Modal.Content>
    </Modal>;
}

export default CheckListModal;
