import { InputNumberProps } from "antd"
import { InputNumberStyle } from "./InputNumberStyle";

type MyInputNumberProps = InputNumberProps
export const InputNumber = (props: MyInputNumberProps) => {
    const { ...rest } = props;
    return (<InputNumberStyle {...rest} />);
};