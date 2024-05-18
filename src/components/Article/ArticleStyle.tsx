import { mediaQueries } from "@/styles/media-queries";
import styled from "@/styles/styled-components";
import { theme } from "@/styles/theme";
import { Card, Flex } from "antd";

export const ArticleStyle = styled(Card)`
	.ant-card-head {
		background: ${theme.primaryContrast};
		color: white;
	}
	.ant-card-body {
		padding: 1rem;
	}

	margin-bottom: 2rem;
`;

export const ArticleTextStyle = styled(Flex)`
	flex-direction: column;
	.text {
		order: 2;
		flex-direction: column;
		display: flex;
		justify-content: space-between;

		.meta {
			font-size: 12px;
			color: gray;
		}
		.ant-btn {
			border-color: ${theme.primaryContrast};
			font-size: 14px;
			width: max-content;
		}
		.read-more {
			margin-top: 0.5rem;
			width: 100%;
		}
	}

	.ant-image {
		width: 100%;
		order: 1;

		img {
			border-radius: 5px;
		}
	}

	
	@media ${mediaQueries.tablet} {
		flex-direction: row;
		.text {
			order: 1;
			.read-more {
				margin-top: 0;
				width: max-content;
			}
		}
		.ant-image {
			min-width: 30%;
			max-width: 30%;
			order: 2;
		}
	}
`;

export const FullArticleTextStyle = styled(Flex)`
	flex-direction: column;
	.text {
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.meta {
			font-size: 12px;
			color: gray;
		}
		.ant-btn {
			border-color: ${theme.primaryContrast};
			font-size: 14px;
			width: max-content;
		}
	}

	.ant-image {
		width: 100%;

		img {
			border-radius: 5px;
		}
	}

	@media ${mediaQueries.tablet} {
		flex-direction: row;
	}
`;


