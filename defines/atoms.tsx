import {atom} from "recoil";

export const modalData_YesNoModalDialog = atom<{
    show: boolean;
    message: string;
    onSelectYes: () => void;
    onSelectNo: () => void;
}>({
    key: "modalData_YesNoModalDialog",
    default: {
        show: false,
        message: "",
        onSelectYes: () => {return},
        onSelectNo: () => {return}
    }
});

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
