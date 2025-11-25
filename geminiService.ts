import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisReportData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        atsScore: { type: Type.NUMBER, description: "A score from 0 to 100 representing ATS compatibility." },
        atsFeedback: { type: Type.STRING, description: "Detailed feedback on ATS parsability." },
        keywordAnalysis: {
            type: Type.OBJECT,
            properties: {
                present: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Top 10 relevant keywords found." },
                missing: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Top 10 critical keywords missing." },
                density: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            keyword: { type: Type.STRING },
                            count: { type: Type.NUMBER }
                        },
                        required: ["keyword", "count"]
                    },
                    description: "Frequency of present keywords."
                }
            },
            required: ["present", "missing", "density"]
        },
        contentGaps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of content weaknesses or missing sections." },
        formattingIssues: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of formatting inconsistencies." },
        readabilityScore: { type: Type.NUMBER, description: "Estimated Flesch-Kincaid grade level." },
        summaryOfStrengths: { type: Type.STRING, description: "Brief summary of the resume's strong points." },
        actionableSuggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Top 3-5 most impactful suggestions." }
    },
    required: ["atsScore", "atsFeedback", "keywordAnalysis", "contentGaps", "formattingIssues", "readabilityScore", "summaryOfStrengths", "actionableSuggestions"]
};

export const analyzeResume = async (resumeText: string, jobDescription: string): Promise<AnalysisReportData> => {
    const prompt = `
You are an expert ATS (Applicant Tracking System) and professional resume reviewer. As a strict and critical reviewer, your task is to analyze the provided resume against the target job description. Scores above 85 should be reserved for exceptionally well-matched resumes. Provide a comprehensive audit in a structured JSON format.

**Resume Text:**
${resumeText}

**Job Description:**
${jobDescription}

Analyze the resume and return ONLY a single, valid JSON object that adheres to the provided schema. Do not include any introductory text or markdown formatting.
`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: analysisSchema,
            temperature: 0.2,
        },
    });

    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as AnalysisReportData;
    } catch (error) {
        console.error("Failed to parse Gemini JSON response:", response.text);
        throw new Error("Received an invalid format from the analysis API.");
    }
};

export const generateEnhancedResume = async (
  resumeText: string,
  jobDescription: string,
  analysis: AnalysisReportData
): Promise<string> => {
    const analysisFeedback = `
- ATS Score: ${analysis.atsScore}/100
- Keywords to add: ${analysis.keywordAnalysis.missing.join(', ')}
- Content Gaps: ${analysis.contentGaps.join(', ')}
- Main Suggestions: ${analysis.actionableSuggestions.join('; ')}
`;

    const prompt = `
You are an expert career coach and professional resume writer. Rewrite and enhance the following resume to be perfectly tailored for the target job description, using the provided analysis for guidance. Your goal is to create a resume that would achieve an ATS score above 95%.

**Original Resume:**
${resumeText}

**Target Job Description:**
${jobDescription}

**Key Improvement Areas from Analysis:**
${analysisFeedback}

**Instructions:**
1.  **Structure:** Create a clean, modern, single-column, ATS-friendly resume structure. Use standard section headers: Professional Summary, Skills, Experience, Education, Projects (if applicable).
2.  **Professional Summary:** Write a compelling 3-4 sentence professional summary that highlights the candidate's key qualifications and aligns directly with the job description.
3.  **Skills:** Integrate keywords from the job description naturally into the skills section. Organize skills into logical categories (e.g., Programming Languages, Tools, Methodologies).
4.  **Experience:** For each role, rewrite the bullet points to start with strong action verbs. Focus on achievements and quantify results wherever possible (e.g., "Increased efficiency by 15%" instead of "Responsible for improving efficiency"). Ensure the experience directly addresses the requirements in the job description.
5.  **Tone & Language:** Use professional, confident language. Eliminate clichés and a passive voice. Ensure perfect grammar and spelling.
6.  **Formatting:** Do not use complex formatting. The output should be clean markdown text, using '##' for section headers and '-' for bullet points. Do not include any introductory or concluding remarks outside of the resume content itself. Just return the raw, enhanced resume text.
`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            temperature: 0.5,
        },
    });

    const enhancedResumeText = response.text;

    if (!enhancedResumeText || enhancedResumeText.trim() === '') {
        throw new Error("The AI failed to generate an enhanced resume. This might be due to a content safety filter. Please try adjusting your resume or job description text.");
    }

    return enhancedResumeText;
};