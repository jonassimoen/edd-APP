import { useContext, useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { pick } from "lodash";
import secureLocalStorage from "react-secure-storage";
import { useSearchParams } from "react-router-dom";
import { useGetTeamsQuery, useLazyGetProfileQuery, useLazyGetTeamsQuery } from "@/services/usersApi";
import { Button } from "@/components/UI/Button/Button";
import { useAuth } from "@/lib/stores/AuthContext";
import { useAppSelector } from "@/reducers";

export const LoginCallback = () => {
	const [params, setParams] = useSearchParams();

	const userState = useAppSelector((state) => state.userState);
	const [getProfile, { isLoading: profileLoading, isSuccess: profileSuccess }] = useLazyGetProfileQuery();
	const [getTeams, { isLoading: teamLoading, isSuccess: teamSuccess }] = useLazyGetTeamsQuery();
	const access_token = useMemo(() => params.get("token"), [params]);

	useEffect(() => {
		if(userState.authenticated) {
			console.log("user has been authenticated --> saved in localstorage");
			secureLocalStorage.setItem("user", JSON.stringify(userState.user));
		}
	})

	useEffect(() => {
		if (access_token) {
			console.log("token set")
			secureLocalStorage.setItem("token", access_token as string);
			getProfile();
			getTeams();
		} else {
			// setState({ ...state, redirectToHome: true, isFetching: false });
		}
	}, [access_token]);

	console.log(userState);

	useEffect(() => {
		if(profileSuccess && teamSuccess) {
			console.log("auth",userState.authenticated);
			console.log("teams",userState.teams);
			console.log("teamslength",userState.teams.length !== 0);


			console.log("NEW", userState.authenticated && userState.teams.length === 0);
			console.log("TEAMID", userState.authenticated && userState.teams && userState.teams.length !== 0);
			console.log("HOME", !userState.authenticated);
		}
	})

	

	if (profileSuccess && teamSuccess) {
		return (
			<>
				{/* <p>AUTH: {userState.authenticated?"true":"false"}</p>
				<p>teams l: {userState.teams.length}</p>
				
				{userState.authenticated && userState.teams && userState.teams.length !== 0 && "TEAMMM"}

				{userState.authenticated && userState.teams.length === 0 && "NEW"}

				{!userState.authenticated && "HOME"} */}
				{userState.authenticated && userState.teams && userState.teams.length !== 0 && <Navigate to={{ pathname: `/team/${userState.teams[0].id}` }} />}

				{userState.authenticated && userState.teams.length === 0 && <Navigate to={{ pathname: "/new" }} />}

				{!userState.authenticated && <Navigate to={{ pathname: "/home" }} />}
			</>
		);
	} else {
		return (<></>);
	}

};