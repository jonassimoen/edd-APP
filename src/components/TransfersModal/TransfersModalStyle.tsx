import styled from "@/styles/styled-components";
import { theme } from "@/styles/theme";
import { Modal, Table } from "antd";

export const TransfersModalStyle = styled(Modal)`
	.ant-modal-content {
		padding: 0;

		.ant-modal-close-icon {
			color: 	white;
		}

		.ant-modal-header {
			padding: 1rem;
			background: ${theme.primaryColor};
			border: 1px solid rgba(255 255 255 / 0.15);
			border-bottom: none;
			margin-bottom: 0;

			.ant-modal-title {
				color: white;
			}
		}

		.ant-modal-body {
			max-height: 450px;
			overflow-y: auto;
		}
	}
`;

export const TransfersModalListStyle = styled(Table)`
	background: transparent;
    width: 100%;
	.ant-table {
		border-radius: 0 0 1rem 1rem;
		.ant-table-thead {
			border-bottom: 1px solid rgba(255 255 255 / 0.15);
			>tr>th {
				color: ${theme.primaryContrast};
				padding: 0.5rem 1rem;
			}
		}
		.ant-table-tbody {
			>tr:last-child {
				background: transparent;
				border-bottom: none;

				>td {
					border-bottom: none;
				}
			}
			
			.ant-table-cell-row-hover {
				background:transparent;
			}
		}
	}
`;