import React from "react";
import { Avatar, AvatarImage } from "../ui/avatar";

export default function BotAvatar() {
  return (
    <Avatar className="w-8 h-8">
      <AvatarImage className="p-1" src="/ChatbotF.png" />
    </Avatar>
  );
}
