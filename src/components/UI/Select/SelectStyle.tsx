import { Select } from "antd";
import styled from "styled-components";
import { MySelectProps } from "./Select";
import { theme } from "@/styles/theme";

export const SelectStyle = styled(Select)`
    width: 100%;
    border-radius: 0.5rem;

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
        border: none !important;
        border-radius: 0.25rem;
        background: ${theme.primaryColor} !important;
        
        &:hover {
            background: rgba(255,255,255,0.1) !important;
        }

        .ant-select-selection-item, .ant-select-selection-placeholder {
            color: #fff;
            display: flex;
            line-height: 1;
            flex-direction: column;
            padding: 0.25rem 0;
        }

        .ant-select-selection-item::before, .ant-select-selection-placeholder::before {
            color: lightgray;
            font-size: 9px;
            content: "${(props: any) => props.placeholdertxt}"
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