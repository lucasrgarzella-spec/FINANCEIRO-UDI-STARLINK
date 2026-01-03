
# 🚀 Starlink Stock Pro (UDI Starlink Controle)

O **Starlink Stock Pro** é um aplicativo mobile-first de gestão comercial de alta performance, desenvolvido especificamente para revendedores e instaladores de equipamentos Starlink. Ele permite o controle rigoroso de estoque, registro de vendas com cálculo de lucro líquido e gestão de evidências por fotos.

## 📱 Funcionalidades Principais

- **🔐 Autenticação Segura**: Suporte a Login tradicional e Social (Google).
- **📦 Gestão de Estoque Inteligente**:
    - Cadastro de produtos com fotos reais.
    - Categorização (Antenas, Cabos, Acessórios).
    - Alerta visual de estoque baixo.
    - Histórico detalhado de entradas e reposições.
- **💰 Controle de Vendas & Lucratividade**:
    - Registro de vendas com baixa automática no estoque.
    - Cálculo automático de lucro líquido (considerando preço de custo e fretes).
    - Anexação de fotos de comprovantes ou produtos entregues.
- **📊 Dashboard Financeiro**:
    - Visão de faturamento realizado vs. potencial.
    - Gráficos de volume de vendas por item.
    - Indicadores de saúde financeira e margem de contribuição.
- **📸 Suporte Multi-mídia**: Captura de fotos diretamente da câmera ou galeria do dispositivo.
- **💾 Persistência Local**: Todos os dados são salvos localmente no dispositivo via LocalStorage.

## 🛠️ Tecnologias Utilizadas

- **React 19**: Biblioteca para construção da interface.
- **Tailwind CSS**: Estilização moderna e responsiva.
- **Lucide React**: Biblioteca de ícones profissionais.
- **Recharts**: Visualização de dados e gráficos financeiros.
- **TypeScript**: Garantia de tipagem e segurança de código.

## 🚀 Como Executar

Este projeto utiliza módulos ES6 nativos e importmaps, dispensando a necessidade de um processo de build complexo para desenvolvimento inicial.

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/starlink-stock-pro.git
   ```
2. Abra o arquivo `index.html` em qualquer navegador moderno ou utilize uma extensão como "Live Server" no VS Code.

## 📂 Estrutura de Arquivos

- `index.html`: Ponto de entrada e configuração do Tailwind/Importmaps.
- `App.tsx`: Componente principal e orquestrador de estado/rotas.
- `types.ts`: Definições de interfaces e tipos do sistema.
- `components/`: Componentes modulares da interface (Dashboard, Inventory, etc).
- `constants.tsx`: Configurações globais, ícones e listas estáticas.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---
Desenvolvido com foco em UX e Performance por um Especialista em Gestão Comercial.
