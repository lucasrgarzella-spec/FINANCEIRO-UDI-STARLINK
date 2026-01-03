
import React, { useState, useMemo } from 'react';
import { Product, Sale } from '../types';
import { PAYMENT_METHODS, ICONS } from '../constants';

interface SaleFormProps {
  products: Product[];
  onClose: () => void;
  onSave: (sale: Sale) => void;
}

const SaleForm: React.FC<SaleFormProps> = ({ products, onClose, onSave }) => {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [soldPrice, setSoldPrice] = useState(0);
  const [shippingCost, setShippingCost] = useState(0); 
  const [paymentMethod, setPaymentMethod] = useState('Pix');
  const [customerName, setCustomerName] = useState('');
  const [proofPhoto, setProofPhoto] = useState<string | undefined>();

  const selectedProduct = useMemo(() => products.find(p => p.id === productId), [products, productId]);

  React.useEffect(() => {
    if (selectedProduct) setSoldPrice(selectedProduct.sellPrice);
  }, [selectedProduct]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProofPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    if (quantity > selectedProduct.stock) {
      alert(`Erro: Estoque insuficiente! (Disponível: ${selectedProduct.stock})`);
      return;
    }
    const total = soldPrice * quantity;
    const profit = total - (selectedProduct.purchasePrice * quantity) - shippingCost;

    onSave({
      id: Date.now().toString(),
      productId,
      productName: selectedProduct.name,
      quantity,
      soldPrice,
      shippingCost,
      total,
      profit,
      paymentMethod,
      customerName,
      date: new Date().toISOString(),
      proofPhoto
    });
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[70] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-[3rem] w-full max-w-lg overflow-hidden flex flex-col shadow-2xl animate-scaleIn">
        <div className="p-8 border-b border-slate-800 bg-emerald-600 text-white flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight">Nova Venda</h3>
            <p className="text-[10px] font-black uppercase opacity-60 tracking-widest mt-1">Baixa automática no estoque</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-black/10 rounded-full transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 flex-1 overflow-y-auto max-h-[75vh]">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Equipamento</label>
            <select required className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all" value={productId} onChange={e => setProductId(e.target.value)}>
              <option value="">Selecione...</option>
              {products.map(p => <option key={p.id} value={p.id} disabled={p.stock <= 0}>{p.name} ({p.stock} un.)</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Qtd</label>
              <input type="number" min="1" required className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500" value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 1)} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Preço Venda</label>
              <input type="number" step="0.01" required className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500" value={soldPrice} onChange={e => setSoldPrice(parseFloat(e.target.value) || 0)} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Frete / Despesas (Reduz lucro)</label>
            <input type="number" step="0.01" className="w-full p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 outline-none focus:ring-2 focus:ring-rose-500" value={shippingCost} onChange={e => setShippingCost(parseFloat(e.target.value) || 0)} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Pagamento / Cliente</label>
            <div className="flex gap-4">
              <select className="flex-1 p-4 bg-slate-800 border border-slate-700 rounded-2xl text-white outline-none" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <input className="flex-1 p-4 bg-slate-800 border border-slate-700 rounded-2xl text-white outline-none" placeholder="Nome Cliente" value={customerName} onChange={e => setCustomerName(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Anexar Comprovante / Foto Entrega</label>
            <label className="w-full p-4 border-2 border-dashed border-slate-800 rounded-2xl flex items-center justify-center gap-3 text-slate-500 hover:text-white hover:border-slate-500 cursor-pointer bg-slate-800/30 transition-all">
              {ICONS.Camera}
              <span className="text-xs font-black uppercase">{proofPhoto ? 'Imagem Ok' : 'Tirar Foto'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>

          <div className="bg-black/40 p-6 rounded-[2rem] border border-slate-800 space-y-3 shadow-inner">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Bruto Cliente</span>
              <span className="text-xl font-black text-white">R$ {(soldPrice * quantity).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Lucro Líquido Real</span>
              <span className="text-2xl font-black text-emerald-400">R$ {selectedProduct ? ((soldPrice - selectedProduct.purchasePrice) * quantity - shippingCost).toLocaleString() : '0'}</span>
            </div>
          </div>

          <button type="submit" className="w-full py-5 bg-white text-slate-900 font-black uppercase tracking-widest rounded-2xl shadow-2xl hover:bg-slate-200 transition-all active:scale-[0.98]">Confirmar Transação</button>
        </form>
      </div>
    </div>
  );
};

export default SaleForm;
