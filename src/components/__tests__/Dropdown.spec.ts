import { shallow } from "enzyme";
import { createElement } from "react";

import { Dropdown, DropdownProps, DropdownType } from "../Dropdown";
import { parseStyle } from "../../utils/ContainerUtils";

describe("Dropdown", () => {
    const renderDropdown = (props: DropdownProps) => shallow(createElement(Dropdown, props));
    const dropDownProps: DropdownProps = {
        onDropdownChangeAction:  jasmine.any(Function) as any,
        sortAttributes: [
            { caption: "Name Asc", name: "Name", isDefaultSort: true, order: "asc" },
            { caption: "Name Desc", name: "Name", isDefaultSort: false, order: "desc" },
            { caption: "Code Desc", name: "Code", isDefaultSort: false, order: "desc" }
        ],
        style: parseStyle("html{}")
    };
    const createOptions = (props: DropdownProps) => {
        const foundDefaultSortOption = false;
        return props.sortAttributes.map((optionObject) => {
            const { name, caption, isDefaultSort, order } = optionObject;
            const optionValue: DropdownType = {
                className: "",
                label: caption,
                order,
                selected: isDefaultSort && !foundDefaultSortOption,
                value: name
            };
            return createElement("option", optionValue);
        });
    };

    it("renders the structure correctly", () => {
        const dropDown = renderDropdown(dropDownProps);

        expect(dropDown).toBeElement(
            createElement("div", { className: "form-group" },
                createElement("select", { className: "form-control", onChange: jasmine.any(Function) as any },
                    createOptions(dropDownProps)
                )
            )
        );
    });

    it("renders with the specified default sort", () => {
        const props: DropdownProps = {
            ...dropDownProps,
            sortAttributes: [
                { caption: "Name Asc", name: "Name", isDefaultSort: false, order: "asc" },
                { caption: "Name Desc", name: "Name", isDefaultSort: true, order: "desc" }
            ]
        };

        const dropDown = renderDropdown(props);
        const option = dropDown.find("option").at(1);

        expect(option.prop("selected")).toBe(true);
    });

    it("renders with first option selected if default sort is not specified", () => {
        const props: DropdownProps = {
            ...dropDownProps,
            sortAttributes: [
                { caption: "Name Asc", name: "Name", isDefaultSort: false, order: "asc" },
                { caption: "Code Desc", name: "Code", isDefaultSort: false, order: "desc" }
            ]
        };

        const dropDown = renderDropdown(props);
        const option = dropDown.find("option").at(0);

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
                    selectedOptions: [ { getAttribute: (_attribute: string) => "asc" } ],
                    value: newValue
                }
            });

            setTimeout(() => {
                expect(props.onDropdownChangeAction).toHaveBeenCalledWith(newValue, "asc");
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
                    selectedOptions: [ { getAttribute: (_attribute: string) => "asc" } ],
                    value: "Name"
                }
            });

            setTimeout(() => {
                expect(props.onDropdownChangeAction).toHaveBeenCalledWith("Name", "asc");

                select.simulate("change", {
                    currentTarget: {
                        selectedOptions: [ { getAttribute: (_attribute: string) => "asc" } ],
                        value: newValue
                    }
                });

                setTimeout(() => {
                    expect(props.onDropdownChangeAction).toHaveBeenCalledWith(newValue, "asc");
                    done();
                }, 1000);
            }, 1000);
        });
    });
});
