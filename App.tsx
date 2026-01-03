import React, { useState, useEffect } from 'react';
import { Product, Sale, StockLog } from './types';
import { ICONS } from './constants';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Sales from './components/Sales';
import HistoryLogs from './components/HistoryLogs';

type View = 'dashboard' | 'inventory' | 'sales' | 'logs';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [stockLogs, setStockLogs] = useState<StockLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar dados do LocalStorage ao iniciar
  useEffect(() => {
    const savedProducts = localStorage.getItem('starlink_products');
    const savedSales = localStorage.getItem('starlink_sales');
    const savedLogs = localStorage.getItem('starlink_logs');

    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedSales) setSales(JSON.parse(savedSales));
    if (savedLogs) setStockLogs(JSON.parse(savedLogs));
    
    setLoading(false);
  }, []);

  // Salvar dados no LocalStorage sempre que houver mudanças
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('starlink_products', JSON.stringify(products));
      localStorage.setItem('starlink_sales', JSON.stringify(sales));
      localStorage.setItem('starlink_logs', JSON.stringify(stockLogs));
    }
  }, [products, sales, stockLogs, loading]);

  const addProduct = (product: Product) => {
    const newProduct = { ...product, id: Date.now().toString() };
    setProducts(prev => [...prev, newProduct]);
    
    if (product.stock > 0) {
      addStockLog({
        id: Date.now().toString() + '_log',
        productId: newProduct.id,
        productName: product.name,
        quantity: product.stock,
        unitValue: product.purchasePrice,
        date: new Date().toISOString(),
      });
    }
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (id: string) => {
    if (window.confirm('Deseja realmente excluir este produto?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
      // Opcional: manter histórico de vendas mesmo sem produto ou remover logs órfãos
    }
  };

  const addSale = (sale: Sale) => {
    const newSale = { ...sale, id: Date.now().toString(), date: new Date().toISOString() };
    setSales(prev => [newSale, ...prev]);
    
    // Atualizar estoque localmente
    setProducts(prev => prev.map(p => {
      if (p.id === sale.productId) {
        return { ...p, stock: p.stock - sale.quantity };
      }
      return p;
    }));
  };

  const addStockLog = (log: StockLog) => {
    const newLog = { ...log, id: Date.now().toString(), date: new Date().toISOString() };
    setStockLogs(prev => [newLog, ...prev]);
    
    // Se for uma entrada manual vinda do form de entrada
    if (!log.id || log.id === '') { 
       setProducts(prev => prev.map(p => {
         if (p.id === log.productId) {
           return { ...p, stock: p.stock + log.quantity };
         }
         return p;
       }));
    }
  };

  if (loading) return (
    <div className="h-screen w-screen bg-slate-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-950 text-slate-100">
      <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 p-4 shadow-lg flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg shadow-indigo-500/20 shadow-lg">
             <div className="text-white text-[10px] font-black px-1">OFFLINE</div>
          </div>
          <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Starlink Stock Pro</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">Status</p>
             <p className="text-xs font-bold text-emerald-400 flex items-center gap-1">
               <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
               Local Ativo
             </p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 md:pb-6 scroll-smooth">
        <div className="max-w-5xl mx-auto p-4 md:p-6">
          {activeView === 'dashboard' && <Dashboard products={products} sales={sales} stockLogs={stockLogs} />}
          {activeView === 'inventory' && (
            <Inventory 
              products={products} 
              addProduct={addProduct} 
              updateProduct={updateProduct}
              deleteProduct={deleteProduct}
              addStockLog={addStockLog}
            />
          )}
          {activeView === 'sales' && <Sales products={products} sales={sales} addSale={addSale} />}
          {activeView === 'logs' && <HistoryLogs logs={stockLogs} />}
        </div>
      </main>

      <nav className="fixed bottom-4 left-4 right-4 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl flex justify-around p-2 z-20 shadow-2xl">
        <NavButton active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} icon={ICONS.Dashboard} label="Painel" />
        <NavButton active={activeView === 'inventory'} onClick={() => setActiveView('inventory')} icon={ICONS.Inventory} label="Estoque" />
        <NavButton active={activeView === 'sales'} onClick={() => setActiveView('sales')} icon={ICONS.Sales} label="Vendas" />
        <NavButton active={activeView === 'logs'} onClick={() => setActiveView('logs')} icon={ICONS.Logs} label="Histórico" />
      </nav>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center transition-all duration-300 px-4 py-2 rounded-2xl ${
      active 
        ? 'text-indigo-400 bg-indigo-500/10 scale-105' 
        : 'text-slate-500 hover:text-slate-300'
    }`}
  >
    {icon}
    <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">{label}</span>
  </button>
);

export default App;