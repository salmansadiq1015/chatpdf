import Image from "next/image";
import React from "react";

export default function Section6() {
  return (
    <>
      <div className="section6-content flex flex-col gap-4 items-center justify-center">
        <h1 className="text-2xl sm:text-4xl font-bold text-black text-center">
          Here&apos;s Just A Few Ways You Can Use our Chatbots
        </h1>
        <p className="text-lg sm:text-2xl font-light text-blue-500 text-center">
          We have a range of plans for businesses at all stages from startups to
          enterprise companies
        </p>
      </div>
      {/* case1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 mt-[3rem] bg-blue-600 ">
        <div className="flex flex-col gap-4 py-[1.5rem] px-[1rem]">
          <h2
            className="text-2xl sm:text-3xl font-bold text-white "
            style={{ textShadow: "-1px 1px 0px #000" }}
          >
            USE CASE 1 - <span className="font-medium">PERSONAL ASSISTANT</span>
          </h2>
          <p className="text-base text-zinc-200 font-light mt-3 text-justify">
            Once you&apos;ve uploaded all of your data, in the form of any CSV,
            PDF, file or text you can talk with your chatbot and ask anything
            you want to quickly find the answers you&apos;re looking for.
          </p>
          <p className="text-base text-zinc-200 font-light mt-3 text-justify">
            You can also generate useful content, using the data to help you
            with your work, such as letter, writing, emails, social media posts,
            or even blog posts.
          </p>
          <p className="text-base text-zinc-200 font-light mt-3 text-justify">
            It&apos;s like having Chat GPT at your fingertips, but it
            specialises in just your business and your needs.
          </p>
        </div>
        <div className="box">
          <Image
            src="/c1.webp"
            alt="case1"
            width={600}
            height={330}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* case2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 mt-[3rem] bg-blue-600 ">
        <div className="">
          <Image
            src="/c2.webp"
            alt="case1"
            width={500}
            height={280}
            className="w-full h-full"
          />
        </div>
        <div className="flex flex-col gap-4 py-[1.5rem] px-[1rem]">
          <h2
            className="text-2xl sm:text-3xl font-bold text-white "
            style={{ textShadow: "-1px 1px 0px #000" }}
          >
            USE CASE 2 -{" "}
            <span className="font-medium"> ONBOARDING & TRAINING</span>
          </h2>
          <p className="text-lg text-zinc-200 font-light mt-3 text-justify">
            Our chatbots are perfect to help onboard and train new employees.
          </p>
          <p className="text-lg text-zinc-200 font-light mt-3 text-justify">
            From day one, newcomers will feel a sense of belonging and clarity,
            all thanks to this efficient helper that knows your business inside
            out.
          </p>
          <p className="text-lg text-zinc-200 mt-3 text-justify">
            An efficient, consistent, and friendly onboarding experience that
            leaves a lasting positive impression. New hires get up to speed
            faster, reducing the time and resources traditionally spent on
            lengthy training processes.
          </p>
        </div>
      </div>

      {/* Case3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 mt-[3rem] bg-blue-600 ">
        <div className="flex flex-col gap-4 py-[1.5rem] px-[1rem]">
          <h2
            className="text-2xl sm:text-3xl font-bold text-white "
            style={{ textShadow: "-1px 1px 0px #000" }}
          >
            USE CASE 2 - <span className="font-medium"> SALES ASSISTAN </span>
          </h2>
          <p className="text-lg text-zinc-200 font-light mt-3 text-justify">
            With ChatDoc.ai, you have the ability to change the skill set of
            your chatbot into a talented salesperson who not only helps
            customers with any questions they might have, but also assists in
            the sales process.
          </p>
          <p className="text-lg text-zinc-200 font-light mt-3 text-justify">
            The chatbot takes into consideration the customers requirements and
            can ask further questions to engage with the customer and close the
            sale.
          </p>
          <p className="text-lg text-zinc-200 mt-3 text-justify">
            Imagine how your sales will grow when you have a highly skilled
            salesperson dealing with all of your chats quickly and efficiently,
            24 hours a day.
          </p>
        </div>
        <div className="">
          <Image
            src="/sale.avif"
            alt="case1"
            width={500}
            height={280}
            className="w-full h-full"
          />
        </div>
      </div>
    </>
  );
}
