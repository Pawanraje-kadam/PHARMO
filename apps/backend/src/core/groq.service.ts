import Groq from 'groq-sdk';
import { config } from './config';

const groq = new Groq({ apiKey: config.groqApiKey });

export class GroqService {
  private static model = 'llama-3.3-70b-versatile';

  static isAvailable(): boolean {
    return !!config.groqApiKey;
  }

  static async generateClinicalInfo(medicineName: string, genericName: string | null): Promise<{
    generic_ingredient: string;
    therapeutic_category: string;
    drug_class: string;
    common_uses: string[];
    age_restrictions: string | null;
    adult_dosage: string;
    pediatric_dosage: string | null;
    is_otc: boolean;
    contraindications: string[];
    common_side_effects: string[];
    pregnancy_warnings: string;
    breastfeeding_warnings: string;
    food_instructions: string | null;
    storage_conditions: string | null;
    important_warnings: string;
    search_keywords: string[];
    synonyms: string[];
  }> {
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

  static async analyzeSymptoms(
    complaint: string,
    age: number,
    gender: string,
    additionalSymptoms: string,
    knownAllergies: string[],
    medicines: { name: string; genericName: string | null; category: string; isOtc: boolean }[]
  ): Promise<{
    analysis: string;
    recommendedMedicines: string[];
    warnings: string[];
    explanation: string;
  }> {
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
