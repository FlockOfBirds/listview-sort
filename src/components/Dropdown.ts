import { Component, FormEvent, OptionHTMLAttributes, ReactElement, createElement } from "react";
import { CommonProps } from "../utils/ContainerUtils";

export interface DropdownProps extends CommonProps {
    onDropdownChangeAction?: (attribute: string, order: string) => void;
    style: object;
}

export interface DropdownState {
    attribute: string;
    id: string;
    order: string;
}

export interface DropdownType extends OptionHTMLAttributes<HTMLOptionElement> {
    order: string;
}

export class Dropdown extends Component<DropdownProps, DropdownState> {
    private defaultAttribute: string;
    private defaultOrder: string;

    constructor(props: DropdownProps) {
        super(props);

        this.state = { attribute: "", id: "", order: "asc" };
        this.updateSort = this.updateSort.bind(this);
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

    componentDidMount() {
        this.props.onDropdownChangeAction(this.defaultAttribute, this.defaultOrder);
        this.setState({ attribute: this.defaultAttribute, order: this.defaultAttribute });
    }

    private createOptions(): Array<ReactElement<{}>> {
        let foundDefaultSortOption;
        const dropDownOptions = this.props.sortAttributes.map((optionObject) => {
            const { name, caption, isDefaultSort, order } = optionObject;
            const optionValue: DropdownType = {
                className: "",
                label: caption,
                order,
                selected: isDefaultSort && !foundDefaultSortOption,
                value: name
            };
            if (isDefaultSort) {
                foundDefaultSortOption = true;
                this.defaultAttribute = name;
                this.defaultOrder = order;
            }
            return createElement("option", optionValue);
        });
        if (!foundDefaultSortOption && this.props.sortAttributes.length > 0) {
            this.defaultAttribute = this.props.sortAttributes[0].name;
            this.defaultOrder = this.props.sortAttributes[0].order;
        }

        return dropDownOptions;
    }

    private updateSort(event: FormEvent<HTMLSelectElement>) {
        const order = event.currentTarget.selectedOptions[0].getAttribute("order");
        const attribute = event.currentTarget.value;

        this.props.onDropdownChangeAction(attribute, order);
        this.setState({ attribute, order });
    }
}
