import { SFC, createElement } from "react";
import * as classNames from "classnames";

import "../ui/PreLoader.scss";

export const PreLoader: SFC<{ className?: string }> = (props) =>
    createElement("div", {
            className: classNames(`widget-drop-down-sort-pre-loader-wrapper`, props.className)
        },
        createPreLoader("one"),
        createPreLoader("two"),
        createPreLoader("three")
    );

const createPreLoader = (index: string) => {
    return createElement("span", { className: `widget-drop-down-sort-pre-loader bubble-${index}` });
};

PreLoader.displayName = "PreLoader";
