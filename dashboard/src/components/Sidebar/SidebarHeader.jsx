import styled from "@emotion/styled";

export const StyledSidebarHeader = styled.div`
	height: 64px;
	min-height: 64px;
	display: flex;
	align-items: center;
	padding: 0 20px;
	width: 100%;

	> div {
		width: 100%;
		overflow: hidden;
	}

	svg {
		font-size: 24px;
		color: white;
	}
`;

export const StyledLogo = styled.div`
	font-family: "Poppins", sans-serif;
	width: 35px;
	min-width: 35px;
	height: 35px;
	min-height: 35px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 8px;
	color: white;
	font-size: 24px;
	font-weight: 700;
	background-color: #009fdb;
	background: linear-gradient(45deg, rgb(21 87 205) 0%, rgb(90 225 255) 100%);
`;

export const StyledCollapsedSidebarHeader = styled.a`
	font-size: 24px;
	margin: 35px 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	border-radius: 50%;
	color: white;
`;
