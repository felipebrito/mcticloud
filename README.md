# 🌤️ Nuvem de Palavras Interativa

Uma aplicação web interativa que permite aos usuários criar uma nuvem de palavras dinâmica com animações suaves e efeitos visuais.

## ✨ Características

- **30 palavras pré-definidas** para escolha
- **Drag & Drop** intuitivo para adicionar palavras à nuvem
- **Sistema de níveis** - palavras mais votadas ficam maiores e mais espessas
- **Animações fluidas** usando anime.js
- **Efeitos visuais** com partículas e transições
- **Interface responsiva** que funciona em desktop e mobile
- **Estatísticas em tempo real** da nuvem

## 🎮 Como Usar

1. **Escolha uma palavra** da lista de 30 palavras disponíveis
2. **Arraste a palavra** para a área da nuvem (ou clique nela)
3. **Observe a animação** de entrada da palavra
4. **Adicione a mesma palavra** várias vezes para vê-la crescer
5. **Clique em uma palavra** na nuvem para removê-la
6. **Use o botão "Reiniciar"** para limpar toda a nuvem

## 🎨 Funcionalidades

### Sistema de Níveis
- **Nível 1**: 1-2 votos (fonte pequena)
- **Nível 2**: 3-4 votos (fonte média)
- **Nível 3**: 5-6 votos (fonte grande)
- **Nível 4**: 7-8 votos (fonte extra grande)
- **Nível 5**: 9+ votos (fonte máxima)

### Animações
- **Entrada**: Efeito elástico com bounce
- **Atualização**: Escala pulsante quando incrementada
- **Saída**: Fade out com escala
- **Reorganização**: Movimento suave em espiral
- **Partículas**: Efeito de rastro do mouse na nuvem

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilos modernos com gradientes e animações
- **JavaScript ES6+** - Lógica da aplicação
- **Anime.js** - Biblioteca de animações
- **Drag & Drop API** - Funcionalidade de arrastar e soltar

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- Desktop (recomendado)
- Tablet
- Smartphone

## 🚀 Como Executar

1. Clone ou baixe os arquivos
2. Abra o arquivo `index.html` em um navegador moderno
3. Comece a usar!

## 📁 Estrutura de Arquivos

```
WCLOUD_2/
├── index.html      # Estrutura HTML principal
├── styles.css      # Estilos CSS com animações
├── script.js       # Lógica JavaScript da aplicação
└── README.md       # Este arquivo
```

## 🎯 Palavras Disponíveis

A aplicação inclui 30 palavras inspiradoras:
- Amor, Felicidade, Sucesso, Paz, Harmonia
- Criatividade, Inovação, Tecnologia, Natureza, Aventura
- Música, Arte, Ciência, Educação, Saúde
- Família, Amizade, Liberdade, Justiça, Igualdade
- Sustentabilidade, Crescimento, Transformação, Inspiração, Motivação
- Conhecimento, Sabedoria, Coragem, Determinação, Esperança

## 🔧 Personalização

Para personalizar a aplicação, você pode:

1. **Alterar as palavras** no array `this.words` no arquivo `script.js`
2. **Modificar cores** no arquivo `styles.css`
3. **Ajustar animações** alterando os parâmetros do anime.js
4. **Adicionar novas funcionalidades** expandindo a classe `WordCloudApp`

## 📊 Estatísticas

A aplicação mostra em tempo real:
- Número de palavras únicas na nuvem
- Total de votos dados

## 🎨 Design

- **Gradientes modernos** para um visual atrativo
- **Glassmorphism** com efeitos de blur
- **Sombras suaves** para profundidade
- **Tipografia clara** e legível
- **Cores harmoniosas** em tons de azul e roxo

---

Desenvolvido com ❤️ usando tecnologias web modernas para criar uma experiência interativa e envolvente! 