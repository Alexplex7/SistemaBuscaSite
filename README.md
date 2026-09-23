# Sistema Busca Site

Uma plataforma web para identificação e qualificação de empresas com baixa presença digital, com foco na prospecção de negócios que ainda não possuem website.

## Sobre o Projeto

O Prospect Local foi idealizado para ajudar agências, freelancers, consultores e equipes comerciais a encontrar oportunidades de negócios utilizando dados públicos do OpenStreetMap através da Overpass API.

A plataforma realiza a busca de estabelecimentos comerciais, identifica empresas sem website e gera uma classificação baseada no potencial de contratação de serviços digitais.

---

## Objetivo

Automatizar a identificação de empresas com baixa maturidade digital, reduzindo o tempo gasto em pesquisas manuais e aumentando a eficiência da prospecção comercial.

---

## Principais Funcionalidades

### MVP

- Busca de empresas por cidade
- Identificação de empresas sem website
- Dashboard com indicadores
- Filtros por categoria
- Score de oportunidade

### Futuras Funcionalidades

- Consulta de dados via OpenStreetMap
- Descoberta automática de redes sociais
- Pipeline de vendas
- Geração automática de leads
- Integração com IA
- Automação de e-mails e WhatsApp
- Sistema de autenticação
---

## Como Funciona

### 1. Coleta de Dados

A plataforma consulta estabelecimentos comerciais utilizando a Overpass API.

### 2. Filtragem

As empresas são classificadas em:

- Com website
- Sem website

### 3. Validação

Em futuras versões, o sistema realizará verificações complementares para validar a presença digital.

### 4. Score

Cada empresa recebe uma pontuação baseada em critérios como:

- Possui website
- Possui telefone
- Possui redes sociais
- Informações de contato disponíveis

---

## Protótipo

O MVP atual consiste em um protótipo frontend navegável com:

### Dashboard

- Empresas analisadas
- Empresas sem website
- Score médio ficticio
- Cidades consultadas

### Busca

- Cidade
- Categoria
- Score mínimo

### Empresas

- Lista de empresas
- Status de website
- Score de oportunidade

### Detalhes

- Informações completas
- Redes sociais
- Motivos do score
---

## Arquitetura Planejada

### Frontend

- HTML
- CSS
- JavaScript

### Evolução futura

- React
- Next.js
- TypeScript
- Tailwind CSS

### Backend

- FastAPI (Python)

### Banco de Dados

- PostgreSQL

### Dados Geográficos

- OpenStreetMap
- Overpass API

### Hospedagem

- GitHub Pages (Protótipo)
- Vercel (Frontend)
- Supabase (Banco)
- Render (Backend)

---

## Público-Alvo

- Agências de Marketing
- Desenvolvedores Web
- Freelancers
- Consultores de Negócios
- Empresas de SEO
- Equipes Comerciais B2B

---

## Proposta de Valor

Transformar dados públicos em oportunidades comerciais qualificadas.

Com poucos cliques, o usuário consegue descobrir empresas que podem se beneficiar de soluções digitais e concentrar esforços nos leads com maior potencial de conversão.

---

## Autores

**Alexandre Lima**
**Eduardo Holanda**
**Vinicius Okston**

Projeto desenvolvido para estudo, validação de produto e prospecção comercial baseada em dados públicos.
