import { Col, Row } from "@/components/UI/Grid/Grid";
import { useGetPageQuery } from "@/services/pagesApi";
import Title from "antd/es/typography/Title";
import i18next, { t } from "i18next";
import { useEffect, useState } from "react";
import { RulesStyles } from "./RulesStyle";
import { Block } from "@/components/Block/Block";
import parseHTML from "html-react-parser";

type RulesState = {
	text: string
}

export const Rules = () => {
	const { data: page, isLoading: pageLoading } = useGetPageQuery("rules");
	const [state, setState] = useState<RulesState>({
		text: "",
	});
	
	useEffect(() => {
		const body = page && page[0] && page[0].translation && page[0].translation
			.find((tl: PageTranslation) => tl.langCode == i18next.resolvedLanguage)?.body;
		setState({ ...state, text: body });
	}, [page]);

	return (
		<RulesStyles>
			<Row>
				<Col span={24}>
					<Title level={2}>{t("general.rules")}</Title>
					<Block className="rules">
						{parseHTML(state.text)}
					</Block>
				</Col>
			</Row>
		</RulesStyles>
	);
};