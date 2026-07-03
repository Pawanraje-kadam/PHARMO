"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroqService = void 0;
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const config_1 = require("./config");
const groq = new groq_sdk_1.default({ apiKey: config_1.config.groqApiKey });
class GroqService {
    static model = 'llama-3.3-70b-versatile';
    static isAvailable() {
        return !!config_1.config.groqApiKey;
    }
    static async generateClinicalInfo(medicineName, genericName) {
        if (!this.isAvailable()) {
            throw new Error('GROQ_API_KEY not configured');
        }
        const prompt = `You are a clinical pharmacology expert. Provide detailed information about the medicine "${medicineName}"${genericName ? ` (generic: ${genericName})` : ''}.

Return ONLY valid JSON (no markdown, no code fences) with exactly this structure:
{
  "generic_ingredient": "string - the active pharmaceutical ingredient",
  "therapeutic_category": "string - e.g. Analgesics, Antibiotics, etc.",
  "drug_class": "string - e.g. NSAID, SSRI, etc.",
  "common_uses": ["array of strings - common therapeutic uses"],
  "age_restrictions": "string or null - age restrictions if any",
  "adult_dosage": "string - typical adult dosage",
  "pediatric_dosage": "string or null - pediatric dosage if applicable",
  "is_otc": boolean - whether it's available over the counter",
  "contraindications": ["array of strings - contraindications"],
  "common_side_effects": ["array of strings - common side effects"],
  "pregnancy_warnings": "string - pregnancy safety information",
  "breastfeeding_warnings": "string - breastfeeding safety information",
  "food_instructions": "string or null - food interaction instructions",
  "storage_conditions": "string or null - storage requirements",
  "important_warnings": "string - critical warnings",
  "search_keywords": ["array of strings - searchable keywords"],
  "synonyms": ["array of strings - alternative names/brands"]
}`;
        const completion = await groq.chat.completions.create({
            model: this.model,
            messages: [
                {
                    role: 'system',
                    content: 'You are a clinical pharmacology assistant. Return only valid JSON without any markdown formatting or code fences.',
                },
                { role: 'user', content: prompt },
            ],
            temperature: 0.3,
            max_tokens: 2000,
        });
        const text = completion.choices[0]?.message?.content || '';
        return JSON.parse(text);
    }
    static async analyzeSymptoms(complaint, age, gender, additionalSymptoms, knownAllergies, medicines) {
        if (!this.isAvailable()) {
            return { analysis: '', recommendedMedicines: [], warnings: [], explanation: '' };
        }
        const medList = medicines.map(m => `- ${m.name}${m.genericName ? ` (${m.genericName})` : ''} [${m.category}${m.isOtc ? ', OTC' : ''}]`).join('\n');
        const prompt = `Patient complaint: "${complaint}"
Age: ${age}
Gender: ${gender}
Additional symptoms: "${additionalSymptoms || 'none'}"
Known allergies: ${knownAllergies.length ? knownAllergies.join(', ') : 'none'}

Available medicines:
${medList}

Analyze the patient's symptoms and provide recommendations. Return ONLY valid JSON:
{
  "analysis": "brief clinical analysis of symptoms",
  "recommendedMedicines": ["names of recommended medicines from the available list"],
  "warnings": ["any safety warnings based on patient profile"],
  "explanation": "detailed reasoning for the recommendations"
}`;
        const completion = await groq.chat.completions.create({
            model: this.model,
            messages: [
                {
                    role: 'system',
                    content: 'You are a clinical assistant. Return only valid JSON without markdown formatting.',
                },
                { role: 'user', content: prompt },
            ],
            temperature: 0.3,
            max_tokens: 1500,
        });
        const text = completion.choices[0]?.message?.content || '';
        return JSON.parse(text);
    }
}
exports.GroqService = GroqService;
