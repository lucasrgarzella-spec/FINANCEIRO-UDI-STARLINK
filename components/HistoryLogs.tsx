import React from 'react';
import { StockLog } from '../types';

interface HistoryLogsProps {
  logs: StockLog[];
}

const HistoryLogs: React.FC<HistoryLogsProps> = ({ logs }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <header>
        <h2 className="text-2xl font-black text-white">Histórico de Entradas</h2>
        <p className="text-slate-400 text-sm">Registro de novos lotes e reposições</p>
      </header>

      <div className="space-y-4">
        {logs.map(log => (
          <div key={log.id} className="bg-slate-900 p-5 rounded-[2rem] border border-slate-800 shadow-xl flex items-center justify-between gap-5 group hover:border-slate-700 transition-all">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-700 shadow-inner group-hover:border-slate-500 transition-colors">
                {log.photo ? (
                  <img src={log.photo} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">📦</span>
                )}
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">{log.productName}</h4>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                  Recebido em: {new Date(log.date).toLocaleString('pt-BR')}
                </p>
                <div className="mt-2">
                  <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-lg font-black uppercase border border-indigo-500/20 tracking-tighter">
                    Entrada de {log.quantity} unidades
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Investimento</p>
              <p className="text-lg font-black text-white">R$ {(log.unitValue * log.quantity).toLocaleString()}</p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">Custo: R$ {log.unitValue.toLocaleString()}</p>
            </div>
          </div>
        ))}

        {logs.length === 0 && (
          <div className="text-center py-24 bg-slate-900/50 rounded-[2.5rem] border border-dashed border-slate-800">
            <div className="text-slate-700 mb-2">📭</div>
            <p className="text-slate-600 font-bold uppercase tracking-widest text-[10px]">Nenhum registro de entrada</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryLogs;