// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function UserAvatar() {
  // const { getUser } = getKindeServerSession();
  // const user = getUser();

  return (
    <div>
      <Avatar className="h-6 w-6">
        <AvatarImage src="/user.png" />
      </Avatar>
    </div>
  );
}
