import config from "@/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url } from "inspector";

export const teamsApi = createApi({
	reducerPath: "teamsApi",
	baseQuery: fetchBaseQuery({ baseUrl: `${config.API_URL}/teams` }),
	endpoints: (builder) => ({

		getTeam: builder.query<Team, number>({
			query: (teamId) => `${teamId}`
		}),

		addTeam: builder.mutation<Team, object>({
			query: (data) => ({
				url: "add",
				method: "POST",
				body: data
			})
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