// import { NextResponse } from "next/server";
// import formidable from "formidable";
// import fs from "fs";
// import pdfParse from "pdf-parse";
// import { OpenAI } from "openai";
// import { gptModel } from "@/lib/cv/gpt-mode";

// export const dynamic = "force-dynamic"; // Ensure this API route is always dynamic

// export async function POST(req: Request) {
//     try {
//         // Parse the incoming request to handle multipart/form-data
//         const form = formidable({ keepExtensions: true });
//         const data = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
//             const incomingMessage = Object.assign(req, new (require("stream").Readable)());
//             form.parse(incomingMessage, (err, fields, files) => {
//                 if (err) return reject(err);
//                 resolve({ fields, files });
//             });
//         });

//         const { fields, files } = data;

//         const positionRaw = (fields as any).position as string;
//         const position = JSON.parse(positionRaw);

//         const uploadedFileArray = files.file;
//         if (!uploadedFileArray || !Array.isArray(uploadedFileArray) || uploadedFileArray.length === 0) {
//             return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
//         }

//         const uploadedFile = uploadedFileArray[0];
//         const fileBuffer = fs.readFileSync((uploadedFile as any).filepath);

//         // Parse the PDF
//         const pdfData = await pdfParse(fileBuffer);
//         const cvText = pdfData.text;

//         // Initialize OpenAI
//         const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

//         const prompt = `
//         Evaluate the following CV based on its relevance to the job with:
//         position title: ${position.name}, 
//         position description: ${position.positionDescription}, 

//         Score it on a scale of 1-100 based on these factors: 
//         1. Experience relevance 
//         2. Skills match to the job position
//         3. Clarity and formatting 
//         4. Achievements & impact 
//         5. Overall professionalism
        
//         Give me only number!
        
//         CV Content: ${cvText}`;

//         const response = await openai.chat.completions.create({
//             model: gptModel,
//             messages: [{ role: "user", content: prompt }],
//         });

//         // Extract the result
//         const result = response.choices[0].message.content;

//         // Return the result as JSON
//         return NextResponse.json({ result }, { status: 200 });
//     } catch (error) {
//         console.error("Error:", error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }