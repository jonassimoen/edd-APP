import config from "@/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const playersApi = createApi({
	reducerPath: "playersApi",
	baseQuery: fetchBaseQuery({ baseUrl: `${config.API_URL}/players` }),
	tagTypes: ['Player'],
	endpoints: (builder) => ({

		getPlayers: builder.query<Player[], void>({
			query: () => ``,
			providesTags: (result, error, arg) =>
				result
					? [...result.map(({ id }) => ({ type: 'Player' as const, id })), 'Player']
					: ['Player'],
		}),

		getPlayer: builder.query<Player, number>({
			query: (teamId) => `${teamId}`,
		}),

		updatePlayer: builder.mutation<Player, Partial<Player> & Pick<Player, 'id'>>({
			query: ({ id, ...put }) => ({
				url: `${id}`,
				method: 'PUT',
				body: put,
			}),
			invalidatesTags: (result, error, arg) => [{ type: 'Player', id: arg.id }],
		}),

		createPlayer: builder.mutation<Player, Partial<Player>>({
			query: ({ ...post }) => ({
				url: ``,
				method: 'POST',
				body: post,
			}),
			invalidatesTags: ['Player']
		}),

		importPlayers: builder.mutation<{count: number}, void>({
			query: () => ({
				url: `import`,
				method: 'POST',
			}),
			invalidatesTags: ['Player']
		})
	})
});

export const { useGetPlayerQuery, useGetPlayersQuery, useUpdatePlayerMutation, useCreatePlayerMutation, useImportPlayersMutation } = playersApi;