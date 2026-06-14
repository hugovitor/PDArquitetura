'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar as CalendarIcon, Clock, Check, ArrowRight, Video } from 'lucide-react';
import styles from './MeetingScheduler.module.css';

interface MeetingSchedulerProps {
  initialLeadData?: {
    name: string;
    email: string;
    phone: string;
    project_type?: string;
    area?: number;
    source?: string;
  };
}

// Generate the next 5 weekdays
const getAvailableDates = () => {
  const dates = [];
  let current = new Date();
  
  // Start from tomorrow
  current.setDate(current.getDate() + 1);

  while (dates.length < 5) {
    // 0 is Sunday, 6 is Saturday
    if (current.getDay() !== 0 && current.getDay() !== 6) {
      dates.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

const timeSlots = [
  '09:00',
  '10:30',
  '14:00',
  '15:30',
  '17:00'
];

export default function MeetingScheduler({ initialLeadData }: MeetingSchedulerProps) {
  const [dates] = useState<Date[]>(getAvailableDates());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState(1); // 1: Date & Time, 2: Lead Info, 3: Success
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Lead fields
  const [name, setName] = useState(initialLeadData?.name || '');
  const [email, setEmail] = useState(initialLeadData?.email || '');
  const [phone, setPhone] = useState(initialLeadData?.phone || '');
  const [projectType, setProjectType] = useState(initialLeadData?.project_type || 'residencial');
  const [message, setMessage] = useState('');

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const handleNextStep = () => {
    if (!selectedDate || !selectedTime) {
      setErrorMsg('Por favor, selecione uma data e horário.');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Create or Find Lead
      // We'll insert a new lead with source = 'agendamento' (or preserve the original source)
      const leadSource = initialLeadData?.source || 'agendamento';
      const temperature = 'quente'; // Anyone scheduling a meeting is a hot lead!

      const leadId = typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID 
        ? window.crypto.randomUUID() 
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });

      const { error: leadError } = await supabase
        .from('leads')
        .insert([
          {
            id: leadId,
            name,
            email,
            phone,
            project_type: projectType,
            source: leadSource,
            temperature,
            message: message || 'Agendamento de reunião direta.',
            status: 'reuniao_agendada'
          }
        ]);

      if (leadError) throw leadError;


      // 2. Schedule Meeting
      // Combine date and time
      const [hours, minutes] = selectedTime!.split(':');
      const scheduledDateTime = new Date(selectedDate!);
      scheduledDateTime.setHours(Number(hours));
      scheduledDateTime.setMinutes(Number(minutes));
      scheduledDateTime.setSeconds(0);

      // Create a virtual meeting link (Google Meet simulation)
      const meetLink = `https://meet.google.com/pd-arquitetura-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;

      const { error: meetingError } = await supabase
        .from('meetings')
        .insert([
          {
            lead_id: leadId,
            scheduled_at: scheduledDateTime.toISOString(),
            duration_minutes: 30,
            status: 'confirmed',
            meeting_link: meetLink
          }
        ]);

      if (meetingError) throw meetingError;

      setStep(3);
    } catch (err: any) {
      console.error('Erro ao agendar reunião:', err);
      setErrorMsg('Erro ao realizar o agendamento. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.section} id="agendamento">
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.schedulerHeader}>
            <span className="section-subtitle">Agenda Aberta</span>
            <h2 className="section-title">Agende sua Reunião de Diagnóstico</h2>
            <p className={styles.headerDesc}>
              Escolha o melhor dia e horário para conversar por videochamada com Palloma Duarte e dar o primeiro passo na transformação do seu espaço.
            </p>
          </div>

          <div className={styles.card}>
            {step === 1 && (
              <div className={styles.stepOne}>
                <div className={styles.layoutGrid}>
                  {/* Date Picker */}
                  <div className={styles.pickerSection}>
                    <h3 className={styles.sectionTitleSmall}>
                      <CalendarIcon size={18} className={styles.iconGold} />
                      1. Selecione o Dia
                    </h3>
                    <div className={styles.dateGrid}>
                      {dates.map((date, index) => {
                        const isSelected = selectedDate?.toDateString() === date.toDateString();
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setSelectedDate(date)}
                            className={`${styles.dateBtn} ${isSelected ? styles.selected : ''}`}
                          >
                            <span className={styles.dateDay}>{date.getDate()}</span>
                            <span className={styles.dateWeekday}>
                              {date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Picker */}
                  <div className={styles.pickerSection}>
                    <h3 className={styles.sectionTitleSmall}>
                      <Clock size={18} className={styles.iconGold} />
                      2. Escolha o Horário
                    </h3>
                    {selectedDate ? (
                      <div className={styles.timeGrid}>
                        {timeSlots.map((time, index) => {
                          const isSelected = selectedTime === time;
                          return (
                            <button
                              key={index}
                              type="button"
                              onClick={() => setSelectedTime(time)}
                              className={`${styles.timeBtn} ${isSelected ? styles.selected : ''}`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className={styles.emptyText}>Selecione um dia para ver os horários disponíveis.</p>
                    )}
                  </div>
                </div>

                {errorMsg && <p className={styles.errorText}>{errorMsg}</p>}

                <div className={styles.actions}>
                  <button
                    onClick={handleNextStep}
                    className="btn-gold"
                    disabled={!selectedDate || !selectedTime}
                  >
                    Confirmar Data e Horário
                    <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className={styles.stepTwo}>
                <div className={styles.selectionSummary}>
                  <div className={styles.summaryItem}>
                    <CalendarIcon size={16} />
                    <span>{selectedDate && formatDate(selectedDate)}</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <Clock size={16} />
                    <span>{selectedTime} (Reunião de 30 min)</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <Video size={16} />
                    <span>Videochamada Online (Google Meet)</span>
                  </div>
                </div>

                <form onSubmit={handleSchedule} className={styles.form}>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="sched-name">Nome Completo</label>
                      <input
                        id="sched-name"
                        type="text"
                        placeholder="Ex: Palloma Duarte"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="sched-phone">WhatsApp</label>
                      <input
                        id="sched-phone"
                        type="tel"
                        placeholder="Ex: (51) 99999-8888"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="sched-email">E-mail</label>
                    <input
                      id="sched-email"
                      type="email"
                      placeholder="Ex: contato@pdarquitetura.com.br"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="sched-type">Tipo de Projeto</label>
                      <select
                        id="sched-type"
                        value={projectType}
                        onChange={(e) => setProjectType(e.target.value)}
                      >
                        <option value="residencial">Residencial</option>
                        <option value="comercial">Comercial</option>
                        <option value="clinica">Clínicas e Consultórios</option>
                        <option value="corporativo">Corporativo</option>
                        <option value="outro">Consultoria ou Outro</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="sched-msg">Mensagem / Observações (Opcional)</label>
                    <textarea
                      id="sched-msg"
                      rows={3}
                      placeholder="Conte um pouco sobre o seu imóvel, o que gostaria de transformar e suas ideias principais..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                  </div>

                  {errorMsg && <p className={styles.errorText}>{errorMsg}</p>}

                  <div className={styles.formActions}>
                    <button type="button" onClick={() => setStep(1)} className={styles.backBtn}>
                      Voltar e Alterar Data
                    </button>
                    <button type="submit" className="btn-gold" disabled={loading}>
                      {loading ? 'Agendando...' : 'Confirmar Reunião'}
                      <Check size={16} style={{ marginLeft: '8px' }} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 3 && (
              <div className={styles.successState}>
                <div className={styles.successBadge}>
                  <Check size={32} />
                </div>
                <h3>Agendamento Confirmado!</h3>
                <p className={styles.successIntro}>
                  Tudo certo, <strong>{name.split(' ')[0]}</strong>! Sua conversa com a arquiteta Palloma Duarte foi reservada com sucesso.
                </p>

                <div className={styles.meetingDetails}>
                  <div className={styles.detailsGrid}>
                    <div className={styles.detailsItem}>
                      <strong>Data:</strong>
                      <span>{selectedDate && formatDate(selectedDate)}</span>
                    </div>
                    <div className={styles.detailsItem}>
                      <strong>Horário:</strong>
                      <span>{selectedTime} (Horário de Brasília)</span>
                    </div>
                    <div className={styles.detailsItem}>
                      <strong>Formato:</strong>
                      <span>Videochamada via Google Meet</span>
                    </div>
                  </div>

                  <div className={styles.meetLinkBox}>
                    <Video size={20} className={styles.iconGold} />
                    <div>
                      <strong>Link do Google Meet:</strong>
                      <p>O link da reunião foi enviado para o seu e-mail e WhatsApp cadastrados.</p>
                    </div>
                  </div>
                </div>

                <p className={styles.successNote}>
                  Por favor, salve na sua agenda. Se precisar reagendar, entre em contato via WhatsApp pelo menos 2 horas antes da reunião.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
