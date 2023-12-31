import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
	name: "currentUser",
	initialState: {
		currentUser: null,
	},
	reducers: {
		updateUser: (state, action) => {
			// console.log("action", action);
			state.currentUser = action.payload;
		},
	},
});

export const { updateUser } = userSlice.actions;

export default userSlice.reducer;
