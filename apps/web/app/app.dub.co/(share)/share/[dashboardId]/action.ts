"use server";

import { prismaEdge } from "@/lib/prisma/edge";
import { cookies } from "next/headers";

export async function verifyPassword(_prevState: any, data: FormData) {
  const dashboardId = data.get("dashboardId") as string;
  const password = data.get("password") as string;

  const dashboard = await prismaEdge.dashboard.findUnique({
    where: { id: dashboardId },
  });

  if (!dashboard) {
    return { error: "Dashboard not found" };
  }

  if (dashboard.password !== password) {
    return { error: "Invalid password" };
  }

  cookies().set(`dub_dash_${dashboardId}`, password, {
    path: "/",
    httpOnly: true,
    secure: true,
  });

  return { redirect: `/share/${dashboardId}` };
}