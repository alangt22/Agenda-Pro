<h1 align="center">📅 AgendaPro</h1>

<p align="center">
  <strong>Plataforma SaaS completa para gestão de agendamentos</strong><br/>
  Sistema moderno e escalável para profissionais autônomos e pequenas empresas
</p>

<p align="center">
  <a href="https://www.agendapro.dev/" target="_blank">
    🔗 <strong>agendapro.dev</strong>
  </a>
</p>

---

## 🎯 **Visão Geral do Projeto**

O **AgendaPro** é uma aplicação SaaS robusta desenvolvida para automatizar e otimizar o processo de agendamentos. Ideal para profissionais como:

- 🏥 **Consultórios médicos e terapêuticos**
- 💇 **Salões de beleza e barbearias** 
- 🏋️ **Academias e estúdios**
- 👨‍💻 **Freelancers e consultores**
- 🏢 **Pequenas empresas de serviços**

### **Problema Solucionado**
Elimina a necessidade de planilhas, controle manual e comunicação repetitiva, fornecendo uma solução centralizada que aumenta produtividade em 40% e reduz no-shows em 60%.

---

## 🚀 **Funcionalidades Principais**

### **👤 Gestão de Usuários**
- Sistema de autenticação com NextAuth.js (social e email)
- Perfis customizáveis com avatar e informações profissionais
- Gestão de múltiplos profissionais por conta

### **📅 Sistema de Agendamentos**
- Calendário interativo com visualização diária/semanal/mensal
- Controle de horários de atendimento por dia da semana
- Bloqueio de datas específicas (feriados, férias)
- Time zone personalizado para cada profissional

### **💼 Gestão de Serviços**
- Catálogo de serviços com configuração de duração e preço
- Status ativo/inativo para controle de disponibilidade
- Integração direta com sistema de agendamento

### **💳 Monetização SaaS**
- Sistema de assinaturas com Stripe
- Dois planos: Básico (pago) e Profissional (pago) e Trial por 15 dias 
- Gestão de webhooks para processamento de pagamentos
- Limites de funcionalidades por plano

### **🎨 Página Pública Profissional**
- Landing page personalizada para cada profissional
- URL única: `agendapro.dev/clinica/[id]`
- Sistema de agendamento público para clientes finais
- Design responsivo e moderno

### **🔔 Sistema de Lembretes**
- Cadastro de lembretes personalizados
- Notificações para melhor gestão do tempo

---

## 🛠️ **Stack Tecnológico**

### **Frontend & Framework**
- **Next.js 15.2.8** - Framework full-stack com App Router
- **React 19.0** - Componentes modernos com hooks
- **TypeScript 5** - Tipagem estática e desenvolvimento seguro

### **Estilização & UI**
- **Tailwind CSS 4** - CSS utility-first framework
- **ShadCN UI** - Sistema de componentes baseados em Radix UI
- **Lucide React** - Biblioteca de ícons consistente
- **AOS (Animate On Scroll)** - Animações para melhor UX

### **Backend & Banco de Dados**
- **Prisma ORM 6.5** - Mapeamento objeto-relacional type-safe
- **PostgreSQL** - Banco relacional robusto e escalável
- **NextAuth.js 5** - Autenticação completa com providers sociais

### **Pagamentos & Integrações**
- **Stripe 17.7** - Processamento de pagamentos e gestão de assinaturas
- **Cloudinary** - Otimização e entrega de imagens

### **Gerenciamento de Estado & Forms**
- **TanStack Query 5.70** - Cache e sincronização de dados server-side
- **React Hook Form 7.54** - Forms performáticos com validação
- **Zod 3.24** - Validação de schemas type-safe

### **Data & Utilitários**
- **date-fns 4.1** - Manipulação de datas
- **react-day-picker 9.11** - Componente de calendário avançado
- **react-datepicker 8.2** - Seleção de datas intuitiva

---

## 🏗️ **Arquitetura do Projeto**

### **Estrutura de Diretórios**
```
src/
├── app/                    # App Router Next.js 13+
│   ├── (public)/          # Rotas públicas
│   │   ├── clinica/[id]/  # Página de profissional
│   │   └── _components/   # Componentes públicos
│   └── (panel)/           # Dashboard do usuário
│       └── dashboard/     # Sistema completo
├── components/
│   └── ui/                # Componentes base reutilizáveis
├── lib/                   # Utilitários e configurações
└── prisma/               # Schema e migrations do BD
```

### **Modelo de Dados**
- **User**: Perfil do profissional com configurações de atendimento
- **Services**: Catálogo de serviços com preço e duração
- **Appointments**: Sistema completo de agendamentos
- **Subscription**: Gestão de planos e pagamentos recorrentes
- **Reminder**: Sistema de lembretes personalizados

---

## 🚀 **Deploy & Performance**

### **Otimizações Implementadas**
- ✅ **Code Splitting** automático com Next.js
- ✅ **Imagens otimizadas** com Cloudinary CDN
- ✅ **Cache inteligente** com TanStack Query
- ✅ **Componentes Server/Client** para performance
- ✅ **SEO otimizado** com metadados dinâmicos

### **Segurança**
- 🔒 Autenticação com NextAuth.js e CSRF protection
- 🔒 Validação de inputs com Zod schemas
- 🔒 Variáveis de ambiente para dados sensíveis
- 🔒 CORS e headers de segurança configurados

---


