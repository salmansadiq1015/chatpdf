import Deploy from "@/components/Deploy";
import Layout from "@/components/layout/Layout";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import React from "react";

export default function page() {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  return (
    <Layout>
      <Deploy userId={user.id} />
    </Layout>
  );
}
