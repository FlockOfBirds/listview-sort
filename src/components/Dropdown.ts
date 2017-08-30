import { Component, FormEvent, OptionHTMLAttributes, ReactElement, createElement } from "react";
import { CommonProps } from "../utils/ContainerUtils";

export interface DropdownProps extends CommonProps {
    onDropdownChangeAction?: (attribute: string, order: string) => void;
    style: object;
}

export interface DropdownState {
    attribute: string;
    order: string;
}

interface DropdownType extends OptionHTMLAttributes<HTMLOptionElement> {
    order: string;
}

export class Dropdown extends Component<DropdownProps, DropdownState> {

    constructor(props: DropdownProps) {
        super(props);

        this.state = { attribute: "", order: "asc" };
        this.updateSort = this.updateSort.bind(this);
        this.resetQuery = this.resetQuery.bind(this);
    }

    render() {
        return createElement("div", { className: "dropdown" },
            createElement("label", { className: "caption" }, this.props.caption + ": ",
                createElement("select", {
                    className: "option",
                    onChange: this.updateSort
                }, this.createOptions()),
                createElement("button",
                    {
                        className: `btn-transparent ${this.state.attribute ? "visible" : "hidden"}`,
                        onClick: this.resetQuery
                    },
                    createElement("span", { className: "glyphicon glyphicon-remove" })
                )
            )
        );
    }

    componentDidUpdate(_prevProps: DropdownProps, prevState: DropdownState) {
        if ((this.state.attribute !== prevState.attribute) || (this.state.order !== prevState.order)) {
            setTimeout(() => {
                this.props.onDropdownChangeAction(this.state.attribute, this.state.order);
            }, 500);
        }
    }

    private createOptions(): Array<ReactElement<{}>> {
        const optionElements: Array<ReactElement<{}>> = [];
        if (this.props.sortAttributes.length) {
            this.props.sortAttributes.map((optionObject) => {
                const { name, caption, order } = optionObject;
                const optionValue: DropdownType = {
                    className: "",
                    label: caption,
                    order,
                    value: name
                };
                optionElements.push(createElement("option", optionValue));
            });
        }
        return optionElements;
    }

    private updateSort(event: FormEvent<HTMLSelectElement>) {
        this.setState({ attribute: event.currentTarget.value, order: event.currentTarget.selectedOptions[0].getAttribute("order") });
    }

    private resetQuery() {
        this.setState({ attribute: "", order: "" });
    }
}
