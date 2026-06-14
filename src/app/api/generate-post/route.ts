import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Map categories to high-quality architectural images from Unsplash
const categoryImages: Record<string, string> = {
  'Tendências': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800',
  'Arquitetura': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
  'Dicas de Reforma': 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800',
  'Estilo de Vida': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800'
};

const keywords = [
  'iluminação natural em projetos de luxo',
  'tendência de marcenaria inteligente em apartamentos pequenos',
  'como escolher pedras nobres para bancadas de cozinha',
  'integração de salas e varandas gourmet',
  'benefícios da biofilia na arquitetura de clínicas',
  'estilo neoclássico na arquitetura contemporânea',
  'automação residencial invisível and de alto padrão',
  'como valorizar um apartamento para locação premium'
];

export async function POST(request: Request) {
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!geminiKey) {
    return NextResponse.json(
      { error: 'Chave GEMINI_API_KEY não configurada no arquivo .env.local.' },
      { status: 400 }
    );
  }

  // Get authorization token from request headers
  const authHeader = request.headers.get('Authorization');
  const token = authHeader ? authHeader.split(' ')[1] : null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  });

  try {
    // Select a random keyword to trigger unique post topics
    const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];

    const prompt = `Você é um redator sênior de marketing digital e especialista em SEO para arquitetura de luxo. 
Escreva um artigo de blog informativo e otimizado sobre: "${randomKeyword}".
O artigo deve conter dicas práticas, termos sofisticados de design e ser estruturado de forma atraente.

Retorne obrigatoriamente um objeto JSON com o seguinte formato:
{
  "title": "Título chamativo do artigo",
  "summary": "Um breve resumo/introdução de 2 linhas sobre o artigo",
  "content": "O texto do artigo com parágrafos separados. Use '###' para indicar subtópicos de seção. Não use Markdown complexo além disso.",
  "category": "Escolha exatamente uma das seguintes: Tendências, Arquitetura, Dicas de Reforma, Estilo de Vida",
  "seo_title": "Título otimizado para o Google (máximo 60 caracteres)",
  "seo_description": "Meta descrição para o Google (máxima 150 caracteres)"
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json'
          }
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Erro na API do Gemini: ${errText}`);
    }

    const resData = await response.json();
    const generatedText = resData.candidates[0].content.parts[0].text;
    
    // Parse the structured JSON response
    const postData = JSON.parse(generatedText);

    // Generate slug from title
    const slug = postData.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Select category image or fallback
    const main_image = categoryImages[postData.category] || categoryImages['Tendências'];

    // Insert into Supabase blog_posts
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([
        {
          title: postData.title,
          slug,
          summary: postData.summary,
          content: postData.content,
          main_image,
          category: postData.category,
          seo_title: postData.seo_title,
          seo_description: postData.seo_description,
          views: 0,
          published_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, post: data[0] });
  } catch (error: any) {
    console.error('Erro na automação do blog com IA:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno ao gerar o artigo com IA.' },
      { status: 500 }
    );
  }
}
