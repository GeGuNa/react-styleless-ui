import useDeterministicId from "@utilityjs/use-deterministic-id";
import useRegisterNodeRef from "@utilityjs/use-register-node-ref";
import * as React from "react";
import { isFragment } from "react-is";
import { type MergeElementProps } from "../typings.d";
import { componentWithForwardedRef } from "../utils";
import BreadcrumbContext from "./context";
import BreadcrumbItem, { type BreadcrumbItemProps } from "./Item";

type BreadcrumbClassesMap = Record<"root" | "label" | "list" | "item", string>;

interface BreadcrumbBaseProps {
  /**
   * The content of the breadcrumb.
   */
  children?: React.ReactNode;
  /**
   * Map of sub-components and their correlated classNames.
   */
  classes?: BreadcrumbClassesMap;
  /**
   * The label of the breadcrumb.
   */
  label:
    | string
    | {
        /**
         * The label to use as `aria-label` property.
         */
        screenReaderLabel: string;
      }
    | {
        /**
         * Identifies the element (or elements) that labels the breadcrumb.
         *
         * @see {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby MDN Web Docs} for more information.
         */
        labelledBy: string;
      };
}

export type BreadcrumbProps = Omit<
  MergeElementProps<"nav", BreadcrumbBaseProps>,
  "className" | "defaultChecked" | "defaultValue"
>;

const getLabelInfo = (labelInput: BreadcrumbProps["label"]) => {
  const props: {
    visibleLabel?: string;
    srOnlyLabel?: string;
    labelledBy?: string;
  } = {};

  if (typeof labelInput === "string") {
    props.visibleLabel = labelInput;
  } else {
    if ("screenReaderLabel" in labelInput) {
      props.srOnlyLabel = labelInput.screenReaderLabel;
    } else if ("labelledBy" in labelInput) {
      props.labelledBy = labelInput.labelledBy;
    } else {
      throw new Error(
        [
          "[StylelessUI][Breadcrumb]: Invalid `label` property.",
          "The `label` property must be either a `string` or in shape of " +
            "`{ screenReaderLabel: string; } | { labelledBy: string; }`"
        ].join("\n")
      );
    }
  }

  return props;
};

const BreadcrumbBase = (
  props: BreadcrumbProps,
  ref: React.Ref<HTMLElement>
) => {
  const {
    label,
    children: childrenProp,
    id: idProp,
    classes,
    ...otherProps
  } = props;

  const id = useDeterministicId(idProp, "styleless-ui__breadcrumb");
  const visibleLabelId = id ? `${id}__label` : undefined;

  const registerListRef = useRegisterNodeRef(list => {
    const listItems = Array.from(list.children);
    const lastItem = listItems[listItems.length - 1];

    if (!lastItem?.firstElementChild) return;

    if (lastItem.firstElementChild.tagName === "A") {
      const anchorLink = lastItem.firstElementChild as HTMLAnchorElement;

      if (anchorLink.hasAttribute("aria-current")) return;

      // eslint-disable-next-line no-console
      console.warn(
        [
          "[StylelessUI][Breadcrumb]: The aria attribute `aria-current`" +
            " is missing from the last <BreadcrumbItem>'s anchor element.",
          "For more information check out: " +
            "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current"
        ].join("\n")
      );
    }
  });

  const labelProps = getLabelInfo(label);

  const visibleLabel =
    typeof labelProps.visibleLabel !== "undefined"
      ? labelProps.visibleLabel
      : undefined;

  const children = React.Children.map(childrenProp, child => {
    if (!React.isValidElement(child)) return null;
    if (isFragment(child)) {
      // eslint-disable-next-line no-console
      console.error(
        "[StylelessUI][Breadcrumb]: The Breadcrumb component doesn't accept a Fragment as a child."
      );

      return null;
    }

    if ((child as React.ReactElement).type !== BreadcrumbItem) {
      // eslint-disable-next-line no-console
      console.error(
        "[StylelessUI][Breadcrumb]: The Breadcrumb component only accepts <BreadcrumbItem> as a child."
      );

      return null;
    }

    return child as React.ReactElement<BreadcrumbItemProps>;
  });

  return (
    <>
      {visibleLabel && (
        <label
          id={visibleLabelId}
          htmlFor={id}
          data-slot="label"
          className={classes?.label}
        >
          {visibleLabel}
        </label>
      )}
      <nav
        {...otherProps}
        id={id}
        ref={ref}
        className={classes?.root}
        aria-label={labelProps.srOnlyLabel}
        aria-labelledby={labelProps.labelledBy}
      >
        <ol ref={registerListRef} className={classes?.list}>
          <BreadcrumbContext.Provider value={{ classes }}>
            {children}
          </BreadcrumbContext.Provider>
        </ol>
      </nav>
    </>
  );
};

const Breadcrumb = componentWithForwardedRef<
  HTMLElement,
  BreadcrumbProps,
  typeof BreadcrumbBase
>(BreadcrumbBase);

export default Breadcrumb;
