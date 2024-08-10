import { Container, Navbar as NavigationBar, Button } from "react-bootstrap";
import Link from "next/link";

export default function Navbar() {
  return (
    <NavigationBar className="bg-body-tertiary">
      <Container>
        <Link href="/" legacyBehavior passHref>
          <NavigationBar.Brand>Transactions</NavigationBar.Brand>
        </Link>
        <Link href="/api/auth/logout">
          <Button variant="outline-secondary">Logout</Button>
        </Link>
      </Container>
    </NavigationBar>
  );
}
