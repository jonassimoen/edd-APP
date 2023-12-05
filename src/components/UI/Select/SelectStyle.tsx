import { Select } from "antd";
import styled from "styled-components";
import { MySelectProps } from "./Select";
import { theme } from "@/styles/theme";

export const SelectStyle = styled(Select)`
    width: 100%;
    border-radius: 0;

    ${(props: MySelectProps) => props.$block === true && `
        width: 100%;
    `}

    &.ant-select-open .ant-select-selection, .ant-selection-search:focus {
        border: none;
        box-shadow: none;
    }

    &.ant-select-focused {
        .ant-select-selector {
            border-color: ${theme.primaryColor} !important;
            outline: 0;
        }
    }

    .ant-select-selector {
        border-radius: 0px;
        
        &:hover {
            border-color: ${theme.primaryColor} !important;
        }

        .ant-select-selection-placeholder {
            color: #000000;
        }
    }

    .ant-select:hover {
        border-color: ${theme.primaryColor} !important;
    }

` as any;

export const OptionStyle = styled(Select.Option)`
    color:red;
    background-color:red;
`;