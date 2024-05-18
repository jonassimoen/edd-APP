import { Article } from "@/components/Article/Article";
import { Pagination } from "@/components/UI/Pagination/Pagination";
import { useLazyGetNewsQuery } from "@/services/newsApi";
import Title from "antd/lib/typography/Title";
import { useEffect, useState } from "react";
import { NewsStyle } from "./NewsStyle";

declare type NewsState = {
	startPage: number,
	currentPage: number,
	articlesPerPage: number,
	numberArticles: number,
}

export const News = () => {
	const [getNews, {data: news, isSuccess}] = useLazyGetNewsQuery();
	const [state, setState] = useState<NewsState>({
		startPage: 1,
		currentPage: 1,
		articlesPerPage: 5,
		numberArticles: 0,
	});

	useEffect(() => { getNews(); }, []);

	useEffect(() => {
		if(news) {
			setState({
				...state,
				numberArticles: news.count,
			});
		}
	}, [news]);

	const onPaginationChange = (page: number, pageSize: number) => {
		getNews(page);
		setState({
			...state,
			currentPage: page,
		});
	};

	return (
		<NewsStyle>
			<Title level={2}>Nieuws</Title>
			{news?.articles?.map((value: Article) => (
				<Article key={value.slug} article={value} short={true} />
			))}
			{
				news?.articles?.length ? 
					<Pagination 
						defaultCurrent={state.startPage} 
						current={state.currentPage}
						total={state.numberArticles} 
						pageSize={state.articlesPerPage}
						size="small"
						onChange={onPaginationChange}
					/>
					: null
			}
		</NewsStyle>
	);
};