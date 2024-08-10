import Head from "next/head";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Container } from "react-bootstrap";
import Error from "next/error";
import { useRouter } from "next/router";
import { Formik } from "formik";
import type { FormikHelpers } from "formik";
import * as yup from "yup";
import MerchantForm from "../../components/MerchantForm";
import { InitialValues } from "@/types";
import { getYNABPayees } from "@/lib/utils";
import Navbar from "@/components/Navbar";

export const getServerSideProps = (async () => {
  try {
    const payees = await getYNABPayees();
    return { props: { errorCode: null, payees } };
  } catch (error) {
    console.error(error);
    return { props: { errorCode: 500, merchants: null, payees: null } };
  }
}) satisfies GetServerSideProps<{
  errorCode: number | null;
  payees: string[] | null;
}>;

export default function Create({
  errorCode,
  payees,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  async function createMerchant(
    values: InitialValues,
    helpers: FormikHelpers<InitialValues>,
  ) {
    const response = await fetch(`/api/merchant`, {
      method: "POST",
      body: JSON.stringify({
        ...values,
        merchant: values.merchant.toUpperCase(),
      }),
    });
    if (!response.ok) {
      if (response.status === 409) {
        helpers.setFieldError("merchant", "Merchant already exists");
      } else {
        alert("Error creating merchant");
      }
    } else {
      router.back();
    }
  }

  if (!payees) {
    return <Error statusCode={500} />;
  }

  const schema = yup.object({
    merchant: yup.string().required().max(200).label("Merchant"),
    payee: yup.string().required().label("Payee"),
  });

  return (
    <>
      <Head>
        <title>Transactions - Create override</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navbar />
      <main>
        <Container className="d-flex flex-column gap-2 mt-2">
          <div className="d-flex justify-content-between align-items-center">
            <h1>Create override</h1>
          </div>
          <Formik
            initialValues={{ merchant: "", payee: payees[0] } as InitialValues}
            validationSchema={schema}
            onSubmit={async (values, helpers) => {
              await createMerchant(values, helpers);
              helpers.setSubmitting(false);
            }}
            validateOnChange={false}
          >
            <MerchantForm payees={payees} />
          </Formik>
        </Container>
      </main>
    </>
  );
}
