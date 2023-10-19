import config from "@/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const matchesApi = createApi({
	reducerPath: "matchesApi",
	baseQuery: fetchBaseQuery({ baseUrl: `${config.API_URL}/matches`, credentials: "include" }),
	tagTypes: ["Match", "MatchEvents", "MatchStatistics", "PlayerStats"],
	endpoints: (builder) => ({

		getMatches: builder.query<Match[], void>({
			query: () => "",
			providesTags: (res, err, arg) =>
				res
					? [...res.map(({ id }) => ({ type: "Match" as const, id })), "Match"]
					: ["Match"],
		}),

		getMatch: builder.query<Match, number>({
			query: (id) => `${id}`
		}),

		updateMatch: builder.mutation<Match, Partial<Match> & Pick<Match, "id">>({
			query: ({ id, ...put }) => ({
				url: `${id}`,
				method: "PUT",
				body: put,
			}),
			invalidatesTags: (res, err, arg) => [{ type: "Match", id: arg.id }],
		}),

		createMatch: builder.mutation<Match, Partial<Match>>({
			query: ({ ...post }) => ({
				url: "",
				method: "POST",
				body: post,
			}),
			invalidatesTags: ["Match"]
		}),

		importMatches: builder.mutation<{ count: number }, void>({
			query: () => ({
				url: "import",
				method: "POST",
			}),
			invalidatesTags: ["Match"]
		}),



		getMatchEvents: builder.query<MatchEvent[], number>({
			query: (matchId) => `${matchId}/events`,
			providesTags: (res, err, arg) =>
				res
					? [...res.map(({ matchId }) => ({ type: "MatchEvents" as const, matchId })), "MatchEvents"]
					: ["MatchEvents"],
		}),

		updateMatchEvents: builder.mutation<MatchEvent, Partial<MatchEvent> & Pick<MatchEvent, "matchId">>({
			query: ({ matchId, ...put }) => ({
				url: `${matchId}/events`,
				method: "PUT",
				body: put,
			}),
			invalidatesTags: (res, err, arg) => [{ type: "MatchEvents", id: arg.matchId }, { type: "Match", id: arg.matchId }],
		}),

		createMatchEvents: builder.mutation<MatchEvent, { events: Partial<MatchEvent>[], matchId: number }>({
			query: ({ matchId, events }) => ({
				url: `${matchId}/events`,
				method: "POST",
				body: [...events],
			}),
			invalidatesTags: (res, err, arg) => [{ type: "MatchEvents", id: arg.matchId }, { type: "Match", id: arg.matchId }],
		}),

		createMatchStarting: builder.mutation<MatchEvent, { startingIds: number[], matchId: number }>({
			query: ({ matchId, startingIds }) => ({
				url: `${matchId}/events/starting`,
				method: "POST",
				body: [...startingIds],
			}),
			invalidatesTags: (res, err, arg) => [{ type: "MatchEvents", id: arg.matchId }, { type: "Match", id: arg.matchId }],
		}),




		getMatchStatistics: builder.query<Statistic[], number>({
			query: (matchId) => `${matchId}/stats`,
			providesTags: (res, err, arg) =>
				res
					? [...res.map(({ matchId }) => ({ type: "MatchStatistics" as const, matchId })), "MatchStatistics"]
					: ["MatchStatistics"],
		}),

		updateMatchStatistics: builder.mutation<Statistic[], { stats: Partial<Statistic>[], matchId: number }>({
			query: ({ matchId, stats }) => ({
				url: `${matchId}/stats`,
				method: "PUT",
				body: [...stats],
			}),
			invalidatesTags: (res, err, arg) => [{ type: "MatchStatistics", id: arg.matchId }, { type: "Match", id: arg.matchId }, "PlayerStats"],
		}),

		createMatchStatistics: builder.mutation<Statistic[], { stats: Partial<Statistic>[], matchId: number }>({
			query: ({ matchId, stats }) => ({
				url: `${matchId}/stats`,
				method: "POST",
				body: [...stats],
			}),
			invalidatesTags: (res, err, arg) => [{ type: "MatchStatistics", id: arg.matchId }, { type: "Match", id: arg.matchId }, "PlayerStats"],
		}),

		importMatchStatistics: builder.query<Statistic[], number>({
			query: (matchId) => `${matchId}/stats/import`,
			providesTags: (res, err, arg) =>
				res
					? [{ type: "MatchStatistics" as const, id: arg }, "MatchStatistics"]
					: ["MatchStatistics"],
		}),
	})
});

export const {
	useGetMatchQuery,
	useGetMatchesQuery,
	useUpdateMatchMutation,
	useCreateMatchMutation,
	useGetMatchEventsQuery,
	useUpdateMatchEventsMutation,
	useCreateMatchEventsMutation,
	useCreateMatchStartingMutation,
	useGetMatchStatisticsQuery,
	useCreateMatchStatisticsMutation,
	useUpdateMatchStatisticsMutation,
	useImportMatchesMutation,
	useLazyImportMatchStatisticsQuery
} = matchesApi;