export interface PromptAnalysis {
  themes: string[];
  emotionalTone: string;
  styleReferences: string[];
  intent: string;
}

export interface Campaign {
  id: number;
  name: string;
  status: 'active' | 'completed';
  image: string;
  remixes: number;
  views: number;
  engagement: number;
  budget: number;
  spent: number;
  endDate: string;
  promptAnalysis?: PromptAnalysis;
}

export interface AdUploadData {
  brand: string;
  title: string;
  imageUrl: string;
  category: string;
  companyId: string;
}
