import {atom} from "recoil";

export const modalShow_TodoEditModal = atom<boolean>({
    key: "modalShow_TodoEditModal",
    default: false
});

export const modalData_TodoDetailModal = atom<{
    show: boolean;
    id: string;
    name: string;
    description: string;
    status: string;
    type: string;
    deadlineAt: Date;
    updatedAt: Date;
    createdAt: Date;
}>({
    key: "modalData_TodoDetailModal",
    default: {
        show: false,
        id: "",
        name: "",
        description: "",
        status: "yet",
        type: "normal",
        deadlineAt: new Date(),
        updatedAt: new Date(),
        createdAt: new Date()
    }
});
