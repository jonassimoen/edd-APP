import config from "@/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const newsApi = createApi({
	reducerPath: "newsApi",
	baseQuery: fetchBaseQuery({ baseUrl: `${config.API_URL}/news`, credentials: "include" }),
	tagTypes: ["Article"],
	endpoints: (builder) => ({
		getNews: builder.query<{articles: Article[], count: number}, number | void>({
			query: (Article: number) => {
				return !Article ?  "" : {
					url: "",
					params: {Article: Article}
				};
			},
			providesTags: (res, err, arg) =>
				res
					? [...res.articles.map(({ id }) => ({ type: "Article" as const, id })), "Article"]
					: ["Article"],
		}),

		getArticle: builder.query<Article, string>({
			query: (slug) => `${slug}`
		}),

		createArticle: builder.mutation<{ msg: string }, Article>({
			invalidatesTags: ["Article"],
			query: (args) => ({
				url: "",
				method: "POST",
				body: args
			}),
		}),

		updateArticle: builder.mutation<{ msg: string }, Article>({
			query: ({ id, ...data }) => ({
				url: `${id}`,
				method: "PUT",
				body: data
			}),
			invalidatesTags: (res, err, arg) => [{ type: "Article", id: arg.id }]
		}),

		deleteArticle: builder.mutation<{ msg: string }, Partial<Article> & Pick<Article, "id">>({
			invalidatesTags: (res, err, arg) => [{ type: "Article", id: arg.id }],
			query: ({ id }) => ({
				url: `${id}`,
				method: "DELETE",
			}),
		})

	})
});

export const { useGetArticleQuery, useGetNewsQuery, useLazyGetNewsQuery, useLazyGetArticleQuery, useCreateArticleMutation, useDeleteArticleMutation, useUpdateArticleMutation } = newsApi;