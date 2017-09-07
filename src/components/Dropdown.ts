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
        return createElement("div", { className: "form-group" },
            createElement("select", {
                    className: "form-control",
                    onChange: this.updateSort
                },
                this.createOptions())
        );
    }

    private createOptions(): Array<ReactElement<{}>> {
        return this.props.sortAttributes.map((optionObject) => {
            const { name, caption, order } = optionObject;
            const optionValue: DropdownType = {
                className: "",
                label: caption,
                order,
                value: name
            };
            return createElement("option", optionValue);
        });
    }

    private updateSort(event: FormEvent<HTMLSelectElement>) {
        const order = event.currentTarget.selectedOptions[0].getAttribute("order");
        const attribute = event.currentTarget.value;

        this.props.onDropdownChangeAction(attribute, order);
        this.setState({ attribute, order });
    }

    private resetQuery() {
        this.setState({ attribute: "", order: "" });
    }
}
