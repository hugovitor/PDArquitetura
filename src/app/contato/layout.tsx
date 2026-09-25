import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contato',
  description:
    'Agende uma conversa com o escritório Palloma Duarte Arquitetura em Brasília. Projetos residenciais, comerciais e de interiores.',
};

export default function ContatoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
