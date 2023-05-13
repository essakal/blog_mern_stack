import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "./tockenSlice";

export default configureStore({
    reducer:{
        tasks: taskReducer,
    }
});