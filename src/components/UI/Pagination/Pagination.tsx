import { PaginationProps } from "antd";
import { PaginationStyle } from "./PaginationStyle";

export const Pagination = (props: PaginationProps) => {
	return (<PaginationStyle {...props}/>);
};