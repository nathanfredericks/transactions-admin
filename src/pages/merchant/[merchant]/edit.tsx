import Head from "next/head";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Container, Button } from "react-bootstrap";
import Error from "next/error";
import { useRouter } from "next/router";
import { Formik } from "formik";
import * as yup from "yup";
import MerchantForm from "../../../components/MerchantForm";
import { InitialValues, Override } from "@/types";
import { getYNABPayees } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import {getOverride} from "@/lib/override";

export const getServerSideProps = (async (context) => {
  const merchant = context.query.merchant as string;

  try {
    const override = await getOverride(merchant);
    const payees = await getYNABPayees();
    if (
      !payees?.some((payee) => payee === override?.payee) &&
      override?.payee
    ) {
      payees.push(override?.payee);
      payees.sort();
    }
    return { props: { errorCode: null, override, payees } };
  } catch (error) {
    console.error(error);
    return { props: { errorCode: 500, override: null, payees: null } };
  }
}) satisfies GetServerSideProps<{
  errorCode: number | null;
  override: Override | null;
  payees: string[] | null;
}>;

const schema = yup.object({
  payee: yup.string().required().label("Payee"),
});

export default function Edit({
  errorCode,
  override,
  payees,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  async function updateMerchant(values: InitialValues) {
    const response = await fetch(
      `/api/merchant/${encodeURIComponent(override?.merchant || "")}`,
      {
        method: "PATCH",
        body: JSON.stringify(values),
      },
    );
    if (!response.ok) {
      alert("Error updating merchant");
    } else {
      router.back();
    }
  }

  async function deleteMerchant() {
    const response = await fetch(
      `/api/merchant/${encodeURIComponent(override?.merchant || "")}`,
      {
        method: "DELETE",
      },
    );
    if (!response.ok) {
      alert("Error deleting merchant");
    } else {
      router.back();
    }
  }

  if (!payees || !override) {
    return <Error statusCode={500} />;
  }

  const initialValues: InitialValues = {
    merchant: override?.merchant || "",
    payee: override?.payee || "",
  };

  return (
    <>
      <Head>
        <title>Transactions - Edit {override.merchant}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navbar />
      <main>
        <Container className="d-flex flex-column gap-2 mt-2">
          <div className="d-flex justify-content-between align-items-center">
            <h1>
              Edit <span className="font-monospace">{override?.merchant}</span>
            </h1>
            <Button variant="danger" onClick={deleteMerchant}>
              Delete
            </Button>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={async (values, { setSubmitting }) => {
              await updateMerchant(values);
              setSubmitting(false);
            }}
            validateOnChange={false}
          >
            <MerchantForm payees={payees} isEditing />
          </Formik>
        </Container>
      </main>
    </>
  );
}
