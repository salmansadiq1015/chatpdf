import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/server";
import React from "react";

export default function MobileSignOut() {
  return (
    <div>
      <LogoutLink>Sign out</LogoutLink>
    </div>
  );
}
