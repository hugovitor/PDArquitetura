'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Mail, Phone, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import MeetingScheduler from '@/components/MeetingScheduler';
import styles from './page.module.css';

const CONTACT_EMAIL = 'contato@pdarquitetura.com.br';
const CONTACT_PHONE = '(51) 99999-8888';
const CONTACT_ADDRESS = 'Av. Carlos Gomes, 1000 - Bela Vista, Porto Alegre - RS';

export default function ContatoPage() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'message'>('schedule');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Contact Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [projectType, setProjectType] = useState('residencial');
  const [message, setMessage] = useState('');

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !message) {
      setErrorMsg('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const { error } = await supabase
        .from('leads')
        .insert([
          {
            name,
            email,
            phone,
            project_type: projectType,
            message,
            source: 'contato',
            temperature: 'morno',
            status: 'novo'
          }
        ]);

      if (error) throw error;

      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      console.error('Erro ao enviar mensagem:', err);
      setErrorMsg('Ocorreu um erro ao enviar sua mensagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.contatoPage}>
      {/* Editorial Header */}
      <section className={styles.hero}>
        <div className="container">
          <span className="section-subtitle">Fale com o Escritório</span>
          <h1 className={styles.title}>Iniciar Meu Projeto</h1>
          <p className={styles.subtitle}>
            Estamos prontos para ouvir suas ideias e transformá-las em realidade. Escolha a melhor forma de entrar em contato conosco.
          </p>
        </div>
      </section>

      {/* Info and Form Grid */}
      <section className={styles.content}>
        <div className="container">
          <div className={styles.grid}>
            {/* Contact Information Column */}
            <div className={styles.infoCol}>
              <div className={styles.infoGroup}>
                <span className="section-subtitle">Canais Diretos</span>
                <h2>Informações de Contato</h2>
                <p className={styles.infoDesc}>Fique à vontade para nos ligar ou nos fazer uma visita (mediante agendamento prévio).</p>
              </div>

              <div className={styles.contactList}>
                <div className={styles.contactItem}>
                  <div className={styles.iconBox}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <strong>Telefone / WhatsApp</strong>
                    <a href={`https://wa.me/5551999998888`} target="_blank" rel="noopener noreferrer">
                      {CONTACT_PHONE}
                    </a>
                  </div>
                </div>

                <div className={styles.contactItem}>
                  <div className={styles.iconBox}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <strong>E-mail</strong>
                    <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                  </div>
                </div>

                <div className={styles.contactItem}>
                  <div className={styles.iconBox}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <strong>Endereço do Escritório</strong>
                    <span>{CONTACT_ADDRESS}</span>
                  </div>
                </div>

                <div className={styles.contactItem}>
                  <div className={styles.iconBox}>
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </div>
                  <div>
                    <strong>Instagram Editorial</strong>
                    <a href="https://www.instagram.com/pallomaduarte.arq/" target="_blank" rel="noopener noreferrer">
                      @pallomaduarte.arq
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Forms Column */}
            <div className={styles.formCol}>
              {/* Tab Selector */}
              <div className={styles.tabSelector}>
                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`${styles.tabBtn} ${activeTab === 'schedule' ? styles.active : ''}`}
                >
                  Agendar Reunião
                </button>
                <button
                  onClick={() => setActiveTab('message')}
                  className={`${styles.tabBtn} ${activeTab === 'message' ? styles.active : ''}`}
                >
                  Enviar Mensagem
                </button>
              </div>

              {/* Form Content */}
              <div className={styles.formCard}>
                {activeTab === 'schedule' ? (
                  <div className={styles.schedulerEmbed}>
                    <MeetingScheduler />
                  </div>
                ) : (
                  <div className={styles.messageForm}>
                    <h3 className={styles.formTitle}>Fale Conosco</h3>
                    <p className={styles.formDesc}>Preencha o formulário abaixo e entraremos em contato em até 24 horas úteis.</p>

                    {success ? (
                      <div className={styles.successBox}>
                        <CheckCircle size={32} className={styles.successIcon} />
                        <h3>Mensagem Enviada!</h3>
                        <p>Obrigado pelo contato. Em breve nossa equipe retornará por e-mail ou WhatsApp.</p>
                        <button onClick={() => setSuccess(false)} className="btn-gold" style={{ marginTop: '1rem' }}>
                          Enviar Nova Mensagem
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleSendMessage} className={styles.form}>
                        <div className={styles.formGroup}>
                          <label htmlFor="contact-name">Seu Nome Completo</label>
                          <input
                            id="contact-name"
                            type="text"
                            placeholder="Ex: Palloma Duarte"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </div>

                        <div className={styles.formGrid}>
                          <div className={styles.formGroup}>
                            <label htmlFor="contact-phone">WhatsApp</label>
                            <input
                              id="contact-phone"
                              type="tel"
                              placeholder="Ex: (51) 99999-8888"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              required
                            />
                          </div>
                          <div className={styles.formGroup}>
                            <label htmlFor="contact-email">E-mail</label>
                            <input
                              id="contact-email"
                              type="email"
                              placeholder="Ex: contato@pdarquitetura.com.br"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className={styles.formGroup}>
                          <label htmlFor="contact-type">Tipo de Projeto</label>
                          <select
                            id="contact-type"
                            value={projectType}
                            onChange={(e) => setProjectType(e.target.value)}
                          >
                            <option value="residencial">Residencial (Casa/Apto)</option>
                            <option value="comercial">Comercial (Loja/Showroom)</option>
                            <option value="clinica">Clínicas e Consultórios</option>
                            <option value="corporativo">Corporativo (Escritório)</option>
                            <option value="outro">Outro</option>
                          </select>
                        </div>

                        <div className={styles.formGroup}>
                          <label htmlFor="contact-msg">Sua Mensagem</label>
                          <textarea
                            id="contact-msg"
                            rows={4}
                            placeholder="Descreva brevemente o seu projeto, metragem aproximada e expectativas..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                          ></textarea>
                        </div>

                        {errorMsg && <p className={styles.errorText}>{errorMsg}</p>}

                        <button type="submit" className="btn-gold" disabled={loading}>
                          {loading ? 'Enviando...' : 'Enviar Mensagem'}
                          <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
