import type { NextApiRequest, NextApiResponse } from "next";
import { File, IncomingForm, Fields,Files } from "formidable";
import fs from "fs";
import pdfParse from "pdf-parse";
import { OpenAI } from "openai";
import { gptModel } from "@/lib/cv/gpt-mode";

export const config = {
    api: {
        bodyParser: false, // Required for formidable to handle the multipart/form-data
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
                if (err) reject(err);
                else resolve({ fields, files });
            });
        });

        const { fields, files } = data;

        const positionRaw = Array.isArray(fields.position) ? fields.position[0] : fields.position || "";
        const position = JSON.parse(positionRaw);

        const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file as unknown as File;
        if (!uploadedFile || !uploadedFile.filepath) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const fileBuffer = fs.readFileSync(uploadedFile.filepath);
        const pdfData = await pdfParse(fileBuffer);
        const cvText = pdfData.text;

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const prompt = `
Evaluate the following CV based on its relevance to the job with:
position title: ${position.name}, 
position description: ${position.positionDescription}, 

Score it on a scale of 1-100 based on these factors: 
1. Experience relevance 
2. Skills match to the job position
3. Clarity and formatting 
4. Achievements & impact 
5. Overall professionalism

Give me only number!

CV Content: ${cvText}`;

        const response = await openai.chat.completions.create({
            model: gptModel,
            messages: [{ role: "user", content: prompt }],
        });

        const result = response.choices[0].message.content;
        return res.status(200).json({ result });
    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
