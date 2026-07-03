'use client';

import { MessageCircle } from 'lucide-react';
import styles from './WhatsAppButton.module.css';

const WHATSAPP_NUMBER = '5561996021524';
const WHATSAPP_MSG = 'Olá! Gostaria de saber mais sobre os serviços de arquitetura.';

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MSG)}`}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.btn}
      aria-label="Falar pelo WhatsApp"
      id="whatsapp-float"
    >
      <MessageCircle size={26} fill="white" strokeWidth={1.5} />
      <span className={styles.tooltip}>Fale comigo agora</span>
    </a>
  );
}
