import Head from "next/head";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { ListGroup, Container, Button } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";
import shopIcon from "bootstrap-icons/icons/shop.svg";
import personIcon from "bootstrap-icons/icons/person-fill.svg";
import { useRouter } from "next/router";
import { Override } from "@/types";
import { getOverrides } from "@/utils";
import Navbar from "@/components/Navbar";

export const getServerSideProps = (async () => {
  const overrides = await getOverrides();
  return { props: { overrides } };
}) satisfies GetServerSideProps<{ overrides: Override[] }>;

export default function Home({
  overrides,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  async function deleteMerchant(merchant: string) {
    const response = await fetch(
      `/api/merchant/${encodeURIComponent(merchant)}`,
      {
        method: "DELETE",
      },
    );
    if (!response.ok) {
      alert("Error deleting merchant");
    } else {
      router.reload();
    }
  }

  return (
    <>
      <Head>
        <title>Transactions</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navbar />
      <main>
        <Container className="d-flex flex-column gap-2 mt-2">
          <div className="d-flex justify-content-between align-items-center">
            <h1>Overrides</h1>
            <Link href="/merchant/create">
              <Button>Create</Button>
            </Link>
          </div>
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
                  <Button
                    variant="danger"
                    onClick={() => deleteMerchant(merchant || "")}
                  >
                    Delete
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Container>
      </main>
    </>
  );
}
