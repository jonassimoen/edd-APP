import { InputProps } from "antd";
import { InputStyle } from "./InputStyle";

type MyInputProps = InputProps
export const Input = (props: MyInputProps) => {
	const { ...rest } = props;
	return (<InputStyle {...rest} />);
};