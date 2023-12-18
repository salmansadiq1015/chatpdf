import React from "react";
import { Avatar, AvatarImage } from "../ui/avatar";

export default function BotAvatar() {
  return (
    <Avatar className="w-10 h-10">
      <AvatarImage className="p-1" src="/ChatbotF.png" />
    </Avatar>
  );
}
