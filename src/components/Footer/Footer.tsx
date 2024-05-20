
import { MessageOutlined } from "@ant-design/icons";
import { FooterStyle } from "./FooterStyle";
import { Crisp } from "crisp-sdk-web";

export const Footer = () => {
	return (
		<FooterStyle>
			<a onClick={() => {
				if(!Crisp.chat.isChatOpened()) {
					Crisp.chat.open();
				}
			}}>
				<MessageOutlined/> Hulp nodig?
			</a>
		</FooterStyle>
	);
};