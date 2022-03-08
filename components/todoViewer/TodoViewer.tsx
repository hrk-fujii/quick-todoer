import React from "react";
import {task} from "../../defines/types";
import {ScrollView} from "native-base";
import Todo from "./Todo";

const TodoViewer = () => {
    let todoList: React.FC[] = [];

    for (const todoData of sampleList) {
        todoList.push(<Todo data={todoData} />);
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

