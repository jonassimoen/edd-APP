import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import config from "@/config";

export const pagesApi = createApi({
	reducerPath: "pagesApi",
	baseQuery: fetchBaseQuery({ baseUrl: `${config.API_URL}/pages`, credentials: "include" }),
	tagTypes: ["Page"],
	endpoints: (builder) => ({
		getPages: builder.query<Page[], void>({
			query: () => "",
			providesTags: (res, err, arg) =>
				res
					? [...res.map(({ id }) => ({ type: "Page" as const, id })), "Page"]
					: ["Page"]
		}),

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

		createPage: builder.mutation<{ msg: string }, Page>({
			invalidatesTags: ["Page"],
			query: (args) => ({
				url: "",
				method: "POST",
				body: args
			}),
		}),

		updatePage: builder.mutation<{ msg: string }, Page>({
			query: ({ id, ...data }) => ({
				url: `${id}`,
				method: "PUT",
				body: data
			}),
			invalidatesTags: (res, err, arg) => [{ type: "Page", id: arg.id }]
		}),

		deletePage: builder.mutation<{ msg: string }, Partial<Page> & Pick<Page, "id">>({
			invalidatesTags: (res, err, arg) => [{ type: "Page", id: arg.id }],
			query: ({ id }) => ({
				url: `${id}`,
				method: "DELETE",
			}),
		}),
	})
});

export const { useGetPagesQuery, useGetPageQuery, useCreatePageMutation, useUpdatePageMutation, useDeletePageMutation } = pagesApi;