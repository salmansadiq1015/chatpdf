import Link from "next/link";
import React from "react";
import { IoIosMailUnread } from "react-icons/io";
import { FaDiscord } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <div
      className="w-full  bg-zinc-100  text-white text-center flex flex-col gap-4 items-center 
    justify-center  "
      style={{ boxShadow: "0rem 2px .1rem 2px rgba(0,0,0,.25)" }}
    >
      <div className="w-full bg-zinc-100 px-12 py-10 max-w-screen-xl mx-auto md:px-8 grid grid-cols-1 lg:grid-cols-5 gap-x-0 gap-y-16 lg:gap-20">
        <div className=" col-span-2 w-full flex flex-col gap-6 items-start sm:mx-auto text-start ">
          <Link href="/">
            <h1
              className="text-2xl text-blue-600 font-bold cursor-pointer"
              style={{ textDecoration: "underline" }}
            >
              ChatDoc.ai
            </h1>
          </Link>
          <p className="text-zinc-500 text-justify">
            InfraDev.Cloud MindPal is a forward-thinking software company
            dedicated to enhancing productivity for modern professionals through
            innovative AI solutions. Our mission is to empower individuals in
            their work environment by leveraging cutting-edge technologies that
            seamlessly integrate with daily tasks, ultimately driving efficiency
            and success.
          </p>
          <div className="">
            <ul className="flex items-center gap-4">
              <li className="text-blue-500 py-1 px-4 rounded-3xl bg-blue-100 hover:bg-blue-200 transition">
                <Link href="#gmail" title="Gmail">
                  <IoIosMailUnread size="25" />
                </Link>
              </li>
              <li className="text-violet-500 py-1 px-4 rounded-3xl bg-violet-100 hover:bg-violet-200 transition">
                <Link href="#discord" title="Discord">
                  <FaDiscord size="25" />
                </Link>
              </li>
              <li className="text-pink-500 py-1 px-4 rounded-3xl bg-pink-100 hover:bg-pink-200 transition">
                <Link
                  href="#linkedIn"
                  className="text-pink-600"
                  title="LinkedIn"
                >
                  <FaLinkedin size="25" />
                </Link>
              </li>
              <li className="text-green-500 py-1 px-4 rounded-3xl bg-green-100 hover:bg-green-200 transition">
                <Link href="#twitter" title="Twitter">
                  <FaTwitter size="25" />
                </Link>
              </li>
            </ul>
          </div>
          <h3 className="text-zinc-700 font-medium">
            &copy;2023 - ChatDoc.ai - Created by{" "}
            <Link href="https://kind-tunic-lamb.cyclic.app/" target="new">
              <span className="text-blue-500 cursor-pointer">
                InfraDev.Cloud
              </span>
            </Link>
          </h3>
        </div>
        <div className=" col-span-3 w-full ">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  text-black w-full">
            <div className=" flex flex-col gap-3 items-start">
              <h3 className="text-black text-lg font-semibold ">Product</h3>
              <ul className=" flex flex-col gap-3 items-start">
                <li className="text-blue-600 cursor-pointer hover:border-b-2 hover:border-blue-500 transition-all">
                  <Link href="/">Home</Link>
                </li>
                <li className="text-blue-600 cursor-pointer hover:border-b-2 hover:border-blue-500 transition-all">
                  <Link href="#features">Features</Link>
                </li>
                <li className="text-blue-600 cursor-pointer hover:border-b-2 hover:border-blue-500 transition-all">
                  <Link href="#testimonials">Testimonials</Link>
                </li>
                <li className="text-blue-600 cursor-pointer hover:border-b-2 hover:border-blue-500 transition-all">
                  <Link href="#pricing">Pricing</Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-3 items-start">
              <h3 className="text-black text-lg font-semibold ">Use Cases</h3>
              <ul className=" flex flex-col gap-3 items-start">
                <li className="text-blue-600 cursor-pointer hover:border-b-2 hover:border-blue-500 transition-all">
                  <Link href="#research">For Research</Link>
                </li>
                <li className="text-blue-600 cursor-pointer hover:border-b-2 hover:border-blue-500 transition-all">
                  <Link href="#marketing">For Marketing</Link>
                </li>
                <li className="text-blue-600 cursor-pointer hover:border-b-2 hover:border-blue-500 transition-all">
                  <Link href="#education">For Education</Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-3 items-start">
              <h3 className="text-black text-lg font-semibold ">Links</h3>

              <ul className=" flex flex-col gap-3 items-start">
                <li className="text-blue-600 cursor-pointer hover:border-b-2 hover:border-blue-500 transition-all">
                  <Link href="/">Privacy Policy</Link>
                </li>
                <li className="text-blue-600 cursor-pointer hover:border-b-2 hover:border-blue-500 transition-all">
                  <Link href="/">Terms of Services</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
