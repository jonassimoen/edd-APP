import { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from "react";
import { useGetProfileQuery, useGetTeamsQuery, useLazyGetProfileQuery, useLazyGetTeamsQuery } from "@/services/usersApi";
import secureLocalStorage from "react-secure-storage";
import { redirect } from "react-router-dom";

declare type AuthContextType = {
	userAuth: {
		user?: User,
		authenticated: boolean,
		teams: Team[]
	},
	setUserAuth: any
};

export const defaultUser: User = {
	id: 0,
	firstName: "",
	lastName: "",
	email: "",
	role: 0,
};

export const AuthContext = createContext<AuthContextType>({
	userAuth: {
		authenticated: false,
		user: defaultUser,
		teams: []
	},
	setUserAuth: () => { /*todo*/}
});

export const AuthContextProvider: FC<PropsWithChildren<object>> = ({ children }) => {
	const [getProfile, { data, isLoading, isError, isSuccess, isFetching: isFetchingProfile }] = useLazyGetProfileQuery();
	const [getTeams, { data: teamsData, isFetching: isFetchingTeams }] = useLazyGetTeamsQuery();

	const [userAuth, setUserAuth] = useState({
		authenticated: false,
		user: defaultUser,
		teams: []
	});

	useEffect(() => {
		if (secureLocalStorage.getItem("token")) {
			if (!isFetchingProfile) {
				getProfile().then(({ data }) => {
					setUserAuth({
						...userAuth,
						authenticated: data && data !== null,
						user: data,
					});
				});
			}
			if (!isFetchingTeams) {
				getTeams().then(({ data }) => {
					setUserAuth({
						...userAuth,
						teams: data.teams,
					});
				});
			}
		}
	}, [secureLocalStorage]);

	// useEffect(() => {
	// 	if (data && data !== null && teamsData && teamsData !== null) {
	// 		secureLocalStorage.setItem('user', JSON.stringify(data));

	// 		setUserAuth({
	// 			user: data,
	// 			teams: teamsData.teams,
	// 			authenticated: data && data !== null,
	// 		});
	// 	}
	// }, [data, teamsData])

	return (
		<AuthContext.Provider
			value={{
				userAuth,
				setUserAuth
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};