import React from 'react';
import { useController, Controller } from 'react-hook-form';
import FormLabel from './FormLabel';

export function SelectField({
  form,
  name,
  label,
  validation = {},
  inputClassName,
  options,
  disabled,
  className,
  placeholder,
  autofocus,
  onChangeFunction,
  labelClasName = '',
  children
}) {
  const {
    fieldState: { error: innerError },
  } = useController({ name, control: form.control, rules: validation });

  const error = innerError;

  const onChange = (e) => {
    if (onChangeFunction) {
      onChangeFunction(e);
    }
  };

  return (
    <Controller
      name={name}
      control={form.control}
      rules={validation}
      render={({ field }) => (
        <div className={className || 'mb-1'}>
          {label && (
            <FormLabel className={`font-bold mb-1 ${labelClasName}`}>
              {label}
              {validation?.required?.value && <span className="text-orange-500 ml-1">*</span>}
            </FormLabel>
          )}
          {children}
          <select
            ref={field.ref}
            name={field.name}
            className={`form-select text-gray-800 w-full leading-5 max-h-9 rounded px-3 py-2 border-slate-700 ${inputClassName} ${error && 'is-invalid'
              } ${disabled ? 'bg-gray-50' : error ? 'bg-red-50' : 'bg-white'}`}
            value={field.value || ''}
            onBlur={field.onBlur}
            onChange={(e) => {
              field.onChange(e);
              onChange(e);
            }}
            autoFocus={!!autofocus}
            disabled={disabled}
          >
            {placeholder && (
              <option value="" hidden>
                {placeholder}
              </option>
            )}
            {options.map((option, key) => (
              <option key={key} value={option.value}>
                {option.label || option.value}
              </option>
            ))}
          </select>
          {error && (
            <div className="text-orange-500 text-xs font-semibold">
              {error.message || 'Dato non valido'}
            </div>
          )}
        </div>
      )}
    />
  );
}
