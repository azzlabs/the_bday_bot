// import formatNumber from 'format-number';
import React, { useEffect, useRef, useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import FormLabel from './FormLabel';

let incrementalId = 0;

const InputGroupWrapper = ({ children, iconRight, buttonRight, inputGroupClassName }) =>
  buttonRight ? (
    <div className={`input-group ${inputGroupClassName}`}>{children}</div>
  ) : iconRight ? (
    <div className={`position-relative ${inputGroupClassName}`}>{children}</div>
  ) : (
    children
  );

export function TextField({
  form,
  name,
  label,
  labelColor,
  placeholder,
  validation,
  autofocus,
  className,
  inputClassName,
  iconRight,
  buttonRight,
  style,
  readonly,
  inputRef,
  onClick,
  onBlur,
  onChangeFunction,
  error: outerError,
  thousandsSeparator = '.',
  decimalsSeparator = ',',
  labelClasName = '',
  disabled,
  bgColor,
  startValue,
  showValue,
  autocomplete,
  min = undefined,
  max = undefined,
  children = null,
  ...props
}) {
  const [id] = useState(++incrementalId);
  const fallbackForm = useForm();
  // use field without form
  name = name || `field_${id}`;
  form = form || fallbackForm;
  inputRef = inputRef || useRef(); // eslint-disable-line

  const onChange = (e) => {
    if (onChangeFunction) {
      onChangeFunction(e);
    }
  };

  const {
    field,
    fieldState: { error: innerError },
  } = useController({ name, control: form.control, rules: validation });

  const error = innerError || outerError;
  const formatter =
    /* type === 'number'
      ? (value) => formatNumber({ integerSeparator: '', decimal: decimalsSeparator })(value)
      : */(value) => value;
  const parser =
    props.type === 'number'
      ? (value) =>
        parseFloat(
          `${value}`
            .trim()
            .replace(new RegExp(`[${thousandsSeparator}]`, 'g'), '')
            .replace(decimalsSeparator, '.'),
        )
      : (value) => value;
  const [inputValue, setInputValue] = useState(formatter(field.value || ''));

  return (
    <div className={className || 'mb-1'} style={style}>
      {label && (
        <FormLabel className={`font-bold mb-1 ${labelClasName}`}>
          {label}
          {validation?.required?.value && <span className="text-orange-500 ml-1">*</span>}
        </FormLabel>
      )}
      <InputGroupWrapper
        iconRight={iconRight}
        buttonRight={buttonRight}
      >
        <input
          ref={(node) => {
            field.ref(node);
            inputRef.current = node;
          }}
          name={field.name}
          className={`form-input text-gray-800 w-full border-slate-700 leading-5 max-h-9 rounded px-3 py-2 ${inputClassName} ${props.disabled ? 'bg-gray-50 cursor-not-allowed' : error ? 'bg-red-50' : 'bg-white'
            } ${bgColor && bgColor} ${error ? 'is-invalid' : ''}`}
          value={showValue || inputValue || formatter(field.value || '') || startValue}
          onBlur={(e) => {
            const originalValue = e.currentTarget.value;
            const value = originalValue ? parser(originalValue) : null;
            field.onBlur(value);
            setInputValue(formatter(value));
            if (onBlur) onBlur(value);
          }}
          onChange={(e) => {
            const originalValue = e.currentTarget.value;
            const value = originalValue ? parser(originalValue) : null;
            field.onChange(value);
            setInputValue(originalValue);
            onChange(e);
          }}
          {...props}
        />
        {error && (
          <div className="text-orange-500 text-xs font-semibold">
            {error.message || 'Dato non valido'}
          </div>
        )}
      </InputGroupWrapper>

      {children}
    </div>
  );
}
