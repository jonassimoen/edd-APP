import { InputProps } from "antd";
import { InputStyle } from "./InputStyle";

type MyInputProps = InputProps & {tourRef?: any}
export const Input = (props: MyInputProps) => {
	const { tourRef, ...rest } = props;
	return (<div ref={tourRef}><InputStyle {...rest}/></div>);
};