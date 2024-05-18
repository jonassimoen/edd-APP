import styled from "@/styles/styled-components";
import { theme } from "@/styles/theme";
import { Pagination } from "antd";

export const PaginationStyle = styled(Pagination)`
	width: 100%;
	text-align: center;

	.ant-pagination-prev, .ant-pagination-next {
		a {
			border-radius: 0px;
		}

		&:hover:not(.ant-pagination-disabled) a {
			color: white;
		}
	}

	.ant-pagination-jump-next, .ant-pagination-jump-prev {
		.ant-pagination-item-link-icon {
			color: ${theme.primaryContrast};
		}
	}

	.ant-pagination-item {
		border-radius: 0px;

		&:hover:not(.ant-pagination-disabled), &.ant-pagination-item-active {
			border-color: ${theme.primaryColor};
			a {
				font-weight: bold;
				color: ${theme.primaryContrast};
			}
		}
	}

	.ant-pagination-disabled {
		a {
			font-weight: bold;
			color: #ababab;
		}
	}
`;