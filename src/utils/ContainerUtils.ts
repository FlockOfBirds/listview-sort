import { OptionHTMLAttributes } from "react";

import { DropdownOptionType } from "../components/Dropdown";
import { ListView } from "./DataSourceHelper/DataSourceHelper";

export interface AttributeType { name: string; caption: string; defaultSelected: boolean; sort: string; }

export interface WrapperProps {
    sortAttributes: AttributeType[];
    "class"?: string;
    mxform: mxui.lib.form._FormBase;
    friendlyId: string;
    style: string;
}

export interface DropdownSortState {
    alertMessage?: string;
    targetListView?: ListView;
    targetNode?: HTMLElement;
    findingListviewWidget: boolean;
    validationPassed?: boolean;
}

export interface OptionHTMLAttributesType extends OptionHTMLAttributes<HTMLOptionElement> { key: string; }

export const createOptionProps = (sortAttributes: AttributeType[]): DropdownOptionType[] => sortAttributes.map((optionObject, index) => {
    const { name, caption, defaultSelected, sort } = optionObject;
    const value = `${name}-${index}`;
    return { name, caption, defaultSelected, sort, value };
});

export const parseStyle = (style = ""): { [key: string]: string } => {
    try {
        return style.split(";").reduce<{ [key: string]: string }>((styleObject, line) => {
            const pair = line.split(":");
            if (pair.length === 2) {
                const name = pair[0].trim().replace(/(-.)/g, match => match[1].toUpperCase());
                styleObject[name] = pair[1].trim();
            }
            return styleObject;
        }, {});
    } catch (error) {
        // tslint:disable-next-line no-console
        window.console.log("Failed to parse style", style, error);
    }

    return {};
};
