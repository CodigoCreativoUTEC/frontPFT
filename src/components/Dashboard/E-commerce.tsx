"use client";
import React from "react";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const ECommerce: React.FC = () => {
  return (
    <>
    <div className="border-s-success justify-center p-2">
       <Link href="/">
          <Image
            width={120}
            height={32}
            src={"/images/logo/logoCodigo.jpg"}
            alt="Logo"
            priority
          />
        </Link>
    </div>
    </>
  );
};

export default ECommerce;
