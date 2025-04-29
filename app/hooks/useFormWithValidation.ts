import { useCallback } from 'react';
import { useForm, UseFormProps, FieldValues, SubmitHandler, SubmitErrorHandler } from 'react-hook-form';

/**
 * Custom hook that extends react-hook-form with additional validation features
 */
export function useFormWithValidation<TFieldValues extends FieldValues = FieldValues>(
  options: UseFormProps<TFieldValues> & {
    onValid?: SubmitHandler<TFieldValues>;
    onInvalid?: SubmitErrorHandler<TFieldValues>;
  }
) {
  const { onValid, onInvalid, ...formOptions } = options;
  
  const methods = useForm<TFieldValues>({
    mode: 'onBlur',
    ...formOptions,
  });
  
  const {
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
    reset,
    control,
    getValues,
    setValue,
    watch,
    trigger,
  } = methods;
  
  // Enhanced submit handler that supports loading state
  const submitForm = useCallback(() => {
    return handleSubmit(
      async (data) => {
        if (onValid) {
          await onValid(data);
        }
      },
      (errors) => {
        if (onInvalid) {
          onInvalid(errors);
        }
        console.log('Form validation errors:', errors);
      }
    )();
  }, [handleSubmit, onValid, onInvalid]);
  
  return {
    ...methods,
    submitForm,
    errors,
    isSubmitting,
    isFormValid: isDirty && isValid,
    control,
    reset,
    getValues,
    setValue,
    watch,
    trigger,
  };
}

export default useFormWithValidation; 