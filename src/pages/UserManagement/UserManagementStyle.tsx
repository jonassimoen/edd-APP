import styled from "@/styles/styled-components";

export const UserManagementStyle = styled.div`
	padding-top: 2rem;
	.pay-visible {
		li {
			&.payed {
				color: green;
			}

			&.non-payed {
				color: red;
			}
		}
	} 
`;