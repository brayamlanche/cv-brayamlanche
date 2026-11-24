// Cápsulas de la portada que siguen al mouse
const hero = document.querySelector('.hero');
hero.addEventListener('mousemove', (e) => {
  const r = hero.getBoundingClientRect();
  hero.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
  hero.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
});

// Aparición de secciones al hacer scroll
const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observador.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.seccion .contenedor').forEach((el) => {
  el.classList.add('oculto');
  observador.observe(el);
});

// Contador de la cifra de la OMS
const contador = document.querySelector('.contador');
const obsContador = new IntersectionObserver(([e]) => {
  if (!e.isIntersecting) return;
  const meta = Number(contador.dataset.meta);
  const inicio = performance.now();
  const paso = (ahora) => {
    const t = Math.min((ahora - inicio) / 1800, 1);
    contador.textContent = Math.round(meta * (1 - Math.pow(1 - t, 3))).toLocaleString('es-EC');
    if (t < 1) requestAnimationFrame(paso);
  };
  requestAnimationFrame(paso);
  obsContador.disconnect();
}, { threshold: 0.6 });
obsContador.observe(contador);

// Pastillero interactivo
const dias = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
const comps = [...document.querySelectorAll('.comp')];
const racha = document.getElementById('racha');
const aviso = document.getElementById('aviso');

function mostrar(texto, tipo) {
  aviso.textContent = texto;
  aviso.className = 'aviso' + (tipo ? ' ' + tipo : '');
}
function contar() {
  const n = comps.filter((c) => c.classList.contains('abierto')).length;
  racha.textContent = n + ' de 7 dosis tomadas';
  if (n === 7) mostrar('Semana completa. Rosa no se saltó ninguna dosis.', 'ok');
  return n;
}

comps.forEach((comp, i) => {
  comp.querySelector('.tapa').addEventListener('click', () => {
    comp.classList.remove('olvido');
    comp.classList.add('abierto');
    if (contar() < 7) mostrar('Rosa tomó su dosis del ' + dias[i] + '.', 'ok');
  });
});

document.getElementById('olvido').addEventListener('click', () => {
  const pendiente = comps.findIndex((c) => !c.classList.contains('abierto') && !c.classList.contains('olvido'));
  if (pendiente === -1) { mostrar('No quedan compartimentos pendientes para simular.'); return; }
  comps[pendiente].classList.add('olvido');
  mostrar('Rosa no abrió el compartimento del ' + dias[pendiente] + '. Se envió un aviso a María, su hija.', 'alerta');
});

document.getElementById('vaciar').addEventListener('click', () => {
  comps.forEach((c) => c.classList.remove('abierto', 'olvido'));
  contar();
  mostrar('Rosa todavía no abre ningún compartimento.');
});

// Tecnologías: toca una para ver qué hace
const chips = [...document.querySelectorAll('#chips button')];
const desc = document.getElementById('chips-desc');
function elegir(chip) {
  chips.forEach((c) => c.setAttribute('aria-pressed', c === chip));
  desc.textContent = chip.dataset.desc;
}
chips.forEach((c) => c.addEventListener('click', () => elegir(c)));
elegir(chips[0]);

// Formulario
const form = document.getElementById('form');
const msg = document.getElementById('msg-form');
form.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const { nombre, correo } = form;
  [nombre, correo].forEach((c) => c.classList.remove('error'));
  if (nombre.value.trim().length < 2) {
    nombre.classList.add('error'); msg.textContent = 'Escribe tu nombre para poder responderte.'; nombre.focus(); return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value.trim())) {
    correo.classList.add('error'); msg.textContent = 'Revisa el correo: parece que le falta algo.'; correo.focus(); return;
  }
  msg.textContent = 'Gracias, ' + nombre.value.trim().split(' ')[0] + '. Te escribiremos pronto.';
  form.reset();
});