import { Component, ReactElement, createElement } from "react";
import { findDOMNode } from "react-dom";
import * as dijitRegistry from "dijit/registry";
import * as classNames from "classnames";
import * as dojoConnect from "dojo/_base/connect";

import { Dropdown, DropdownProps } from "./Dropdown";
import { ValidateConfigs } from "./ValidateConfigs";
<<<<<<< HEAD
import { DropdownSortState, WrapperProps, createOptionProps, parseStyle } from "../utils/ContainerUtils";
import { PreLoader } from "./PreLoader";
import { DataSourceHelper, ListView } from "../utils/DataSourceHelper/DataSourceHelper";
=======
import { DropdownSortState, ListView, WrapperProps, createOptionProps, parseStyle } from "../utils/ContainerUtils";
>>>>>>> Loading with CSS only

import "../ui/DropdownSort.scss";

export default class DropdownSort extends Component<WrapperProps, DropdownSortState> {
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
                queryNode: this.state.targetNode,
                targetListview: this.state.targetListView,
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

    private validateListView() {
        if (!this.state.validationPassed) {
            const queryNode = findDOMNode(this).parentNode as HTMLElement;
            const targetNode = ValidateConfigs.findTargetNode(queryNode);
            let targetListView: ListView | null = null;

            if (targetNode) {
<<<<<<< HEAD
=======
                this.setState({ targetNode });
>>>>>>> Loading with CSS only
                targetListView = dijitRegistry.byNode(targetNode);
                if (targetListView) {
                    if (!targetListView.__customWidgetDataSourceHelper) {
                        try {
                            targetListView.__customWidgetDataSourceHelper = new DataSourceHelper(targetListView);
                        } catch (error) {
                            this.setState({
                                alertMessage: error.message,
                                targetListView,
                                targetNode
                            });
                        }
                    } else if (!DataSourceHelper.checkVersionCompatible(targetListView.__customWidgetDataSourceHelper.version)) {
                        this.setState({
                            alertMessage: "DataSource compatibility issue"
                        });
                    }
                    this.dataSourceHelper = targetListView.__customWidgetDataSourceHelper as DataSourceHelper;
                    const validateMessage = ValidateConfigs.validate({
                        ...this.props as WrapperProps,
                        queryNode: targetNode,
                        targetListview: targetListView,
                        validate: !this.state.findingListviewWidget
                    });

                    this.setState({
                        findingListviewWidget: false,
                        targetListView,
                        targetNode,
                        validationPassed: !validateMessage
                    });
                }
            }
        }
    }

    private updateSort(attribute: string, order: string) {
        const { targetNode, targetListView, validationPassed } = this.state;

<<<<<<< HEAD
        if (targetListView && targetNode && validationPassed && this.dataSourceHelper) {
            this.dataSourceHelper.setConstraint("sorting", this.props.friendlyId, [ attribute, order ]);
        }
    }

    // private showPreLoader() {
    //     if (this.state.targetNode) {
    //         this.state.targetNode.style.display = "none";
    //     }

    //     this.setState({ isLoading: true });
    // }

    // private hidePreLoader() {
    //     if (this.state.targetNode) {
    //         this.state.targetNode.style.display = "inline";
    //     }

    //     this.setState({ isLoading: false });
    // }
=======
        if (targetListView && targetNode && validationPassed) {
            this.showLoader(targetNode);
            targetListView._datasource._sorting = [ [ attribute, order ] ];
            targetListView.update(null, () => {
                this.hideLoader(targetNode);
            });
        }
    }

    componentDidMount() {
        const queryNode = findDOMNode(this).parentNode as HTMLElement;
        const targetNode = ValidateConfigs.findTargetNode(queryNode) as HTMLElement;
        this.showLoader(targetNode);
    }

    private showLoader(node?: HTMLElement) {
        if (node) {
            node.classList.add("widget-dropdown-sort-loading");
        }
    }

    private hideLoader(node?: HTMLElement) {
        if (node) {
            node.classList.remove("widget-dropdown-sort-loading");
        }
    }
>>>>>>> Loading with CSS only
}
