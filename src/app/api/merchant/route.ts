import { NextRequest } from "next/server";
import { z } from "zod";
import { revalidateTag } from "next/cache";
import { createOverride, getOverrides } from "@/lib/override";

export async function POST(request: NextRequest) {
  const schema = z.object({
    merchant: z.string(),
    payee: z.string(),
  });
  try {
    const json = await request.json();
    const { merchant, payee } = await schema.parseAsync(json);
    const overrides = (await getOverrides()) ?? [];
    const merchants = overrides
      .map(({ merchant }) => merchant)
      .filter((merchant): merchant is string => !!merchant);
    if (merchants.includes(merchant)) {
      return Response.json(
        { revalidated: true, now: Date.now() },
        { status: 409 },
      );
    }
    await createOverride(merchant, payee);
    revalidateTag("overrides");
    return Response.json({ merchant, payee }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(error.errors, { status: 400 });
    } else {
      console.error(error);
      return Response.json({}, { status: 500 });
    }
  }
}
