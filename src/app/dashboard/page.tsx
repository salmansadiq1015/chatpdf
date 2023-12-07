import Dashboard from "@/components/Dashboard";
import LinesChart from "@/components/LinesChart";
import { db } from "@/db";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user || !user.id) redirect("/auth-callback?origin=dashboard");

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  });

  const AllUser = await db.user.findMany();

  const uploadedFiles = await db.file.findMany({
    where: {
      userId: user.id,
    },
  });

  if (!dbUser) redirect("/auth-callback?origin=dashboard");

  const subscriptionPlan = await getUserSubscriptionPlan();

  return (
    <>
      <Dashboard
        subscriptionPlan={subscriptionPlan}
        uploadedFiles={uploadedFiles.length}
      />
      <div className="w-full px-[1rem] sm:px-[3rem] min-h-screen ">
        <h2
          className="text-3xl text-black font-semibold "
          style={{ textShadow: "-1px 1px 0px #888" }}
        >
          Analytics
        </h2>
        <LinesChart
          fileLength={5}
          AllUser={AllUser.length}
          UserFile={uploadedFiles.length}
        />
      </div>
    </>
  );
};

export default Page;
