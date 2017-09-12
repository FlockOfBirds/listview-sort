import { shallow } from "enzyme";
import { OptionHTMLAttributes, createElement } from "react";

import { Dropdown, DropdownProps } from "../Dropdown";
import { createOptionProps, parseStyle } from "../../utils/ContainerUtils";

describe("Dropdown", () => {

    const renderDropdown = (props: DropdownProps) => shallow(createElement(Dropdown, props));

    const dropDownProps: DropdownProps = {
        onDropdownChangeAction: jasmine.any(Function) as any,
        options: createOptionProps([
            { caption: "Name Asc", name: "Name", isDefaultSort: true, order: "asc" },
            { caption: "Name Desc", name: "Name", isDefaultSort: false, order: "desc" },
            { caption: "Code Desc", name: "Code", isDefaultSort: false, order: "desc" }
        ]),
        style: parseStyle("html{}")
    };

    const createOptions = (props: DropdownProps) => {
        return props.options.map((optionObject) => {
            const { caption, value, isDefaultSort } = optionObject;
            const optionValue: OptionHTMLAttributes<HTMLOptionElement> = {
                className: "",
                label: caption,
                selected: isDefaultSort,
                value
            };
            return createElement("option", optionValue);
        });
    };

    it("renders the structure correctly", () => {
        const wrapper = renderDropdown(dropDownProps);

        expect(wrapper).toBeElement(
            createElement("div", { className: "form-group" },
                createElement("select", {
                    className: "form-control",
                    onChange: jasmine.any(Function) as any
                },
                    createOptions(dropDownProps)
                )
            )
        );
    });

    it("renders with the specified default sort", () => {
        const props: DropdownProps = {
            ...dropDownProps,
            options: createOptionProps([
                { caption: "Name Asc", name: "Name", isDefaultSort: false, order: "asc" },
                { caption: "Name Desc", name: "Name", isDefaultSort: true, order: "desc" }
            ])
        };

        const wrapper = renderDropdown(props);
        const option = wrapper.find("option").at(1);

        expect(option.prop("selected")).toBe(true);
    });

    describe("select", () => {
        it("changes value", (done) => {
            const newValue = "Code";
            const props: DropdownProps = {
                ...dropDownProps,
                onDropdownChangeAction: value => value
            };
            spyOn(props, "onDropdownChangeAction").and.callThrough();
            const wrapper = renderDropdown(props);
            const select: any = wrapper.find("select");

            select.simulate("change", {
                currentTarget: {
                    value: newValue + "-2"
                }
            });

            setTimeout(() => {
                expect(props.onDropdownChangeAction).toHaveBeenCalledWith(newValue, "desc");
                done();
            }, 1000);
        });

        it("updates when the select option changes", (done) => {
            const newValue = "Code";
            const props: DropdownProps = {
                ...dropDownProps,
                onDropdownChangeAction: value => value
            };
            spyOn(props, "onDropdownChangeAction").and.callThrough();
            const wrapper = renderDropdown(props);
            const select: any = wrapper.find("select");

            select.simulate("change", {
                currentTarget: {
                    value: "Name-0"
                }
            });

            setTimeout(() => {
                expect(props.onDropdownChangeAction).toHaveBeenCalledWith("Name", "asc");

                select.simulate("change", {
                    currentTarget: {
                        value: newValue + "-2"
                    }
                });

                setTimeout(() => {
                    expect(props.onDropdownChangeAction).toHaveBeenCalledWith(newValue, "desc");
                    done();
                }, 1000);
            }, 1000);
        });
    });
});
