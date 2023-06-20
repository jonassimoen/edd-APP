import { LayoutProps } from "antd";
import { LayoutStyle } from "./LayoutStyle";


type MyLayoutProps = LayoutProps & {};
export const Layout = (props: MyLayoutProps) => {
	const {...rest} = props;
	return (<LayoutStyle {...rest} />);
}