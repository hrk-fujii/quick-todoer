import React from "react";
import * as fireStore from "firebase/firestore";
import * as firebaseAuth from "firebase/auth";
import {useRecoilState} from "recoil";
import { Modal, Checkbox, ScrollView } from "native-base";
import {modalData_CheckListModal} from "../../defines/atoms";
import {checkListItem} from "../../defines/types";
import { ItemClick } from "native-base/lib/typescript/components/composites/Typeahead/useTypeahead/types";

const CheckListModal = (props: {id: string; name: string;}) => {
    const db = fireStore.getFirestore();
    const user = firebaseAuth.getAuth().currentUser;

    const [changed, setChanged] = React.useState<{id: string; state: boolean;}[]>([]);
    const [checkListData , setCheckListData] = React.useState<{id: string; data: checkListItem;}[]>([]);
    const [modalData, setModalData] = useRecoilState(modalData_CheckListModal);
    
    React.useEffect(() => {
        const checkListRef = fireStore.collection(db, "users/" + user.uid + "/tasks/" + modalData.id + "/check_lists");
        const unSubscribe = fireStore.onSnapshot(checkListRef, {
            includeMetadataChanges: true
        }, hChangeCheckList);
    });

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
        if (item.data.isChecked) {
            checkedListProps.push(<Checkbox isChecked={true} key="check_list_item_{item.id}" onChange={(state) => {hChangeCheckState(item.id, state)}}></Checkbox>);
        } else {
            unCheckedListProps.push(<Checkbox isChecked={false} key="check_list_item_{item.id}" onChange={(state) => {hChangeCheckState(item.id, state)}}></Checkbox>);
        }
    })

    const hChangeCheckState = (id: string, state: boolean) => {
        const newChanged: {id: string; state: boolean;}[] = [];
        changed.forEach((item) => {
            if (item.id === id) {
                newChanged.push({id: item.id, state: state});
            } else {
                newChanged.push(item);
            }
        });
        if (!newChanged.some(item => item.id === id)) {
            newChanged.push({id: id, state: state});
        }
        setChanged(newChanged);
    }

    return <Modal isOpen={modalData.show}>
        <Modal.Content>
            <Modal.Header>
                チェックリスト
            </Modal.Header>
            <Modal.Body>
                <ScrollView flex={1}>
                    {checkedListProps}
                    {unCheckedListProps}
                </ScrollView>
            </Modal.Body>
        </Modal.Content>
    </Modal>;
}

export default CheckListModal;
