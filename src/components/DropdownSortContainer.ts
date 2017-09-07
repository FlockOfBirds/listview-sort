import { Component, ReactElement, createElement } from "react";
import { findDOMNode } from "react-dom";
import * as dijitRegistry from "dijit/registry";
import * as classNames from "classnames";
import * as dojoLang from "dojo/_base/lang";
import * as dojoConnect from "dojo/_base/connect";

import { Dropdown, DropdownProps } from "./Dropdown";
import { ValidateConfigs } from "./ValidateConfigs";
import { CommonProps, ListView, DropdownSortProps, DropdownSortState, parseStyle } from "../utils/ContainerUtils";
import "../ui/DropdownSort.css";

export default class DropdownSort extends Component<DropdownSortProps, DropdownSortState> {
    private navigationHandler: object;

    constructor(props: DropdownSortProps) {
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
                ...this.props as DropdownSortProps,
                queryNode: this.state.targetNode,
                targetListview: this.state.targetListview,
                targetListviewName: this.props.targetListviewName,
                validate: !this.state.findingListviewWidget
            }),
            this.renderDropdown()
        );
    }

    componentWillUnmount() {
        dojoConnect.disconnect(this.navigationHandler);
    }

    private renderDropdown(): ReactElement<DropdownProps> {
        if (this.state.validationPassed) {
            return createElement(Dropdown, {
                ...this.props as CommonProps,
                onDropdownChangeAction: this.updateSort,
                style: parseStyle(this.props.style)
            });
        }

        return null;
    }

    private validate() {
        if (!this.state.validationPassed) {
            const queryNode = findDOMNode(this).parentNode as HTMLElement;
            const targetNode = ValidateConfigs.findTargetNode(this.props.targetListviewName, queryNode);
            let targetGrid: ListView | null = null;

            if (targetNode) {
                this.setState({ targetNode });
                targetGrid = dijitRegistry.byNode(targetNode);
                if (targetGrid) {
                    this.setState({ targetListview: targetGrid });
                }
            }
            const validateMessage = ValidateConfigs.validate({
                ...this.props as DropdownSortProps,
                queryNode: targetNode,
                targetListview: targetGrid,
                targetListviewName: this.props.targetListviewName,
                validate: true
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
