import * as React from "react";
import type { ValueEditorProps } from "react-querybuilder";
import {
  getFirstOption,
  standardClassnames,
  useValueEditor,
  ValueEditor,
  ValueSelector,
} from "react-querybuilder";

export const BootstrapValueEditor = (
  props: ValueEditorProps,
): React.JSX.Element | null => {
  const { valueAsArray, multiValueHandler } = useValueEditor({
    handleOnChange: props.handleOnChange,
    inputType: props.inputType,
    operator: props.operator,
    value: props.value,
    type: props.type,
    listsAsArrays: props.listsAsArrays,
    parseNumbers: props.parseNumbers,
    values: props.values,
  });

  const { selectorComponent: SelectorComponent = ValueSelector } = props;

  if (props.operator === "null" || props.operator === "notNull") {
    return null;
  }

  const placeHolderText = props.fieldData?.placeholder ?? "";

  if (
    (props.operator === "between" || props.operator === "notBetween") &&
    (props.type === "select" || props.type === "text")
  ) {
    const editors = ["from", "to"].map((key, i) => {
      if (props.type === "text") {
        return (
          <input
            className={`${standardClassnames.valueListItem} form-control w-50`}
            disabled={props.disabled}
            key={key}
            onChange={(e) => multiValueHandler(e.target.value, i)}
            placeholder={placeHolderText}
            type={props.inputType || "text"}
            value={valueAsArray[i] ?? ""}
          />
        );
      }
      return (
        <SelectorComponent
          key={key}
          {...props}
          className={`${standardClassnames.valueListItem} form-select w-50`}
          disabled={props.disabled}
          handleOnChange={(v) => multiValueHandler(v, i)}
          listsAsArrays={props.listsAsArrays}
          options={props.values ?? []}
          value={valueAsArray[i] ?? getFirstOption(props.values)}
        />
      );
    });

    return (
      <span
        className={standardClassnames.value}
        data-testid={props.testID}
        title={props.title}
      >
        {editors[0]}
        {props.separator}
        {editors[1]}
      </span>
    );
  }

  switch (props.type) {
    case "select":
    case "multiselect":
      return (
        <ValueEditor
          skipHook
          {...props}
          className={`${props.className} form-select w-50`}
        />
      );

    case "switch":
      return (
        <span className={`custom-control custom-switch ${props.className}`}>
          <input
            checked={!!props.value}
            className="form-check-input custom-control-input"
            disabled={props.disabled}
            onChange={(e) => props.handleOnChange(e.target.checked)}
            title={props.title}
            type="checkbox"
          />
        </span>
      );

    case "checkbox":
      return (
        <ValueEditor
          skipHook
          {...props}
          className={`form-check-input ${props.className}`}
        />
      );

    case "radio":
      return (
        <span className={standardClassnames.value} title={props.title}>
          {props.values?.map((v) => (
            <div className="form-check form-check-inline" key={v.name}>
              <input
                checked={props.value === v.name}
                className="form-check-input"
                disabled={props.disabled}
                id={v.name}
                onChange={(e) => props.handleOnChange(e.target.value)}
                type="radio"
                value={v.name}
              />
              <label className="form-check-label" htmlFor={v.name}>
                {v.label}
              </label>
            </div>
          ))}
        </span>
      );
    case "text":
      return (
        <input
          className={`${standardClassnames.valueListItem} form-control w-50 ${props.field === "merchant" ? "text-uppercase font-monospace" : ""}`}
          disabled={props.disabled}
          maxLength={props.field === "merchant" ? 16 : undefined}
          onChange={(e) => props.handleOnChange(e.target.value)}
          placeholder={placeHolderText}
          type="text"
          value={props.value}
        />
      );
  }

  return null;
};
