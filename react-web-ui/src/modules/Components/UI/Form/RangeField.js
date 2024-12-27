// import formatNumber from 'format-number';
import React, { useEffect, useRef, useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import FormLabel from './FormLabel';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

let incrementalId = 0;

const InputGroupWrapper = ({ children, iconRight, buttonRight, inputGroupClassName }) =>
  buttonRight ? (
    <div className={`input-group ${inputGroupClassName}`}>{children}</div>
  ) : iconRight ? (
    <div className={`position-relative ${inputGroupClassName}`}>{children}</div>
  ) : (
    children
  );

export function RangeField({
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
  const formatter = (value) => value;
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

        <RangeSlider
          className={`mt-5 ${inputClassName}`}
          ref={(node) => {
            field.ref(node);
            inputRef.current = node;
          }}
          name={field.name}
          value={showValue || inputValue || formatter(field.value || '') || startValue}
          /* onBlur={(e) => {
            const originalValue = e.currentTarget.value;
            const value = originalValue ? parser(originalValue) : null;
            field.onBlur(value);
            setInputValue(formatter(value));
            if (onBlur) onBlur(value);
          }} */
          onInput={(originalValue, e) => {
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
