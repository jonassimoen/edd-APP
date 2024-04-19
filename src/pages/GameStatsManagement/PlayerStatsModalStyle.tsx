import styled from "@/styles/styled-components";
import { Modal } from "antd";

export const PlayerStatsModalStyle = styled(Modal)`
	.ant-row {
		flex-wrap: wrap;
		align-items: stretch;
		margin-bottom:1rem;
	}
	.ant-col {
		width: 20%;
		padding: 0.25rem;

		.ant-input-number {
			width: 3rem;
		}
	}
`;