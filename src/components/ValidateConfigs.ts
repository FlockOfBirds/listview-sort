import { Component, createElement } from "react";

import { Alert } from "./Alert";
import { DropdownSortProps, ListView } from "../utils/ContainerUtils";

export interface ValidateConfigProps extends DropdownSortProps {
    inWebModeler?: boolean;
    queryNode?: HTMLElement;
    targetListview?: ListView;
    targetListviewName: string;
    validate: boolean;
}

const widgetName = "Dropdown sort widget";

export class ValidateConfigs extends Component<ValidateConfigProps, {}> {
    render() {
        return createElement(Alert, {
            bootstrapStyle: "danger",
            className: "widget-dropdown-sort-alert",
            message: this.props.validate ? ValidateConfigs.validate(this.props) : ""
        });
    }

    static validate(props: ValidateConfigProps): string {
        if (!props.queryNode) {
            return `${widgetName}: unable to find grid with the name "${props.targetListviewName}"`;
        }
        if (props.inWebModeler) {
            return "";
        }
        if (!(props.targetListview && props.targetListview.declaredClass === "mxui.widget.ListView")) {
            return `${widgetName}: supplied target name "${props.targetListviewName}" is not of the type list view`;
        }
        if (!ValidateConfigs.isCompatible(props.targetListview)) {
            return `${widgetName}: this Mendix version is incompatible`;
        }
        const isValidAttribute = ValidateConfigs.isValidAttribute(props.targetListview._datasource._entity, props);
        if (isValidAttribute !== "") {
            return `${widgetName}: supplied sort attribute name "${isValidAttribute}" does not belong to list view`;
        }

        return "";
    }

    static isValidAttribute(entity: string, props: ValidateConfigProps): string {
        if (props.targetListview) {
            const dataSourceEntity: mendix.lib.MxMetaObject = window.mx.meta.getEntity(entity);
            const dataAttributes: string[] = dataSourceEntity.getAttributes();
            props.sortAttributes.forEach(sortAttribute => {
                if (ValidateConfigs.itContains(dataAttributes, sortAttribute.name)) return sortAttribute;
            });
        }

        return "";
    }

    static isCompatible(targetGrid: ListView): boolean {
        return !!(targetGrid &&
            targetGrid.update &&
            targetGrid._datasource &&
            targetGrid._datasource._entity &&
            targetGrid._datasource._sorting);
    }

    static findTargetNode(targetGridName: string, queryNode: HTMLElement): HTMLElement | null {
        let targetNode: HTMLElement | null = null ;

        while (!targetNode && queryNode) {
            targetNode = targetGridName
                ? queryNode.querySelector(`.mx-name-${targetGridName}`) as HTMLElement
                : queryNode.querySelectorAll(`.mx-listview`)[0] as HTMLElement;

            if (targetNode) {
                break;
            }
            queryNode = queryNode.parentNode as HTMLElement;
        }

        return targetNode;
    }

    static itContains(array: string[] | string, element: string) {
        return array.indexOf(element) > -1;
    }
}
