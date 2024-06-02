import styled from "@/styles/styled-components";
import { theme } from "@/styles/theme";
import { Modal } from "antd";

export const ConfirmModalStyle = styled(Modal)`
.ant-modal-content {
    border-radius: 1rem;
    max-width: 575px;
    padding: 0;

    .ant-modal-title {
        background:transparent;
        border-radius: 1rem 1rem 0 0;
        padding: 1rem;
        text-transform: uppercase;
        color: #fff;
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
        border-radius: 1rem 1rem 0 0;
        background-color: ${theme.primaryContrast};
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