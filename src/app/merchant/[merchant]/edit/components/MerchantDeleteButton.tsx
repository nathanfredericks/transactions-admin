"use client";

import { Button } from "react-bootstrap";
import { deleteOverride } from "@/app/actions";

type Props = {
  merchant: string;
};

export function MerchantDeleteButton(props: Props) {
  const { merchant } = props;

  return (
    <Button variant="danger" onClick={() => deleteOverride(merchant)}>
      Delete
    </Button>
  );
}
