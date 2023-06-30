import { mediaQueries } from "@/styles/media-queries";
import { Col, Row } from "antd";

import "antd/lib/grid/style";
import styled from "styled-components";

export const RowStyle = styled(Row)`
	&.ant-row {
    	@media ${mediaQueries.desktop} {
			margin-left: 0px;
			margin-right: 0px;
		}
	}
`;

export const ColStyle = styled(Col)`
	&.ant-col {
		@media (min-width: 576px) {
			padding-left: 12px;
			padding-right: 12px;
		}
		

		${(props: any) => props.$zeroPadding &&
			"padding: 1px;"
}
	}
`;