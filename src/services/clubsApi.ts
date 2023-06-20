import config from "@/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const clubsApi = createApi({
	reducerPath: "clubsApi",
	baseQuery: fetchBaseQuery({ baseUrl: `${config.API_URL}/clubs` }),
	tagTypes: ['Club'],
	endpoints: (builder) => ({

		getClubs: builder.query<Club[], void>({
			query: () => ``,
			providesTags: (res, err, arg) =>
				res
					? [...res.map(({ id }) => ({ type: 'Club' as const, id })), 'Club']
					: ['Club'],
		}),

		getClub: builder.query<Club, number>({
			query: (teamId) => `${teamId}`
		}),

		updateClub: builder.mutation<Club, Partial<Club> & Pick<Club, 'id'>>({
			query: ({ id, ...put }) => ({
				url: `${id}`,
				method: 'PUT',
				body: put,
			}),
			invalidatesTags: (res, err, arg) => [{ type: 'Club', id: arg.id }],
		}),

		createClub: builder.mutation<Club, Partial<Club>>({
			query: ({ ...post }) => ({
				url: ``,
				method: 'POST',
				body: post,
			}),
			invalidatesTags: ['Club']
		}),

		importClubs: builder.mutation<{count: number}, void>({
			query: () => ({
				url: `import`,
				method: 'POST',
			}),
			invalidatesTags: ['Club']
		})
	})
});

export const { useGetClubQuery, useGetClubsQuery, useUpdateClubMutation, useCreateClubMutation, useImportClubsMutation } = clubsApi;