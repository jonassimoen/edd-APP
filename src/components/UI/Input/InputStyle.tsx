import styled from "styled-components";
import { Input } from "antd";

import { theme } from "@/styles/theme";

const inputFocusStyle = `
	border-color: #d9d9d9;
	box-shadow: none;
	outline: none;
`;

const antInputStyle = `
	color: #9E9E9E;
	padding: 5px 10px;
	border: 1px solid #d9d9d9;
	border-radius: 0.5rem;
	margin: 10px auto;

	@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
		height: 50px;
		padding-top: 15px;
	}

	&:hover {
		border-color: ${theme.primaryColor}
	}

	&:focus {
		${inputFocusStyle}	
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
`;

export const InputStyle = styled(Input)`
    &.ant-input-affix-wrapper {
        ${antInputStyle}
    }

    &.ant-input {
        ${antInputStyle}
    }
`;
