import { Component, ReactElement, createElement } from "react";
import { findDOMNode } from "react-dom";
import * as dijitRegistry from "dijit/registry";
import * as classNames from "classnames";
import * as dojoConnect from "dojo/_base/connect";

import { DropDown, DropDownProps } from "./DropDownSort";
import { ValidateConfigs } from "./ValidateConfigs";
import { DropDownSortState, WrapperProps, createOptionProps, parseStyle } from "../utils/ContainerUtils";
import { DataSourceHelper, ListView } from "mendix-data-source-helper";

import "../ui/DropDownSort.scss";

export default class DropDownSortContainer extends Component<WrapperProps, DropDownSortState> {
    private navigationHandler: object;
    private dataSourceHelper: DataSourceHelper;

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
                message: this.state.alertMessage,
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
        DataSourceHelper.hideContent(targetNode);
    }

    componentWillUnmount() {
        dojoConnect.disconnect(this.navigationHandler);
    }

    private renderDropDown(): ReactElement<DropDownProps> | null {
        if (this.state.alertMessage) {
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
            let errorMessage = "";

            if (targetNode) {
                targetListView = dijitRegistry.byNode(targetNode);
                if (targetListView) {
                    try {
                        this.dataSourceHelper = new DataSourceHelper(targetNode, targetListView, this.props.friendlyId, DataSourceHelper.VERSION);
                    } catch (error) {
                        errorMessage = error.message;
                    }

                    const validationMessage = ValidateConfigs.validate({
                        ...this.props as WrapperProps,
                        queryNode: targetNode,
                        targetListview: targetListView,
                        validate: !this.state.findingListviewWidget
                    });

                    this.setState({
                        alertMessage: validationMessage || errorMessage,
                        findingListviewWidget: false,
                        targetListView,
                        targetNode,
                        validationPassed: !validationMessage
                    });
                }
            }
        }
    }

    private updateSort(attribute: string, order: string) {
        const { targetNode, targetListView, validationPassed } = this.state;

        if (targetListView && targetNode && validationPassed && this.dataSourceHelper) {
            this.dataSourceHelper.setSorting(this.props.friendlyId, [ attribute, order ]);
        }
    }
}
