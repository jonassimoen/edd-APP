import styled from "@/styles/styled-components";
import { theme } from "@/styles/theme";
import { Modal } from "antd";

export const ConfirmModalStyle = styled(Modal)`
.ant-modal-content {
    border-radius: 0px;
    max-width: 575px;
    padding: 0;

    .ant-modal-title {
        background-color: ${theme.primaryContrast};
        padding: 5px 30px;
        text-transform: uppercase;
        color: #fff;
        padding: 5px 5px 5px 36.5px;
    }

    .ant-modal-close-x {
        width: 30px;
        height: 30px;
        font-size: 20px;
        color: 84FF00;
        line-height: 30px;
    }

    .ant-modal-header {
        border: 0px;
        border-radius: 0px;
        padding: 0;

        .ant-modal-title {
            color: white;
            p {
                margin: 0px;
            }

            .custom-title-container {
                text-align: right;

                .anticon {
                    margin-top: 5px;
                    margin-right: 5px;
                }
            }
        }
    }

    .ant-modal-footer {
        display: none;
    }
}

.actions {
    text-align: right;
    margin-top: 15px;
    button {
        margin: 5px;
    }
}
`;