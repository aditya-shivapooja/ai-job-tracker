"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isApplicationStatus } from "@/lib/application-status";
import { requireUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${key} is required`);
  }

  return value.trim();
}

function getOptionalString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim().length === 0) {
    return null;
  }

  return value.trim();
}

export async function createApplication(formData: FormData) {
  const user = await requireUser();
  const status = formData.get("status");

  if (!isApplicationStatus(status)) {
    throw new Error("Status is invalid");
  }

  await prisma.application.create({
    data: {
      company: getRequiredString(formData, "company"),
      role: getRequiredString(formData, "role"),
      status,
      jobDescription: getOptionalString(formData, "jobDescription"),
      notes: getOptionalString(formData, "notes"),
      userId: user.id,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/applications");
  redirect("/applications");
}

export async function updateApplicationStatus(formData: FormData) {
  const user = await requireUser();
  const applicationId = getRequiredString(formData, "applicationId");
  const status = formData.get("status");

  if (!isApplicationStatus(status)) {
    throw new Error("Status is invalid");
  }

  await prisma.application.updateMany({
    where: {
      id: applicationId,
      userId: user.id,
    },
    data: {
      status,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/applications");
}

