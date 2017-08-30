import { Component, createElement } from "react";

import { Alert } from "./Alert";
import { ListView, ListviewSortProps } from "../utils/ContainerUtils";

export interface ValidateConfigProps extends ListviewSortProps {
    inWebModeler?: boolean;
    queryNode?: HTMLElement;
    targetGrid?: ListView;
    targetGridName: string;
    validate: boolean;
}

const widgetName = "List view sort widget";

export class ValidateConfigs extends Component<ValidateConfigProps, {}> {
    render() {
        return createElement(Alert, {
            bootstrapStyle: "danger",
            className: "widget-listview-sort-alert",
            message: this.props.validate ? ValidateConfigs.validate(this.props) : ""
        });
    }

    static validate(props: ValidateConfigProps): string {
        if (!props.queryNode) {
            return `${widgetName}: unable to find grid with the name "${props.targetGridName}"`;
        }
        if (props.inWebModeler) {
            return "";
        }
        if (!(props.targetGrid && props.targetGrid.declaredClass === "mxui.widget.ListView")) {
            return `${widgetName}: supplied target name "${props.targetGridName}" is not of the type list view`;
        }
        if (!ValidateConfigs.isCompatible(props.targetGrid)) {
            return `${widgetName}: this Mendix version is incompatible`;
        }
        const isValidAttribute = ValidateConfigs.isValidAttribute(props.targetGrid._datasource._entity, props);
        if (isValidAttribute !== "") {
            return `${widgetName}: supplied sort attribute name "${isValidAttribute}" does not belong to list view`;
        }

        return "";
    }

    static isValidAttribute(entity: string, props: ValidateConfigProps): string {
        if (props.targetGrid) {
            const dataSourceEntity: mendix.lib.MxMetaObject = window.mx.meta.getEntity(entity);
            const dataAttributes: string[] = dataSourceEntity.getAttributes();
            props.sortAttributes.forEach(sortAttribute => {
                if (!ValidateConfigs.itContains(dataAttributes, sortAttribute.name)) return sortAttribute;
            });
        }

        return "";
    }

    static isCompatible(targetGrid: ListView): boolean {
        return !!(targetGrid &&
            targetGrid._onLoad &&
            targetGrid._loadMore &&
            targetGrid._renderData &&
            targetGrid._datasource &&
            targetGrid._datasource.atEnd &&
            typeof targetGrid._datasource._pageSize !== "undefined" &&
            typeof targetGrid._datasource._setSize !== "undefined");
    }

    static findTargetNode(props: ListviewSortProps, queryNode: HTMLElement): HTMLElement | null {
        let targetNode: HTMLElement | null = null ;

        while (!targetNode && queryNode) {
            targetNode = props.targetGridName
                ? queryNode.querySelector(`.mx-name-${props.targetGridName}`) as HTMLElement
                : queryNode.querySelectorAll(`.mx-listview`)[0] as HTMLElement;

            if (targetNode) break;
            queryNode = queryNode.parentNode as HTMLElement;
        }

        return targetNode;
    }

    static itContains(array: string[] | string, element: string) {
        return array.indexOf(element) > -1;
    }
}
