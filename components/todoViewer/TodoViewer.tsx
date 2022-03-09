import React from "react";
import * as firebaseAuth from "firebase/auth";
import * as fireStore from "firebase/firestore";
import {task} from "../../defines/types";
import {ScrollView} from "native-base";
import Todo from "./Todo";

const TodoViewer = () => {
    const [schedules, setSchedules] = React.useState<object>({});
    
    const user = firebaseAuth.getAuth().currentUser;
    const db = fireStore.getFirestore();

    const getSchedules = async () => {
        const schedulesResult = await fireStore.getDocs(fireStore.collection(db, "users/" + user?.uid + "/schedules"));
        let returnData = {};
        schedulesResult.forEach(element => {
            returnData[element.id] = element.data;
        });
        return returnData;
    }
    
    React.useEffect(() => {
        getSchedules().then((data) => {
            setSchedules(data);
        });
    }, []);
    
    let todoList: React.FC[] = [];

    for (const [key, val] of Object.entries(schedules)) {
        todoList.push(<Todo data={val} id={key} />);
    }

    
    return <ScrollView>
        {todoList}
    </ScrollView>
}

export default TodoViewer;

const sample: task = {
    name: "やること",
    description: "とりあえずこれ使ってマークアップしてみる",
    status: "yet",
    type: "normal",
    deadlineAt: new Date(),
    updatedAt: new Date(),
    createdAt: new Date()
}

const sampleList = [sample, sample, sample, sample, sample, sample, sample, sample, sample];

