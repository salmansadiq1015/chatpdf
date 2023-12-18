import Image from "next/image";
import React from "react";

interface EmptyProps {
  lable: string;
}

export default function Empty({ lable }: EmptyProps) {
  return (
    <div className="h-full py-20 px-6 flex flex-col items-center justify-center">
      <div className="relative ">
        <Image src="/empty.png" width={100} height={100} alt="Empty" />
      </div>
      <div className="text-muted-foreground text-sm text-center">{lable}</div>
    </div>
  );
}
