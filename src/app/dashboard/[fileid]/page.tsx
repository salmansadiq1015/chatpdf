import ChatWrapper from "@/components/chat/ChatWrapper";
import Layout from "@/components/layout/Layout";
import PdfRenderer from "@/components/PdfRenderer";
import PieChart from "@/components/PieChart";
import PolarAreaChart from "@/components/PolarArea";
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

  // Get Totle user files:
  // const uploadedFiles = await db.file.findMany({
  //   where: {
  //     userId: user.id,
  //   },
  // });

  // // Get Total User messages
  // const totalMessages = await db.message.findMany({
  //   where: {
  //     // id: fileid,
  //     userId: user.id,
  //   },
  //   orderBy: {
  //     createdAt: "asc",
  //   },
  // });

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

{
  /* h-[calc(100vh-3.5rem)] */
}
{
  /* <div className="flex-1 relative justify-between flex flex-col min-h-screen mb-4"> */
}
{
  /* <div
          title="Preview File"
          className="absolute top-0 right-0 z-40 px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6 "
        > */
}
{
  /* Main area */
}
{
  /* <PdfRenderer url={file?.url} />
        </div> */
}
{
  /* lg:flex xl:px-2 */
}
{
  /* <div className="mx-auto w-full max-w-8xl grow flex flex-col-reverse md:flex-row "> */
}
{
  /* ChatDOC */
}
{
  /* <div className="shrink-0  mt-[1rem] md:mt-[1rem] flex-1 border border-gray-300 lg:w-96 lg:border-l lg:border-t-0">
            <ChatWrapper isSubscribed={plan.isSubscribed} fileId={file.id} />
          </div> */
}

{
  /* -----------Left sidebar & main wrapper -----------*/
}
{
  /* 
          <div className=" relative flex-[.4] xl:flex flex-col min-h-[90vh] overflow-y-scroll ">
            <div
              className="w-full mt-[4rem] md:mt-[4rem] max-h-[17.5rem] flex flex-col py-[.5rem] px-4
             rounded-lg shadow-xl bg-slate-200 hover:shadow-2xl transition-all "
            >
              <h1
                className="text-xl text-green-950 font-bold"
                style={{ textShadow: "-1px 1px 0px #ccc" }}
              >
                Messages Analytics
              </h1>
              <div
                className="w-full h-[13rem] mt-3 flex  items-center justify-center"
                style={{
                  filter:
                    "drop-shadow(0.3rem 0.3rem 0.2rem rgba(0, 0, 0, 0.5))",
                }}
              >
                <PieChart totalMessages={totalMessages.length} />
              </div>
            </div> */
}

{
  /*  */
}
{
  /* <div
              className="w-full mt-[4rem] md:mt-[4rem] max-h-[17.5rem] flex flex-col py-[.5rem] px-4
             rounded-lg shadow-xl bg-slate-200 hover:shadow-2xl transition-all "
            >
              <h1
                className="text-xl text-green-950 font-bold"
                style={{ textShadow: "-1px 1px 0px #ccc" }}
              >
                Files Analytics
              </h1>
              <div
                className="w-full h-[13rem] mt-3 flex  items-center justify-center"
                style={{
                  filter:
                    "drop-shadow(0.3rem 0.3rem 0.2rem rgba(0, 0, 0, 0.5))",
                }}
              >
                <PolarAreaChart
                  uploadedFiles={uploadedFiles.length}
                  totalQuota={totalQuota}
                />
              </div>
            </div>
          </div>
        </div>
      </div> */
}
