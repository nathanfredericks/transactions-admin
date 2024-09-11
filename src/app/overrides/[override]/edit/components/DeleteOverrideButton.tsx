"use client";

import { Button } from "react-bootstrap";
import { deleteOverride } from "@/app/actions";

type Props = {
  id: string;
};

export function DeleteOverrideButton(props: Props) {
  const { id } = props;

  return (
    <Button onClick={() => deleteOverride(id)} variant="danger">
      Delete
    </Button>
  );
}
