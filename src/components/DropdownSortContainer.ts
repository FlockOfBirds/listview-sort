import { Component, ReactElement, createElement } from "react";
import { findDOMNode } from "react-dom";
import * as dijitRegistry from "dijit/registry";
import * as classNames from "classnames";
import * as dojoLang from "dojo/_base/lang";
import * as dojoConnect from "dojo/_base/connect";

import { Dropdown, DropdownProps } from "./Dropdown";
import { ValidateConfigs } from "./ValidateConfigs";
import { DropdownSortState, ListView, WrapperProps, createOptionProps, parseStyle } from "../utils/ContainerUtils";
import "../ui/DropdownSort.css";

export default class DropdownSort extends Component<WrapperProps, DropdownSortState> {
    private navigationHandler: object;

    constructor(props: WrapperProps) {
        super(props);

        this.state = {
            alertMessage: "",
            findingListviewWidget: true
        };
        this.updateSort = this.updateSort.bind(this);
        this.navigationHandler = dojoConnect.connect(props.mxform, "onNavigation", this, dojoLang.hitch(this, this.validate));
    }

    render() {
        return createElement("div",
            {
                className: classNames("widget-dropdown-sort", this.props.class),
                style: parseStyle(this.props.style)
            },
            createElement(ValidateConfigs, {
                ...this.props as WrapperProps,
                queryNode: this.state.targetNode,
                targetListview: this.state.targetListview,
                validate: !this.state.findingListviewWidget
            }),
            this.renderDropdown()
        );
    }

    componentWillUnmount() {
        dojoConnect.disconnect(this.navigationHandler);
    }

    private renderDropdown(): ReactElement<DropdownProps> | null {
        if (this.state.validationPassed) {
            return createElement(Dropdown, {
                onDropdownChangeAction: this.updateSort,
                options: createOptionProps(this.props.sortAttributes),
                style: parseStyle(this.props.style)
            });
        }

        return null;
    }

    private validate() {
        if (!this.state.validationPassed) {
            const queryNode = findDOMNode(this).parentNode as HTMLElement;
            const targetNode = ValidateConfigs.findTargetNode(queryNode);
            let targetListView: ListView | null = null;

            if (targetNode) {
                this.setState({ targetNode });
                targetListView = dijitRegistry.byNode(targetNode);
                if (targetListView) {
                    this.setState({ targetListview: targetListView });
                }
            }
            const validateMessage = ValidateConfigs.validate({
                ...this.props as WrapperProps,
                queryNode: this.state.targetNode,
                targetListview: this.state.targetListview,
                validate: !this.state.findingListviewWidget
            });
            this.setState({ findingListviewWidget: false, validationPassed: !validateMessage });
        }
    }

    private updateSort(attribute: string, order: string) {
        if (this.state.targetListview && this.state.targetListview._datasource && this.state.validationPassed) {
            this.state.targetListview._datasource._sorting = [ [ attribute, order ] ];
            this.state.targetListview.update();
        }
    }
}
