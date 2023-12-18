// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function UserAvatar() {
  // const { getUser } = getKindeServerSession();
  // const user = getUser();

  return (
    <div>
      <Avatar className="h-8 w-8">
        <AvatarImage src="/user.png" />
        {/* <AvatarFallback>
          {user?.given_name?.charAt(0)}
          {user?.family_name?.charAt(0)}
        </AvatarFallback> */}
      </Avatar>
    </div>
  );
}
