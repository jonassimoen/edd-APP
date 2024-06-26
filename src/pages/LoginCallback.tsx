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
	const hasPayed = useMemo(() => userState && userState.user && userState.user.payed, [userState]);

	useEffect(() => {
		if (userState.authenticated) {
			secureLocalStorage.setItem("user", JSON.stringify(userState.user));
		}
	});

	useEffect(() => {
		if (access_token) {
			getProfile();
			getTeams();
		} else {
			// setState({ ...state, redirectToHome: true, isFetching: false });
		}
	}, [access_token]);

	if (profileSuccess && teamSuccess) {
		return (
			<>
				{userState.authenticated && !hasPayed && <Navigate to={{ pathname: "/payment" }} />}

				{userState.authenticated && hasPayed && userState.teams && userState.teams.length !== 0 && <Navigate to={{ pathname: `/team/${userState.teams[0].id}` }} />}

				{userState.authenticated && hasPayed && userState.teams.length === 0 && <Navigate to={{ pathname: "/new" }} />}

				{!userState.authenticated && !hasPayed && <Navigate to={{ pathname: "/home" }} />}
			</>
		);
	} else {
		return (<></>);
	}

};