import { Component, createElement } from "react";
import { findDOMNode } from "react-dom";

import { DropDown } from "./components/DropDownSort";
import { ValidateConfigs } from "./components/ValidateConfigs";
import {
    DropDownSortState, WrapperProps, createOptionProps,
    parseStyle
} from "./utils/ContainerUtils";

declare function require(name: string): string;

// tslint:disable-next-line class-name
export class preview extends Component<WrapperProps, DropDownSortState> {
    constructor(props: WrapperProps) {
        super(props);

        this.state = { findingListviewWidget: true };
    }

    render() {
        return createElement("div", { className: "widget-dropdown-sort" },
            createElement(ValidateConfigs, {
                ...this.props as WrapperProps,
                inWebModeler: true,
                queryNode: this.state.targetNode,
                targetListview: this.state.targetListView,
                validate: !this.state.findingListviewWidget
            }),
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

    componentWillReceiveProps(_newProps: WrapperProps) {
        this.validateConfigs();
    }

    private validateConfigs() {
        const routeNode = findDOMNode(this) as HTMLElement;
        const targetNode = ValidateConfigs.findTargetNode(routeNode);

        if (targetNode) {
            this.setState({ targetNode });
        }
        this.setState({ findingListviewWidget: true });
    }
}

export function getPreviewCss() {
    return require("./ui/DropDownSort.scss");
}
