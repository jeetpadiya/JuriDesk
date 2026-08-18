"use client"

import { Controller, FormProvider, type ControllerProps, type FieldPath, type FieldValues, type FormProviderProps } from "react-hook-form"

function Form<TFieldValues extends FieldValues>(props: FormProviderProps<TFieldValues>) {
  return <FormProvider {...props} />
}

function FormField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>(
  props: ControllerProps<TFieldValues, TName>,
) {
  return <Controller {...props} />
}

export { Form, FormField }
