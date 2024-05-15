import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import config from "@/config";

export const weeksApi = createApi({
	reducerPath: "weeksApi",
	baseQuery: fetchBaseQuery({ baseUrl: `${config.API_URL}/weeks`, credentials: "include" }),
	tagTypes: ["Week", "Match"],
	endpoints: (builder) => ({
		getWeeks: builder.query<Week[], void>({
			query: () => "",
			providesTags: (res, err, arg) =>
				res
					? [...res.map(({ id }) => ({ type: "Week" as const, id })), "Week"]
					: ["Week"]
		}),

		updateWeek: builder.mutation<Week, Partial<Week> & Pick<Week, "id">>({
			query: ({ id, ...body }) => ({
				url: `${id}`,
				method: "PUT",
				body
			}),
			invalidatesTags: (res, err, arg) => [{ type: "Week", id: arg.id }],
		}),

		createWeek: builder.mutation<Week, Partial<Week>>({
			query: ({ ...body }) => ({
				url: "",
				method: "POST",
				body
			}),
			invalidatesTags: ["Week"]
		}),

		validateWeek: builder.mutation<Week, Partial<Week> & Pick<Week, "id">>({
			query: ({ id, ...body }) => ({
				url: `${id}/validate`,
				method: "POST",
			}),
			invalidatesTags: (res, err, arg) => [{ type: "Week", id: arg.id }, "Match"],
		}),

		getDeadlineInfo: builder.query<{ deadlineInfo: DeadlineInfo, weeks: Week[], rft: string }, void>({
			query: () => "/deadline-info",
			providesTags: (res, err, arg) =>
				res
					? [...res.weeks.map(({ id }) => ({ type: "Week" as const, id })), "Week"]
					: ["Week"]
		}),

	})
});

export const { useGetWeeksQuery, useUpdateWeekMutation, useCreateWeekMutation, useGetDeadlineInfoQuery, useValidateWeekMutation } = weeksApi;