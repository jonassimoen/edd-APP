import styled from "@/styles/styled-components";
import { theme } from "@/styles/theme";

export const DeadlineBar = styled.div`
	color: #000;
	text-align: center;
	font-size: 18px;

	p {
		padding: 0.75rem;

		.deadline-date {
			font-weight: bold;
		}
	}
`;

export const TeamStyle = styled.div`
	.header {
		display:flex;
		justify-content: space-between;
		align-items: center;
		border-radius: 1rem;
		color:white;
		margin-bottom: 1rem;
		background: ${theme.primaryColor};
		padding: 1rem;

		.title {
			h1,h2,h3 {
				margin-top: 0;
			}
		}
	}
    
	.right-col {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
`;
