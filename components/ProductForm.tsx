
import React, { useState, useEffect } from 'react';
import { Product, Category } from '../types';
import { CATEGORIES, ICONS } from '../constants';

interface ProductFormProps {
  onClose: () => void;
  onSave: (product: Product) => void;
  initialProduct?: Product;
}

const ProductForm: React.FC<ProductFormProps> = ({ onClose, onSave, initialProduct }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Antena' as Category,
    sku: '',
    purchasePrice: 0,
    sellPrice: 0,
    stock: 0,
    supplier: '',
  });
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (initialProduct) {
      setFormData({
        name: initialProduct.name,
        category: initialProduct.category,
        sku: initialProduct.sku,
        purchasePrice: initialProduct.purchasePrice,
        sellPrice: initialProduct.sellPrice,
        stock: initialProduct.stock,
        supplier: initialProduct.supplier || '',
      });
      setImages(initialProduct.images || []);
    }
  }, [initialProduct]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => setImages(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: initialProduct ? initialProduct.id : Date.now().toString(),
      entryDate: initialProduct ? initialProduct.entryDate : new Date().toISOString(),
      images
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[60] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-scaleIn">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h3 className="text-xl font-black text-white uppercase tracking-tight">
            {initialProduct ? 'Editar Equipamento' : 'Novo Equipamento'}
          </h3>
          <button onClick={onClose} className="p-2 text-slate-500 hover:bg-slate-800 rounded-full transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Galeria de Fotos</label>
            <div className="flex flex-wrap gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-800 group">
                  <img src={img} className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                    className="absolute inset-0 bg-rose-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  >
                    Excluir
                  </button>
                </div>
              ))}
              <label className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-600 hover:border-indigo-500 hover:text-indigo-500 cursor-pointer transition-all bg-slate-800/30">
                {ICONS.Camera}
                <span className="text-[9px] font-black mt-1 uppercase">Add Foto</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Descrição</label>
              <input required className="w-full p-4 bg-slate-800/50 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-white transition-all" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Categoria</label>
              <select className="w-full p-4 bg-slate-800/50 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-white" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value as Category })}>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">SKU / Serial</label>
              <input required className="w-full p-4 bg-slate-800/50 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-white font-mono" value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Fornecedor</label>
              <input className="w-full p-4 bg-slate-800/50 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-white" value={formData.supplier} onChange={e => setFormData({ ...formData, supplier: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Custo Un. (R$)</label>
              <input type="number" step="0.01" required className="w-full p-4 bg-slate-800/50 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-white" value={formData.purchasePrice} onChange={e => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) || 0 })} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Venda Sugerida (R$)</label>
              <input type="number" step="0.01" required className="w-full p-4 bg-slate-800/50 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-white" value={formData.sellPrice} onChange={e => setFormData({ ...formData, sellPrice: parseFloat(e.target.value) || 0 })} />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 text-slate-500 font-black uppercase tracking-widest hover:text-white transition-colors">Voltar</button>
            <button type="submit" className="flex-[2] py-4 bg-white text-slate-900 font-black uppercase tracking-widest rounded-2xl shadow-xl hover:bg-slate-200 transition-all active:scale-95">Gravar Dados</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
