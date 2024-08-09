import { Button, Form } from "react-bootstrap";
import { useFormikContext } from "formik";
import { InitialValues, Override } from "@/types";

type Props = {
  override?: Override;
  payees: string[];
  isEditing?: boolean;
};

export default function MerchantForm(props: Props) {
  const { payees, isEditing = false } = props;
  const { values, handleChange, dirty, errors, isSubmitting, handleSubmit } =
    useFormikContext<InitialValues>();

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="payee">
        <Form.Label>Merchant</Form.Label>
        <Form.Control
          type="text"
          name="merchant"
          className="font-monospace"
          style={{textTransform: "uppercase"}}
          onChange={handleChange}
          value={values.merchant}
          disabled={isEditing}
          isInvalid={!!errors.merchant}
        />
        <Form.Control.Feedback type="invalid">
          {errors.merchant}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3" controlId="payee">
        <Form.Label>Payee</Form.Label>
        <Form.Select
          name="payee"
          aria-label="Select a payee"
          onChange={handleChange}
          value={values.payee}
          isInvalid={!!errors.payee}
        >
          {payees?.map((payee) => (
            <option key={payee} value={payee}>
              {payee}
            </option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {errors.payee}
        </Form.Control.Feedback>
      </Form.Group>
      <div className="d-inline-flex gap-2">
        <Button
          variant="primary"
          type="submit"
          disabled={isSubmitting || !dirty}
        >
          Save
        </Button>
      </div>
    </Form>
  );
}
