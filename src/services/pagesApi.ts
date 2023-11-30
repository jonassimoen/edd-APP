import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import config from "@/config";

export const pagesApi = createApi({
	reducerPath: "pagesApi",
	baseQuery: fetchBaseQuery({ baseUrl: `${config.API_URL}/pages`, credentials: "include" }),
	tagTypes: ["Page"],
	endpoints: (builder) => ({
		getPage: builder.query<Page[], string>({
			query: (arg) => ({
				url: "",
				params: { slug: arg },
			}),
			providesTags: (res, err, arg) =>
				res
					? [...res.map(({ id }) => ({ type: "Page" as const, id })), "Page"]
					: ["Page"]
		}),
	})
});

export const { useGetPageQuery } = pagesApi;