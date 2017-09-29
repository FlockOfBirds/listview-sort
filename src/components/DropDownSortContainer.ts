import { Component, ReactElement, createElement } from "react";
import { findDOMNode } from "react-dom";
import * as dijitRegistry from "dijit/registry";
import * as classNames from "classnames";
import * as dojoConnect from "dojo/_base/connect";

import { DropDown, DropDownProps } from "./DropDownSort";
import { ValidateConfigs } from "./ValidateConfigs";
import { DropDownSortState, ListView, WrapperProps, createOptionProps, parseStyle } from "../utils/ContainerUtils";

import "../ui/DropDownSort.scss";

export default class DropDownSortContainer extends Component<WrapperProps, DropDownSortState> {
    private navigationHandler: object;

    constructor(props: WrapperProps) {
        super(props);

        this.state = {
            alertMessage: "",
            findingListviewWidget: true
        };
        this.updateSort = this.updateSort.bind(this);
        this.validateListView = this.validateListView.bind(this);
        this.navigationHandler = dojoConnect.connect(props.mxform, "onNavigation", this, this.validateListView);
    }

    render() {
        return createElement("div",
            {
                className: classNames("widget-drop-down-sort", this.props.class),
                style: parseStyle(this.props.style)
            },
            createElement(ValidateConfigs, {
                ...this.props as WrapperProps,
                queryNode: this.state.targetNode,
                targetListview: this.state.targetListView,
                validate: !this.state.findingListviewWidget
            }),
            this.renderDropDown()
        );
    }

    componentDidMount() {
        const queryNode = findDOMNode(this).parentNode as HTMLElement;
        const targetNode = ValidateConfigs.findTargetNode(queryNode) as HTMLElement;
        this.showLoader(targetNode);
    }

    componentWillUnmount() {
        dojoConnect.disconnect(this.navigationHandler);
    }

    private renderDropDown(): ReactElement<DropDownProps> | null {
        if (this.state.validationPassed) {
            return createElement(DropDown, {
                onDropDownChangeAction: this.updateSort,
                options: createOptionProps(this.props.sortAttributes),
                style: parseStyle(this.props.style)
            });
        }

        return null;
    }

    private validateListView() {
        if (!this.state.validationPassed) {
            const queryNode = findDOMNode(this).parentNode as HTMLElement;
            const targetNode = ValidateConfigs.findTargetNode(queryNode);
            let targetListView: ListView | null = null;

            if (targetNode) {
                this.setState({ targetNode });
                targetListView = dijitRegistry.byNode(targetNode);
                if (targetListView) {
                    this.setState({ targetListView });
                }
            }

            const validateMessage = ValidateConfigs.validate({
                ...this.props as WrapperProps,
                queryNode: this.state.targetNode,
                targetListview: this.state.targetListView,
                validate: !this.state.findingListviewWidget
            });

            this.setState({ findingListviewWidget: false, validationPassed: !validateMessage });
        }
    }

    private updateSort(attribute: string, order: string) {
        const { targetNode, targetListView, validationPassed } = this.state;

        if (targetListView && targetNode && validationPassed) {
            this.showLoader(targetNode);
            targetListView._datasource._sorting = [ [ attribute, order ] ];
            targetListView.update(null, () => {
                this.hideLoader(targetNode);
            });
        }
    }

    private showLoader(node?: HTMLElement) {
        if (node) {
            node.classList.add("widget-drop-down-sort-loading");
        }
    }

    private hideLoader(node?: HTMLElement) {
        if (node) {
            node.classList.remove("widget-drop-down-sort-loading");
        }
    }
}
