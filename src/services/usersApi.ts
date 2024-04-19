import config from "@/config";
import { setTeams, setUser } from "@/features/userSlice";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const usersApi = createApi({
	reducerPath: "usersApi",
	tagTypes: ["userTeam"],
	baseQuery: fetchBaseQuery({ baseUrl: `${config.API_URL}/user/`, credentials: "include" }),
	endpoints: (builder) => ({
		logout: builder.mutation<void,void>({
			query: () => ({
				url: "logout",
				method: "POST"
			}),
		}),

		getProfile: builder.query<User, void>({
			query: () => "profile",
			async onQueryStarted(args, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(setUser(data));
				} catch(err) {
					console.error(err);
				}
			}
		}),

		getTeams: builder.query<{ teams: Team[], user: User }, void>({
			query: () => "teams",
			providesTags: ["userTeam"],
			async onQueryStarted(args, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(setTeams(data.teams));
				} catch(err) {
					console.error(err);
				}
			}
		}),
	})
});

export const { useGetProfileQuery, useLazyGetProfileQuery, useGetTeamsQuery, useLazyGetTeamsQuery, useLogoutMutation } = usersApi;