import { Component, createElement } from "react";
import { findDOMNode } from "react-dom";

import { Alert } from "./components/Alert";
import { DropDown } from "./components/DropDownSort";
import { Utils, createOptionProps, parseStyle } from "./utils/ContainerUtils";
import { ContainerProps, ContainerState } from "./components/DropDownSortContainer";

declare function require(name: string): string;

// tslint:disable-next-line class-name
export class preview extends Component<ContainerProps, ContainerState> {
    constructor(props: ContainerProps) {
        super(props);

        this.state = { listviewAvailable: true };
    }

    render() {
        return createElement("div", { className: "widget-dropdown-sort" },
            this.renderAlert(),
            createElement(DropDown, {
                onDropDownChangeAction: () => { return; },
                options: createOptionProps(this.props.sortAttributes),
                style: parseStyle(this.props.style)
            })
        );
    }

    componentDidMount() {
        this.validateConfigs();
    }

    componentWillReceiveProps(_newProps: ContainerProps) {
        this.validateConfigs();
    }

    private renderAlert() {
        const message = Utils.validateProps({
            ...this.props as ContainerProps
        });

        return createElement(Alert, {
            bootstrapStyle: "danger",
            className: "widget-drop-down-filter-alert",
            message
        });
    }

    private validateConfigs() {
        const routeNode = findDOMNode(this) as HTMLElement;
        const targetNode = Utils.findTargetNode(routeNode);

        if (targetNode) {
            this.setState({ targetNode });
        }
        this.setState({ listviewAvailable: true });
    }
}

export function getPreviewCss() {
    return require("./ui/DropDownSort.scss");
}
