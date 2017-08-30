import { Component, createElement } from "react";
import { findDOMNode } from "react-dom";

import { Dropdown } from "./components/Dropdown";
import { ValidateConfigs } from "./components/ValidateConfigs";
import { CommonProps, ListviewSortProps, ListviewSortState, parseStyle } from "./utils/ContainerUtils";

declare function require(name: string): string;

// tslint:disable-next-line class-name
export class preview extends Component<ListviewSortProps, ListviewSortState> {
    constructor(props: ListviewSortProps) {
        super(props);

        this.state = { findingWidget: true };
    }

    render() {
        return createElement("div", { className: "widget-offline-search" },
            createElement(ValidateConfigs, {
                ...this.props as ListviewSortProps,
                inWebModeler: true,
                queryNode: this.state.targetNode,
                targetGrid: this.state.targetGrid,
                validate: !this.state.findingWidget
            }),
            createElement(Dropdown, {
                ...this.props as CommonProps,
                onDropdownChangeAction: () => { return; },
                style: parseStyle(this.props.style)
            })
        );
    }

    componentDidMount() {
        this.validateConfigs(this.props);
    }

    componentWillReceiveProps(newProps: ListviewSortProps) {
        this.validateConfigs(newProps);
    }

    private validateConfigs(props: ListviewSortProps) {
        const routeNode = findDOMNode(this) as HTMLElement;
        const targetNode = ValidateConfigs.findTargetNode(props, routeNode);

        if (targetNode) {
            this.setState({ targetNode });
        }
        this.setState({ findingWidget: true });
    }
}

export function getPreviewCss() {
    return require("./ui/ListviewSort.css");
}
