import { useState } from 'react';
import { Heart, CheckCircle, Shield, Smartphone } from 'lucide-react';
import { api } from '../lib/api';
import type { DonationInsert } from '../types/database';

type Method = 'PayPal' | 'Mixx' | 'Moov';

const AMOUNTS = [1000, 2500, 5000, 10000, 25000];

export default function DonationsPage() {
  const [amount, setAmount] = useState<number | ''>('');
  const [customAmount, setCustomAmount] = useState('');
  const [method, setMethod] = useState<Method>('Moov');
  const [donor, setDonor] = useState({ name: '', email: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const finalAmount = amount !== '' ? amount : Number(customAmount);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalAmount || finalAmount <= 0) return;
    setStatus('loading');
    const payload: DonationInsert = {
      amount: finalAmount,
      currency: 'XOF',
      payment_method: method,
      donor_name: donor.name || null,
      donor_email: donor.email || null,
    };
    try {
      await api.post('/donations', { data: payload });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const methods: { id: Method; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'Moov', label: 'Moov Money', icon: <Smartphone size={18} />, color: 'border-blue-500 bg-blue-50 text-blue-700' },
    { id: 'Mixx', label: 'Mixx by Yas', icon: <Smartphone size={18} />, color: 'border-orange-500 bg-orange-50 text-orange-700' },
    { id: 'PayPal', label: 'PayPal', icon: <Shield size={18} />, color: 'border-indigo-500 bg-indigo-50 text-indigo-700' },
  ];

  if (status === 'success') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-10 text-center">
          <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={36} className="text-teal-500" />
          </div>
          <h2 className="text-2xl font-bold text-teal-800 mb-3">Merci pour votre don !</h2>
          <p className="text-gray-500 mb-2">
            Votre don de <span className="font-bold text-teal-700">{finalAmount.toLocaleString('fr-FR')} XOF</span> via {method} a bien été enregistré.
          </p>
          <p className="text-gray-400 text-sm mb-8">Que Dieu bénisse votre générosité.</p>
          <button onClick={() => { setStatus('idle'); setAmount(''); setCustomAmount(''); }} className="btn-primary w-full justify-center">
            Faire un autre don
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="relative pt-32 pb-20 bg-teal-800 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-teal-300 mb-4">Soutenez-nous</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-display mb-4">Faire un don</h1>
          <p className="text-teal-200 text-lg max-w-xl">
            Votre générosité permet à la Zone Baptiste Agapé de poursuivre sa mission au service de Dieu et des communautés.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <form onSubmit={submit} className="bg-white rounded-2xl shadow-sm p-8 space-y-8">
            {/* Amount */}
            <div>
              <h3 className="font-bold text-teal-800 mb-4 flex items-center gap-2">
                <Heart size={18} className="text-teal-500" />
                Montant du don (XOF)
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
                {AMOUNTS.map(a => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => { setAmount(a); setCustomAmount(''); }}
                    className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition ${
                      amount === a
                        ? 'border-teal-600 bg-teal-50 text-teal-700'
                        : 'border-gray-200 text-gray-600 hover:border-teal-300'
                    }`}
                  >
                    {a.toLocaleString('fr-FR')}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Autre montant</label>
                <input
                  type="number"
                  min="100"
                  value={customAmount}
                  onChange={e => { setCustomAmount(e.target.value); setAmount(''); }}
                  placeholder="Ex: 15000"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Method */}
            <div>
              <h3 className="font-bold text-teal-800 mb-4">Mode de paiement</h3>
              <div className="grid grid-cols-3 gap-3">
                {methods.map(({ id, label, icon, color }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setMethod(id)}
                    className={`p-3 rounded-xl border-2 text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
                      method === id ? color : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Donor */}
            <div>
              <h3 className="font-bold text-teal-800 mb-4">Vos informations (optionnel)</h3>
              <div className="space-y-3">
                <input
                  value={donor.name}
                  onChange={e => setDonor(d => ({ ...d, name: e.target.value }))}
                  placeholder="Nom complet"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <input
                  type="email"
                  value={donor.email}
                  onChange={e => setDonor(d => ({ ...d, email: e.target.value }))}
                  placeholder="Adresse e-mail"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Summary */}
            {finalAmount > 0 && (
              <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Montant</span>
                  <span className="font-bold text-teal-800">{finalAmount.toLocaleString('fr-FR')} XOF</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Mode</span>
                  <span className="font-medium text-teal-700">{method}</span>
                </div>
              </div>
            )}

            {status === 'error' && (
              <p className="text-red-500 text-sm">Une erreur est survenue. Veuillez réessayer.</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading' || !finalAmount || finalAmount <= 0}
              className="btn-primary w-full justify-center text-base py-4"
            >
              <Heart size={18} />
              {status === 'loading' ? 'Traitement...' : 'Confirmer le don'}
            </button>

            <p className="text-xs text-gray-400 text-center">
              Votre don contribue directement aux activités de la Zone Baptiste Agapé. Que Dieu vous bénisse.
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
