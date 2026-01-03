
import React, { useState } from 'react';
import { Product, Sale } from '../types';
import { ICONS } from '../constants';
import SaleForm from './SaleForm';

interface SalesProps {
  products: Product[];
  sales: Sale[];
  addSale: (s: Sale) => void;
}

const Sales: React.FC<SalesProps> = ({ products, sales, addSale }) => {
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSales = sales.filter(s => 
    s.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white">Vendas</h2>
          <p className="text-slate-400 text-sm">Registro de faturamento</p>
        </div>
        <button 
          onClick={() => setShowSaleForm(true)}
          className="bg-emerald-600 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-xl shadow-emerald-900/20 hover:bg-emerald-500 transition-all font-bold"
        >
          {ICONS.Add}
          <span>Vender</span>
        </button>
      </header>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
        <input 
          type="text" 
          placeholder="Produto ou Cliente..." 
          className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-[1.5rem] focus:ring-2 focus:ring-emerald-500 outline-none text-white placeholder:text-slate-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredSales.map(sale => (
          <div key={sale.id} className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-5 group">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-700 shadow-inner group-hover:border-slate-500 transition-colors">
                {sale.proofPhoto ? (
                  <img src={sale.proofPhoto} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-slate-600 text-2xl">🧾</span>
                )}
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">{sale.productName}</h4>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                  {new Date(sale.date).toLocaleDateString('pt-BR')} • {sale.customerName || 'Venda Balcão'}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full font-black border border-indigo-500/20">{sale.paymentMethod}</span>
                  <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-black border border-slate-700">{sale.quantity}x Unid.</span>
                  {sale.shippingCost > 0 && (
                    <span className="text-[9px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded-full font-black border border-rose-500/20">Frete: R$ {sale.shippingCost.toLocaleString()}</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t border-slate-800 sm:border-t-0 pt-4 sm:pt-0 gap-2">
              <div className="text-right">
                <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Recebido</p>
                <p className="text-lg font-black text-white">R$ {sale.total.toLocaleString()}</p>
              </div>
              <div className="text-right bg-emerald-500/5 px-3 py-1 rounded-xl border border-emerald-500/10">
                <p className="text-[9px] text-emerald-500/70 uppercase font-black tracking-widest">Lucro</p>
                <p className="text-md font-black text-emerald-400">R$ {sale.profit.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}

        {filteredSales.length === 0 && (
          <div className="text-center py-20 bg-slate-900 rounded-[2rem] border border-dashed border-slate-800">
            <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">Nenhum registro</p>
          </div>
        )}
      </div>

      {showSaleForm && (
        <SaleForm 
          products={products}
          onClose={() => setShowSaleForm(false)}
          onSave={(sale) => { addSale(sale); setShowSaleForm(false); }}
        />
      )}
    </div>
  );
};

export default Sales;
