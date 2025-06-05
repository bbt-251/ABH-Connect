// File: pages/api/cv-autofill.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, Fields, Files, File } from "formidable";
import fs from "fs";
import pdfParse from "pdf-parse";
import { OpenAI } from "openai";
import { gptModel } from "@/lib/cv/gpt-mode";

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const form = new IncomingForm({ keepExtensions: true });

        const data = await new Promise<{ fields: Fields; files: Files }>((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) return reject(err);
                resolve({ fields, files });
            });
        });

        const { fields, files } = data;

        const yearsOfExperienceRaw = fields.yearsOfExperience as unknown as string;
        const yearsOfExperience: string[] = JSON.parse(yearsOfExperienceRaw);

        const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file as unknown as File;
        if (!uploadedFile || !uploadedFile.filepath) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const fileBuffer = fs.readFileSync(uploadedFile.filepath);
        const pdfData = await pdfParse(fileBuffer);
        const cvText = pdfData.text;

        const prompt = `
interface ProfessionalExperienceModel {
  company: string;
  title: string;
  startDate: string; // Must be MMMM DD, YYYY
  endDate: string; // Must be MMMM DD, YYYY
  mainActivities: string;
  reference: string | null;
}

interface EducationalExperienceModel {
  startDate: string; // Must be MMMM DD, YYYY
  endDate: string; // Must be MMMM DD, YYYY
  educationalLevel: string;
  title: string;
  school: string;
}

From the CV content below I want you to give me:
{
  professionalExperience: ProfessionalExperienceModel[],
  educationalExperience: EducationalExperienceModel[],
  yearsOfExperience: string
}

Include all that's written as it is.
(i.e. Choose years of experience from ${yearsOfExperience}, if it's clearly stated in the CV use that, otherwise infer it). 
If none is found you can return an empty array.
Return only the JSON object — no formatting and no explanation!

If any of the above models couldn't be satisfied do not include it in professionalExperience or educationalExperience!

CV Content: ${cvText}
    `.trim();

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const response = await openai.chat.completions.create({
            model: gptModel,
            messages: [{ role: "user", content: prompt }],
        });

        const result = response.choices[0].message.content;
        return res.status(200).json({ result });
    } catch (error) {
        console.error("Error parsing CV:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
