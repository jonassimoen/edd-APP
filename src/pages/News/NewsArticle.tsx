import { Article } from "@/components/Article/Article";
import { useGetArticleQuery } from "@/services/newsApi";
import { BackOverview, NewsArticleStyle } from "./NewsArticleStyle";
import { Link } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

export const NewsArticle = () => {
	const {t} = useTranslation();
	const {data: article, isSuccess: gotArticle} = useGetArticleQuery(window.location.pathname.slice(window.location.pathname.lastIndexOf("/") + 1));
	return (
		<NewsArticleStyle>
			<BackOverview to={"/news"} className="back">
				<LeftOutlined style={{fontSize: "12px", marginRight: "0.5rem"}} />
				{t("news.backToOverview")}
			</BackOverview>
			{
				gotArticle && <Article key={article.slug} article={article} short={false} />
			}
		</NewsArticleStyle>
	);
};