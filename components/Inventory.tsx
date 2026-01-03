
import React, { useState } from 'react';
import { Product, StockLog, Category } from '../types';
import { ICONS, CATEGORIES } from '../constants';
import ProductForm from './ProductForm';
import StockLogForm from './StockLogForm';

interface InventoryProps {
  products: Product[];
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  addStockLog: (l: StockLog) => void;
}

const Inventory: React.FC<InventoryProps> = ({ products, addProduct, updateProduct, deleteProduct, addStockLog }) => {
  const [showProductForm, setShowProductForm] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [showStockForm, setShowStockForm] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Todos'>('Todos');

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white">Inventário</h2>
          <p className="text-slate-400 text-sm">Controle de equipamentos</p>
        </div>
        <button 
          onClick={() => { setProductToEdit(null); setShowProductForm(true); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg hover:bg-indigo-500 transition-all font-bold"
        >
          {ICONS.Add}
          <span>Novo</span>
        </button>
      </header>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
          <input 
            type="text" 
            placeholder="Nome ou SKU..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white placeholder:text-slate-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as any)}
        >
          <option value="Todos">Categorias</option>
          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map(product => {
          const profitMargin = product.purchasePrice > 0 ? ((product.sellPrice - product.purchasePrice) / product.purchasePrice) * 100 : 0;
          return (
            <div key={product.id} className="bg-slate-900 rounded-[2rem] border border-slate-800 overflow-hidden shadow-xl hover:border-slate-700 transition-all group">
              <div className="h-44 bg-slate-800 relative overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-700">
                    <Package size={48} />
                  </div>
                )}
                <div className="absolute top-4 left-4 right-4 flex justify-between">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                    product.stock < 5 ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40' : 'bg-indigo-600 text-white'
                  }`}>
                    {product.stock} Unid.
                  </span>
                  <span className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[9px] font-bold text-white uppercase tracking-widest">
                    {product.category}
                  </span>
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-white text-lg truncate flex-1 pr-2">{product.name}</h4>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">+{profitMargin.toFixed(0)}%</span>
                </div>
                <p className="text-[10px] text-slate-500 mb-4 font-mono">SKU: {product.sku}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="bg-slate-800/50 p-2 rounded-xl">
                    <p className="text-[9px] text-slate-500 uppercase font-black">Preço Venda</p>
                    <p className="text-lg font-black text-white">R$ {product.sellPrice.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-800/50 p-2 rounded-xl">
                    <p className="text-[9px] text-slate-500 uppercase font-black">Custo</p>
                    <p className="text-lg font-black text-slate-400">R$ {product.purchasePrice.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowStockForm(product)}
                    className="flex-1 py-3 bg-white text-slate-900 font-black text-[10px] uppercase rounded-xl hover:bg-slate-200 transition-all"
                  >
                    Entrada
                  </button>
                  <button 
                    onClick={() => setProductToEdit(product)}
                    className="p-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-all"
                  >
                    {ICONS.Edit}
                  </button>
                  <button 
                    onClick={() => deleteProduct(product.id)}
                    className="p-3 text-rose-500 bg-rose-500/10 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                  >
                    {ICONS.Delete}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {(showProductForm || productToEdit) && (
        <ProductForm 
          initialProduct={productToEdit || undefined}
          onClose={() => { setShowProductForm(false); setProductToEdit(null); }} 
          onSave={(p) => { productToEdit ? updateProduct(p) : addProduct(p); setShowProductForm(false); setProductToEdit(null); }} 
        />
      )}

      {showStockForm && (
        <StockLogForm 
          product={showStockForm}
          onClose={() => setShowStockForm(null)}
          onSave={(log) => { addStockLog(log); setShowStockForm(null); }}
        />
      )}
    </div>
  );
};

const Package: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
  </svg>
);

export default Inventory;
