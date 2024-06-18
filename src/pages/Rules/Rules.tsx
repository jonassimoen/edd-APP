import { Col, Row } from "@/components/UI/Grid/Grid";
import { useGetPageQuery } from "@/services/pagesApi";
import Title from "antd/es/typography/Title";
import i18next, { t } from "i18next";
import { useEffect, useState } from "react";
import { RulesCollapse, RulesStyles } from "./RulesStyle";
import { Block } from "@/components/Block/Block";
import parseHTML from "html-react-parser";
import { CollapseProps, Image } from "antd";
import { DownCircleOutlined, UpCircleOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

type RulesState = {
	text: string
}

export const Rules = () => {
	const { data: page, isLoading: pageLoading } = useGetPageQuery("rules");
	const {competition } = useSelector((state: StoreState) => state.application);
	const [state, setState] = useState<RulesState>({
		text: "",
	});

	const getRule = (sub: string) => {
		const pageRule = page && page.filter((p: Page) => p.slug.indexOf(sub) === 0);
		if(!pageRule || pageRule?.length === 0) {
			return "-";
		}
		return pageRule[0].translation.find((tl: PageTranslation) => tl.langCode == i18next.resolvedLanguage)?.body || "-";
	};

	useEffect(() => {
		document.body.classList.add("color-background-white");
		return () => { document.body.classList.remove("color-background-white"); };
	},[]);
	
	useEffect(() => {
		const body = page && page[0] && page[0].translation && page[0].translation
			.find((tl: PageTranslation) => tl.langCode == i18next.resolvedLanguage)?.body;
		setState({ ...state, text: body || "" });
	}, [page]);

	const items: CollapseProps["items"] = [
		{
			key: "teamotm",
			label: t("rules.totmd"),
			children: <Image src={`${competition.assetsCdn}/general/teamofthematchday.jpg`} preview={false} height={"75vh"} />
		},
		{
			key: "matchdays",
			label: t("rules.matchdays"),
			children: parseHTML(getRule("rules_matchdays")),
		},
		{
			key: "squad",
			label: t("rules.squad"),
			children: parseHTML(getRule("rules_squad")),
		},
		{
			key: "substitutes",
			label: t("rules.substitutes"),
			children: parseHTML(getRule("rules_substitutes")),
		},
		{
			key: "transfers",
			label: t("rules.transfers"),
			children: parseHTML(getRule("rules_transfers")),
		},
		{
			key: "deadlines",
			label: t("rules.deadlines"),
			children: parseHTML(getRule("rules_deadlines")),
		},
		{
			key: "points",
			label: t("rules.points"),
			children: parseHTML(getRule("rules_points")),
		},
		{
			key: "boosters",
			label: t("rules.boosters"),
			children: parseHTML(getRule("rules_boosters")),
		},
		{
			key: "prices",
			label: t("rules.prices"),
			children: parseHTML(getRule("rules_prices")),
		},
		{
			key: "legal",
			label: t("rules.legal"),
			children: parseHTML(getRule("rules_legal")),
		},
	];

	return (
		<RulesStyles>
			<Row>
				<Col span={24}>
					<Title level={2}>{t("general.rules")}</Title>
					<RulesCollapse 
						className="rules"
						bordered={false}
						accordion
						items={items} 
						defaultActiveKey={[]} 
						expandIcon={({isActive}) => isActive ?  <DownCircleOutlined className="rotated" /> : <DownCircleOutlined />}
						expandIconPosition="end"
					/>
					{/* <Block className="rules">
						{parseHTML(state.text)}
					</Block> */}
				</Col>
			</Row>
		</RulesStyles>
	);
};