import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import FormInput, { FormInputProps } from './FormInput';

interface ControlledInputProps<T extends FieldValues> extends Omit<FormInputProps, 'value' | 'onChangeText'> {
  name: Path<T>;
  control: Control<T>;
  rules?: {
    required?: string | boolean;
    pattern?: {
      value: RegExp;
      message: string;
    };
    minLength?: {
      value: number;
      message: string;
    };
    maxLength?: {
      value: number;
      message: string;
    };
    validate?: (value: any) => string | boolean | Promise<string | boolean>;
  };
  defaultValue?: string;
}

/**
 * A controlled input component that integrates with react-hook-form
 */
function ControlledInput<T extends FieldValues>({
  name,
  control,
  rules,
  defaultValue = '',
  ...inputProps
}: ControlledInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue as any}
      render={({ field: { onChange, onBlur, value }, fieldState: { error, isTouched } }) => (
        <FormInput
          {...inputProps}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          error={error?.message}
          touched={isTouched}
        />
      )}
    />
  );
}

export default ControlledInput; 