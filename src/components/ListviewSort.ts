import { Component, ReactElement, createElement } from "react";
import { findDOMNode } from "react-dom";
import * as dijitRegistry from "dijit/registry";
import * as classNames from "classnames";
import * as dojoLang from "dojo/_base/lang";
import * as dojoConnect from "dojo/_base/connect";

import { Dropdown, DropdownProps } from "./Dropdown";
import { ValidateConfigs } from "./ValidateConfigs";
import { CommonProps, ListView, ListviewSortProps, ListviewSortState, parseStyle } from "../utils/ContainerUtils";
import "../ui/ListviewSort.css";

export default class ListviewSort extends Component<ListviewSortProps, ListviewSortState> {
    constructor(props: ListviewSortProps) {
        super(props);

        this.state = {
            alertMessage: "",
            findingWidget: true
        };
        this.updateSort = this.updateSort.bind(this);
        dojoConnect.connect(props.mxform, "onNavigation", this, dojoLang.hitch(this, this.initSort));
    }

    render() {
        return createElement("div",
            {
                className: classNames("widget-listview-sort", this.props.class),
                style: parseStyle(this.props.style)
            },
            createElement(ValidateConfigs, {
                ...this.props as ListviewSortProps,
                queryNode: this.state.targetNode,
                targetGrid: this.state.targetGrid,
                targetGridName: this.props.targetGridName,
                validate: !this.state.findingWidget
            }),
            this.renderBar()
        );
    }

    private renderBar(): ReactElement<DropdownProps> {
        if (this.state.validationPassed) {
            return createElement(Dropdown, {
                ...this.props as CommonProps,
                onDropdownChangeAction: this.updateSort,
                style: parseStyle(this.props.style)
            });
        }

        return null;
    }

    private initSort() {
        if (!this.state.validationPassed) {
            const queryNode = findDOMNode(this).parentNode as HTMLElement;
            const targetNode = ValidateConfigs.findTargetNode(this.props, queryNode);
            let targetGrid: ListView | null = null;

            if (targetNode) {
                this.setState({ targetNode });
                targetGrid = dijitRegistry.byNode(targetNode);
                if (targetGrid) {
                    this.setState({ targetGrid });
                }
            }
            const validateMessage = ValidateConfigs.validate({
                ...this.props as ListviewSortProps,
                queryNode: targetNode,
                targetGrid,
                targetGridName: this.props.targetGridName,
                validate: true
            });
            this.setState({ findingWidget: false, validationPassed: !validateMessage });
        }
    }

    private updateSort(attribute: string, order: string) {
        if (this.state.targetGrid && this.state.targetGrid._datasource && this.state.validationPassed) {
            this.state.targetGrid._datasource._sorting = [ [ attribute, order ] ];
            this.state.targetGrid.update();
        }
    }
}
