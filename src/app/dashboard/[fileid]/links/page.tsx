"use client";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import cheerio from "cheerio";

export default function Page() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);

  // const handleScrape = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.get(url);
  //     const $ = cheerio.load(response.data);
  //     const allText = [] as any;

  //     $("body")
  //       ?.find("*")
  //       ?.each((index, element) => {
  //         const text = $(element)?.text()?.trim();
  //         if (text.length > 0) {
  //           allText.push(text);
  //         }
  //       });

  //     const scrapedData = allText.join("\n");
  //     setData(scrapedData);
  //     setUrl("");
  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Error during scraping:", error);
  //     // Handle the error, e.g., display a user-friendly message
  //     setData("");
  //     setUrl("");
  //     setLoading(false);
  //   }
  // };

  const handleScrape = async () => {
    try {
      setLoading(true);
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      const uniqueLines = new Set<string>();

      // Exclude elements with style attributes and script/link tags :not(link)
      $("body")
        ?.find(":not([style]):not(script)")
        ?.each((index, element) => {
          const text = $(element)?.text()?.trim();
          if (text.length > 0) {
            uniqueLines.add(text);
          }
        });

      const scrapedData = Array.from(uniqueLines).join("\n");
      setData(scrapedData);
      setUrl("");
      setLoading(false);
    } catch (error) {
      console.error("Error during scraping:", error);
      // Handle the error, e.g., display a user-friendly message
      setData("");
      setUrl("");
      setLoading(false);
    }
  };

  // Handle Download

  const handleDownload = () => {
    const blob = new Blob([data], { type: "text/plain " });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleEnterKeyPress = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleScrape();
    }
  };

  return (
    <Layout>
      <div className="w-full min-h-screen py-[3rem] sm:py-[1rem] px-3 ">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl text-blue-500 font-semibold">Links</h1>
          <p className="text-zinc-500 text-sm">
            Web pages act as training material for your chatbot. You can manage
            links used for training the chatbot here.
          </p>
          <div
            className="w-full mt-8"
            style={{ height: "1px", background: "#ccc" }}
          ></div>

          <div className="w-full  flex flex-col items-center gap-8 py-8 ">
            {/* Input and Scrape button */}
            <h2 className="text-2xl text-center text-black font-semibold">
              Enter the target website link to import the content.
            </h2>
            <div className="flex items-center py-4 px-3 gap-2 bg-zinc-300 rounded-md w-full ">
              <input
                type="text"
                placeholder="Enter the website link"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleEnterKeyPress}
                className="w-full  rounded-md shadow-md px-2  py-1"
                style={{ height: "3rem" }}
              />
              <Button onClick={handleScrape}>
                {loading ? "Scrapping..." : "Start"}
              </Button>
            </div>

            {data && (
              <div className=" w-full min-h-[50vh] flex flex-col gap-6 py-8 px-4 rounded-sm shadow-md">
                <h2 className="text-2xl font-semibold text-zinc-800">
                  Scraped Website Data
                </h2>
                <div className="">
                  {data && <Button onClick={handleDownload}>Download</Button>}
                </div>
                <p>{data}</p>
              </div>
            )}
          </div>

          {/* ----------Development------> */}
          <div className="w-full mt-[2rem] flex flex-col items-center justify-center gap-4">
            <h2 className="text-2xl text-blue-500 font-semibold">
              Development Mode
              <span className="animate-pulse inline-block">...</span>
            </h2>
            <span>
              <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
            </span>
          </div>

          {/* -------------------- */}
        </div>
      </div>
    </Layout>
  );
}
