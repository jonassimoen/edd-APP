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
	})
});

export const { useGetGeneralInfoQuery, usePostClubWinnerMutation } = generalApi;