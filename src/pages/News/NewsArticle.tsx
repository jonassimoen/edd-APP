import { Article } from "@/components/Article/Article";
import { useGetArticleQuery } from "@/services/newsApi";
import { NewsArticleStyle } from "./NewsArticleStyle";

export const NewsArticle = () => {
	const {data: article, isSuccess: gotArticle} = useGetArticleQuery(window.location.pathname.slice(window.location.pathname.lastIndexOf("/") + 1));
	return (
		<NewsArticleStyle>
			{
				gotArticle && <Article key={article.slug} article={article} short={false} />
			}
		</NewsArticleStyle>
	);
};