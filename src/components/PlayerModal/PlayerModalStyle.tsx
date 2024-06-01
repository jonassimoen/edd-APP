import styled from "@/styles/styled-components";
import { theme } from "@/styles/theme";
import { Modal, Table, Tabs } from "antd";

export const PlayerModalStyle = styled(Modal)<any>`
	.ant-modal-header {
		display: none;
	}
	.ant-modal-content {
        border-radius: 1rem;
		padding: 0;
		height: 80%;
	
		@media screen and (min-width: 905px) {
			height: 570px;
		}
	
		@media screen and (max-width: 904px) {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
		}

		.ant-modal-close {
			height: 24px;
			width: 24px;
			top: 12px;
			right: 12px;
			background: none;

			&-x {
				background: ${theme.primaryColor};
				height: 100%;
				width: 100%;
				border-radius: 50%;

				svg {
					color: ${theme.colorLightGray};
					font-size: 12px;
				}

				&:hover {
					background: ${theme.primaryContrast};
				}
			}
		}

		.ant-modal-body {
			border-radius: 1rem;
			height: 100%;
			overflow-y: hidden;
			overflow-x: hidden;
			transition: all 375ms ease-in;

			.player-header {
				background: ${theme.primaryColor};
				padding: 1rem;
				display: flex;
				gap: 1rem;
				align-items: center;
				transition: all 375ms ease-in;
				height: 140px;

				.right {
					color: #fff;
					display: flex;
					flex-direction: column;
					flex: 1;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.forename {
					line-height: 1.2;
					font-size: 14px;
				}
	
				.surname {
					line-height: 1.2;
					font-size: 24px;
					font-weight: 700;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}

				.clubPosition {
					line-height: 1;
				}

				.thumbnail {	
					background-image: url(${props => props.bg});
					background-repeat: no-repeat;
					background-size: cover;
					background-color: #fff;
					position: relative;
					height: 90px;
					width: 90px;
					border-radius: 50%;
					border: 1px solid white;
					transition: all 375ms ease-in;
				}

				&.small-header {
					position: relative;
					height: 90px;

					.right {
						gap: 3px;
						flex-direction: row;
						
						.forename, .surname {
							font-size: 20px;
							margin: 0;
						}
					}
					.clubPosition {
						display: none;
					} 
					.thumbnail {
						height: 50px;
						width: 50px;
					}
				}
			}

			.player-stats {
				display:flex;
				padding: 1rem 0;

				.stat {
					flex: 1;
					text-align: center;

					.label {
						font-size: 12px;
						line-height: 1;
    					margin: 0.5rem 0 0.25rem;
						color: ${theme.colorGray};
					}
					.value {
						font-size: 20px;
						line-height: 1.1;
					}

					&:not(:last-child)::after {
						content: "";
						background-color: ${theme.colorLightGray};
						position: absolute;
						right: 0;
						top: 0;
						bottom: 0;
						width: 1px;
					}
				}
			}

			.player-actions {
				display:flex;
				padding: 1rem 0;
				align-items: flex-start;
				justify-content: center;
				border-bottom: 1px solid ${theme.colorLightGray};

				.action {
					display: flex;
					width: 5rem;
					text-align: center;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					gap: 0.5rem;
					margin: 0.5rem;
					color: gray;
					font-size: 12px; 

					.anticon svg {
						cursor: pointer;
						font-size: 30px;
						border-radius: 50%;
					}

					&.disabled {
						opacity: 50%;
						.anticon svg {
							cursor: not-allowed;
						}
					}
				}
			}
		}

		.points {
			border-top: 1px solid ${theme.colorLightGray};
			padding: 1rem;
		}

		.match-details {
			border-top: 1px solid ${theme.colorLightGray};
			align-items: center;
			background: rgb(249 249 249);

			.ant-col {
				padding: 0;
				&:nth-child(2) {
					text-align:center;
				}
			}
		}
		.player-body {
			margin-bottom: 120px;
		}
	}
`;

export const PointsTableStyle = styled(Table)`
	padding: 0 1rem;

    .ant-table-thead {
		>tr>th {
			&:first-child {
				text-align: left;
			}
			color: ${theme.primaryColor};
			text-align: center;
			border-bottom: 1px solid ${theme.primaryColor};
			padding: 5px;
		}
	}

    .ant-table-tbody {
		text-align: center;
        .ant-table-row {
            background-color: #FFF;
            > td {
				.ant-table-cell-row-hover {
					background-color: #FFF;
				}
				padding: 5px;
				text-align: center;

				&:first-child {
					text-align: left;
				}
            }

			&[data-row-key^="special"] {
				color: ${theme.primaryColor};
				font-weight: 400;
			}
        }

        .cursor-pointer {
            cursor: pointer;
        }
    }
`;

export const TableStyle = styled(Table)`
	border-top: 1px solid ${theme.colorLightGray};

    .ant-table-container table>thead>tr:first-child {
        >*:first-child {
            border-start-start-radius: 0px;
        }
        >*:last-child {
            border-start-end-radius: 0px;
        }
    }

    .ant-table-thead {
        display: none;
    }

	.avatar-container {
		margin-bottom: -10px;
	}

    .ant-table-tbody {
		text-align: center;
        .ant-table-row {
            background-color: #FFF;
            > td {
				&:nth-child(2) {
					text-align:center;
				}

                border: none;
                padding: 3.5px;	
            }
        }

        .cursor-pointer {
            cursor: pointer;
        }
    }
` as any;