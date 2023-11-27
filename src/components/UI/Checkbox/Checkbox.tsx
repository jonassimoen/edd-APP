import { CheckboxProps } from "antd";
import { CheckboxStyle } from "./CheckboxStyle";

declare type MyCheckboxProps = CheckboxProps;
export const Checkbox = (props: MyCheckboxProps) => {
	return (<CheckboxStyle {...props} />);
};