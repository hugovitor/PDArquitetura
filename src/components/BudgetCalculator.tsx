'use client';

import { useState } from 'react';
import { Calculator, ArrowRight, X, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './BudgetCalculator.module.css';

const projectTypes: Record<string, { label: string; minRate: number; maxRate: number }> = {
  residencial: { label: 'Projeto Residencial (Casa)', minRate: 80, maxRate: 150 },
  apartamento: { label: 'Reforma de Apartamento', minRate: 100, maxRate: 180 },
  interiores: { label: 'Design de Interiores', minRate: 120, maxRate: 220 },
  comercial: { label: 'Espaço Comercial / Escritório', minRate: 90, maxRate: 160 },
  clinica: { label: 'Clínica / Consultório', minRate: 110, maxRate: 200 },
};

type Step = 'calculator' | 'capture' | 'result';

function qualifyLead(type: string, area: number) {
  if ((type === 'residencial' || type === 'comercial') && area >= 200) return 'quente';
  if (area >= 80) return 'morno';
  return 'frio';
}

export default function BudgetCalculator() {
  const [step, setStep] = useState<Step>('calculator');
  const [projectType, setProjectType] = useState('residencial');
  const [area, setArea] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState({ min: 0, max: 0 });

  const calculate = () => {
    const a = parseFloat(area);
    if (!a || a <= 0) return;
    const rates = projectTypes[projectType];
    setEstimate({ min: Math.round(a * rates.minRate), max: Math.round(a * rates.maxRate) });
    setStep('capture');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const a = parseFloat(area);
    const temp = qualifyLead(projectType, a);
    try {
      await supabase.from('leads').insert({
        name,
        phone,
        email: '',
        project_type: projectType === 'apartamento' ? 'residencial' : projectType === 'interiores' ? 'residencial' : projectType as string,
        area: a,
        source: 'calculadora',
        temperature: temp,
        status: 'novo',
        message: `Lead via calculadora. Tipo: ${projectTypes[projectType].label}. Área: ${a}m²`,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setStep('result');
    }
  };

  const fmt = (n: number) =>
    n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

  const whatsappMsg = `Olá, fiz uma simulação no site e gostaria de saber mais sobre meu projeto de *${projectTypes[projectType]?.label}* de *${area}m²*. Estimativa: *${fmt(estimate.min)} a ${fmt(estimate.max)}*.`;

  return (
    <section id="simulador" className={styles.section}>
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <span className="section-subtitle">
            <Calculator size={14} style={{ display: 'inline', marginRight: '6px' }} />
            Simulador de Investimento
          </span>
          <h2 className="section-title">Quanto custa o seu projeto?</h2>
          <p className={styles.desc}>
            Informe o tipo e a metragem do seu projeto para receber uma estimativa personalizada.
          </p>
        </div>

        <div className={styles.card}>
          {step === 'calculator' && (
            <div className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="calc-type">Tipo de projeto</label>
                <select
                  id="calc-type"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className={styles.select}
                >
                  {Object.entries(projectTypes).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label htmlFor="calc-area">Metragem estimada (m²)</label>
                <input
                  id="calc-area"
                  type="number"
                  placeholder="Ex: 120"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className={styles.input}
                  min="1"
                />
              </div>
              <button
                onClick={calculate}
                disabled={!area || parseFloat(area) <= 0}
                className={`btn-gold ${styles.btn}`}
              >
                Calcular Estimativa <ArrowRight size={16} />
              </button>
            </div>
          )}

          {step === 'capture' && (
            <div className={styles.form}>
              <div className={styles.captureHeader}>
                <CheckCircle size={32} className={styles.captureIcon} />
                <h3>Estimativa pronta! Informe seus dados para recebê-la.</h3>
              </div>
              <form onSubmit={handleSubmit}>
                <div className={styles.field}>
                  <label htmlFor="calc-name">Seu nome completo</label>
                  <input
                    id="calc-name"
                    type="text"
                    placeholder="Ex: Maria Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="calc-phone">Seu WhatsApp (com DDD)</label>
                  <input
                    id="calc-phone"
                    type="tel"
                    placeholder="Ex: (51) 99999-8888"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.btnRow}>
                  <button type="button" onClick={() => setStep('calculator')} className={styles.back}>
                    <X size={14} /> Refazer
                  </button>
                  <button type="submit" disabled={loading} className={`btn-gold ${styles.btn}`}>
                    {loading ? 'Calculando...' : 'Ver minha estimativa'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 'result' && (
            <div className={styles.result}>
              <div className={styles.resultBadge}>Estimativa de Investimento</div>
              <p className={styles.resultProject}>{projectTypes[projectType].label} · {area}m²</p>
              <div className={styles.resultRange}>
                <span className={styles.resultMin}>{fmt(estimate.min)}</span>
                <span className={styles.resultSep}>até</span>
                <span className={styles.resultMax}>{fmt(estimate.max)}</span>
              </div>
              <p className={styles.resultNote}>
                * Estimativa referencial. O valor final depende de especificações, materiais e complexidade do projeto. Agende uma consulta gratuita para um orçamento detalhado.
              </p>
              <div className={styles.resultActions}>
                <a
                  href={`https://wa.me/5551999998888?text=${encodeURIComponent(whatsappMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold"
                >
                  Falar com a arquiteta
                </a>
                <button onClick={() => setStep('calculator')} className="btn-outline">
                  Nova simulação
                </button>
              </div>
            </div>
          )}
        </div>

        {step === 'calculator' && (
          <p className={styles.privacy}>
            🔒 Seus dados são protegidos. Não compartilhamos com terceiros.
          </p>
        )}
      </div>
    </section>
  );
}
