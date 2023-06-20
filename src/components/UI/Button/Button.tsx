import { ButtonProps } from "antd";
import { ButtonStyle } from "./ButtonStyle";

export const Button = (props: ButtonProps) => {
    const { children, ...rest } = props;

    return (<ButtonStyle
        {...rest}>
        {children}
    </ButtonStyle>);
}