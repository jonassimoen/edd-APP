import { FormItemStyle, FormStyle } from "./FormStyle";

export const Form = (props: any) => {
    const {children, ...rest} = props;
    return (<FormStyle {...rest}>{children}</FormStyle>)
}

export const FormItem = (props: any) => {
    const {children, ...rest} = props;
    return (<FormItemStyle {...rest}>{children}</FormItemStyle>)
}