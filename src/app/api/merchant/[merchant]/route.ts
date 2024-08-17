import { z } from "zod";
import { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { deleteOverride, updateOverride } from "@/lib/override";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { merchant: string } },
) {
  const schema = z.object({
    payee: z.string(),
  });
  try {
    const json = await request.json();
    const { payee } = await schema.parseAsync(json);
    await updateOverride(params.merchant, payee);
    revalidateTag("overrides");
    return Response.json({ merchant: params.merchant, payee }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(error.errors, { status: 400 });
    } else {
      console.error(error);
      return Response.json({}, { status: 500 });
    }
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { merchant: string } },
) {
  try {
    await deleteOverride(params.merchant);
    revalidateTag("overrides");
    return Response.json({}, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(error.errors, { status: 400 });
    } else {
      console.error(error);
      return Response.json({}, { status: 500 });
    }
  }
}
