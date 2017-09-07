export interface CommonProps {
    caption: string;
    sortAttributes: Array<{ name: string, caption: string, order: string }>;
}

export interface DropdownSortProps extends CommonProps {
    class?: string;
    mxform: mxui.lib.form._FormBase;
    targetListviewName: string;
    style: string;
}
export interface DropdownSortState {
    alertMessage?: string;
    targetListview?: ListView;
    targetNode?: HTMLElement;
    findingListviewWidget: boolean;
    validationPassed?: boolean;
}

export interface ListView extends mxui.widget._WidgetBase {
    _datasource: {
        _entity: string;
        _sorting: string[][];
    };
    update: () => void;
}

export const parseStyle = (style = ""): {[key: string]: string} => {
    try {
        return style.split(";").reduce<{[key: string]: string}>((styleObject, line) => {
            const pair = line.split(":");
            if (pair.length === 2) {
                const name = pair[0].trim().replace(/(-.)/g, match => match[1].toUpperCase());
                styleObject[name] = pair[1].trim();
            }
            return styleObject;
        }, {});
    } catch (error) {
        // tslint:disable-next-line no-console
        window.console.log("Failed to parse style", style, error);
    }

    return {};
};
