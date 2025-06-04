// File: app/api/binance/route.ts
import { NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs";
import pdfParse from "pdf-parse";
import { OpenAI } from "openai";
import { gptModel } from "@/lib/cv/gpt-mode";

export const dynamic = "force-dynamic"; // Ensure this API route is always dynamic

export async function POST(req: Request) {
    try {
        // Parse the incoming request to handle multipart/form-data
        const form = formidable({ keepExtensions: true });
        const data = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
            const incomingMessage = Object.assign(req, new (require('stream').Readable)());
            form.parse(incomingMessage, (err, fields, files) => {
                if (err) return reject(err);
                resolve({ fields, files });
            });
        });

        const { fields, files } = data;

        const yearsOfExperienceRaw = (fields as any).yearsOfExperience as string;
        const yearsOfExperience: string[] = JSON.parse(yearsOfExperienceRaw);

        const uploadedFileArray = files.file;
        if (!uploadedFileArray || !Array.isArray(uploadedFileArray) || uploadedFileArray.length === 0) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const uploadedFile = uploadedFileArray[0];
        const fileBuffer = fs.readFileSync((uploadedFile as any).filepath);

        // Parse the PDF
        const pdfData = await pdfParse(fileBuffer);
        const cvText = pdfData.text;

        // Generate prompt
        const prompt = ` 
            interface ProfessionalExperienceModel {
                company: string;
                title: string;
                startDate: string; //Must be MMMM DD, YYYY
                endDate: string; //Must be MMMM DD, YYYY
                mainActivities: string;
                reference: string| null;
            }

            interface EducationalExperienceModel {
                startDate: string; //Must be MMMM DD, YYYY
                endDate: string; //Must be MMMM DD, YYYY
                educationalLevel: string;
                title: string;
                school: string;
            }
            
            From the CV content below I want you to give me {professionalExperience:ProfessionalExperienceModel[],educationalExperience:EducationalExperienceModel[], yearsOfExperience:string}, Include all that's written as it is. 
            (i.e. Choose years of experience from ${yearsOfExperience}, if its clearly stated in the CV use that otherwise infer). If none is found you can make either an empty array. Return only the JSON object no formatting and no explanation necessary just the object above!

            If any of the above models couldn't be satisfied do not include it in professionalExperience or educationalExperience!

            CV Content: ${cvText}`;

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const response = await openai.chat.completions.create({
            model: gptModel,
            messages: [{ role: "user", content: prompt }],
        });

        const result = response.choices[0].message.content;

        return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
        console.error("Error parsing CV:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
