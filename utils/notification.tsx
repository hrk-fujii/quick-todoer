import React from "react";
import * as notifications from "expo-notifications";

export const setNotification = async (title: string, description: string, deadlineAt: Date) => {
    const dateTrigger = (new Date(deadlineAt)).setDate(deadlineAt.getDate() - 1);
    const hourTrigger = (new Date(deadlineAt)).setHours(deadlineAt.getHours() - 1);
    try {
        await notifications.scheduleNotificationAsync({
            content: {
                body: title + "\n明日 " + deadlineAt.toLocaleTimeString() + "\n" + description
            },
            trigger: dateTrigger
        });
    } catch (error) {}
    try {
        await notifications.scheduleNotificationAsync({
            content: {
                body: "やることの締切が迫っています！\n" + title + "\n本日 " + deadlineAt.toLocaleTimeString() + "\n" + description
            },
            trigger: hourTrigger
        });
    } catch (error) {}
}
