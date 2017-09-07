import page from "./pages/home.page";

const testValue = "Red light";

describe("DropdownSort", () => {
    it("when dropdown is rendered the list view should be sorted by default", () => {
        page.open();
        page.dropdownSort.waitForVisible();
        page.listViewFirstItem.waitForVisible();

        const itemValue = page.listViewFirstItem.getHTML();
        expect(itemValue).toContain(testValue);
    });
});
