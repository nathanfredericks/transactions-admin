import {Container, Navbar as ReactBootstrapNavbar} from "react-bootstrap";
import Link from "next/link";

export default function Navbar() {
  return (
    <ReactBootstrapNavbar className="bg-body-tertiary">
      <Container>
        <Link href="/" legacyBehavior passHref>
          <ReactBootstrapNavbar.Brand>Transactions</ReactBootstrapNavbar.Brand>
        </Link>
      </Container>
    </ReactBootstrapNavbar>
  )
}