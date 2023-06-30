import styled from "styled-components";
import {Button} from "antd";

import "antd/lib/button/style";
import { theme } from "@/styles/theme";

export const ButtonStyle = styled(Button)`
	border-radius: 0px !important;

	&.ant-btn-primary {
		color: #FFF;
		background-color: ${theme.primaryContrast};

		&:hover {
			background-color: ${theme.primaryColor};
			color: ${theme.primaryContrast};
		}
	}
	&.ant-btn-default {
		color: ${theme.primaryContrast};

		&:hover {
			background-color: ${theme.primaryContrast};
			color: ${theme.primaryColor};
		}
	}

    &.ant-btn-loading:not(.ant-btn-circle):not(.ant-btn-circle-outline):not(.ant-btn-icon-only) {
		padding-left: 40px;
		
		&.ant-btn-sm {
			padding-left: 21.5px;

			span {
				margin-left: 5px;
			}
		}
    }

    &.ant-btn-loading:not(.ant-btn-circle):not(.ant-btn-circle-outline):not(.ant-btn-icon-only) .anticon {
        margin-left: 0;
    }
`;