export type user = {
    email: string;
    name: string;
    type: string;
    updatedAt: Date;
    createdAt: Date;
    planDeadlineAt: Date;
};

export type task = {
    name: string;
    description: string;
    status: string;
    type: string;
    deadlineAt: Date;
    createdAt: Date;
    updatedAt: Date;
};
