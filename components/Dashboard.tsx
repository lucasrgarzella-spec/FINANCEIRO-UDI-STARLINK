import React from 'react';
import { Product, Sale, StockLog } from '../types';
import { ICONS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  products: Product[];
  sales: Sale[];
  stockLogs: StockLog[];
}

const Dashboard: React.FC<DashboardProps> = ({ products, sales, stockLogs }) => {
  const currentInventoryValue = products.reduce((acc, p) => acc + (p.purchasePrice * p.stock), 0);
  const potentialRevenue = products.reduce((acc, p) => acc + (p.sellPrice * p.stock), 0);
  const potentialRemainingProfit = products.reduce((acc, p) => acc + ((p.sellPrice - p.purchasePrice) * p.stock), 0);
  const totalHistoricalInvestment = stockLogs.reduce((acc, log) => acc + (log.unitValue * log.quantity), 0);

  const totalSold = sales.reduce((acc, s) => acc + s.total, 0);
  const totalProfit = sales.reduce((acc, s) => acc + s.profit, 0);
  const totalShipping = sales.reduce((acc, s) => acc + (s.shippingCost || 0), 0);
  const lowStockProducts = products.filter(p => p.stock < 5);

  const salesByProduct = products.map(p => {
    const productSales = sales.filter(s => s.productId === p.id);
    const totalQuantity = productSales.reduce((acc, s) => acc + s.quantity, 0);
    return { name: p.name, value: totalQuantity };
  }).filter(item => item.value > 0).sort((a, b) => b.value - a.value).slice(0, 5);

  const exportToCSV = (data: any[], fileName: string, headers: string[]) => {
    // Usamos o BOM \uFEFF para que o Excel reconheça como UTF-8
    const BOM = '\uFEFF';
    const csvContent = [
      headers.join(';'),
      ...data.map(row => 
        Object.values(row)
          .map(value => {
            if (value === null || value === undefined) return '';
            const str = String(value);
            // Escapar ponto e vírgula e aspas
            return `"${str.replace(/"/g, '""')}"`;
          })
          .join(';')
      )
    ].join('\n');

    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportProducts = () => {
    const headers = ['ID', 'Nome', 'Categoria', 'SKU', 'Custo (R$)', 'Venda (R$)', 'Estoque', 'Fornecedor', 'Data Cadastro'];
    const data = products.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      sku: p.sku,
      cost: p.purchasePrice.toFixed(2),
      sell: p.sellPrice.toFixed(2),
      stock: p.stock,
      supplier: p.supplier || '',
      date: new Date(p.entryDate).toLocaleDateString('pt-BR')
    }));
    exportToCSV(data, 'estoque_starlink', headers);
  };

  const handleExportSales = () => {
    const headers = ['Data', 'Produto', 'Qtd', 'Preço Unit.', 'Frete', 'Total Bruto', 'Lucro Líquido', 'Pagamento', 'Cliente'];
    const data = sales.map(s => ({
      date: new Date(s.date).toLocaleDateString('pt-BR'),
      product: s.productName,
      qty: s.quantity,
      unit: s.soldPrice.toFixed(2),
      shipping: s.shippingCost.toFixed(2),
      total: s.total.toFixed(2),
      profit: s.profit.toFixed(2),
      method: s.paymentMethod,
      customer: s.customerName || 'N/A'
    }));
    exportToCSV(data, 'vendas_starlink', headers);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Painel Financeiro</h2>
          <p className="text-slate-400 text-sm">Controle de faturamento e ativos</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportProducts}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-slate-700 shadow-lg"
          >
            {ICONS.Download}
            Exportar Estoque
          </button>
          <button 
            onClick={handleExportSales}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-slate-700 shadow-lg"
          >
            {ICONS.Download}
            Exportar Vendas
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard title="Vendas Realizadas" value={`R$ ${totalSold.toLocaleString()}`} color="text-white" description="Bruto recebido" />
        <StatCard title="Lucro Líquido" value={`R$ ${totalProfit.toLocaleString()}`} color="text-emerald-400" description="Após custos e fretes" />
        <StatCard title="Estimativa de Venda" value={`R$ ${potentialRevenue.toLocaleString()}`} color="text-indigo-400" description="Valor total do estoque" />
        <StatCard title="Ativos em Estoque" value={`R$ ${currentInventoryValue.toLocaleString()}`} color="text-blue-400" description="Custo imobilizado" />
        <StatCard title="Margem Pendente" value={`R$ ${potentialRemainingProfit.toLocaleString()}`} color="text-emerald-500" description="Lucro a realizar" />
        <StatCard title="Despesas Frete" value={`- R$ ${totalShipping.toLocaleString()}`} color="text-rose-500" description="Custos logísticos" />
      </div>

      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
          📊 Performance de Produtos
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] uppercase text-slate-500 font-bold">
                <th className="pb-3">Produto</th>
                <th className="pb-3 text-center">Estoque</th>
                <th className="pb-3 text-center">Faturamento</th>
                <th className="pb-3 text-right">Margem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {products.map(p => {
                const margin = p.purchasePrice > 0 ? ((p.sellPrice - p.purchasePrice) / p.purchasePrice) * 100 : 0;
                return (
                  <tr key={p.id} className="text-sm">
                    <td className="py-4">
                      <p className="font-bold text-slate-200">{p.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{p.sku}</p>
                    </td>
                    <td className="py-4 text-center">
                      <span className={`font-bold ${p.stock < 5 ? 'text-rose-400' : 'text-slate-300'}`}>{p.stock}</span>
                    </td>
                    <td className="py-4 text-center text-slate-400 font-medium">R$ {(p.sellPrice * p.stock).toLocaleString()}</td>
                    <td className="py-4 text-right">
                      <span className="text-[10px] font-bold px-2 py-1 bg-slate-800 rounded-lg text-emerald-400">{margin.toFixed(0)}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <h3 className="text-lg font-bold mb-4 text-white">Vendas por Item</h3>
          <div className="h-64">
            {salesByProduct.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesByProduct}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} fontSize={10} tick={{fill: '#64748b'}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', color: '#fff' }}
                    itemStyle={{ color: '#818cf8' }}
                  />
                  <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-600 italic">Sem dados de vendas</div>
            )}
          </div>
        </div>
        <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/20 p-6 rounded-3xl flex flex-col justify-center">
            <h3 className="text-xl font-black text-white mb-2">Resumo Operacional</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Total Investido Histórico</span>
                <span className="text-white font-mono">R$ {totalHistoricalInvestment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Itens Críticos</span>
                <span className="text-rose-400 font-bold">{lowStockProducts.length}</span>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string; color: string; description?: string }> = ({ title, value, color, description }) => (
  <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl shadow-sm">
    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{title}</p>
    <p className={`text-xl font-black ${color} tracking-tight`}>{value}</p>
    {description && <p className="text-[9px] text-slate-500 font-bold mt-2 uppercase tracking-tighter">{description}</p>}
  </div>
);

export default Dashboard;