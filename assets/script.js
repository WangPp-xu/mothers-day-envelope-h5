const $ = (id) => document.getElementById(id);

const nameInput = $('nameInput');
const msgInput = $('msgInput');
const fromInput = $('fromInput');
const letterTo = $('letterTo');
const typeArea = $('typeArea');
const letterFrom = $('letterFrom');
const letterDate = $('letterDate');
const letterPaper = $('letterPaper');
const envelopeWrap = $('envelopeWrap');
const flap = $('flap');
const seal = $('seal');
const openTip = $('openTip');
const applyBtn = $('applyBtn');
const makeLinkBtn = $('makeLinkBtn');
const copyLinkBtn = $('copyLinkBtn');
const copyBlessingBtn = $('copyBlessingBtn');
const toggleBtn = $('toggleBtn');
const shareBox = $('shareBox');
const shareLink = $('shareLink');
const toast = $('toast');
const bgMusic = $('bgMusic');
const musicBtn = $('musicBtn');
const petalLayer = $('petalLayer');
const heartLayer = $('heartLayer');

const defaultData = {
  name: '妈妈',
  msg: '母亲节快乐！\n谢谢您一直以来的照顾、包容和爱。\n愿您每天都开心、健康、平安。\n我会一直爱您，也会越来越懂事。',
  from: '爱您的我'
};

let cardData = { ...defaultData };
let opened = false;
let typingTimer = null;
let hasTypedOnce = false;

function getTodayText() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

function normalizeText(text) {
  return String(text || '').replace(/\\n/g, '\n').trim();
}

function getParamsData() {
  const params = new URLSearchParams(window.location.search);
  const name = normalizeText(params.get('name')) || localStorage.getItem('mom_card_name') || defaultData.name;
  const msg = normalizeText(params.get('msg')) || localStorage.getItem('mom_card_msg') || defaultData.msg;
  const from = normalizeText(params.get('from')) || localStorage.getItem('mom_card_from') || defaultData.from;
  return { name, msg, from };
}

function isShareMode() {
  const params = new URLSearchParams(window.location.search);
  // 只要是“生成专属链接”打开，或链接里带了 name/msg/from，就进入纯展示模式。
  // 纯展示模式会隐藏上方可编辑区域，只保留标题、信封和动画。
  return params.get('mode') === 'share' || params.has('name') || params.has('msg') || params.has('from');
}

function applyShareModeIfNeeded() {
  if (isShareMode()) {
    document.body.classList.add('share-mode');
    shareBox.classList.remove('show');
  }
}

function setInputs(data) {
  nameInput.value = data.name;
  msgInput.value = data.msg;
  fromInput.value = data.from;
}

function collectInputs() {
  return {
    name: normalizeText(nameInput.value) || defaultData.name,
    msg: normalizeText(msgInput.value) || defaultData.msg,
    from: normalizeText(fromInput.value) || defaultData.from
  };
}

function saveLocal(data) {
  localStorage.setItem('mom_card_name', data.name);
  localStorage.setItem('mom_card_msg', data.msg);
  localStorage.setItem('mom_card_from', data.from);
}

function renderStaticLetter(data) {
  letterTo.textContent = `To 我最亲爱的${data.name}：`;
  letterFrom.textContent = data.from;
  letterDate.textContent = getTodayText();
  if (!opened || !hasTypedOnce) {
    typeArea.textContent = data.msg;
  }
}

function generateCard() {
  cardData = collectInputs();
  saveLocal(cardData);
  renderStaticLetter(cardData);
  if (opened) {
    startTypewriter(cardData.msg);
  }
  showToast('贺卡已生成');
}

function startTypewriter(text) {
  clearInterval(typingTimer);
  typeArea.textContent = '';
  typeArea.classList.add('type-cursor');
  const chars = Array.from(text);
  let i = 0;
  typingTimer = setInterval(() => {
    typeArea.textContent += chars[i] || '';
    i += 1;
    if (i >= chars.length) {
      clearInterval(typingTimer);
      typingTimer = null;
      typeArea.classList.remove('type-cursor');
      hasTypedOnce = true;
    }
  }, 55);
}

function openEnvelope() {
  if (opened) return;
  generateCardWithoutToast();
  opened = true;
  envelopeWrap.classList.add('opened');
  flap.classList.add('open');
  seal.classList.add('open');
  openTip.classList.add('open');
  letterPaper.classList.add('open');
  launchConfetti();
  tryPlayMusic();
  setTimeout(() => startTypewriter(cardData.msg), 520);
}

function closeEnvelope() {
  opened = false;
  clearInterval(typingTimer);
  typingTimer = null;
  hasTypedOnce = false;
  typeArea.classList.remove('type-cursor');
  renderStaticLetter(cardData);
  envelopeWrap.classList.remove('opened');
  flap.classList.remove('open');
  seal.classList.remove('open');
  openTip.classList.remove('open');
  letterPaper.classList.remove('open');
}

function toggleEnvelope() {
  if (opened) closeEnvelope();
  else openEnvelope();
}

function generateCardWithoutToast() {
  cardData = collectInputs();
  saveLocal(cardData);
  renderStaticLetter(cardData);
}

function makeDedicatedLink() {
  generateCardWithoutToast();
  const url = new URL(window.location.href);
  url.searchParams.set('mode', 'share');
  url.searchParams.set('name', cardData.name);
  url.searchParams.set('msg', cardData.msg);
  url.searchParams.set('from', cardData.from);
  shareLink.value = url.toString();
  shareBox.classList.add('show');
  copyText(url.toString(), '专属链接已生成并复制');
}

async function copyText(text, message = '已复制') {
  try {
    await navigator.clipboard.writeText(text);
    showToast(message);
  } catch (err) {
    const temp = document.createElement('textarea');
    temp.value = text;
    temp.style.position = 'fixed';
    temp.style.left = '-9999px';
    document.body.appendChild(temp);
    temp.focus();
    temp.select();
    document.execCommand('copy');
    temp.remove();
    showToast(message);
  }
}

function getBlessingText() {
  generateCardWithoutToast();
  return `To 我最亲爱的${cardData.name}：\n${cardData.msg}\n\n${cardData.from}\n${getTodayText()}`;
}

function showToast(text) {
  toast.textContent = text;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1700);
}

function tryPlayMusic() {
  if (!bgMusic) return;
  bgMusic.play().then(() => {
    musicBtn.classList.add('playing');
  }).catch(() => {
    // 微信和很多浏览器会禁止自动播放，需要用户点击音乐按钮或页面后再播放。
  });
}

function toggleMusic() {
  if (bgMusic.paused) {
    bgMusic.play().then(() => {
      musicBtn.classList.add('playing');
      showToast('音乐已开启');
    }).catch(() => showToast('请先点击页面再播放音乐'));
  } else {
    bgMusic.pause();
    musicBtn.classList.remove('playing');
    showToast('音乐已暂停');
  }
}

function createPetal() {
  const petals = ['🌸', '🌷', '❀', '✿'];
  const el = document.createElement('div');
  el.className = 'petal';
  el.textContent = petals[Math.floor(Math.random() * petals.length)];
  el.style.left = `${Math.random() * 100}vw`;
  el.style.fontSize = `${14 + Math.random() * 16}px`;
  el.style.opacity = `${0.55 + Math.random() * 0.35}`;
  el.style.animationDuration = `${7 + Math.random() * 6}s`;
  el.style.setProperty('--drift', `${(Math.random() - 0.5) * 160}px`);
  el.style.setProperty('--rotate', `${Math.random() * 720 - 360}deg`);
  petalLayer.appendChild(el);
  setTimeout(() => el.remove(), 14000);
}

function createHeart() {
  const hearts = ['♡', '❤', '💕', '💗'];
  const el = document.createElement('div');
  el.className = 'float-heart';
  el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
  el.style.left = `${Math.random() * 100}vw`;
  el.style.fontSize = `${14 + Math.random() * 18}px`;
  el.style.animationDuration = `${5 + Math.random() * 5}s`;
  el.style.setProperty('--x', `${(Math.random() - 0.5) * 80}px`);
  el.style.setProperty('--r', `${Math.random() * 90 - 45}deg`);
  heartLayer.appendChild(el);
  setTimeout(() => el.remove(), 11000);
}

function launchConfetti() {
  const symbols = ['❤', '♡', '✨', '🌸', '💗', '✿'];
  for (let i = 0; i < 34; i += 1) {
    const el = document.createElement('div');
    el.className = 'confetti';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.fontSize = `${14 + Math.random() * 15}px`;
    el.style.setProperty('--x', `${(Math.random() - 0.5) * 360}px`);
    el.style.setProperty('--y', `${-80 - Math.random() * 330}px`);
    el.style.setProperty('--r', `${Math.random() * 720 - 360}deg`);
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1700);
  }
}

function init() {
  cardData = getParamsData();
  setInputs(cardData);
  renderStaticLetter(cardData);
  applyShareModeIfNeeded();

  applyBtn.addEventListener('click', generateCard);
  makeLinkBtn.addEventListener('click', makeDedicatedLink);
  copyLinkBtn.addEventListener('click', () => copyText(shareLink.value, '链接已复制'));
  copyBlessingBtn.addEventListener('click', () => copyText(getBlessingText(), '祝福语已复制'));
  toggleBtn.addEventListener('click', toggleEnvelope);
  envelopeWrap.addEventListener('click', toggleEnvelope);
  musicBtn.addEventListener('click', toggleMusic);

  document.body.addEventListener('click', function firstInteraction() {
    tryPlayMusic();
    document.body.removeEventListener('click', firstInteraction);
  }, { once: true });

  setInterval(createPetal, 900);
  setInterval(createHeart, 1200);
}

init();
