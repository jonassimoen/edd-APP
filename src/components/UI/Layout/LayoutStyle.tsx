import { Layout } from "antd";
import styled from "styled-components";

import { mediaQueries } from "@/styles/media-queries";
import { theme } from "@/styles/theme";
export const LayoutStyle = styled(Layout)`	
    &.ant-layout {
		background: transparent;
		margin: 0 auto;
		width: 100%;
		@media ${mediaQueries.tabletL} {
			width: 90%;
		}
		@media ${mediaQueries.desktopL} {
			width: 80%;
		}
    }
`;

export const PageStyle = styled.div`
	padding: 10px 0;

	@media ${mediaQueries.tablet} {
		padding: 50px 0;
	}
`;