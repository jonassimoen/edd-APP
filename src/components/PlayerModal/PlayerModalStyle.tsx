import styled from "@/styles/styled-components";
import { theme } from "@/styles/theme";
import { Modal } from "antd";

export const PlayerModalStyle = styled(Modal)`
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
				color: ${theme.primaryColor};
				line-height: 30px;
			}

		}

		.ant-modal-header {
			.ant-modal-title {
				background-color: ${theme.primaryContrast};
				padding: 5px 30px;
				text-transform: uppercase;
				color: #fff;
			}
		}

		.ant-modal-body {
			padding: 24px;

			.surname, .forename {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				font-size: 18px;
			}

			.action {
				margin-top: 15px;
				text-align: center;
				cursor: pointer;

				.anticon {
					font-size: 30px;
					margin: 10px;
					display: block;
				}
			}

			.player-header {
				margin: 0px;
				padding: 0px 25px;
				display: flex;
				align-items: center;
				font-size: 16px;
				margin-bottom: 10px;
			}

			.player-body {
				margin: 0;
			}

			.points {
				background-color: ${theme.primaryColor};
				color: ${theme.primaryContrast};
				display: flex;
				flex-direction: column;
				text-align: center;
				padding: 10px;
				font-weight: bold;

				.value {
					font-size: 200%;
				}

				// .label {
				// 	display: block;
				// }
			}
		}
	}
`;

export const PointsOverviewTable = styled.table`
	width: 100%;
	border-collapse: collapse;

	thead {
		background: ${theme.primaryColor};
		color: #000;
		text-align: center;
	}

	tr {
		th, td {
			padding: 5px;
			text-align: center;

			&:nth-child(1) {
				text-align: left;
			}
		}
	}
`;