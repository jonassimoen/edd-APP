import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import secureLocalStorage from "react-secure-storage"

type userAuthState = {
    user?: User,
    authenticated: boolean,
    teams: Team[]
}

const userToken = secureLocalStorage.getItem('userToken') ? secureLocalStorage.getItem('userToken') : null

const initialState: userAuthState = {
    user: secureLocalStorage.getItem('user') ? JSON.parse(secureLocalStorage.getItem('user') as string) : null,
    authenticated: secureLocalStorage.getItem('user') ? true : false,
    teams: [],
}

export const userSlice = createSlice({
    initialState,
    name: 'userSlice',
    reducers: {
        logout: () => initialState,
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.authenticated = !!action.payload;
        },
        setTeams: (state, action: PayloadAction<Team[]>) => {
            state.teams = action.payload;
        }
    }
})
export const userReducer = userSlice.reducer;

export const { logout, setUser, setTeams } = userSlice.actions;