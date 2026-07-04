import { useEffect, useState } from 'react';
import {
  BookOpen, Calendar, Image, Users, Mail, MessageSquare, Heart,
  LogOut, Plus, Trash2, Check, X, Edit2, Save, ClipboardList
} from 'lucide-react';
import { api } from '@/../../src/lib/api';
import type { IActivity }  from '@/../../src2/models/Acttivity.model';

type Tab = 'activities' | 'news' | 'gallery' | 'members' | 'contacts' | 'subscribers' | 'registrations' | 'donations';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'activities', label: 'Activités', icon: <Calendar size={16} /> },
  { id: 'news', label: 'Actualités', icon: <BookOpen size={16} /> },
  { id: 'gallery', label: 'Galerie', icon: <Image size={16} /> },
  { id: 'members', label: 'Bureau', icon: <Users size={16} /> },
  { id: 'contacts', label: 'Messages', icon: <MessageSquare size={16} /> },
  { id: 'subscribers', label: 'Newsletter', icon: <Mail size={16} /> },
  { id: 'registrations', label: 'Inscriptions', icon: <ClipboardList size={16} /> },
  { id: 'donations', label: 'Dons', icon: <Heart size={16} /> },
];

const DEPTS: Department[] = ['Tous', 'Hommes', 'Femmes', 'Jeunesse', 'Enfants'];

function ConfirmDelete({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={onConfirm} className="text-red-500 hover:text-red-700 p-1"><Check size={14} /></button>
      <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 p-1"><X size={14} /></button>
    </div>
  );
}

// ─── Activities Tab ───────────────────────────────────────────────────────────

export function ActivitiesTab() {
  const [items, setItems] = useState<IActivity[]>([]);
  const [form, setForm] = useState<ActivityInsert>({ title: '', description: '', image_url: '', event_date: '', location: '', department: 'Tous', organizer: 'Zone' });
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    const data = await api.get('/activities');
    setItems(Array.isArray(data) ? data : []);
  };
  useEffect(() => { void load(); }, []);

  const save = async () => {
    if (editId) {
      await api.put(`/activities/${editId}`, { data: form });
    } else {
      await api.post('/activities', { data: form });
    }
    setEditing(false); setEditId(null);
    setForm({ title: '', description: '', image_url: '', event_date: '', location: '', department: 'Tous', organizer: 'Zone' });
    load();
  };

  const del = async (id: string) => {
    await api.delete(`/activities/${id}`);
    setDeleting(null); void load();
  };

  const startEdit = (a: IActivity) => {
    setForm({ title: a.title, description: a.description ?? '', image: a.image ?? '', date: a.date ?? '', location: a.location ?? '', departement: a.departement, organizer: a.organizer });
    setEditId(a.id); setEditing(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-teal-800 text-lg">Activités ({items.length})</h2>
        <button onClick={() => { setEditing(true); setEditId(null); }} className="btn-primary text-sm py-2">
          <Plus size={15} /> Ajouter
        </button>
      </div>

      {editing && (
        <div className="bg-teal-50 rounded-xl p-6 border border-teal-200 space-y-4">
          <h3 className="font-semibold text-teal-800">{editId ? 'Modifier' : 'Nouvelle activité'}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-600 font-medium mb-1 block">Titre *</label>
              <input className="input-field" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Titre de l'activité" />
            </div>
            <div>
              <label className="text-xs text-gray-600 font-medium mb-1 block">Date</label>
              <input type="date" className="input-field" value={form.event_date ?? ''} onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-gray-600 font-medium mb-1 block">Lieu</label>
              <input className="input-field" value={form.location ?? ''} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Lieu de l'événement" />
            </div>
            <div>
              <label className="text-xs text-gray-600 font-medium mb-1 block">Département</label>
              <select className="input-field" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value as Department }))}>
                {DEPTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600 font-medium mb-1 block">Organisateur</label>
              <select className="input-field" value={form.organizer} onChange={e => setForm(f => ({ ...f, organizer: e.target.value as 'Zone' | 'Église' }))}>
                <option>Zone</option><option>Église</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-600 font-medium mb-1 block">URL de l'image</label>
              <input className="input-field" value={form.image_url ?? ''} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://..." />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-600 font-medium mb-1 block">Description</label>
              <textarea rows={3} className="input-field resize-none" value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description de l'activité" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="btn-primary text-sm py-2"><Save size={14} /> Enregistrer</button>
            <button onClick={() => { setEditing(false); setEditId(null); }} className="btn-outline text-sm py-2">Annuler</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition">
            {item.image_url && <img src={item.image_url} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-800 truncate">{item.title}</p>
              <p className="text-xs text-gray-400">{item.event_date ?? '—'} · {item.department} · {item.organizer}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {deleting === item.id ? (
                <ConfirmDelete onConfirm={() => del(item.id)} onCancel={() => setDeleting(null)} />
              ) : (
                <>
                  <button onClick={() => startEdit(item)} className="p-1.5 text-gray-400 hover:text-teal-600"><Edit2 size={14} /></button>
                  <button onClick={() => setDeleting(item.id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
