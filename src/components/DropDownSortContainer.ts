import { Component, ReactElement, createElement } from "react";
import { findDOMNode } from "react-dom";
import * as dijitRegistry from "dijit/registry";
import * as classNames from "classnames";
import * as dojoConnect from "dojo/_base/connect";

import { Alert } from "./Alert";
import { DropDown, DropDownProps } from "./DropDownSort";
import { Utils, createOptionProps, parseStyle } from "../utils/ContainerUtils";
import { DataSourceHelper, ListView } from "mendix-data-source-helper";

import "../ui/DropDownSort.scss";

interface WrapperProps {
    class: string;
    style: string;
    friendlyId: string;
    mxform: mxui.lib.form._FormBase;
    mxObject: mendix.lib.MxObject;
}

export interface ContainerProps extends WrapperProps {
    entity: string;
    sortAttributes: AttributeType[];
}

export interface AttributeType {
    name: string;
    caption: string;
    defaultSelected: boolean;
    sort: string;
}

export interface ContainerState {
    alertMessage?: string;
    listviewAvailable: boolean;
    targetListView?: ListView | null;
    targetNode?: HTMLElement;
}

export default class DropDownSortContainer extends Component<ContainerProps, ContainerState> {
    private navigationHandler: object;
    private dataSourceHelper: DataSourceHelper;

    constructor(props: ContainerProps) {
        super(props);

        this.state = {
            alertMessage: Utils.validateProps(this.props),
            listviewAvailable: true
        };
        this.updateSort = this.updateSort.bind(this);
        this.connectToListView = this.connectToListView.bind(this);
        this.navigationHandler = dojoConnect.connect(props.mxform, "onNavigation", this, this.connectToListView);
    }

    render() {
        return createElement("div", {
                className: classNames("widget-drop-down-sort", this.props.class),
                style: parseStyle(this.props.style)
            },
            createElement(Alert, {
                bootstrapStyle: "danger",
                className: "widget-drop-down-sort-alert",
                message: this.state.alertMessage
            }),
            this.renderDropDown()
        );
    }

    componentDidMount() {
        const queryNode = findDOMNode(this).parentNode as HTMLElement;
        const targetNode = Utils.findTargetNode(queryNode) as HTMLElement;

        if (targetNode) {
            DataSourceHelper.hideContent(targetNode);
        }
    }

    componentWillUnmount() {
        dojoConnect.disconnect(this.navigationHandler);
    }

    private renderDropDown(): ReactElement<DropDownProps> | null {
        if (!this.state.alertMessage) {
            return createElement(DropDown, {
                onDropDownChangeAction: this.updateSort,
                options: createOptionProps(this.props.sortAttributes),
                style: parseStyle(this.props.style)
            });
        }

        return null;
    }

    private connectToListView() {
        const queryNode = findDOMNode(this).parentNode as HTMLElement;
        const targetNode = Utils.findTargetNode(queryNode) as HTMLElement;
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
            }
        }

        const validationMessage = Utils.validateCompatibility({
            ...this.props as ContainerProps,
            targetListView
        });

        this.setState({
            alertMessage: validationMessage || errorMessage,
            listviewAvailable: !!targetListView,
            targetListView,
            targetNode
        });
    }

    private updateSort(attribute: string, order: string) {
        const { targetNode, targetListView } = this.state;

        if (targetListView && targetNode && this.dataSourceHelper) {
            this.dataSourceHelper.setSorting(this.props.friendlyId, [ attribute, order ]);
        }
    }
}
