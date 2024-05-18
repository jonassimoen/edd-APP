import config from "@/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const newsApi = createApi({
	reducerPath: "newsApi",
	baseQuery: fetchBaseQuery({ baseUrl: `${config.API_URL}/news`, credentials: "include" }),
	tagTypes: ["Article"],
	endpoints: (builder) => ({
		getNews: builder.query<{articles: Article[], count: number}, number | void>({
			query: (page: number) => {
				console.log("API Calling", !page ?  "" : {
					url: "",
					params: {page: page}
				});
				return !page ?  "" : {
					url: "",
					params: {page: page}
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

	})
});

export const { useGetArticleQuery, useGetNewsQuery, useLazyGetNewsQuery, useLazyGetArticleQuery } = newsApi;