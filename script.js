// Paleta clássica de word cloud
const WORD_COLORS = [
    '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231',
    '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe',
    '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000',
    '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080',
    '#ffffff', '#000000', '#ff4500', '#1e90ff', '#32cd32',
    '#ff69b4', '#8a2be2', '#00ced1', '#ffd700', '#dc143c'
];

// Sempre inicializar todas as palavras com valor 1
const INITIAL_WORDS = [
  ['Foguete', 1], ['Sonho', 1], ['Persistência', 1], ['Nós', 1], ['Brasil', 1],
  ['Livro', 1], ['Descoberta', 1], ['Sustentabilidade', 1], ['Fórmula', 1], ['Fundamental', 1],
  ['Futuro', 1], ['Calculadora', 1], ['Tudo', 1], ['Inspiração', 1], ['Engrenagem', 1],
  ['Vida', 1], ['Teoria', 1], ['Saúde', 1], ['Ideia', 1], ['Necessidade', 1],
  ['Lupa', 1], ['Esperança', 1], ['Laboratório', 1], ['Chip', 1], ['Humanidade', 1],
  ['Avião', 1], ['Soberania', 1], ['Átomo', 1], ['Eu', 1], ['Universo', 1],
  ['Pesquisa', 1], ['Democracia', 1], ['Mundo', 1], ['Comunidade', 1], ['Superação', 1],
  ['Microscópio', 1], ['Trabalho', 1], ['Educação', 1], ['Incrível', 1], ['Gente', 1],
  ['Conhecimento', 1], ['União', 1], ['Amor', 1],
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
    // Patch para configurar o canvas do D3-cloud
    const originalCanvas = document.createElement;
    document.createElement = function(tagName) {
        const element = originalCanvas.call(this, tagName);
        if (tagName.toLowerCase() === 'canvas') {
            element.setAttribute('willReadFrequently', 'true');
        }
        return element;
    };

    d3.layout.cloud()
        .size([width, height])
        .words(wordsArray)
        .padding(6)
        .rotate(() => {
          // 50% chance de inverter (180º)
          const base = Math.random() > 0.5 ? 0 : 180;
          // 30% chance de adicionar 90º
          const extra = Math.random() > 0.7 ? 90 : 0;
          return base + extra;
        })
        .font('Rawline')
        .fontWeight(d => d.weight)
        .fontSize(d => d.size)
        .on('end', words => {
            // Restaura a função original de createElement
            document.createElement = originalCanvas;
            
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
                .each(function(d) {
                    // Armazena a posição original no DOM
                    this._baseX = d.x + centerX;
                    this._baseY = d.y + centerY;
                    this._angle = d.rotate;
                })
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
    saveWordValues();
    renderWordCloud(INITIAL_WORDS);
}

function decreaseWord(word) {
    for (let i = 0; i < INITIAL_WORDS.length; i++) {
        if (INITIAL_WORDS[i][0] === word) {
            INITIAL_WORDS[i][1] = Math.max(INITIAL_WORDS[i][1] - 1, 1); // Limite inferior
            break;
        }
    }
    saveWordValues();
    renderWordCloud(INITIAL_WORDS);
}

function resetAllToOne() {
    for (let i = 0; i < INITIAL_WORDS.length; i++) {
        INITIAL_WORDS[i][1] = 1;
    }
    saveWordValues();
    renderWordCloud(INITIAL_WORDS);
}

// Função para salvar valores no Local Storage
function saveWordValues() {
  console.log('[PERSIST] Salvando valores:', INITIAL_WORDS.map(w => w[1]));
  localStorage.setItem('wordValues', JSON.stringify(INITIAL_WORDS.map(w => w[1])));
}

// Função para carregar valores do Local Storage
function loadWordValues() {
  const saved = localStorage.getItem('wordValues');
  console.log('[PERSIST] Carregando valores:', saved);
  if (saved) {
    const arr = JSON.parse(saved);
    if (Array.isArray(arr) && arr.length === INITIAL_WORDS.length) {
      arr.forEach((v, i) => INITIAL_WORDS[i][1] = v);
    }
  }
}

// Chamar ao iniciar
loadWordValues();

// Adiciona zonas de incremento/decremento no SVG
function addIncrementDecrementZones(svg, addBeforeWords = false) {
  const width = +svg.getAttribute('width');
  const height = +svg.getAttribute('height');
  const rDrop = 44; // raio da zona de drop (grande, invisível)
  const rBtn = 24; // raio do botão visível
  const margin = 24;
  const zones = [
    // Top
    { x: width/2 - 60, y: margin, type: '+', id: 'zone-top-plus' },
    { x: width/2 + 60, y: margin, type: '-', id: 'zone-top-minus' },
    // Bottom
    { x: width/2 - 60, y: height - margin, type: '+', id: 'zone-bottom-plus' },
    { x: width/2 + 60, y: height - margin, type: '-', id: 'zone-bottom-minus' },
    // Left
    { x: margin, y: height/2 - 60, type: '+', id: 'zone-left-plus' },
    { x: margin, y: height/2 + 60, type: '−', id: 'zone-left-minus' },
    // Right
    { x: width - margin, y: height/2 - 60, type: '+', id: 'zone-right-plus' },
    { x: width - margin, y: height/2 + 60, type: '−', id: 'zone-right-minus' },
  ];
  // Remove zonas antigas
  svg.querySelectorAll('.incdec-zone').forEach(e => e.remove());
  // Adiciona zonas
  zones.forEach(zone => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'incdec-zone');
    g.setAttribute('data-type', zone.type);
    g.setAttribute('data-id', zone.id);
    // Define rotação do texto conforme lado
    let rotation = 0;
    if (zone.id.includes('bottom')) rotation = 180;
    if (zone.id.includes('left')) rotation = -90;
    if (zone.id.includes('right')) rotation = 90;
    g.innerHTML = `
      <circle class="drop-area" cx="${zone.x}" cy="${zone.y}" r="${rDrop}" />
      <circle cx="${zone.x}" cy="${zone.y}" r="${rBtn}" stroke="#000" stroke-width="4" />
      <text x="${zone.x}" y="${zone.y+10}" text-anchor="middle" font-size="36" font-family="Arial" fill="#000" transform="rotate(${rotation} ${zone.x} ${zone.y})">${zone.type}</text>
    `;
    svg.appendChild(g);
  });
}

// Detecta colisão entre palavra e zona (retorna zona colidida ou null)
function getCollidingZone(wordEl, svg) {
  const bbox = wordEl.getBBox();
  const transform = wordEl.getAttribute('transform');
  const match = /translate\(([-\d.]+),([-\.\d]+)\)/.exec(transform);
  let dx = 0, dy = 0;
  if (match) {
    dx = parseFloat(match[1]) - (bbox.x + bbox.width/2);
    dy = parseFloat(match[2]) - (bbox.y + bbox.height/2);
  }
  // Ajusta o bbox para a posição real
  const wordBox = {
    x: bbox.x + dx,
    y: bbox.y + dy,
    width: bbox.width,
    height: bbox.height
  };
  let over = null;
  svg.querySelectorAll('.incdec-zone').forEach(zone => {
    const circle = zone.querySelector('.drop-area');
    const zx = +circle.getAttribute('cx');
    const zy = +circle.getAttribute('cy');
    const r = +circle.getAttribute('r');
    // Checa se algum canto do bbox está dentro do círculo
    const corners = [
      [wordBox.x, wordBox.y],
      [wordBox.x + wordBox.width, wordBox.y],
      [wordBox.x, wordBox.y + wordBox.height],
      [wordBox.x + wordBox.width, wordBox.y + wordBox.height],
      // Centro também
      [wordBox.x + wordBox.width/2, wordBox.y + wordBox.height/2]
    ];
    for (const [px, py] of corners) {
      const dist = Math.sqrt((px - zx) ** 2 + (py - zy) ** 2);
      if (dist < r) {
        over = zone;
        break;
      }
    }
  });
  return over;
}

// Modifica enableSVGTextDrag para lógica Collidable
function enableSVGTextDrag() {
  const svg = document.querySelector('#wordsCloud svg');
  let dragging = null;
  let offset = { x: 0, y: 0 };
  let lastTransform = '';
  let lastColliding = null;

  function getSVGCoords(e) {
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    return { x: svgP.x, y: svgP.y };
  }

  function onStart(e) {
    if (e.target.classList.contains('cloud-word')) {
      dragging = e.target;
      lastTransform = dragging.getAttribute('transform');
      const match = /translate\(([-\d.]+),([-.\d]+)\)/.exec(lastTransform);
      const { x, y } = getSVGCoords(e);
      if (match) {
        offset.x = x - parseFloat(match[1]);
        offset.y = y - parseFloat(match[2]);
      }
      dragging.setAttribute('opacity', 0.7);
      svg.style.cursor = 'grabbing';
      console.log('[DRAG] Start:', dragging.textContent);
      e.preventDefault();
    }
  }

  function onMove(e) {
    if (dragging) {
      const { x, y } = getSVGCoords(e);
      const newX = x - offset.x;
      const newY = y - offset.y;
      const rotate = /rotate\(([-\d.]+)\)/.exec(lastTransform);
      const scale = /scale\(([-\d.]+)\)/.exec(lastTransform);
      dragging.setAttribute(
        'transform',
        `translate(${newX},${newY}) rotate(${rotate ? rotate[1] : 0}) scale(${scale ? scale[1] : 1})`
      );
      // Feedback visual Collidable
      svg.querySelectorAll('.incdec-zone').forEach(zone => zone.classList.remove('colliding'));
      const over = getCollidingZone(dragging, svg);
      if (over) {
        over.classList.add('colliding');
        lastColliding = over;
        console.log('[DRAG] Colidindo com zona:', over.getAttribute('data-id'), dragging.textContent);
      } else {
        lastColliding = null;
      }
      e.preventDefault();
    }
  }

  function onEnd(e) {
    if (dragging) {
      svg.querySelectorAll('.incdec-zone').forEach(zone => zone.classList.remove('colliding'));
      if (lastColliding) {
        const type = lastColliding.getAttribute('data-type');
        const word = dragging.textContent;
        console.log('[DROP] Drop sobre zona:', lastColliding.getAttribute('data-id'), 'Tipo:', type, 'Palavra:', word);
        if (type === '+') {
          console.log('[INCREMENTO]', word);
          increaseWord(word);
        }
        if (type === '-' || type === '−') {
          console.log('[DECREMENTO]', word);
          decreaseWord(word);
        }
      } else {
        console.log('[DROP] Drop fora de zona:', dragging.textContent);
      }
      dragging.setAttribute('opacity', 1);
      svg.style.cursor = '';
      dragging = null;
      lastColliding = null;
      e.preventDefault();
    }
  }

  svg.addEventListener('mousedown', onStart);
  svg.addEventListener('mousemove', onMove);
  svg.addEventListener('mouseup', onEnd);
  svg.addEventListener('mouseleave', onEnd);
  svg.addEventListener('touchstart', onStart, { passive: false });
  svg.addEventListener('touchmove', onMove, { passive: false });
  svg.addEventListener('touchend', onEnd, { passive: false });
  svg.addEventListener('touchcancel', onEnd, { passive: false });
}

// Atualiza renderWordCloud para adicionar zonas antes das palavras
const originalRenderWordCloud2 = renderWordCloud;
renderWordCloud = function() {
  originalRenderWordCloud2.apply(this, arguments);
  setTimeout(() => {
    const svg = document.querySelector('#wordsCloud svg');
    // Adiciona zonas ANTES das palavras
    addIncrementDecrementZones(svg, true);
    // Move todas as zonas para o início do SVG (fundo)
    svg.querySelectorAll('.incdec-zone').forEach(zone => {
      svg.insertBefore(zone, svg.firstChild.nextSibling); // após <defs>
    });
    enableSVGTextDrag();
  }, 100);
};

// Drag and drop para swappable-word com zonas HTML
function enableHTMLWordDrag() {
  let dragging = null;
  let offset = { x: 0, y: 0 };
  let lastZone = null;
  let startX = 0, startY = 0;

  function onStart(e) {
    if (e.target.classList.contains('swappable-word')) {
      dragging = e.target;
      const rect = dragging.getBoundingClientRect();
      const evt = e.touches ? e.touches[0] : e;
      offset.x = evt.clientX - rect.left;
      offset.y = evt.clientY - rect.top;
      startX = rect.left;
      startY = rect.top;
      dragging.style.position = 'fixed';
      dragging.style.zIndex = 3000;
      dragging.style.pointerEvents = 'none';
      dragging.style.opacity = 0.7;
      document.body.appendChild(dragging);
      e.preventDefault();
    }
  }

  function onMove(e) {
    if (dragging) {
      const evt = e.touches ? e.touches[0] : e;
      const x = evt.clientX - offset.x;
      const y = evt.clientY - offset.y;
      dragging.style.left = x + 'px';
      dragging.style.top = y + 'px';
      // Colisão com zonas
      document.querySelectorAll('.zone-html').forEach(zone => zone.classList.remove('colliding'));
      let collided = null;
      document.querySelectorAll('.zone-html').forEach(zone => {
        const zrect = zone.getBoundingClientRect();
        const dX = (x + dragging.offsetWidth/2) - (zrect.left + zrect.width/2);
        const dY = (y + dragging.offsetHeight/2) - (zrect.top + zrect.height/2);
        const dist = Math.sqrt(dX*dX + dY*dY);
        if (dist < zrect.width/2) {
          zone.classList.add('colliding');
          collided = zone;
        }
      });
      lastZone = collided;
      e.preventDefault();
    }
  }

  function onEnd(e) {
    if (dragging) {
      document.querySelectorAll('.zone-html').forEach(zone => zone.classList.remove('colliding'));
      if (lastZone) {
        if (lastZone.textContent.trim() === '+') {
          dragging.textContent = dragging.textContent + ' +';
        } else if (lastZone.textContent.trim() === '-') {
          dragging.textContent = dragging.textContent + ' -';
        }
      }
      // Volta para o container
      dragging.style.position = '';
      dragging.style.left = '';
      dragging.style.top = '';
      dragging.style.zIndex = '';
      dragging.style.pointerEvents = '';
      dragging.style.opacity = '';
      document.getElementById('swappable-list').appendChild(dragging);
      dragging = null;
      lastZone = null;
      e.preventDefault();
    }
  }

  document.addEventListener('mousedown', onStart);
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onEnd);
  document.addEventListener('touchstart', onStart, { passive: false });
  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('touchend', onEnd, { passive: false });
}

// Atalho de teclado R para resetar todos para 1
window.addEventListener('keydown', function(e) {
  if (e.key === 'r' || e.key === 'R') {
    resetAllToOne();
  }
});

window.addEventListener('touchmove', function(e) {
  e.preventDefault();
}, { passive: false });

document.addEventListener('DOMContentLoaded', () => {
    renderWordCloud(INITIAL_WORDS);
    enableHTMLWordDrag();
}); 