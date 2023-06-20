import { isRejectedWithValue } from "@reduxjs/toolkit";
import { App } from "antd";
import { Middleware, MiddlewareAPI } from "redux";

const {notification} = App.useApp();

export const rtkQueryNotification: Middleware = (api: MiddlewareAPI) => (next) => (action) => {
    if(isRejectedWithValue(action)) {
        console.log(action, "rejected");
        notification.error({
            message: 'Something went wrong!',
            description: action.payload.data.message
        })
    }
}