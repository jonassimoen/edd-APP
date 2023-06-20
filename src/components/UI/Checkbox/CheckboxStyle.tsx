import { theme } from "@/styles/theme";
import { Checkbox } from "antd";
import styled from "styled-components";

export const CheckboxStyle = styled(Checkbox)`
    outline:0;      
    .ant-checkbox-inner {
        border-radius: 0px;
        &:hover {
            border-color: ${theme.primaryColor};
        }
    }
    &:hover {
        .ant-checkbox-inner {
            border-color: ${theme.primaryColor} !important;
        }
    }

    &.ant-checkbox-wrapper {
        &:hover {
            .ant-checkbox-checked .ant-checkbox-inner {
                background-color: ${theme.primaryContrast} !important;
                border: none;

            }
        }
        
    }
    .ant-checkbox-checked {
        &:hover {
            .ant-checkbox-inner {
                background-color: ${theme.primaryContrast};
            }
        }
        &:after {
            border: none;   
        }
    
        .ant-checkbox-inner {
            border-color: ${theme.primaryContrast};
            background-color: ${theme.primaryContrast};
        }
    }

`;