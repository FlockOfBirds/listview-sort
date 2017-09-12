import { Component, createElement } from "react";
import { findDOMNode } from "react-dom";

import { Dropdown } from "./components/Dropdown";
import { ValidateConfigs } from "./components/ValidateConfigs";
import {
    DropdownSortState, WrapperProps, createOptionProps,
    parseStyle
} from "./utils/ContainerUtils";

declare function require(name: string): string;

// tslint:disable-next-line class-name
export class preview extends Component<WrapperProps, DropdownSortState> {
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
                targetListview: this.state.targetListview,
                validate: !this.state.findingListviewWidget
            }),
            createElement(Dropdown, {
                onDropdownChangeAction: () => { return; },
                options: createOptionProps(this.props.sortAttributes),
                style: parseStyle(this.props.style)
            })
        );
    }

    componentDidMount() {
        this.validateConfigs(this.props);
    }

    componentWillReceiveProps(newProps: WrapperProps) {
        this.validateConfigs(newProps);
    }

    private validateConfigs(props: WrapperProps) {
        const routeNode = findDOMNode(this) as HTMLElement;
        const targetNode = ValidateConfigs.findTargetNode(props.targetListviewName, routeNode);

        if (targetNode) {
            this.setState({ targetNode });
        }
        this.setState({ findingListviewWidget: true });
    }
}

export function getPreviewCss() {
    return require("./ui/DropdownSort.css");
}
