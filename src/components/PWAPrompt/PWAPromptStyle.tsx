import styled from "@/styles/styled-components";
import { theme } from "@/styles/theme";
import { Modal } from "antd";

export const PWAPromptStyle = styled(Modal)`
	.ant-modal-content {
		border-radius: 0px;
		padding: 12px 16px;
		
		.ant-modal-header {
			.ant-modal-title {
				.anticon {
					margin-right: 0.5rem;
				}
			}
		}

		.ant-modal-body {
			.description {
				margin-bottom: 1rem;
			}

			.ant-steps-item-title {
				img {
					height: 1.2rem !important;
					width: auto !important;
					position: relative;
					top: -.1em;
					margin: 0 0.2rem;
					vertical-align: text-bottom;
					pointer-events: none;
				}
			}

		}

		.ant-modal-footer {
			.ant-btn {
				border-radius: 0;

				&-primary {
					background: ${theme.primaryContrast};
				}
			}
		}
	}
`;