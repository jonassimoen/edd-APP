
import { MessageOutlined } from "@ant-design/icons";
import { FooterStyle } from "./FooterStyle";
import { Link } from "react-router-dom";

type FooterProps = {
    user?: User
}

export const Footer = (props: FooterProps) => {
    return (
        <FooterStyle>
            <ul>
                <li><Link to="home"><MessageOutlined /></Link></li>
            </ul>
        </FooterStyle>
    );
}