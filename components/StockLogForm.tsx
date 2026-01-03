import React, { useState } from 'react';
import { Product, StockLog } from '../types';
import { ICONS } from '../constants';

interface StockLogFormProps {
  product: Product;
  onClose: () => void;
  onSave: (log: StockLog) => void;
}

const StockLogForm: React.FC<StockLogFormProps> = ({ product, onClose, onSave }) => {
  const [quantity, setQuantity] = useState(1);
  const [unitValue, setUnitValue] = useState(product.purchasePrice);
  const [photo, setPhoto] = useState<string | undefined>();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: StockLog = {
      id: '', // Identificador para indicar nova entrada manual no App.tsx
      productId: product.id,
      productName: product.name,
      quantity,
      unitValue,
      photo,
      date: new Date().toISOString()
    };
    onSave(newLog);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[70] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-md overflow-hidden flex flex-col shadow-2xl animate-scaleIn">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-indigo-600 text-white">
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight">Entrada de Estoque</h3>
            <p className="text-[10px] text-white/70 uppercase font-black tracking-widest">{product.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/10 rounded-full transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Qtd Recebida</label>
              <input 
                type="number"
                min="1"
                required
                className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white transition-all"
                value={quantity}
                onChange={e => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Custo Unit. (R$)</label>
              <input 
                type="number"
                step="0.01"
                required
                className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white transition-all"
                value={unitValue}
                onChange={e => setUnitValue(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Foto do Lote/NF (Opcional)</label>
            <div className="flex items-center gap-4">
              {photo && (
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-700 shadow-lg">
                  <img src={photo} className="w-full h-full object-cover" />
                </div>
              )}
              <label className="flex-1 p-4 border-2 border-dashed border-slate-800 rounded-2xl flex items-center justify-center gap-3 text-slate-500 hover:text-white hover:border-slate-500 cursor-pointer bg-slate-800/30 transition-all">
                {ICONS.Camera}
                <span className="text-[10px] font-black uppercase tracking-widest">{photo ? 'Substituir' : 'Anexar Foto'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          </div>

          <div className="bg-black/40 p-5 rounded-[2rem] border border-slate-800 flex justify-between items-center shadow-inner">
            <div>
              <p className="text-[9px] uppercase font-black text-slate-500 tracking-widest">Total Investido</p>
              <p className="text-2xl font-black text-white">R$ {(unitValue * quantity).toLocaleString()}</p>
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 text-slate-500 font-black uppercase tracking-widest hover:text-white transition-colors"
            >
              Voltar
            </button>
            <button 
              type="submit"
              className="flex-[2] py-4 bg-white text-slate-900 font-black uppercase tracking-widest rounded-2xl shadow-xl hover:bg-slate-200 transition-all active:scale-95"
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockLogForm;