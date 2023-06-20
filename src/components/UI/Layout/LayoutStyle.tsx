import { Layout } from "antd";
import styled from "styled-components";

import { mediaQueries } from "@/styles/media-queries";
export const LayoutStyle = styled(Layout)`
		/* padding: 20px;

		@media ${mediaQueries.tablet} {
			padding: 15px 32px;
		} */
		
    &.ant-layout {		
		background: transparent;
		margin: 0 auto;
		width: 100%;
		@media (min-width: 992px) {
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