import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import React from "react";

interface HeadingProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  bgColor?: string;
}

export default function Heading({
  title,
  description,
  icon: Icon,
  iconColor,
  bgColor,
}: HeadingProps) {
  return (
    <div className="px-4 flex flex-col  items-center justify-center gap-y-6 mb-8">
      <div className={cn("p-2 rounded-md w-fit", bgColor)}>
        <Icon className={cn("h-10 w-10", iconColor)} />
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-center ">{title}</h2>
        <p className="text-sm text-muted-foreground text-center">
          {description}
        </p>
      </div>
    </div>
  );
}
