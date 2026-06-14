'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Settings, Save, Check, Sparkles, HelpCircle } from 'lucide-react';
import styles from './page.module.css';

interface Setting {
  id: string;
  key: string;
  value: string;
  description?: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) throw error;
      if (data) {
        setSettings(data);
        const valMap: Record<string, string> = {};
        data.forEach(item => {
          valMap[item.key] = item.value;
        });
        setValues(valMap);
      }
    } catch (e) {
      console.error('Erro ao buscar configurações:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleValueChange = (key: string, val: string) => {
    setValues(prev => ({ ...prev, [key]: val }));
  };

  const handleSaveSetting = async (key: string, id: string) => {
    const valToSave = values[key];
    setSavingKey(key);

    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ value: valToSave })
        .eq('id', id);

      if (error) throw error;
      alert('Configuração salva com sucesso!');
    } catch (err: any) {
      console.error('Erro ao salvar configuração:', err);
      alert('Erro ao salvar: ' + err.message);
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Configurações do Site</h1>
          <p className={styles.subtitle}>Gerencie chaves de SEO, contatos e informações corporativas em tempo real.</p>
        </div>
      </header>

      <div className={styles.card}>
        {loading ? (
          <div className={styles.loading}>
            <Sparkles size={22} className={styles.spinner} />
            <span>Buscando configurações...</span>
          </div>
        ) : settings.length > 0 ? (
          <div className={styles.settingsList}>
            {settings.map((setting) => (
              <div key={setting.id} className={styles.settingItem}>
                <div className={styles.settingMeta}>
                  <strong className={styles.settingKey}>{setting.key.replace(/_/g, ' ').toUpperCase()}</strong>
                  <p className={styles.settingDesc}>{setting.description || 'Sem descrição.'}</p>
                </div>
                <div className={styles.settingActionRow}>
                  <input
                    type="text"
                    className={styles.settingInput}
                    value={values[setting.key] || ''}
                    onChange={(e) => handleValueChange(setting.key, e.target.value)}
                  />
                  <button
                    onClick={() => handleSaveSetting(setting.key, setting.id)}
                    className="btn-gold"
                    disabled={savingKey === setting.key}
                    style={{ padding: '0.75rem 1.25rem' }}
                  >
                    {savingKey === setting.key ? 'Salvando...' : <Save size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <HelpCircle size={32} />
            <p>Nenhuma configuração encontrada na tabela site_settings.</p>
            <p className={styles.emptyNote}>
              Execute a seção de seed data do seu script SQL `supabase_schema.sql` no painel do Supabase para inicializar as chaves!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
