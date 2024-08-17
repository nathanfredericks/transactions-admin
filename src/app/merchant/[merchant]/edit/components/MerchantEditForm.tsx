"use client";
import * as yup from "yup";
import { Formik } from "formik";
import { InitialValues } from "@/app/types";
import MerchantForm from "@/app/components/MerchantForm";
import { updateOverride } from "@/app/merchant/[merchant]/edit/actions";

type Props = {
  initialValues: InitialValues;
  payees: string[];
};

export function MerchantEditForm(props: Props) {
  const { initialValues, payees } = props;

  const schema = yup.object({
    merchant: yup.string().required().max(200).label("Merchant"),
    payee: yup.string().required().label("Payee"),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={async (values) => {
        await updateOverride(initialValues.merchant, values.payee);
      }}
      validateOnChange={false}
    >
      <MerchantForm payees={payees} isEditing />
    </Formik>
  );
}
