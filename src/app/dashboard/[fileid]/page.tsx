import ChatWrapper from "@/components/chat/ChatWrapper";
import Layout from "@/components/layout/Layout";
import PdfRenderer from "@/components/PdfRenderer";
import { db } from "@/db";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: {
    fileid: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { fileid } = params;

  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user || !user.id) redirect(`/auth-callback?origin=dashboard/${fileid}`);

  const file = await db.file.findFirst({
    where: {
      id: fileid,
      userId: user.id,
    },
  });

  if (!file) notFound();

  const plan = await getUserSubscriptionPlan();
  // const totalQuota = plan.quota || 10;

  return (
    <Layout>
      {/* h-[calc(100vh-3.5rem)] */}
      <div className="flex-1 w-full justify-between flex flex-col min-h-screen">
        <div className="mx-auto  w-full max-w-8xl grow lg:flex xl:px-2 flex flex-col-reverse lg:flex-row">
          <div className="shrink-0 flex-[1] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
            <ChatWrapper isSubscribed={plan.isSubscribed} fileId={file.id} />
          </div>

          {/* Left sidebar & main wrapper */}
          <div className="flex-1 xl:flex mt-[2rem] md:mt-0">
            <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6 ">
              {/* Main area */}
              <PdfRenderer url={file.url} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Page;
