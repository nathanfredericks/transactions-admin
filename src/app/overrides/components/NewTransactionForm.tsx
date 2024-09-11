import { Form } from "react-bootstrap";
import { useFormikContext } from "formik";
import { CategoryGroup, InitialValues, Payee } from "@/app/types";

type Props = {
  payees: Payee[];
  categoryGroups: CategoryGroup[];
};

export default function NewTransactionForm(props: Props) {
  const { categoryGroups, payees } = props;
  const { values, handleChange, errors, handleSubmit } =
    useFormikContext<InitialValues>();

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="payee">
        <Form.Label>Payee</Form.Label>
        <Form.Select
          aria-label="Select a payee"
          isInvalid={!!errors.payee}
          name="payee"
          onChange={handleChange}
          value={values.payee}
        >
          <option value=""></option>
          {payees?.map((payee) => (
            <option key={payee.id} value={payee.id}>
              {payee.name}
            </option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {errors.payee}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="category">
        <Form.Label>Category</Form.Label>
        <Form.Select
          aria-label="Select a category"
          isInvalid={!!errors.category}
          name="category"
          onChange={handleChange}
          value={values.category}
        >
          <option value=""></option>
          {categoryGroups?.map((group) => (
            <optgroup key={group.id} label={group.name}>
              {group.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </optgroup>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {errors.payee}
        </Form.Control.Feedback>
      </Form.Group>

      <div>
        <h5>Templating</h5>
        <div className="form-info">
          <p>
            Memo supports templating with{" "}
            <a href="https://handlebarsjs.com/">Handlebars</a>.
          </p>
          <strong>Variables</strong>
          <ul>
            <li>
              <code>{"{{date}}"}</code> - Today&apos;s date in{" "}
              <code>YYYY-MM-DD</code> format
            </li>
          </ul>
          <strong>Helpers</strong>
          <ul>
            <li>
              <code>{"formatDate"}</code> - Format date with{" "}
              <a href="https://moment.github.io/luxon/#/">Luxon</a>
            </li>
            <li>
              <code>{"subtractMonthFromDate"}</code> - Subtract one month from
              date
            </li>
          </ul>
          <strong>Example</strong>
          <ul>
            <li>
              <code>
                {'{{formatDate (subtractMonthFromDate date) "MMMM yyyy"}}'}
              </code>{" "}
              - One month ago in <code>MMMM yyyy</code> format
            </li>
          </ul>
        </div>
      </div>
      <Form.Group className="mb-3" controlId="memo">
        <Form.Label>Memo</Form.Label>
        <Form.Control
          isInvalid={!!errors.memo}
          name="memo"
          onChange={handleChange}
          value={values.memo}
        />
      </Form.Group>
    </Form>
  );
}
