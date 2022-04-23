import React from "react";
import * as notifications from "expo-notifications";
import * as firebaseAuth from "firebase/auth";
import * as fireStore from "firebase/firestore";
import {task} from "../../defines/types";
import {ScrollView} from "native-base";
import Todo from "./Todo";
import * as notificationUtils from "../../utils/notification";

const TodoViewer = () => {
    const [tasks, setTasks] = React.useState<object>({});
    
    const user = firebaseAuth.getAuth().currentUser;
    const db = fireStore.getFirestore();

    const hChangeTasks = async (docs: fireStore.QuerySnapshot) => {
        if (docs.metadata.hasPendingWrites) {
            return;
        }

        await notifications.cancelAllScheduledNotificationsAsync();
        let setData = {};
        docs.forEach(element => {
            let todoData = element.data();
            todoData.deadlineAt = todoData.deadlineAt.toDate();
            todoData.updatedAt = todoData.updatedAt.toDate();
            todoData.createdAt = todoData.createdAt.toDate();
            setData[element.id] = todoData;
            if (todoData.status !== "done") {
                notificationUtils.setNotification(todoData.name, todoData.description, todoData.deadlineAt).
                    then((result)=>{return}, (error)=>{return});
            }
        });
        setTasks(setData);
    }
    
    React.useEffect(() => {
        const tasksRef = fireStore.collection(db, "users/" + user?.uid + "/tasks");
        const unSubscribe = fireStore.onSnapshot(tasksRef, {
            includeMetadataChanges: true
        }, (element) => {
            hChangeTasks(element).then((value) => {
                return;
            }, (error) => {
                return;
            });
        }, (error) => {return});
    }, []);
    
    let todoList: React.FC[] = [];

    for (const [key, val] of Object.entries(tasks)) {
        todoList.push(<Todo data={val} id={key} key={"tasks_" + key} />);
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

