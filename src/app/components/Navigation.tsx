"use client";
import { Container, Navbar, Button } from "react-bootstrap";
import Link from "next/link";

export default function Navigation() {
  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <Link href="/" legacyBehavior passHref>
          <Navbar.Brand>Transactions</Navbar.Brand>
        </Link>
        <Link href="/api/auth/logout">
          <Button variant="outline-secondary">Logout</Button>
        </Link>
      </Container>
    </Navbar>
  );
}
