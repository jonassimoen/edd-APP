import styled from "@/styles/styled-components";

export const GeneralManagementStyle = styled.div`
	li {
		&.payed {
			color: green;
		}

		&.non-payed {
			color: red;
		}
	}
`;