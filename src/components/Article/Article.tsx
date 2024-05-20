import { Button } from "../UI/Button/Button";
import parseHTML from "html-react-parser";
import dayjs from "dayjs";
import { ArticleStyle, ArticleTextStyle, FullArticleTextStyle } from "./ArticleStyle";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { Image } from "antd";
import { t } from "i18next";

declare type ArticleProps = {
	article: Article
	short?: boolean
}

export const Article = (props: ArticleProps) => {
	const {
		id,
		slug,
		title,
		description,
		timestampCreated,
		timestampUpdated,
		author,
		imageUrl,
		readMore,
	} = props.article;
	const navigate = useNavigate();
	const application = useSelector((state: StoreState) => state.application);
	
	return props.short ? 
		(
			<ArticleStyle 
				size="small"
				title={title.toUpperCase()}
			>

				<ArticleTextStyle gap={12}>
					<div className="text">
						<div className="description">
							<p className="meta">
								{author.firstName} - {dayjs(timestampCreated).format("D MMM [om] HH:MM")} {timestampUpdated?`(update: ${dayjs(timestampUpdated).format("D MMM YYYY [om] HH:MM")})`:null}
							</p>
							{(parseHTML(description) as JSX.Element[])[0]}
						</div>
						{
							readMore && 
							<Button
								type="text"
								className="read-more"
								onClick={() => navigate(`/news/${slug}`)}
							>
								{t("news.readMore")}
							</Button>
						}
					</div>
					{
						imageUrl && <Image src={`${application.competition.assetsCdn}/news/${imageUrl}`} preview={false} />
					}
				</ArticleTextStyle>
			</ArticleStyle>
		) : 
		(
			<ArticleStyle 
				size="small"
				title={title.toUpperCase()}
			>
				<FullArticleTextStyle gap={12}>
					{
						imageUrl && <Image src={`${application.competition.assetsCdn}/news/${imageUrl}?w=1280`} preview={false} />
					}
					<div className="text">
						<div className="description">
							<p className="meta">
								{author.firstName} - {dayjs(timestampCreated).format("D MMM [om] HH:MM")} {timestampUpdated?`(update: ${dayjs(timestampUpdated).format("D MMM YYYY [om] HH:MM")})`:null}
							</p>
							{parseHTML(description) as JSX.Element[]}
						</div>
					</div>
				</FullArticleTextStyle>
			</ArticleStyle>
		);
};