"use client";
import * as yup from "yup";
import { Formik } from "formik";
import { InitialValues } from "@/app/types";
import MerchantForm from "@/app/components/MerchantForm";
import { createOverride } from "@/app/merchant/create/actions";

type Props = {
  payees: string[];
};

export function MerchantCreateForm(props: Props) {
  const { payees } = props;

  const schema = yup.object({
    merchant: yup.string().required().max(200).label("Merchant"),
    payee: yup.string().required().label("Payee"),
  });

  return (
    <Formik
      initialValues={{ merchant: "", payee: payees[0] } as InitialValues}
      validationSchema={schema}
      onSubmit={async (values) => {
        await createOverride(values.merchant, values.payee);
      }}
      validateOnChange={false}
    >
      <MerchantForm payees={payees} />
    </Formik>
  );
}
