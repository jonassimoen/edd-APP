import config from "@/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const matchesApi = createApi({
	reducerPath: "matchesApi",
	baseQuery: fetchBaseQuery({ baseUrl: `${config.API_URL}/matches`, credentials: "include" }),
	tagTypes: ["Match", "MatchStatistics", "PlayerStats", "ImportedMatchStatistics"],
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

		recalculateMatchPoints: builder.mutation<{msg: string}, number>({
			query: (id: number) => ({
				url: `${id}/recalculate`,
				method: "POST",
				body: {},
			}),
			invalidatesTags: (res, err, arg) => ["PlayerStats", "MatchStatistics"],
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
				method: "GET",
			}),
			invalidatesTags: ["Match"]
		}),

		getMatchStatistics: builder.query<Statistic[], number>({
			query: (matchId) => `${matchId}/stats`,
			providesTags: (res, err, arg) =>
				res
					? [...res.map(({ matchId }) => ({ type: "MatchStatistics" as const, matchId })), "MatchStatistics"]
					: ["MatchStatistics"],
		}),

		updateMatchStatistics: builder.mutation<Statistic[], { stats: Partial<Statistic>[], matchId: number, score: { home: number, away: number}, goalMinutes: { home: number[], away: number[]} }>({
			query: ({ matchId, stats, score, goalMinutes }) => ({
				url: `${matchId}/stats`,
				method: "PUT",
				body: {stats, score, goalMinutes},
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

		importMatchStatistics: builder.query<{players: Statistic[], goals: number[][]}, number>({
			query: (matchId) => `${matchId}/stats/import`,
			providesTags: (res, err, arg) =>
				res
					? [{ type: "ImportedMatchStatistics" as const, id: arg }, "ImportedMatchStatistics"]
					: ["ImportedMatchStatistics"],
		}),
	})
});

export const {
	useGetMatchQuery,
	useGetMatchesQuery,
	useUpdateMatchMutation,
	useRecalculateMatchPointsMutation,
	useCreateMatchMutation,
	useGetMatchStatisticsQuery,
	useCreateMatchStatisticsMutation,
	useUpdateMatchStatisticsMutation,
	useImportMatchesMutation,
	useLazyImportMatchStatisticsQuery
} = matchesApi;