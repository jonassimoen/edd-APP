import config from "@/config";
import { setTeams } from "@/features/userSlice";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url } from "inspector";

export const teamsApi = createApi({
	reducerPath: "teamsApi",
	tagTypes: ["userTeam", "userTeamPoints"],
	baseQuery: fetchBaseQuery({ baseUrl: `${config.API_URL}/teams`, credentials: "include" }),
	endpoints: (builder) => ({

		getTeam: builder.query<{ team: Team, players: Player[], transfers: Transfer[] }, number>({
			query: (teamId) => `${teamId}`,
			providesTags: ["userTeam"],
		}),

		addTeam: builder.mutation<{ team: Team }, object>({
			invalidatesTags: ["userTeam"],
			query: (data) => ({
				url: "add",
				method: "POST",
				body: data
			}),
		}),

		updateTeamSelection: builder.mutation<{ msg: string }, { teamId: number, bench: number[], starting: number[], teamName: string, captainId: number, viceCaptainId: number }>({
			invalidatesTags: ["userTeam"],
			query: ({ teamId, ...data }) => ({
				url: `${teamId}/selections`,
				method: "POST",
				body: data
			}),
		}),

		submitTransfers: builder.mutation<{ msg: string, team: Team }, { teamId: number, transfers: Transfer[] }>({
			invalidatesTags: ["userTeam"],
			query: ({ teamId, ...data }) => ({
				url: `${teamId}/transfers`,
				method: "POST",
				body: data,
			})
		}),
		
		activateBooster: builder.mutation<{message: string}, { teamId: number, type: string }>({
			invalidatesTags: ["userTeam"],
			query: ({ teamId, ...data }) => ({
				url: `${teamId}/booster`,
				method: "POST",
				body: data
			}),
		}),

		getPoints: builder.query<{team:Team, players:Player[]}, {teamId: number, weekId: number}>({
			query: ({teamId, weekId}) => `${teamId}/points/${weekId}`,
			providesTags: ["userTeamPoints"],
		}),

		getTeamRankings: builder.query<{team: Team, user: User}, void>({
			query: () => "/rankings"
		}) 
	})
});

export const { 
	useGetTeamQuery, 
	useLazyGetTeamQuery,
	useAddTeamMutation, 
	useUpdateTeamSelectionMutation, 
	useLazyGetPointsQuery, 
	useSubmitTransfersMutation,
	useGetTeamRankingsQuery,
	useActivateBoosterMutation,
} = teamsApi;