import styled from "styled-components";
import { InputNumber } from "antd";

import { theme } from "@/styles/theme";

const inputNumberFocusStyle = `
	border-color: #d9d9d9;
	box-shadow: none;
	outline: none;
`;

const antInputNumberStyle = `
		color: #9E9E9E;
		border-radius: 0px;
		font-size: 0.75rem;
		border: 1px solid #DEDEDE;

		@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
			height: 50px;
	 	}

		&:hover {
			border: 1px solid ${theme.primaryColor}
		}

		&:focus {
			${inputNumberFocusStyle}	
		}

		::placeholder {
			color: #bfbfbf;
		}

		:-ms-input-placeholder { /* Internet Explorer 10-11 */
			color: #bfbfbf;
		}
		
		::-ms-input-placeholder { /* Microsoft Edge */
				color: #bfbfbf;
		}

		&:disabled {
				color: rgba(0, 0, 0, 0.25);
				background: #F9F9F9;
				border: none;
		}

		&.ant-input-lg {
				padding-left: 20px;
				height: 40px;
		}

		&.ant-input-sm {
				padding-left: 10px;
				height: 32px;
		}

		&.ant-input-number-focused {
			border: 1px solid ${theme.primaryColor};
			box-shadow: none;
		}

		input {
			text-align: center;
		}
`;

export const InputNumberStyle = styled(InputNumber)`
    &.ant-input-number-affix-wrapper {
        ${antInputNumberStyle}
    }

    &.ant-input-number {
        ${antInputNumberStyle}
    }
`;
