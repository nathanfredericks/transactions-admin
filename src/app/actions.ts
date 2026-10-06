"use server";
import { redirect } from "next/navigation";
import { removeOverride } from "@/app/utils/overrides";
export async function deleteOverride(id: string) {
  await removeOverride(id);
  redirect("/");
}
