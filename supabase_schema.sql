-- SQL Schema para o projeto Palloma Duarte Arquitetura
-- Execute este script no SQL Editor do seu projeto Supabase.

-- Habilitar extensão para gerar UUIDs se não estiver habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 1. TABELA DE LEADS (CRM)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    city TEXT,
    project_type TEXT CHECK (project_type IN ('residencial', 'comercial', 'clinica', 'corporativo', 'consultoria', 'outro')),
    area NUMERIC, -- em metros quadrados
    investment_range TEXT, -- Faixa de investimento
    deadline TEXT, -- Prazo desejado
    message TEXT,
    status TEXT DEFAULT 'novo' CHECK (status IN ('novo', 'contatado', 'reuniao_agendada', 'proposta_enviada', 'fechado', 'perdido')),
    temperature TEXT DEFAULT 'morno' CHECK (temperature IN ('frio', 'morno', 'quente')),
    notes TEXT,
    source TEXT DEFAULT 'contato' -- 'contato', 'calculadora', 'quiz', 'ebook'
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS
-- Permitir que qualquer visitante insira leads (público)
CREATE POLICY "Permitir inserções públicas de leads" ON public.leads
    FOR INSERT WITH CHECK (true);

-- Permitir que apenas usuários autenticados (admin) leiam/editem/excluam leads
CREATE POLICY "Permitir leitura/escrita apenas para administradores" ON public.leads
    FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- =========================================================================
-- 2. TABELA DE REUNIÕES (MEETINGS)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    meeting_link TEXT
);

-- Habilitar RLS
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS
CREATE POLICY "Permitir inserções públicas de reuniões" ON public.meetings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir controle de reuniões para administradores" ON public.meetings
    FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- =========================================================================
-- 3. TABELA DE PROJETOS (PORTFÓLIO)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('residencial', 'comercial', 'clinicas_consultorios', 'corporativo')),
    description TEXT NOT NULL,
    city TEXT NOT NULL,
    area NUMERIC NOT NULL,
    year INTEGER NOT NULL,
    main_image TEXT NOT NULL,
    gallery TEXT[] DEFAULT '{}',
    before_image TEXT,
    after_image TEXT,
    is_featured BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0
);

-- Habilitar RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS
-- Qualquer um pode ler projetos
CREATE POLICY "Permitir leitura pública de projetos" ON public.projects
    FOR SELECT USING (true);

-- Apenas admins podem modificar projetos
CREATE POLICY "Permitir modificações de projetos por administradores" ON public.projects
    FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- =========================================================================
-- 4. TABELA DE BLOG POSTS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    summary TEXT NOT NULL,
    main_image TEXT NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    category TEXT NOT NULL,
    seo_title TEXT,
    seo_description TEXT,
    views INTEGER DEFAULT 0
);

-- Habilitar RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS
-- Qualquer um pode ler posts
CREATE POLICY "Permitir leitura pública de posts" ON public.blog_posts
    FOR SELECT USING (true);

-- Apenas admins podem modificar posts
CREATE POLICY "Permitir modificações de posts por administradores" ON public.blog_posts
    FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- =========================================================================
-- 5. TABELA DE DEPOIMENTOS (TESTIMONIALS)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    avatar TEXT,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5)
);

-- Habilitar RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS
CREATE POLICY "Permitir leitura pública de depoimentos" ON public.testimonials
    FOR SELECT USING (true);

CREATE POLICY "Permitir modificações de depoimentos por administradores" ON public.testimonials
    FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- =========================================================================
-- 6. TABELA DE CONFIGURAÇÕES DO SITE (SITE SETTINGS)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS
CREATE POLICY "Permitir leitura pública de configurações" ON public.site_settings
    FOR SELECT USING (true);

CREATE POLICY "Permitir modificações de configurações por administradores" ON public.site_settings
    FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- =========================================================================
-- DADOS INICIAIS (SEED DATA)
-- =========================================================================

-- Inserir Projetos Iniciais
INSERT INTO public.projects (title, slug, category, description, city, area, year, main_image, gallery, before_image, after_image, is_featured, order_index)
VALUES 
(
    'Casa Alvorada', 
    'casa-alvorada', 
    'residencial', 
    'Residência de alto padrão com linhas minimalistas, volumetria marcante e integração total com a natureza. A iluminação natural foi privilegiada através de grandes vãos de vidro, enquanto a paleta de materiais foca no concreto aparente, madeira natural e tons de bege.',
    'Porto Alegre - RS', 
    450.00, 
    2025, 
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
    ],
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80', -- Antes (Banheiro antigo/Reforma)
    'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80', -- Depois
    true, 
    1
),
(
    'Apartamento Concept', 
    'apartamento-concept', 
    'residencial', 
    'Reforma completa de apartamento voltada para um jovem colecionador de arte. O layout original foi totalmente integrado, conectando cozinha, estar e varanda. A sofisticação se dá na curadoria de mobiliário assinado e no uso discreto de detalhes em dourado e grafite.',
    'São Paulo - SP', 
    140.00, 
    2024, 
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80'
    ],
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', -- Antes
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80', -- Depois
    true, 
    2
),
(
    'Clínica Lumina', 
    'clinica-lumina', 
    'clinicas_consultorios', 
    'Projeto de clínica dermatológica focado em proporcionar uma experiência de spa urbano e acolhimento para os pacientes. Texturas naturais, formas orgânicas e iluminação indireta quente criam uma atmosfera de calmaria e bem-estar, distanciando-se do visual hospitalar tradicional.',
    'Curitiba - PR', 
    180.00, 
    2025, 
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=800&q=80'
    ],
    NULL,
    NULL,
    false, 
    3
);

-- Inserir Depoimentos Iniciais
INSERT INTO public.testimonials (name, role, content, avatar, rating)
VALUES 
('Mariana e Roberto', 'Proprietários da Casa Alvorada', 'Trabalhar com a Palloma foi uma experiência incrível. Ela conseguiu captar nossa essência e traduzir em cada detalhe da casa. A atenção aos prazos e a qualidade técnica dos projetos nos deram muita tranquilidade.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80', 5),
('Dr. André Santos', 'Diretor da Clínica Lumina', 'O projeto da clínica superou todas as expectativas. Os pacientes sempre elogiam o acolhimento do espaço. A Palloma uniu sofisticação com todas as normas técnicas exigidas, com muita maestria.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80', 5);

-- Inserir Posts do Blog Iniciais
INSERT INTO public.blog_posts (title, slug, content, summary, main_image, category, seo_title, seo_description)
VALUES 
(
    '5 Tendências de Arquitetura de Alto Padrão para 2026', 
    'tendencias-arquitetura-alto-padrao-2026', 
    'A arquitetura residencial de alto padrão está em constante evolução, impulsionada pela busca por bem-estar, tecnologia integrada e sustentabilidade. Em 2026, destacam-se os cinco grandes tendências que definem os novos lares contemporâneos:

1. **Materiais Naturais e Orgânicos**: O uso de pedras brutas, madeiras de manejo sustentável e argila traz calor e textura, conectando os ambientes internos com a natureza.
2. **Iluminação Biodinâmica**: Sistemas que mimetizam a luz natural do dia para apoiar o ciclo circadiano, gerando mais conforto visual e relaxamento.
3. **Formas Curvas e Orgânicas**: Arcos suaves em passagens, nichos arredondados e mobiliários sinuosos trazem fluidez e suavizam as linhas retas da arquitetura moderna.
4. **Espaços de Descompressão**: Ambientes dedicados ao autocuidado, como salas de meditação, spas integrados ao banheiro e adegas intimistas.
5. **Tecnologia Invisível (Smart Home)**: Automação residencial avançada onde comandos de voz, sensores de presença e automação de climatização ocorrem de forma fluida, sem painéis ou fios visíveis.',
    'Conheça as principais apostas em design de interiores e arquitetura contemporânea focadas em sofisticação, materiais orgânicos e automação invisível.',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
    'Tendências',
    'Tendências de Arquitetura de Alto Padrão para 2026 | Palloma Duarte',
    'Descubra as 5 principais tendências da arquitetura de luxo para 2026. Design biofílico, automação residencial invisível e materiais naturais em destaque.'
),
(
    'Guia Completo: Como Escolher os Acabamentos para seu Projeto', 
    'como-escolher-acabamentos-projeto', 
    'A fase de escolha de acabamentos é uma das mais importantes (e complexas) de qualquer obra. Acabamentos inadequados podem comprometer a estética geral e a funcionalidade a longo prazo.

Aqui estão 3 dicas essenciais da arquiteta Palloma Duarte para fazer escolhas certeiras:

1. **Crie uma Tábua de Conceito (Moodboard)**:
   Antes de comprar qualquer revestimento, junte amostras físicas de madeira, tecidos, pedras e metais. Coloque-os lado a lado para verificar se as tonalidades e texturas combinam harmonicamente sob diferentes iluminações.

2. **Equilibre Estética e Funcionalidade**:
   Um porcelanato polido pode ser lindo na sala, mas é extremamente escorregadio para áreas molhadas como banheiros e cozinhas. Para áreas externas e banheiros, prefira acabamentos naturais ou acetinados.

3. **Invista nos Metais**:
   Torneiras, misturadores e puxadores são os "detalhes de ouro" de um projeto. Optar por acabamentos escovados (como dourado fosco ou grafite) traz uma sofisticação discreta sem a marca de dedos comum em metais cromados brilhantes.',
    'Dicas práticas para selecionar revestimentos, pedras e metais sem errar, garantindo harmonia estética e durabilidade.',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    'Guias',
    'Como Escolher Acabamentos para seu Projeto | Dicas de Arquitetura',
    'Aprenda a selecionar revestimentos, metais e acabamentos ideais para sua reforma de luxo com este guia exclusivo do escritório Palloma Duarte.'
);

-- Inserir Configurações Iniciais
INSERT INTO public.site_settings (key, value)
VALUES 
(
    'contact_info',
    '{
        "address": "Av. Carlos Gomes, 1000 - Sala 802, Porto Alegre - RS",
        "phone": "+55 (51) 99999-8888",
        "whatsapp": "5551999998888",
        "email": "contato@pallomaduarte.com",
        "instagram": "https://instagram.com/pallomaduarte.arq",
        "working_hours": "Seg. a Sex. das 09h às 18h"
    }'::jsonb
),
(
    'seo_global',
    '{
        "title_suffix": " | Palloma Duarte Arquitetura",
        "default_description": "Escritório de arquitetura de luxo especializado em projetos sofisticados, funcionais e personalizados de residências e áreas comerciais.",
        "default_keywords": "arquitetura de luxo, design de interiores, arquitetura comercial, reforma de alto padrão, porto alegre, arquiteta palloma duarte"
    }'::jsonb
);

-- =========================================================================
-- 6. TABELA DE VISUALIZAÇÕES DE PÁGINAS (MÉTRICAS DE ACESSO)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.page_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    url TEXT NOT NULL,
    referrer TEXT,
    user_agent TEXT,
    city TEXT DEFAULT 'Desconhecida',
    region TEXT DEFAULT 'Desconhecido',
    country TEXT DEFAULT 'Desconhecido'
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS
-- Permitir que qualquer visitante insira visualizações de página (público)
CREATE POLICY "Permitir inserções públicas de page_views" ON public.page_views
    FOR INSERT WITH CHECK (true);

-- Permitir que apenas usuários autenticados (admin) leiam visualizações de página
CREATE POLICY "Permitir leitura de page_views para administradores" ON public.page_views
    FOR SELECT TO authenticated USING (true);
