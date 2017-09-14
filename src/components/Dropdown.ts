import { Component, FormEvent, OptionHTMLAttributes, ReactElement, createElement } from "react";

import { AttributeType } from "../utils/ContainerUtils";

export interface DropdownOptionType extends AttributeType {
    value: string;
}

export interface DropdownProps {
    onDropdownChangeAction?: (attribute: string, order: string) => void;
    options: DropdownOptionType[];
    style: object;
}

export interface DropdownState {
    value: string;
}

export class Dropdown extends Component<DropdownProps, DropdownState> {
    constructor(props: DropdownProps) {
        super(props);

        this.state = { value: "" };
        this.handleChange = this.handleChange.bind(this);
        this.renderOptions = this.renderOptions.bind(this);
    }

    render() {
        return createElement("div", { className: "form-group" },
            createElement("select", {
                className: "form-control",
                onChange: this.handleChange
            },
                this.renderOptions())
        );
    }

    private renderOptions(): Array<ReactElement<{}>> {
        let foundDefaultSortOption;
        let defaultValue;
        const dropDownOptions = this.props.options.map((optionObject) => {
            const { caption, value, defaultSelected } = optionObject;
            const optionValue: OptionHTMLAttributes<HTMLOptionElement> = {
                className: "",
                label: caption,
                selected: defaultSelected && !foundDefaultSortOption,
                value
            };
            if (defaultSelected) {
                foundDefaultSortOption = true;
                defaultValue = value;
            }
            return createElement("option", optionValue, caption);
        });

        if (!foundDefaultSortOption && this.props.options.length > 0) {
            defaultValue = this.props.options[0].value;
        }
        this.callOnChangeAction(defaultValue);

        return dropDownOptions;
    }

    private handleChange(event: FormEvent<HTMLSelectElement>) {
        const value = event.currentTarget.value;
        this.callOnChangeAction(value);
    }

    private callOnChangeAction(value: string) {
        const options = this.props.options.filter((optionFilter => optionFilter.value === value));
        const option = options.pop();
        this.props.onDropdownChangeAction(option.name, option.sort);
    }
}
