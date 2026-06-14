'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './ExitIntentPopup.module.css';

export default function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem('exit_popup_shown');
    if (alreadySeen) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10) {
        setIsOpen(true);
        sessionStorage.setItem('exit_popup_shown', 'true');
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
    };

    // Só ativar após 8 segundos na página
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 8000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setLoading(true);
    try {
      await supabase.from('leads').insert({
        name: 'Lead Exit Popup',
        phone,
        email: '',
        source: 'exit_popup',
        status: 'novo',
        temperature: 'frio',
        message: 'Lead captado via popup de saída.',
      });
      setDone(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={() => setIsOpen(false)} aria-label="Fechar">
          <X size={20} />
        </button>

        {!done ? (
          <>
            <span className="section-subtitle">Antes de ir...</span>
            <h2 className={styles.title}>Receba uma consultoria gratuita de 30 min</h2>
            <p className={styles.desc}>
              Deixe seu WhatsApp e nossa arquiteta entra em contato para uma conversa inicial sem compromisso.
            </p>
            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="tel"
                placeholder="Seu WhatsApp (com DDD)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={styles.input}
                required
              />
              <button type="submit" disabled={loading} className="btn-gold" style={{ width: '100%' }}>
                {loading ? 'Aguarde...' : 'Quero a consultoria gratuita'}
              </button>
            </form>
            <button className={styles.skip} onClick={() => setIsOpen(false)}>
              Não, obrigado
            </button>
          </>
        ) : (
          <div className={styles.success}>
            <div className={styles.successIcon}>✓</div>
            <h2 className={styles.title}>Recebemos seu contato!</h2>
            <p className={styles.desc}>Nossa arquiteta entrará em contato em breve pelo WhatsApp. Até logo!</p>
            <button onClick={() => setIsOpen(false)} className="btn-outline" style={{ marginTop: '1rem' }}>
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
