import { ColProps, RowProps } from "antd";
import { ColStyle, RowStyle } from "./GridStyle";

export const Row = (props: RowProps) => {
	return (<RowStyle {...props} />);
};

export declare type CustomColProps = ColProps & {
    $zeroPadding?: boolean
}

export const Col = (props: CustomColProps) => {
	return (<ColStyle {...props} />);
};