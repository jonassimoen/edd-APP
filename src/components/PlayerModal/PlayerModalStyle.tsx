import styled from "@/styles/styled-components";
import { theme } from "@/styles/theme";
import { Modal } from "antd";

export const PlayerModalStyle = styled(Modal)
`
	.ant-modal-content {
		border-radius: 0px;
		// max-width: 375px;
		background-color: #FFF;
		color: #000;
        padding: 0;
        padding-bottom: 25px;

		.ant-modal-close-x {
			width: 30px;
			height: 30px;
			font-size: 20px;
			color: 84FF00;
			line-height: 30px;
		}
	
		.ant-modal-header {
			background-color: #FFF;
			border: 0px;
			border-radius: 0px;
			padding: 15px 5px 5px 25px;

			.ant-modal-title {
                text-transform: uppercase;
				color: ${theme.primaryContrast};
				p {
					margin: 0px;
				}
			}
		}

		.ant-modal-body {
			padding: 0;

			p {
				margin-bottom: 0;
			}

			.surname, .forename {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				// max-width: 150px;
			}

			.club a {
				color: #000;
			}

			.points {
				background-color: ${theme.primaryColor};
				position: absolute;
				right: 0;
				top: 0px;
				text-align: center;
				padding: 10px;

				.value {
                    font-size: 150%;
                    font-weight: bold;
				}

				.label {
					display: block;
				}
			}

			.player-info {
				background-color: 84FF00;
				margin: 0px 30px;  
			}
			.player-actions {
				margin-top: 15px;
				display: flex;
				align-content: center;
				justify-content: flex-start;

				.action {
					margin-top: 15px;
					text-align: center;
					cursor: pointer;
	
					.anticon {
						font-size: 30px;
						margin: 5px;
						display: block;
					}
				}
			}
		}

		.ant-modal-footer {
			display: none;
		}
	}

	.player-avatar {
		width: 65px;
	}
`;