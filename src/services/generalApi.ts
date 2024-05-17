import config from "@/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const generalApi = createApi({
	reducerPath: "generalApi",
	baseQuery: fetchBaseQuery({ baseUrl: `${config.API_URL}/general`, credentials: "include" }),
	tagTypes: ["General"],
	endpoints: (builder) => ({
		getGeneralInfo: builder.query<object, void>({
			providesTags: ["General"],
			query: () => ""
		}),
		postClubWinner: builder.mutation<object, {clubWinner: number}>({
			query: ({ ...post }) => ({
				url: "/winner",
				method: "POST",
				body: post,
			}),
			invalidatesTags: ["General"]
		}),
		getUsersList: builder.query<{
			users: User[], 
			activeBoosters: {user: string, boosters: string[]}[],
			audits: {id: number, user: {email: string}, action: string, params: string, timestamp: string }[]
		}, void>({
			query: () => "/users",
		}),
		getAudit: builder.query<{
			action: string,
			params: string,
		}, number>({
			query: (id) => `/audit/${id}`,
		}),
		postToken: builder.mutation<any, string>({
			query: (token) => ({
				url: `${config.API_URL}/notifications/registration`,
				method: "POST",
				body: {token},
			}),
		}),
	})
});

export const { useGetGeneralInfoQuery, usePostClubWinnerMutation, useGetUsersListQuery, useLazyGetAuditQuery, usePostTokenMutation } = generalApi;