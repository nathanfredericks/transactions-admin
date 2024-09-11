"use client";
import { Button, ListGroup } from "react-bootstrap";
import Link from "next/link";
import type { Override } from "@/app/types";
import { deleteOverride } from "@/app/actions";

type Props = {
  overrides: Override[];
};

export default function OverridesList(props: Props) {
  const { overrides } = props;

  return (
    <>
      {overrides.length === 0 && <p>No overrides</p>}
      <ListGroup>
        {overrides.map(({ id, name }) => (
          <ListGroup.Item
            className="d-flex justify-content-between align-items-center"
            key={id}
          >
            <div className="d-flex flex-column">{name}</div>
            <div className="d-inline-flex gap-2">
              <Link href={`/overrides/${id}/edit`}>
                <Button variant="secondary">Edit</Button>
              </Link>
              <Button onClick={() => deleteOverride(id)} variant="danger">
                Delete
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
}
