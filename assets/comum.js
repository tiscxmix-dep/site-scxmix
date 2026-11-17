/* SCX Mix — código compartilhado entre o site e o painel.
   Desenvolvido por CRG - Soluções Tecnológicas */
(function () {
  const ICONES = {
    cimento: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M10 10h28l4 30H6z"/><path d="M14 18h20M16 26h16"/></svg>',
    tijolos: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3"><rect x="4" y="8" width="18" height="9"/><rect x="26" y="8" width="18" height="9"/><rect x="14" y="20" width="20" height="9"/><rect x="4" y="32" width="18" height="9"/><rect x="26" y="32" width="18" height="9"/></svg>',
    hidraulica: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M6 16h18a6 6 0 0 1 6 6v6"/><path d="M14 10v6M8 10h12M30 28h4"/><path d="M32 34c-1.5 2.5-2 4-2 5a2 2 0 0 0 4 0c0-1-.5-2.5-2-5z"/></svg>',
    eletrica: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M27 4L10 27h12l-3 17 19-25H26z"/></svg>',
    tintas: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><rect x="6" y="6" width="30" height="10" rx="2"/><path d="M36 11h6v10H22v6"/><rect x="18" y="27" width="8" height="16" rx="2"/></svg>',
    ferramentas: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M8 12l8-6 8 6-4 4z"/><path d="M20 16l20 22-4 4-20-22"/></svg>',
    pisos: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3"><path d="M24 4l20 10-20 10L4 14z"/><path d="M4 24l20 10 20-10M4 34l20 10 20-10"/></svg>',
    utilidades: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M8 16h32l-4 26H12z"/><path d="M12 16c0-8 24-8 24 0"/></svg>',
    telhado: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M4 26L24 8l20 18"/><path d="M10 21v19h28V21"/><path d="M20 40V29h8v11"/></svg>',
    madeira: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3"><rect x="4" y="12" width="40" height="10" rx="2"/><rect x="4" y="26" width="40" height="10" rx="2"/><path d="M14 17h10M24 31h12"/></svg>',
    jardim: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M24 44V22"/><path d="M24 26c-10 0-14-8-14-16 10 0 14 6 14 16zM24 22c0-8 4-14 14-14 0 8-4 14-14 14z"/></svg>',
    iluminacao: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M17 30a12 12 0 1 1 14 0v5H17z"/><path d="M18 41h12"/></svg>',
    banheiro: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M6 24h36v4a12 12 0 0 1-12 12H18A12 12 0 0 1 6 28z"/><path d="M12 24V10a4 4 0 0 1 8 0"/><path d="M16 40l-2 4M32 40l2 4"/></svg>',
    seguranca: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M6 32h36v6H6z"/><path d="M10 32a14 14 0 0 1 28 0"/><path d="M24 18v-6M20 32V20M28 32V20"/></svg>',
    caixa: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M6 14l18-8 18 8v20l-18 8-18-8z"/><path d="M6 14l18 8 18-8M24 22v20"/></svg>'
  };
  const NOMES_ICONES = {
    cimento: "Saco de cimento", tijolos: "Tijolos", hidraulica: "Hidráulica", eletrica: "Elétrica",
    tintas: "Tintas", ferramentas: "Ferramentas", pisos: "Pisos", utilidades: "Utilidades",
    telhado: "Casa / telhado", madeira: "Madeira", jardim: "Jardim", iluminacao: "Iluminação",
    banheiro: "Banheiro", seguranca: "EPI / segurança", caixa: "Caixa (genérico)"
  };

  const DADOS_INICIAIS = {
    site: {
      whatsapp: "5567991737172",
      telefone: "(67) 99173-7172",
      horario: "Seg a sex: 7h às 18h · Sáb: 7h às 12h",
      endereco: "Campo Grande - MS",
      instagram: "",
      descontoPix: 5,
      estiloMensagem: "auto",
      corAzul: "#2e3192",
      corAmarelo: "#ffe814",
      logoUrl: "",
      avisos: ["Entrega no mesmo dia em Campo Grande", "5% de desconto no PIX", "Parcele em até 10x no cartão", "Orçamento grátis pelo WhatsApp", "Preço especial para obras e construtoras"],
      vantagens: [
        { titulo: "Entrega rápida", texto: "Campo Grande e região" },
        { titulo: "5% off no PIX", texto: "em todo o site" },
        { titulo: "Até 10x no cartão", texto: "nas compras acima de R$ 300" },
        { titulo: "Orçamento na hora", texto: "pelo WhatsApp" }
      ],
      tituloDepartamentos: "Departamentos",
      subDepartamentos: "Do alicerce ao acabamento.",
      tituloOfertas: "Ofertas da semana",
      notaPrecos: "Preços sujeitos a alteração e confirmação no orçamento. Valor no PIX já com desconto.",
      anuncios: [
        { titulo: "Vai construir ou reformar?", texto: "Mande a lista de materiais da sua obra e a gente monta o orçamento completo com preço de atacado." },
        { titulo: "Entrega no mesmo dia", texto: "Pedidos confirmados até as 14h saem para entrega no mesmo dia em Campo Grande." }
      ],
      contatoTitulo: "Peça o orçamento da sua obra",
      contatoTexto: "Conte o que você precisa ou cole a lista de materiais. Respondemos pelo WhatsApp com preço e prazo de entrega.",
      passos: [
        { titulo: "Escolha os produtos", texto: "Navegue pelos departamentos e adicione o que precisa ao seu orçamento." },
        { titulo: "Envie pelo WhatsApp", texto: "Com um toque, a lista vai pronta para o nosso atendimento." },
        { titulo: "Receba em casa", texto: "Confirmamos preço, forma de pagamento e o horário da entrega." }
      ],
      rodapeTexto: "Materiais de construção e utilidades para sua obra e sua casa.",
      secoes: { vantagens: true, departamentos: true, anuncios: true, contato: true, passos: true }
    },
    categorias: [
      { id: "cimento", nome: "Cimento e argamassa", icone: "cimento", ordem: 1, ativo: true },
      { id: "tijolos", nome: "Tijolos e blocos", icone: "tijolos", ordem: 2, ativo: true },
      { id: "hidraulica", nome: "Hidráulica", icone: "hidraulica", ordem: 3, ativo: true },
      { id: "eletrica", nome: "Elétrica", icone: "eletrica", ordem: 4, ativo: true },
      { id: "tintas", nome: "Tintas", icone: "tintas", ordem: 5, ativo: true },
      { id: "ferramentas", nome: "Ferramentas", icone: "ferramentas", ordem: 6, ativo: true },
      { id: "pisos", nome: "Pisos e revestimentos", icone: "pisos", ordem: 7, ativo: true },
      { id: "utilidades", nome: "Utilidades", icone: "utilidades", ordem: 8, ativo: true }
    ],
    produtos: [
      { id: 1, nome: "Cimento CP II 50 kg", categoria: "cimento", unidade: "saco", preco: 36.90, preco_de: 42.90, destaque: true },
      { id: 2, nome: "Argamassa AC-I 20 kg", categoria: "cimento", unidade: "saco", preco: 14.90, preco_de: 17.50, destaque: true },
      { id: 3, nome: "Cal hidratada 20 kg", categoria: "cimento", unidade: "saco", preco: 18.90 },
      { id: 4, nome: "Tijolo baiano 8 furos", categoria: "tijolos", unidade: "milheiro", preco: 890.00, preco_de: 990.00, destaque: true },
      { id: 5, nome: "Bloco de concreto 14×19×39", categoria: "tijolos", unidade: "unid.", preco: 3.40 },
      { id: 6, nome: "Tubo PVC soldável 25 mm 6 m", categoria: "hidraulica", unidade: "barra", preco: 24.90, destaque: true },
      { id: 7, nome: "Caixa d'água 1000 L", categoria: "hidraulica", unidade: "unid.", preco: 449.00, preco_de: 519.00, destaque: true },
      { id: 8, nome: "Torneira de jardim metal ½\"", categoria: "hidraulica", unidade: "unid.", preco: 22.90 },
      { id: 9, nome: "Cabo flexível 2,5 mm rolo 100 m", categoria: "eletrica", unidade: "rolo", preco: 229.00, preco_de: 259.00, destaque: true },
      { id: 10, nome: "Tomada 2P+T 10 A", categoria: "eletrica", unidade: "unid.", preco: 9.90 },
      { id: 11, nome: "Lâmpada LED 12 W", categoria: "eletrica", unidade: "unid.", preco: 7.90, destaque: true },
      { id: 12, nome: "Tinta acrílica premium 18 L", categoria: "tintas", unidade: "lata", preco: 304.00, preco_de: 379.00, destaque: true },
      { id: 13, nome: "Massa corrida PVA 25 kg", categoria: "tintas", unidade: "balde", preco: 69.90 },
      { id: 14, nome: "Rolo de lã 23 cm com cabo", categoria: "tintas", unidade: "unid.", preco: 24.90 },
      { id: 15, nome: "Carrinho de mão 60 L", categoria: "ferramentas", unidade: "unid.", preco: 239.00, preco_de: 279.00, destaque: true },
      { id: 16, nome: "Colher de pedreiro 8\"", categoria: "ferramentas", unidade: "unid.", preco: 19.90 },
      { id: 17, nome: "Trena 5 m", categoria: "ferramentas", unidade: "unid.", preco: 16.90 },
      { id: 18, nome: "Piso cerâmico 60×60 acetinado", categoria: "pisos", unidade: "m²", preco: 39.90, preco_de: 49.90, destaque: true },
      { id: 19, nome: "Rejunte flexível 1 kg", categoria: "pisos", unidade: "pacote", preco: 8.90 },
      { id: 20, nome: "Balde plástico 12 L", categoria: "utilidades", unidade: "unid.", preco: 9.90, destaque: true },
      { id: 21, nome: "Mangueira de jardim 20 m", categoria: "utilidades", unidade: "unid.", preco: 59.90 },
      { id: 22, nome: "Vassoura de pelo 40 cm", categoria: "utilidades", unidade: "unid.", preco: 21.90 }
    ].map((p, i) => Object.assign({ preco_de: null, destaque: false, ativo: true, descricao: "", foto_url: "", ordem: i }, p)),
    banners: [
      { id: 1, ordem: 1, ativo: true, estilo: "s1", etiqueta: "Oferta da semana", titulo: "Cimento CP II", destaque: "50 kg", subtitulo: "Leve 10 sacos ou mais e garanta o menor preço. Entrega no mesmo dia em Campo Grande.", preco_rotulo: "a partir de", preco: "36,90", preco_sufixo: "o saco", botao_texto: "Adicionar ao orçamento", botao_acao: "prod:1", imagem_url: "", imagem_mobile_url: "" },
      { id: 2, ordem: 2, ativo: true, estilo: "s2", etiqueta: "Tintas", titulo: "Renove a casa com", destaque: "até 20% off", subtitulo: "Látex PVA e acrílica premium, rolos, pincéis e massa corrida com preço especial.", preco_rotulo: "Acrílica 18 L", preco: "289", preco_sufixo: "no PIX", botao_texto: "Ver tintas", botao_acao: "cat:tintas", imagem_url: "", imagem_mobile_url: "" },
      { id: 3, ordem: 3, ativo: true, estilo: "s3", etiqueta: "Utilidades", titulo: "Tudo para casa,", destaque: "do balde à mangueira", subtitulo: "Utilidades domésticas, organização e limpeza no mesmo lugar da sua obra.", preco_rotulo: "Balde 12 L", preco: "9,90", preco_sufixo: "cada", botao_texto: "Ver utilidades", botao_acao: "cat:utilidades", imagem_url: "", imagem_mobile_url: "" }
    ]
  };

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const brl = (v) => Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const urlSegura = (u) => (/^https:\/\//i.test(String(u || "")) ? String(u) : "");
  const soDigitos = (s) => String(s || "").replace(/\D/g, "");
  const linkWhats = (numero, texto) => {
    let n = soDigitos(numero);
    if (n.length <= 11) n = "55" + n;
    return "https://wa.me/" + n + (texto ? "?text=" + encodeURIComponent(texto) : "");
  };
  // mistura o objeto salvo com os padrões (campos novos sempre existem)
  const mesclarSite = (salvo) => {
    const base = JSON.parse(JSON.stringify(DADOS_INICIAIS.site));
    const s = Object.assign(base, salvo || {});
    s.secoes = Object.assign({}, DADOS_INICIAIS.site.secoes, (salvo || {}).secoes || {});
    return s;
  };

  function conectar() {
    const c = window.SCX_CONFIG || {};
    if (!c.supabaseUrl || !c.supabaseAnonKey || !window.supabase) return null;
    try { return window.supabase.createClient(c.supabaseUrl, c.supabaseAnonKey); }
    catch (e) { console.error("Supabase:", e); return null; }
  }

  /* ---------- aplicativo (PWA): registra e convida para instalar ---------- */
  function instalarApp(opcoes) {
    if ("serviceWorker" in navigator && location.protocol !== "file:") {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
    const chave = "scx-instalar-" + opcoes.id;
    const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
    if (standalone) return;
    let adiado = false;
    try { adiado = Date.now() < Number(localStorage.getItem(chave) || 0); } catch (e) {}
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !/crios|fxios/i.test(navigator.userAgent);
    let evento = null;
    const css = document.createElement("style");
    css.textContent = `.scx-inst{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(14px + env(safe-area-inset-bottom,0px));z-index:95;width:min(520px,calc(100% - 24px));background:#1f2170;color:#fff;border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,.3);display:flex;gap:12px;align-items:center;padding:12px 14px;font:15px/1.35 "Barlow",system-ui,sans-serif}
      .scx-inst img{width:44px;height:44px;border-radius:10px;flex:none}.scx-inst div{flex:1;min-width:0}.scx-inst b{display:block}.scx-inst small{color:#d7d9ff}
      .scx-inst button{border:0;border-radius:8px;padding:8px 12px;font:inherit;font-weight:700;cursor:pointer}.scx-inst .s{background:#ffe814;color:#1f2170}.scx-inst .n{background:transparent;color:#d7d9ff;padding:8px 6px}`;
    document.head.appendChild(css);
    function mostrar() {
      if (adiado || document.querySelector(".scx-inst")) return;
      const el = document.createElement("div"); el.className = "scx-inst"; el.setAttribute("role", "dialog");
      el.innerHTML = `<img src="${opcoes.icone}" alt=""><div><b>${opcoes.titulo}</b><small>${ios ? 'No Safari, toque em <b style="display:inline">Compartilhar</b> e depois em <b style="display:inline">Adicionar à Tela de Início</b>.' : opcoes.texto}</small></div>${ios ? "" : '<button class="s" type="button">Instalar</button>'}<button class="n" type="button" aria-label="Agora não">${ios ? "Ok" : "Agora não"}</button>`;
      document.body.appendChild(el);
      const fechar = (dias) => { el.remove(); try { localStorage.setItem(chave, String(Date.now() + dias * 864e5)); } catch (e) {} };
      el.querySelector(".n").onclick = () => fechar(opcoes.diasAdiar || 7);
      const s = el.querySelector(".s");
      if (s) s.onclick = async () => { if (!evento) return fechar(1); evento.prompt(); const r = await evento.userChoice.catch(() => ({})); evento = null; fechar(r.outcome === "accepted" ? 365 : (opcoes.diasAdiar || 7)); };
    }
    window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); evento = e; setTimeout(mostrar, opcoes.atraso || 0); if (opcoes.aoDisponivel) opcoes.aoDisponivel(); });
    window.addEventListener("appinstalled", () => { const el = document.querySelector(".scx-inst"); if (el) el.remove(); try { localStorage.setItem(chave, String(Date.now() + 365 * 864e5)); } catch (e) {} });
    if (ios && opcoes.mostrarNoIos) setTimeout(mostrar, opcoes.atraso || 0);
    return { abrir() { adiado = false; if (evento || ios) mostrar(); }, get disponivel() { return !!evento || ios; } };
  }

  window.SCX = { instalarApp, ICONES, NOMES_ICONES, DADOS_INICIAIS, esc, brl, urlSegura, soDigitos, linkWhats, mesclarSite, conectar };
})();
