// Paleta clássica de word cloud
const WORD_COLORS = [
    '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231',
    '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe',
    '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000',
    '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080',
    '#ffffff', '#000000', '#ff4500', '#1e90ff', '#32cd32',
    '#ff69b4', '#8a2be2', '#00ced1', '#ffd700', '#dc143c'
];

const INITIAL_WORDS = [
  ['Foguete', 3], ['Sonho', 1], ['Persistência', 7], ['Nós', 1], ['Brasil', 1],
  ['Livro', 8], ['Descoberta', 5], ['Sustentabilidade', 7], ['Fórmula', 3], ['Fundamental', 6],
  ['Futuro', 1], ['Calculadora', 4], ['Tudo', 6], ['Inspiração', 1], ['Engrenagem', 7],
  ['Vida', 8], ['Teoria', 1], ['Saúde', 5], ['Ideia', 9], ['Necessidade', 6],
  ['Lupa', 4], ['Esperança', 1], ['Laboratório', 7], ['Chip', 8], ['Humanidade', 6],
  ['Avião', 2], ['Soberania', 5], ['Átomo', 9], ['Eu', 4], ['Universo', 1],
  ['Pesquisa', 7], ['Democracia', 1], ['Mundo', 6], ['Comunidade', 8], ['Superação', 9],
  ['Microscópio', 5], ['Trabalho', 7], ['Educação', 3], ['Incrível', 4], ['Gente', 6],
  ['Conhecimento', 3], ['União', 5], ['Amor', 8],
];

function getTransform(d, centerX, centerY, scale = 1) {
    return `translate(${d.x + centerX},${d.y + centerY}) rotate(${d.rotate}) scale(${scale})`;
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function fadeInScaleInWord(el, delay = 0) {
    const d = d3.select(el).datum();
    const centerX = 1000 / 2;
    const centerY = 600 / 2;
    // 40% de chance de animar blur
    const useBlur = Math.random() < 0.4;
    el.setAttribute('transform', getTransform(d, centerX, centerY, 1.3));
    el.setAttribute('opacity', 0);
    if (useBlur) {
        el.style.filter = 'blur(8px)';
    } else {
        el.style.filter = '';
    }
    setTimeout(() => {
        let start = null;
        function animate(ts) {
            if (!start) start = ts;
            const elapsed = ts - start;
            const duration = 1500;
            let t = Math.min(elapsed / duration, 1);
            t = easeOutCubic(t);
            const scale = 1.3 - 0.3 * t;
            const opacity = t;
            el.setAttribute('transform', getTransform(d, centerX, centerY, scale));
            el.setAttribute('opacity', opacity);
            if (useBlur) {
                const blur = 8 * (1 - t);
                el.style.filter = `blur(${blur.toFixed(2)}px)`;
            }
            if (elapsed < duration) {
                requestAnimationFrame(animate);
            } else {
                el.setAttribute('transform', getTransform(d, centerX, centerY, 1));
                el.setAttribute('opacity', 1);
                if (useBlur) el.style.filter = '';
            }
        }
        requestAnimationFrame(animate);
    }, delay);
}

function renderWordCloud(words = INITIAL_WORDS) {
    const minSize = 12;
    const maxSize = 72;
    function getFontWeight(size) {
        // Todos os pesos disponíveis para variação suave
        const steps = [100, 200, 300, 400, 500, 600, 700, 800, 900];
        const idx = Math.round(((size - minSize) / (maxSize - minSize)) * (steps.length - 1));
        return steps[Math.max(0, Math.min(idx, steps.length - 1))];
    }
    const wordsArray = words.map(([text, count]) => {
        let size = minSize + count * 4;
        if (size > maxSize) size = maxSize;
        return {
            text,
            size,
            weight: getFontWeight(size),
            color: '#fff',
            count
        };
    });
    const width = 1000;
    const height = 600;
    d3.select('#wordsCloud').selectAll('*').remove();
    const svg = d3.select('#wordsCloud').append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`);
    const defs = svg.append('defs');
    defs.append('filter')
        .attr('id', 'glow')
        .append('feGaussianBlur')
        .attr('stdDeviation', '4')
        .attr('result', 'coloredBlur');
    defs.select('filter')
        .append('feMerge')
        .selectAll('feMergeNode')
        .data(['coloredBlur', 'SourceGraphic'])
        .enter()
        .append('feMergeNode')
        .attr('in', d => d);
    d3.layout.cloud()
        .size([width, height])
        .words(wordsArray)
        .padding(6)
        .rotate(() => Math.random() > 0.7 ? 90 : 0)
        .font('Rawline')
        .fontWeight(d => d.weight)
        .fontSize(d => d.size)
        .on('end', words => {
            const centerX = width / 2;
            const centerY = height / 2;
            svg.selectAll('text')
                .data(words)
                .enter()
                .append('text')
                .attr('class', 'cloud-word')
                .attr('text-anchor', 'middle')
                .attr('font-family', 'Rawline')
                .attr('font-weight', d => d.weight)
                .attr('font-size', d => d.size)
                .attr('fill', '#fff')
                .attr('filter', 'url(#glow)')
                .attr('transform', d => getTransform(d, centerX, centerY, 1.3))
                .attr('opacity', 0)
                .text(d => d.text);
            // Efeito de entrada em cascata
            const allWords = document.querySelectorAll('.cloud-word');
            allWords.forEach((el, i) => {
                fadeInScaleInWord(el, i * 60);
            });
        })
        .start();
}

// Função para fade e scale em uma palavra
function fadeAndScaleWord(el) {
    const d = d3.select(el).datum();
    const centerX = 1000 / 2;
    const centerY = 600 / 2;
    let start = null;
    function animateFadeScale(ts) {
        if (!start) start = ts;
        const elapsed = ts - start;
        let scale = 1;
        let opacity = 1;
        if (elapsed < 200) {
            // Fade out e scale up (0-200ms)
            scale = 1 + 0.3 * (elapsed / 200);
            opacity = 1 - (elapsed / 200);
        } else if (elapsed < 400) {
            // Fade in e scale down (200-400ms)
            scale = 1.3 - 0.3 * ((elapsed - 200) / 200);
            opacity = (elapsed - 200) / 200;
        } else {
            el.setAttribute('transform', getTransform(d, centerX, centerY, 1));
            el.setAttribute('opacity', 1);
            return;
        }
        el.setAttribute('transform', getTransform(d, centerX, centerY, scale));
        el.setAttribute('opacity', opacity);
        requestAnimationFrame(animateFadeScale);
    }
    requestAnimationFrame(animateFadeScale);
}

// Função para escolher uma aleatória e aplicar o efeito
function fadeAndScaleRandomWord() {
    const words = document.querySelectorAll('.cloud-word');
    if (words.length === 0) return;
    const idx = Math.floor(Math.random() * words.length);
    fadeAndScaleWord(words[idx]);
}

// Funções para aumentar/diminuir o valor de uma palavra
function increaseWord(word) {
    let found = false;
    for (let i = 0; i < INITIAL_WORDS.length; i++) {
        if (INITIAL_WORDS[i][0] === word) {
            INITIAL_WORDS[i][1] = Math.min(INITIAL_WORDS[i][1] + 1, 15); // Limite superior
            found = true;
            break;
        }
    }
    if (!found) {
        INITIAL_WORDS.push([word, 2]);
    }
    renderWordCloud(INITIAL_WORDS);
}

function decreaseWord(word) {
    for (let i = 0; i < INITIAL_WORDS.length; i++) {
        if (INITIAL_WORDS[i][0] === word) {
            INITIAL_WORDS[i][1] = Math.max(INITIAL_WORDS[i][1] - 1, 1); // Limite inferior
            break;
        }
    }
    renderWordCloud(INITIAL_WORDS);
}

function resetAllToOne() {
    for (let i = 0; i < INITIAL_WORDS.length; i++) {
        INITIAL_WORDS[i][1] = 1;
    }
    renderWordCloud(INITIAL_WORDS);
}

document.addEventListener('DOMContentLoaded', () => {
    renderWordCloud(INITIAL_WORDS);
}); 