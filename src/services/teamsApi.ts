import config from "@/config";
import { setTeams } from "@/features/userSlice";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url } from "inspector";

export const teamsApi = createApi({
	reducerPath: "teamsApi",
	tagTypes: ["userTeams"],
	baseQuery: fetchBaseQuery({ baseUrl: `${config.API_URL}/teams` }),
	endpoints: (builder) => ({

		getTeam: builder.query<Team, number>({
			query: (teamId) => `${teamId}`,
			providesTags: ["userTeams"],
		}),

		addTeam: builder.mutation<{team:Team}, object>({
			invalidatesTags: ["userTeams"],
			query: (data) => ({
				url: "add",
				method: "POST",
				body: data
			}),
		}),

		// updatePlayer: builder.mutation<Player, Partial<Player> & Pick<Player, 'id'>>({
		// 	query: ({ id, ...put }) => ({
		// 		url: `${id}`,
		// 		method: 'PUT',
		// 		body: put,
		// 	}),
		// 	invalidatesTags: (result, error, arg) => [{ type: 'Player', id: arg.id }],
		// }),
	})
});

export const { useGetTeamQuery, useLazyGetTeamQuery, useAddTeamMutation } = teamsApi;