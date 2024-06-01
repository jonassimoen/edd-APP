import styled from "styled-components";
import {Button} from "antd";

import "antd/lib/button/style";
import { theme } from "@/styles/theme";

export const ButtonStyle = styled(Button)`
	border-radius: 1rem;
	line-height: normal;
	height: auto;
	padding: 0.5rem;

	&.ant-btn-primary {
		background: ${theme.primaryContrast};
		box-shadow: none;
		border: 1px solid rgba(255 255 255 / 0.15);

		&:not(.ant-btn-disabled):hover {
			color: ${theme.secondaryColor};
			background: ${theme.primaryContrast};
		}
	}
`;