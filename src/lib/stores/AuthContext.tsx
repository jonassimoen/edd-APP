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
	setUserAuth: () => { }
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
			console.log("found token");
			if (!isFetchingProfile) {
				console.log("FETCHING PROFILE");
				getProfile().then(({ data }) => {
					console.log("FETCHED PROFILE:", data);
					console.log("STATE BEFORE FETCH PROFILE",userAuth);
					setUserAuth({
						...userAuth,
						authenticated: data && data !== null,
						user: data,
					});
					console.log("STATE AFTER FETCH PROFILE",userAuth);
				});
			}
			if (!isFetchingTeams) {
				console.log("FETCHING TEAMS");
				getTeams().then(({ data }) => {
					console.log("FETCHED TEAMS:", data);
					console.log("STATE AFTER FETCH TEAMS",userAuth);
					setUserAuth({
						...userAuth,
						teams: data.teams,
					});
					console.log("STATE BEFORE FETCH TEAMS",userAuth);
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
	// 		console.log("FOUND PROFILE + TEAMS")
	// 	}
	// }, [data, teamsData])
	// // console.log("usercontext",user, "auth", authenticated);

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