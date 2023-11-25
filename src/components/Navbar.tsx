import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import {
  LoginLink,
  RegisterLink,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight } from "lucide-react";
import UserAccountNav from "./UserAccountNav";
// import { db } from "@/db";
// import MobileNav from "./MobileNav";

const Navbar = async () => {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  // const userId: string = user.id as string;

  // const dbUser = await db.user.findFirst({
  //   where: {
  //     id: userId,
  //   },
  // });
  // const role = dbUser?.role;
  // console.log("Admin", role);

  return (
    <nav className="sticky h-16 inset-x-0 top-0 z-50 w-full border-b border-gray-200 bg-black backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-16 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-bold text-white text-2xl">
            Chat<span className="text-blue-700">Doc</span>.ai
          </Link>

          {/* <MobileNav isAuth={!!user} /> */}

          <div className=" items-center space-x-4 flex">
            {!user ? (
              <>
               
                <LoginLink
                  className={
                    buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    }) + "hidden sm:flex text-white px-2 "
                  }
                >
                  Sign in
                </LoginLink>
                <RegisterLink
                  className={
                    buttonVariants({
                      size: "sm",
                    }) + "sm:w-[8rem] px-1"
                  }
                >
                  Get started <ArrowRight className="ml-1.5 h-5 w-4 sm:w-5 " />
                </RegisterLink>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  // className={buttonVariants({
                  //   variant: "ghost",
                  //   size: "sm",
                  // })}
                  className="hover:bg-slate-200 py-[.3rem] px-3 text-white hover:text-black rounded-md transition-all
                  font-semibold hidden sm:block"
                >
                  Dashboard
                </Link>

                <UserAccountNav
                  name={
                    !user.given_name || !user.family_name
                      ? "Your Account"
                      : `${user.given_name} ${user.family_name}`
                  }
                  email={user.email ?? ""}
                  imageUrl={user.picture ?? ""}
                />
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
