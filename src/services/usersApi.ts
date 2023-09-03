import config from "@/config";
import { setTeams, setUser } from "@/features/userSlice";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const usersApi = createApi({
	reducerPath: "usersApi",
	tagTypes: ["userTeams"],
	baseQuery: fetchBaseQuery({ baseUrl: `${config.API_URL}/user/` }),
	endpoints: (builder) => ({
		getProfile: builder.query<User, void>({
			query: () => "profile",
			async onQueryStarted(args, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(setUser(data));
				} catch(err) {}
			}
		}),

		getTeams: builder.query<{ teams: Team[], user: User }, void>({
			query: () => "teams",
			providesTags: ["userTeams"],
			async onQueryStarted(args, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(setTeams(data.teams));
				} catch(err) {}
			}
		}),
	})
});

export const { useGetProfileQuery, useLazyGetProfileQuery, useGetTeamsQuery, useLazyGetTeamsQuery } = usersApi;