"use client";
import * as yup from "yup";
import { Formik, type FormikProps } from "formik";
import { Button, Card, Form } from "react-bootstrap";
import NewTransactionForm from "@/app/overrides/components/NewTransactionForm";
import type { CategoryGroup, InitialValues, Payee } from "@/app/types";
import { TransactionQueryBuilder } from "@/app/overrides/components/TransactionQueryBuilder";

type Props = {
  initialValues: InitialValues;
  payees: Payee[];
  categoryGroups: CategoryGroup[];
  onSubmit: (values: InitialValues) => void;
};

export function OverrideForm(props: Props) {
  const { initialValues, payees, categoryGroups, onSubmit } = props;

  const schema = yup.object().shape({
    name: yup.string().label("Override").required(),
    payee: yup.string().label("Payee").required(),
    category: yup.string().nullable().label("Category"),
    memo: yup.string().nullable().label("Memo"),
    query: yup.object().label("Query").required(),
  });

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => onSubmit(values)}
        validateOnChange={false}
        validationSchema={schema}
      >
        {({
          dirty,
          isSubmitting,
          submitForm,
          values,
          setFieldValue,
          handleChange,
          errors,
        }: FormikProps<InitialValues>) => (
          <>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Override name</Form.Label>
              <Form.Control
                isInvalid={!!errors.name}
                name="name"
                onChange={handleChange}
                value={values.name}
              />
            </Form.Group>
            <Card>
              <Card.Header>Query Builder</Card.Header>
              <Card.Body className="p-0">
                <TransactionQueryBuilder
                  query={values.query}
                  setQuery={(query) => setFieldValue("query", query)}
                />
              </Card.Body>
            </Card>
            <Card>
              <Card.Header>New Transaction</Card.Header>
              <Card.Body>
                <NewTransactionForm
                  categoryGroups={categoryGroups}
                  payees={payees}
                />
              </Card.Body>
            </Card>

            <div className="d-inline-flex justify-content-end">
              <Button
                disabled={isSubmitting || !dirty}
                onClick={submitForm}
                type="submit"
                variant="primary"
              >
                Save
              </Button>
            </div>
          </>
        )}
      </Formik>
    </>
  );
}
