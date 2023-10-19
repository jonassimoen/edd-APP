import config from "@/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const playerStatsApi = createApi({
	reducerPath: "playerStatsApi",
	baseQuery: fetchBaseQuery({ baseUrl: `${config.API_URL}/player-stats`, credentials: "include" }),
	tagTypes: ["PlayerStats"],
	endpoints: (builder) => ({

		getPlayerStats: builder.query<Statistic[], void>({
			query: () => "",
			providesTags: (result, error, arg) =>
				result
					? [...result.map(({ id }) => ({ type: "PlayerStats" as const, id })), "PlayerStats"]
					: ["PlayerStats"],
		}),

		// getPlayer: builder.query<Player, number>({
		// 	query: (teamId) => `${teamId}`,
		// }),

		// updatePlayer: builder.mutation<Player, Partial<Player> & Pick<Player, 'id'>>({
		// 	query: ({ id, ...put }) => ({
		// 		url: `${id}`,
		// 		method: 'PUT',
		// 		body: put,
		// 	}),
		// 	invalidatesTags: (result, error, arg) => [{ type: 'Player', id: arg.id }],
		// }),

		// createPlayer: builder.mutation<Player, Partial<Player>>({
		// 	query: ({ ...post }) => ({
		// 		url: ``,
		// 		method: 'POST',
		// 		body: post,
		// 	}),
		// 	invalidatesTags: ['Player']
		// }),
	})
});

export const { useGetPlayerStatsQuery } = playerStatsApi;
