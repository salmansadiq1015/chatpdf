import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import "./home.css";
import { ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Pricing from "./pricing/page";
import Image from "next/image";
import { db } from "@/db";
import UserComment from "../components/UserComment";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Footer from "@/components/Footer";
import Comment from "@/components/Comment";
import Navbar from "@/components/Navbar";
import Section5 from "@/components/Home/Section5";
import Section6 from "@/components/Home/Section6";

export default async function Home() {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  const comment = await db.comment.findMany({});

  const dbUser = await db.user.findFirst({
    where: {
      id: user?.id ?? undefined,
    },
  });

  return (
    <>
      <Navbar />
      <MaxWidthWrapper
        className="relative mt-20 sm:mt-30 flex flex-col items-center justify-center  overflow-hidden
    "
      >
        <div className="fixed bottom-3 right-3 z-50">
          <Comment userId={user?.id} userEmail={user?.email} />
        </div>
        <div className="px-2.5 md:px-20 mb-12">
          <div
            className="relative w-full min-h-screen rounded-lg home-page1"
            data-aos="fade-up"
          >
            <div className="relative mt-[4rem] ml-[1rem] z-30 ">
              <h2
                className="font-extrabold text-4xl  text-blue-600 text-start md:text-6xl "
                style={{ textShadow: "-1px 1px 0px #000" }}
              >
                AI Powered Chatbot Trained On Custom Your Data
              </h2>
              <p
                className="font-normal text-md  text-zinc-400 text-justify mt-4"
                data-aos="fade-up"
              >
                <span className="text-zinc-900 font-semibold">ChatDoc</span> is
                an AI-powered document management tool that streamlines data
                extraction and retrieval from custom data sources, such as PDFs,
                CSVs, and text files. Users can effortlessly search, organize,
                and interact with their documents, enhancing productivity and
                information accessibility.
              </p>
              {/* <button
            className="flex items-center justify-center gap-2 py-2 px-4 bg-blue-600
           text-white rounded-md cursor-pointer mt-6 hover:bg-blue-700 transition-colors"
          >
            Get Started <ArrowRight />
          </button> */}
              <Link
                className={buttonVariants({
                  size: "lg",
                  className: "mt-5",
                })}
                href="/dashboard"
                target="_blank"
                id="dashboardBtn"
              >
                Get started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="image z-30 w-full h-full">
              <Image
                src="/Page1.webp"
                alt="preview"
                width="500"
                height="352"
                className="w-full h-[22rem] sm:h-full"
              />
            </div>
          </div>
          <div className="anim1">
            <span className="star"></span>
          </div>

          <div className="anim2">
            <span className="sta2"></span>
          </div>
          {/* <div className="anim3 ">
        <span className="sta3"></span>
      </div> */}

          {/* <-------------Page-2---------------> */}

          <section
            className=" relative mt-[4rem] sm:mt-[10rem] home-section2 z-30 px-0"
            data-aos="fade-right"
            id="features"
          >
            <div className="section2-content flex flex-col items-center justify-center gap-4">
              <h1
                className="text-center font-bold text-black text-3xl px-[.5rem] sm:px-[3rem] sm:text-6xl"
                style={{ textShadow: "-1px 1px 0px #999" }}
              >
                Begin your chat session within minutes.
              </h1>
              <p className="px-[.5rem] md:px-[6rem] text-center text-zinc-500 ">
                Interacting with your PDF, SVG, TXT documents has never been
                this simple, thanks to ChatDoc. Our user-friendly interface
                ensures quick and efficient communication with your PDF, SVG,
                TXT files.
              </p>

              <div className="chat-steps mt-[2rem] px-0 w-full">
                <div className="chat-step flex flex-col gap-4 items-center">
                  <div className="step-image">
                    <Image
                      src="/step1.webp"
                      alt="step1"
                      width="500"
                      height="320"
                      className="p-[.5rem] hover:scale-105 transition-all"
                    />
                  </div>
                  <h2 className="text-3xl text-zinc-900 font-bold mt-2">
                    Register for an account
                  </h2>
                  <h1 className="text-4xl text-blue-600 font-extrabold ">01</h1>
                  <p className="text-center text-zinc-500 font-normal ">
                    Register for your account now to access our platform&apos;s
                    full range of features and benefits.
                  </p>
                </div>
                {/* Step 2 */}
                <div className="chat-step flex flex-col gap-4 items-center">
                  <div className="step-image2">
                    <Image
                      src="/step2.webp"
                      alt="step2"
                      width="500"
                      height="320"
                      className="p-[.5rem] hover:scale-105 transition-all"
                    />
                  </div>
                  <h2 className="text-3xl text-zinc-900 font-bold mt-2">
                    Upload your documents
                  </h2>
                  <h1 className="text-4xl text-blue-600 font-extrabold ">02</h1>

                  <p className="text-center text-zinc-500 font-normal ">
                    Add any TXT Files, PDF files & CSV Files securely into your
                    ChatDoc in minutes.
                  </p>
                </div>
                {/* Step 3 */}
                <div className="chat-step chat-step flex flex-col gap-4 items-center">
                  <div className="step-image3">
                    <Image
                      src="/step3.webp"
                      alt="step3"
                      width="500"
                      height="320"
                      className="p-[.5rem] hover:scale-105 transition-all"
                    />
                  </div>
                  <h2 className="text-3xl text-zinc-900 font-bold mt-2">
                    Initiate your queries.
                  </h2>
                  <h1 className="text-4xl text-blue-600 font-extrabold ">03</h1>

                  <p className="text-center text-zinc-500 font-normal ">
                    Experience sheer simplicity! Discover the lightning-fast
                    ChatDoc today; it&apos;s a matter of mere seconds to get
                    started.
                  </p>
                </div>
              </div>
            </div>
            <div
              className="w-full h-full rounded-lg p-[1rem] shadow-2xl mt-[4rem]"
              style={{
                background: "rgba(215, 215, 215, 0.3)",
                border: "1px solid #ccc",
              }}
            >
              <Image
                src="/file-upload-preview.jpg"
                alt="prew"
                width="1200"
                height="320"
                className="rounded-lg border border-zinc-200"
              />
            </div>
          </section>

          {/* -----------Section 3------------ */}

          <section
            className="home-section3 w-full min-h-screen bg-blue-600 text-white rounded-xl shadow-lg mt-[4rem] 
      sm:mt-[7rem] z-30"
          >
            <div className="section3-comtent flex flex-col items-center justify-center gap-4 py-[3rem]">
              <h1
                className="text-3xl font-bold text-white px-[1rem] sm:text-5xl sm:px-[4rem] text-center "
                style={{ textShadow: "-1px 1px 0px #000" }}
              >
                An Intuitive AI Chatbot Platform for Seamless Conversations.
              </h1>
              <p className="text-lg text-zinc-200 px-[1rem] sm:px-[4rem] text-center mb-[2rem] ">
                Anyone can setup your custom data chatDoc in minute to help
                interecting with your documents or ask any question
              </p>
              <video
                src="/chatvideo.mp4"
                loop
                autoPlay
                muted
                playsInline
                className="mt-[1rem] px-1 rounded-md"
              ></video>
            </div>
          </section>

          {/* Section 4 */}
          <section
            className=" w-full min-h-[70vh] bg-slate-200 mt-[4rem] sm:mt-[6rem] rounded-md shadow-xl flex 
      flex-col items-center justify-center z-30 "
          >
            <div className="section3-content w-full flex flex-col items-center justify-center gap-4">
              <h3 className="text-lg font-semibold text-blue-700">
                SEEING IS BELIEVING
              </h3>
              <h1
                className="text-3xl sm:text-5xl text-center px-[.5rem] md:px-[3.5rem] font-semibold
           text-zinc-950-700 line-"
                style={{
                  lineHeight: "3.8rem",
                  textShadow: "-1px 1px 0px #000",
                }}
              >
                Elevate Your Daily Routine with Our Dynamic Chatbot Integration.
              </h1>

              <Button className="homebtn flex flex-col gap-1 h-[5rem] font-semibold text-xl mt-[1rem] overflow-hidden">
                <span className="z-40">Chat Your First Document</span>
                <span className="uppercase font-normal text-lg z-40">
                  {" "}
                  NO credit card required
                </span>
              </Button>
            </div>
          </section>

          {/* ---------Section 5-------- */}
          <section className=" w-full min-h-screen mt-[4rem] rounded-md py-[4rem] px-2 sm:mt-[7rem] bg-white z-30 ">
            <Section5 />
          </section>

          <div className="w-full min-h-screen">
            <div
              className="w-full h-full rounded-lg p-[1rem] shadow-2xl mt-[4rem]"
              style={{
                background: "rgba(215, 215, 215, 0.3)",
                border: "1px solid #ccc",
              }}
            >
              <Image
                src="/dashboard-preview.jpg"
                alt="prew"
                width={1200}
                height={350}
                className="rounded-lg border border-zinc-200 w-full h-[25rem] sm:h-full"
              />
            </div>
          </div>

          {/* ----------------Section 6--------- */}
          <section className="w-full min-h-screen z-30 bg-blue-200 mt-[0rem] sm:mt-[6rem] py-[3rem] rounded-sm shadow-2xl">
            <Section6 />
          </section>
          {/* -----------Comment Section--------- */}
          <section
            className="mt-[2rem] w-full py-8 px-2 rounded-md  "
            id="testimonials"
          >
            <UserComment comment={comment} role={dbUser?.role} />
          </section>
          {/* -----------------Billings------------ */}
          <section className="mt-[1rem]" id="pricing">
            <Pricing />
          </section>
        </div>
        <Footer />
      </MaxWidthWrapper>
    </>
  );
}
