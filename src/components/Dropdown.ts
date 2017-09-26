import { Component, FormEvent, ReactElement, createElement } from "react";

import { AttributeType, OptionHTMLAttributesType } from "../utils/ContainerUtils";

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

        this.state = { value: this.getDefaultValue() };
        this.handleChange = this.handleChange.bind(this);
        this.renderOptions = this.renderOptions.bind(this);
        this.callOnChangeAction = this.callOnChangeAction.bind(this);
        this.getDefaultValue = this.getDefaultValue.bind(this);

        this.callOnChangeAction(this.state.value);

    }

    render() {
        return createElement("select", {
                className: "form-control",
                onChange: this.handleChange,
                value: this.state.value
            },
            this.renderOptions()
        );
    }

    private getDefaultValue(): string {
        this.props.options.forEach((optionObject) => {
            const { value, defaultSelected } = optionObject;

            if (defaultSelected) {
                return value;
            }
        });

        return this.props.options[0].value;
    }

    private renderOptions(): Array<ReactElement<{}>> {
        return this.props.options.map((optionObject) => {
            const { caption, value } = optionObject;

            const optionValue: OptionHTMLAttributesType = {
                className: "",
                key: value,
                label: caption,
                value
            };

            return createElement("option", optionValue, caption);
        });
    }

    private handleChange(event: FormEvent<HTMLSelectElement>) {
        const value = event.currentTarget.value;

        this.setState({ value });
        this.callOnChangeAction(value);

    }

    private callOnChangeAction(value: string) {
        const options = this.props.options.filter((optionFilter => optionFilter.value === value));
        const option = options.pop();

        if (option && this.props.onDropdownChangeAction) {
            this.props.onDropdownChangeAction(option.name, option.sort);
        }
    }
}
