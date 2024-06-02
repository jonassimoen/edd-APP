import styled from "@/styles/styled-components";
import { theme } from "@/styles/theme";
import { Modal } from "antd";

export const BoosterConfirmModalStyle = styled(Modal)`
	.ant-modal-content {
		border-radius: 0px;
		background-color: #fff;
		padding: 0;

		.ant-modal-close {
			top: 0;
			right: 0;
			width: 30px;
			height: 30px;

			> .ant-modal-close-x {
				// width: 30px;
				// height: 30px;
				font-size: 20px;
				color: ${theme.secondaryColor};
				line-height: 30px;
			}

		}

		& .ant-modal-header {
			.ant-modal-title {
				background-color: ${theme.primaryContrast};
				padding: 5px 30px;
				text-transform: uppercase;
				color: #fff;
			}

			margin-bottom: 0px;
		}

		.ant-modal-body {
			padding: 1rem 1.5rem;
		}

		.ant-modal-footer {
			padding: 0 1rem 1rem 0;
		}

		.player-booster {
			margin-top: 1rem;
		}

		.error {
			color: red;
			padding: 3px;
		}
	}
`;