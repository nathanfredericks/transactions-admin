"use client";
import { Button, ListGroup } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";
import shopIcon from "bootstrap-icons/icons/shop.svg";
import personIcon from "bootstrap-icons/icons/person-fill.svg";
import { Override } from "@/app/types";
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
        {overrides.map(({ merchant, payee }) => (
          <ListGroup.Item
            key={merchant}
            className="d-flex justify-content-between align-items-center"
          >
            <div className="d-flex flex-column">
              <span className="d-inline-flex column-gap-2 align-items-center font-monospace">
                <Image alt="shop icon" src={shopIcon} /> {merchant}
              </span>
              <span className="d-inline-flex column-gap-2 align-items-center">
                <Image alt="person icon" src={personIcon} /> {payee}
              </span>
            </div>
            <div className="d-inline-flex gap-2">
              <Link
                href={`/merchant/${encodeURIComponent(merchant || "")}/edit`}
              >
                <Button variant="secondary">Edit</Button>
              </Link>
              <Button variant="danger" onClick={() => deleteOverride(merchant)}>
                Delete
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
}
