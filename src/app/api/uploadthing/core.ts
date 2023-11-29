import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { DocxLoader } from "langchain/document_loaders/fs/docx";

import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { getPineconeClient } from "@/lib/pinecone";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { PLANS } from "@/config/stripe";

const f = createUploadthing();

const middleware = async () => {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user || !user.id) throw new Error("Unauthorized");

  const subscriptionPlan = await getUserSubscriptionPlan();

  return { subscriptionPlan, userId: user.id };
};

const onUploadComplete = async ({
  metadata,
  file,
}: {
  metadata: Awaited<ReturnType<typeof middleware>>;
  file: {
    key: string;
    name: string;
    url: string;
  };
}) => {
  const isFileExist = await db.file.findFirst({
    where: {
      key: file.key,
    },
  });

  if (isFileExist) return;

  const createdFile = await db.file.create({
    data: {
      key: file.key,
      name: file.name,
      userId: metadata.userId,
      url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
      uploadStatus: "PROCESSING",
    },
  });

  try {
    const response = await fetch(
      `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`
    );

    const blob = await response.blob();

    let loader;

    if (file.name.toLowerCase().endsWith(".pdf")) {
      loader = new PDFLoader(blob);
    } else if (file.name.toLowerCase().endsWith(".txt")) {
      loader = new TextLoader(blob);
    } else if (file.name.toLowerCase().endsWith(".csv")) {
      loader = new CSVLoader(blob);
    } else if (file.name.toLowerCase().endsWith(".docx")) {
      loader = new DocxLoader(blob);
    } else {
      // Handle unsupported file types or notify the user
      throw new Error("Unsupported file type");
    }

    const pageLevelDocs = await loader.load();

    const pagesAmt = pageLevelDocs.length;

    const { subscriptionPlan } = metadata;
    const { isSubscribed } = subscriptionPlan;

    const isProExceeded =
      pagesAmt > PLANS.find((plan) => plan.name === "Pro")!.pagesPerPdf;
    const isFreeExceeded =
      pagesAmt > PLANS.find((plan) => plan.name === "Free")!.pagesPerPdf;

    if ((isSubscribed && isProExceeded) || (!isSubscribed && isFreeExceeded)) {
      await db.file.update({
        data: {
          uploadStatus: "FAILED",
        },
        where: {
          id: createdFile.id,
        },
      });
    }

    // vectorize and index the entire document
    const pinecone = await getPineconeClient();
    const pineconeIndex = pinecone.Index("test");

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
      pineconeIndex,
      namespace: createdFile.id,
    });

    await db.file.update({
      data: {
        uploadStatus: "SUCCESS",
      },
      where: {
        id: createdFile.id,
      },
    });
  } catch (err) {
    console.log("Pinecone Error", err);
    await db.file.update({
      data: {
        uploadStatus: "FAILED",
      },
      where: {
        id: createdFile.id,
      },
    });
  }
};

export const ourFileRouter = {
  freePlanUploader: f({
    pdf: { maxFileSize: "4MB" },
    image: { maxFileSize: "4MB" },
    text: { maxFileSize: "4MB" },
  })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
  proPlanUploader: f({
    pdf: { maxFileSize: "16MB" },
    image: { maxFileSize: "16MB" },
    text: { maxFileSize: "16MB" },
  })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

// -------------------2---------------->

// Import necessary modules and libraries
// import { db } from "@/db";
// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
// import { createUploadthing, type FileRouter } from "uploadthing/next";

// // Import loaders for different file types
// import { PDFLoader } from "langchain/document_loaders/fs/pdf";
// import { TextLoader } from "langchain/document_loaders/fs/text";
// import { CSVLoader } from "langchain/document_loaders/fs/csv";
// import { DocxLoader } from "langchain/document_loaders/fs/docx";
// import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";

// // Import other necessary modules and configurations
// import { OpenAIEmbeddings } from "langchain/embeddings/openai";
// import { PineconeStore } from "langchain/vectorstores/pinecone";
// import { getPineconeClient } from "@/lib/pinecone";
// import { getUserSubscriptionPlan } from "@/lib/stripe";
// import { PLANS } from "@/config/stripe";

// // Create an instance of Uploadthing
// const uploadthing = createUploadthing();

// // Middleware function to authenticate users and retrieve subscription information
// const middleware = async () => {
//   const { getUser } = getKindeServerSession();
//   const user = getUser();

//   if (!user || !user.id) throw new Error("Unauthorized");

//   const subscriptionPlan = await getUserSubscriptionPlan();

//   return { subscriptionPlan, userId: user.id };
// };

// // Function to handle upload completion
// const onUploadComplete = async ({
//   metadata,
//   file,
// }: {
//   metadata: Awaited<ReturnType<typeof middleware>>;
//   file: {
//     key: string;
//     name: string;
//     url: string;
//   };
// }) => {
//   const isFileExist = await db.file.findFirst({
//     where: {
//       key: file.key,
//     },
//   });

//   if (isFileExist) return;

//   const createdFile = await db.file.create({
//     data: {
//       key: file.key,
//       name: file.name,
//       userId: metadata.userId,
//       url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
//       uploadStatus: "PROCESSING",
//     },
//   });

//   try {
//     let pageLevelDocs;

//     // If the file is a website link
//     if (file.name.toLowerCase().startsWith("http")) {
//       const webLoader = new CheerioWebBaseLoader(file.url);
//       pageLevelDocs = await webLoader.load();
//     } else {
//       // Otherwise, handle other file types
//       const response = await fetch(
//         `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`
//       );

//       const blob = await response.blob();

//       let loader;

//       // Determine the loader based on the file type
//       if (file.name.toLowerCase().endsWith(".pdf")) {
//         loader = new PDFLoader(blob);
//       } else if (file.name.toLowerCase().endsWith(".txt")) {
//         loader = new TextLoader(blob);
//       } else if (file.name.toLowerCase().endsWith(".csv")) {
//         loader = new CSVLoader(blob);
//       } else if (file.name.toLowerCase().endsWith(".docx")) {
//         loader = new DocxLoader(blob);
//       } else {
//         // Handle unsupported file types or notify the user
//         throw new Error("Unsupported file type");
//       }

//       // Load the document content
//       pageLevelDocs = await loader.load();
//     }

//     // Handle processing and indexing as needed
//     const pagesAmt = pageLevelDocs.length;

//     const { subscriptionPlan } = metadata;
//     const { isSubscribed } = subscriptionPlan;

//     const isProExceeded =
//       pagesAmt > PLANS.find((plan) => plan.name === "Pro")!.pagesPerPdf;
//     const isFreeExceeded =
//       pagesAmt > PLANS.find((plan) => plan.name === "Free")!.pagesPerPdf;

//     if ((isSubscribed && isProExceeded) || (!isSubscribed && isFreeExceeded)) {
//       await db.file.update({
//         data: {
//           uploadStatus: "FAILED",
//         },
//         where: {
//           id: createdFile.id,
//         },
//       });
//     }

//     // Vectorize and index the entire document
//     const pinecone = await getPineconeClient();
//     const pineconeIndex = pinecone.Index("test");

//     const embeddings = new OpenAIEmbeddings({
//       openAIApiKey: process.env.OPENAI_API_KEY,
//     });

//     await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
//       pineconeIndex,
//       namespace: createdFile.id,
//     });

//     // Update the upload status to success
//     await db.file.update({
//       data: {
//         uploadStatus: "SUCCESS",
//       },
//       where: {
//         id: createdFile.id,
//       },
//     });
//   } catch (err) {
//     console.error("Error during upload:", err);

//     // Update the upload status to failed
//     await db.file.update({
//       data: {
//         uploadStatus: "FAILED",
//       },
//       where: {
//         id: createdFile.id,
//       },
//     });
//   }
// };

// // Define file upload routers for different subscription plans
// export const ourFileRouter = {
//   freePlanUploader: uploadthing({
//     pdf: { maxFileSize: "4MB" },
//     text: { maxFileSize: "4MB" },
//   })
//     .middleware(middleware)
//     .onUploadComplete(onUploadComplete),
//   proPlanUploader: uploadthing({
//     pdf: { maxFileSize: "16MB" },
//     text: { maxFileSize: "16MB" },
//   })
//     .middleware(middleware)
//     .onUploadComplete(onUploadComplete),
// } satisfies FileRouter;

// // Export the file router
// export type OurFileRouter = typeof ourFileRouter;
