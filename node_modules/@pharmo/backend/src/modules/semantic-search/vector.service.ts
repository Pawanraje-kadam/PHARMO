export class VectorService {
  public static async generateEmbedding(text: string): Promise<number[]> {
    const sanitizedText = text.replace(/[\r\n\t]/g, ' ').trim().slice(0, 1000);
    const mockVector: number[] = new Array(1536).fill(0);
    
    for (let i = 0; i < sanitizedText.length; i++) {
      mockVector[i % 1536] += sanitizedText.charCodeAt(i) / 1000;
    }
    
    const magnitude = Math.sqrt(mockVector.reduce((sum, val) => sum + val * val, 0)) || 1;
    return mockVector.map(val => val / magnitude);
  }

  public static cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) return 0;
    let dotProduct = 0, normA = 0, normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    return denominator === 0 ? 0 : dotProduct / denominator;
  }
}