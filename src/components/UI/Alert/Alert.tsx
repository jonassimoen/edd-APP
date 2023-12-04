import { AlertStyle } from "./AlertStyle";

export const Alert = (props: any) => {
	const { children, ...rest}= props;

	return (
		<AlertStyle {...rest}>
			{children}
		</AlertStyle>
	);
};