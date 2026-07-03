'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ArrowRight, Check, Sparkles, RefreshCw } from 'lucide-react';
import styles from './ProjectQuiz.module.css';

interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    value: string;
    imagePlaceholder?: string; // We can style these options beautifully
  }[];
}

const quizQuestions: Question[] = [
  {
    id: 1,
    text: 'Qual paleta de cores e texturas mais atrai o seu olhar?',
    options: [
      { label: 'Tons neutros, linhas limpas, madeira clara e muito branco.', value: 'minimalista' },
      { label: 'Contrastes fortes, concreto exposto, metal preto e tijolos.', value: 'industrial' },
      { label: 'Mármores, detalhes dourados, molduras clássicas (boiseries) e simetria.', value: 'classico' },
      { label: 'Móveis contemporâneos, integração de ambientes, cores pontuais e tecnologia.', value: 'moderno' },
    ],
  },
  {
    id: 2,
    text: 'Qual é a sua maior prioridade para este novo projeto?',
    options: [
      { label: 'Aproveitamento máximo e inteligência de cada centímetro.', value: 'espaco' },
      { label: 'Estética impecável, sofisticação e materiais nobres.', value: 'estetica' },
      { label: 'Praticidade para o dia a dia, ergonomia e fácil manutenção.', value: 'funcionalidade' },
      { label: 'Valorização do imóvel para venda/aluguel ou investimento.', value: 'investimento' },
    ],
  },
  {
    id: 3,
    text: 'Que tipo de espaço vamos transformar?',
    options: [
      { label: 'Uma casa inteira ou parte dela.', value: 'residencial_casa' },
      { label: 'Um apartamento.', value: 'residencial_apto' },
      { label: 'Um escritório ou espaço comercial.', value: 'comercial' },
      { label: 'Uma clínica ou consultório de saúde/estética.', value: 'clinica' },
    ],
  },
  {
    id: 4,
    text: 'Qual a dimensão aproximada do espaço (m²)?',
    options: [
      { label: 'Até 50 m²', value: '50' },
      { label: 'De 50 a 120 m²', value: '120' },
      { label: 'De 120 a 300 m²', value: '300' },
      { label: 'Acima de 300 m²', value: '500' },
    ],
  },
];

const styleResults: Record<string, { title: string; desc: string; tips: string[] }> = {
  minimalista: {
    title: 'Minimalista Clássico & Neutro',
    desc: 'Seu estilo é pautado pela premissa de que "menos é mais". Ambientes organizados, livres de excessos, com muita luz natural e foco na textura dos materiais naturais, como linho, madeira clara e pedras com acabamento fosco.',
    tips: [
      'Priorize marcenaria planejada embutida para ocultar a desordem.',
      'Aposte em iluminação indireta difusa com fitas de LED quente.',
      'Escolha poucas peças de design assinado que tragam personalidade ao espaço.',
    ],
  },
  industrial: {
    title: 'Industrial Urbano & Contemporâneo',
    desc: 'Você aprecia a autenticidade e a crueza dos materiais estruturais. Ambientes amplos (estilo loft), tubulações aparentes, contraste entre o aconchego da madeira rústica e a frieza do ferro preto e do cimento queimado são a sua assinatura.',
    tips: [
      'Utilize esquadrias pretas de alumínio ou ferro para delimitar ambientes de forma leve.',
      'Combine sofás de couro natural com tapetes geométricos e macios para aquecer o espaço.',
      'Invista em luminárias pendentes em trilhos pretos direcionáveis.',
    ],
  },
  classico: {
    title: 'Clássico Contemporâneo / Neoclássico',
    desc: 'O requinte, a simetria e a atenção aos detalhes ornamentais definem o seu gosto. Você se sente atraído por boiseries nas paredes, tampos de mármore com veios marcantes, tecidos nobres como veludo e toques de metais dourados ou latão.',
    tips: [
      'Crie paredes de destaque usando molduras de gesso (boiseries) pintadas na mesma cor da parede para sofisticação sutil.',
      'Utilize espelhos amplos com molduras clássicas para ampliar o pé-direito.',
      'Combine móveis de linhas curvas clássicas com marcenaria moderna retilínea.',
    ],
  },
  moderno: {
    title: 'Moderno & Altamente Funcional',
    desc: 'Integração total de ambientes, dinamismo e inovação tecnológica definem seu estilo. Você gosta de linhas geométricas fortes, superfícies contínuas e o uso estratégico de cores expressivas em meio a uma base neutra.',
    tips: [
      'Invista em sistemas de automação residencial (iluminação, som e persianas).',
      'Use painéis amadeirados ou ripados para camuflar portas de acesso.',
      'Aposte em iluminação linear embutida no teto e rasgos de gesso.',
    ],
  },
};

export default function ProjectQuiz() {
  const [currentStep, setCurrentStep] = useState(0); // 0 to 3 for questions, 4 for lead capture, 5 for result
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Lead fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSelectOption = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentStep + 1]: value }));
    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setCurrentStep(4); // Move to lead capture step
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setErrorMsg('');
    }
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // Determine style based on Q1
      const stylePreference = answers[1] || 'moderno';
      
      // Determine project_type mapping
      let projectType = 'residencial';
      const q3Val = answers[3];
      if (q3Val === 'comercial') projectType = 'comercial';
      else if (q3Val === 'clinica') projectType = 'clinica';

      // Estimate area
      const areaVal = Number(answers[4]) || 50;

      // Determine Lead Temperature based on area size or priority
      let temperature = 'morno';
      const priority = answers[2];
      if (areaVal >= 120 || priority === 'estetica') {
        temperature = 'quente';
      } else if (areaVal <= 50) {
        temperature = 'frio';
      }

      // Generate notes
      const notesObj = {
        stylePreference,
        priority,
        spaceType: answers[3],
        areaRange: answers[4] + ' m²',
      };

      // Save to Supabase
      const { error } = await supabase
        .from('leads')
        .insert([
          {
            name,
            email,
            phone,
            project_type: projectType,
            area: areaVal,
            source: 'quiz',
            temperature,
            notes: `Estilo Predominante: ${stylePreference}. Prioridade: ${priority}. Imóvel: ${answers[3]}. Área: ${answers[4]}m². Detalhes: ${JSON.stringify(notesObj)}`,
            status: 'novo'
          }
        ]);

      if (error) throw error;


      // Move to result step
      setCurrentStep(5);
    } catch (err: any) {
      console.error('Erro ao enviar lead do quiz:', err);
      setErrorMsg('Ocorreu um erro ao processar seus dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
    setName('');
    setEmail('');
    setPhone('');
    setErrorMsg('');
  };

  const getPredominantStyle = () => {
    // Q1 answer dictates the aesthetic style directly
    const q1 = answers[1];
    return styleResults[q1] || styleResults['moderno'];
  };

  const progressPercentage = ((currentStep + 1) / (quizQuestions.length + 2)) * 100;

  return (
    <section className={styles.section} id="quiz-estilo">
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.quizHeader}>
            <span className="section-subtitle">Descubra Seu Estilo</span>
            <h2 className="section-title">Quiz de Estilo Arquitetônico</h2>
            <p className={styles.headerDesc}>
              Responda a 4 perguntas simples e receba uma análise personalizada do perfil ideal para o seu projeto.
            </p>
          </div>

          {currentStep <= 4 && (
            <div className={styles.progressContainer}>
              <div className={styles.progressBar} style={{ width: `${progressPercentage}%` }}></div>
              <span className={styles.progressText}>Etapa {currentStep + 1} de 5</span>
            </div>
          )}

          {/* Question Steps */}
          {currentStep < quizQuestions.length && (
            <div className={styles.stepCard}>
              <h3 className={styles.questionText}>
                {quizQuestions[currentStep].text}
              </h3>
              <div className={styles.optionsGrid}>
                {quizQuestions[currentStep].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectOption(option.value)}
                    className={styles.optionBtn}
                  >
                    <div className={styles.optionIndex}>{String.fromCharCode(65 + index)}</div>
                    <span className={styles.optionLabel}>{option.label}</span>
                  </button>
                ))}
              </div>
              
              {currentStep > 0 && (
                <button onClick={handleBack} className={styles.backBtn}>
                  Voltar para a pergunta anterior
                </button>
              )}
            </div>
          )}

          {/* Lead Capture Step */}
          {currentStep === 4 && (
            <div className={styles.stepCard}>
              <div className={styles.formIntro}>
                <Sparkles size={24} className={styles.goldIcon} />
                <h3>Análise Quase Pronta!</h3>
                <p>Insira seus dados para salvar e visualizar o resultado do seu estilo arquitetônico.</p>
              </div>

              <form onSubmit={handleSubmitLead} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="quiz-name">Seu Nome Completo</label>
                  <input
                    id="quiz-name"
                    type="text"
                    placeholder="Ex: Palloma Duarte"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="quiz-email">Seu Melhor E-mail</label>
                  <input
                    id="quiz-email"
                    type="email"
                    placeholder="Ex: pallomaduartearquitetura@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="quiz-phone">WhatsApp para Contato</label>
                  <input
                    id="quiz-phone"
                    type="tel"
                    placeholder="Ex: (61) 99602-1524"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                {errorMsg && <p className={styles.errorText}>{errorMsg}</p>}

                <div className={styles.formActions}>
                  <button type="button" onClick={handleBack} className={styles.backBtn}>
                    Voltar
                  </button>
                  <button type="submit" className="btn-gold" disabled={loading}>
                    {loading ? 'Processando...' : 'Ver Meu Resultado'}
                    <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Result Step */}
          {currentStep === 5 && (
            <div className={`${styles.stepCard} ${styles.resultCard}`}>
              <div className={styles.resultHeader}>
                <div className={styles.resultBadge}>Seu Perfil Arquitetônico</div>
                <h3 className={styles.resultTitle}>{getPredominantStyle().title}</h3>
                <p className={styles.resultDesc}>{getPredominantStyle().desc}</p>
              </div>

              <div className={styles.tipsSection}>
                <h4>💡 Recomendações de Ouro para o seu Espaço:</h4>
                <ul className={styles.tipsList}>
                  {getPredominantStyle().tips.map((tip, idx) => (
                    <li key={idx}>
                      <Check size={16} className={styles.checkIcon} />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.ctaBox}>
                <h4>Gostaria de tirar essa ideia do papel?</h4>
                <p>Agende uma conversa de diagnóstico gratuita de 30 minutos diretamente com a arquiteta Palloma Duarte para discutir o potencial do seu espaço.</p>
                <div className={styles.ctaButtons}>
                  <a href="#agendamento" className="btn-gold">
                    Agendar Reunião Gratuita
                    <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                  </a>
                  <button onClick={handleReset} className={styles.resetBtn}>
                    <RefreshCw size={14} style={{ marginRight: '6px' }} />
                    Fazer o Teste Novamente
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
