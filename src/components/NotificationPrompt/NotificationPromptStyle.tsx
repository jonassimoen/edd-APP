import styled from "@/styles/styled-components";
import { theme } from "@/styles/theme";
import { Modal } from "antd";

export const NotificationPromptStyle = styled(Modal)`
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