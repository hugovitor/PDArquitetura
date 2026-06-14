'use client';

import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './EbookPopup.module.css';

export default function EbookPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // Mostrar popup após 25 segundos de inatividade
  useEffect(() => {
    const alreadySeen = sessionStorage.getItem('ebook_popup_shown');
    if (alreadySeen) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
      sessionStorage.setItem('ebook_popup_shown', 'true');
    }, 25000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await supabase.from('leads').insert({
        name,
        phone,
        email: '',
        source: 'ebook',
        status: 'novo',
        temperature: 'morno',
        message: 'Lead via download de E-book: Guia de Reformas Premium',
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

        <div className={styles.inner}>
          <div className={styles.visual}>
            <div className={styles.bookCover}>
              <span className={styles.bookTitle}>Guia de<br />Reformas<br />Premium</span>
              <span className={styles.bookAuthor}>Palloma Duarte Arquitetura</span>
            </div>
          </div>

          <div className={styles.content}>
            {!done ? (
              <>
                <span className="section-subtitle" style={{ fontSize: '0.7rem' }}>E-book Gratuito</span>
                <h2 className={styles.title}>Tudo que você precisa saber antes de reformar</h2>
                <p className={styles.desc}>
                  Checklist de 30 pontos, dicas de acabamentos e como evitar os erros mais caros em uma reforma de alto padrão.
                </p>
                <form onSubmit={handleSubmit} className={styles.form}>
                  <input
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.input}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Seu WhatsApp (com DDD)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={styles.input}
                    required
                  />
                  <button type="submit" disabled={loading} className="btn-gold" style={{ width: '100%', gap: '8px' }}>
                    <Download size={16} />
                    {loading ? 'Aguarde...' : 'Quero o E-book Grátis'}
                  </button>
                </form>
                <p className={styles.privacy}>🔒 Sem spam. Apenas conteúdo de valor.</p>
              </>
            ) : (
              <div className={styles.success}>
                <div className={styles.successIcon}>✓</div>
                <h2 className={styles.title}>Perfeito, {name.split(' ')[0]}!</h2>
                <p className={styles.desc}>
                  Seu e-book está pronto. Nossa arquiteta entrará em contato pelo WhatsApp para enviar o material e tirar suas dúvidas.
                </p>
                <a
                  href="https://wa.me/5551999998888?text=Ol%C3%A1!%20Quero%20receber%20o%20Guia%20de%20Reformas%20Premium."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold"
                  style={{ width: '100%', marginTop: '1rem' }}
                >
                  Receber pelo WhatsApp
                </a>
                <button className={styles.close2} onClick={() => setIsOpen(false)}>Fechar</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
