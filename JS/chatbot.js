/* ============================================================
   CHATBOT IA · INFOACTIVA v5.0  (AMIGABLE + INTELIGENTE)
   - Personalidad "Info" cálida, boliviana, con chispa
   - Matching por prioridad + frases largas (evita falsos positivos)
   - Respuestas cortas pero cariñosas
   - Comandos de voz: "activa la voz" / "cállate"
   - Saludo según hora del día
   - Se reinicia en cada visita (sin localStorage)
   - 4 capas de respuesta + Gemini
   - Voz integrada: TTS + STT
   ============================================================ */

(function () {
  'use strict';

  // ============================================================
  // PERSONALIDAD
  // ============================================================
  const BOT = {
    nombre: 'Info',
    emoji: '🤖',
    firma: '— Equipo Infoactiva 💙🧡'
  };

  // ============================================================
  // CONFIGURACIÓN
  // ============================================================
  const CONFIG = {
    API_ENDPOINT: 'https://infoactiva-chat.typ2-infoactiva.workers.dev',
    WHATSAPP_NUMBER: '59178960751',
    MAX_HISTORY: 12,
    DEBUG: false,
    TIMEOUT_MS: 4000,
    FALLBACK_FIRST: true,
    TYPING_DELAY: 400,
    WHATSAPP_REDIRECT_DELAY: 1500
  };

  const SYSTEM_PROMPT = `Eres "${BOT.nombre}", el asistente virtual de Infoactiva (Bolivia, gestión documental, +15 años).

PERSONALIDAD:
- Español boliviano, cercano, cálido, con chispa.
- Tuteo siempre ("tú", "te", "quieres"). Nunca "usted".
- Expresiones suaves: "al toque", "de una", "chévere", "con gusto", "sin problema".
- 1-2 emojis por mensaje, con intención.
- Frases CORTAS. Máximo 3-4 líneas.
- Termina con una pregunta cálida tipo "¿Quieres saber más?" o "¿Te cuento?".

EMPRESA: Infoactiva, gestión documental integral. La Paz, Cochabamba, Santa Cruz. +15 años.

SERVICIOS: custodia, archivo en sitio, digitalización, BPM/software, medios magnéticos, seguridad, destrucción, organización, asesoría.

CONTACTOS:
- WhatsApp general: +591 78960751
- Santa Cruz: 78960752
- La Paz: 77231547
- Cochabamba: 75838069

REGLAS:
1. SIEMPRE breve y cálido. Nada de listas de 8 items.
2. NUNCA digas "no sé". Di "uy, esa no me la sé 😅 pero mi equipo sí".
3. NUNCA inventes datos.
4. Usa <strong> solo para 1-2 palabras.
5. Máximo 1 enlace.
6. Empieza algunas con "¡Claro!", "¡De una!", "¡Con gusto!".`;

  // ============================================================
  // BASE DE CONOCIMIENTO
  // Respuestas CORTAS pero CÁLIDAS, con personalidad
  // El campo "priority" ayuda a desempatar
  // El campo "intent" activa comportamientos especiales
  // El campo "action" ejecuta acciones (voz)
  // ============================================================
  const KNOWLEDGE_BASE = [

    // ===== COMANDOS DE VOZ (máxima prioridad) =====
    {
      keywords: ['habla por voz','hablar por voz','puedes hablar','activa la voz','activa voz','prende la voz','enciende la voz','hablame','háblame','quiero que hables','di algo','lee en voz alta'],
      priority: 50,
      action: 'voice_on',
      response: `¡Listo! 🔊 Ya activé mi voz, de ahora en adelante te leo las respuestas.<br><br>Si quieres que me calle, solo dime "<strong>cállate</strong>" 😉`
    },
    {
      keywords: ['callate','cállate','silencio','desactiva la voz','apaga la voz','no hables','deja de hablar','mute','mudo','no quiero que hables'],
      priority: 50,
      action: 'voice_off',
      response: `🔇 Ok, ya me callo. Cuando quieras que hable otra vez, dime "<strong>activa la voz</strong>".`
    },

    // ===== SALUDOS =====
    {
      keywords: ['hola','buenos dias','buenas tardes','buenas noches','hey','saludos','qué tal','que tal','buen día','buen dia','hi','hello','holi','que onda','qué onda','wenas','buenas'],
      priority: 6,
      response: `¡Hola! 👋 Qué gusto tenerte por aquí.<br><br>Soy <strong>Info</strong>, tu asistente de Infoactiva. ¿En qué te doy una mano hoy? 😊`
    },

    // ===== DIGITALIZACIÓN (específico) =====
    {
      keywords: ['digitalizacion','digitalización','digitalizar','digitalizan','escanear','escaneo','escanean','pdf','escáner','escaner','papel a digital','documento digital','digitalizacion de documentos','digitalización de documentos'],
      priority: 12,
      response: `🖨️ ¡Claro que sí! Hacemos <strong>digitalización</strong> de documentos.<br><br>Convertimos papel en archivos digitales al toque, así buscas todo en segundos y liberas espacio.<br><br>¿Quieres que te cuente los beneficios o prefieres cotizar? 😊`
    },
    {
      keywords: ['beneficios de la digitalizacion','beneficios digitalizacion','ventajas digitalizacion','beneficios de digitalizar','beneficio digitalizar','para que sirve digitalizar','para que sirve la digitalizacion'],
      priority: 25,
      response: `Los 3 grandes beneficios son:<br><br>⚡ Encuentras todo en segundos<br>💾 Ahorras muchísimo espacio<br>🔐 Respaldas y proteges la info<br><br>¿Te cotizo tu caso? 😊`
    },

    // ===== CUSTODIA =====
    {
      keywords: ['custodia','guardar','almacenar','resguardo','almacenamiento','guardan','cajas','deposito','depósito','bodega','custodia de documentos'],
      priority: 10,
      response: `¡Buena elección! 📦 <strong>Custodia de documentos</strong><br><br>Ideal para lo que no consultas seguido. Liberas espacio, tienes acceso controlado y recuperas rápido cuando lo pidas.<br><br>¿Quieres más detalles o cotizar?`
    },

    // ===== ARCHIVO EN SITIO =====
    {
      keywords: ['archivo en sitio','en sitio','in house','inhouse','en tus oficinas','en mi oficina','en mi empresa','archivo en tus oficinas'],
      priority: 10,
      response: `🏢 <strong>Archivo en sitio</strong><br><br>Llevamos nuestra experiencia a <strong>tus instalaciones</strong>. Personal capacitado, organización y estándares de seguridad.<br><br>¿Te interesa? 😊`
    },

    // ===== AUTOMATIZACIÓN / SOFTWARE =====
    {
      keywords: ['automatizacion','automatización','automatiz','bpm','software','sistema','desarrollo','app','aplicacion','aplicación','programa','sistema informatico','sistema informático','digitalizar procesos'],
      priority: 9,
      response: `🤖 <strong>BPM / Software a medida</strong><br><br>Automatizamos tus procesos para que todo fluya más rápido y con trazabilidad.<br><br>¿Quieres que te cuente un caso? 😉`
    },

    // ===== SEGURIDAD =====
    {
      keywords: ['seguridad','protegen','confidencial','certificado','protegido','cuidan','ciberseguridad','resguardo seguro','como protegen','cómo protegen'],
      priority: 9,
      response: `🔒 <strong>Seguridad garantizada</strong><br><br>Control de temperatura 24/7, protección contra incendios, vigilancia permanente y confidencialidad total.<br><br>Tu info está en buenas manos 😊`
    },

    // ===== MEDIOS MAGNÉTICOS =====
    {
      keywords: ['medios magneticos','medios magnéticos','disco duro','discos duros','cintas','backup','respaldo','usb','servidor','servidores','cinta de respaldo'],
      priority: 9,
      response: `💾 <strong>Resguardo de medios magnéticos</strong><br><br>Cuidamos discos duros, cintas LTO, USB y servidores como se debe.<br><br>¿Te interesa? 😊`
    },

    // ===== DESTRUCCIÓN =====
    {
      keywords: ['destruccion','destrucción','destruir','eliminar','incinerar','borrar','triturar','deshacerse','destruccion segura'],
      priority: 9,
      response: `🔥 <strong>Destrucción segura</strong><br><br>Proceso certificado con acta de destrucción y confidencialidad total.<br><br>¿Coordinamos una? 😉`
    },

    // ===== ORGANIZACIÓN =====
    {
      keywords: ['organizacion','organización','inventario','inventariado','clasificar','ordenar','clasificacion','clasificación'],
      priority: 7,
      response: `📋 <strong>Organización e inventariado</strong><br><br>Dejamos tu archivo codificado y encontrable en segundos.<br><br>¿Hablamos? 😊`
    },

    // ===== ASESORÍA =====
    {
      keywords: ['asesoria','asesoría','consultoria','consultoría','acompañamiento','experto','aconsejan'],
      priority: 7,
      response: `👔 <strong>Asesoría especializada</strong><br><br>Diagnóstico, plan personalizado y capacitación para tu equipo.<br><br>¿Agendamos una llamada? 😊`
    },

    // ===== SERVICIOS (general) =====
    {
      keywords: ['servicio','servicios','ofrecen','que hacen','qué hacen','tienen','portafolio','soluciones','catalogo','catálogo','productos'],
      priority: 6,
      response: `¡Claro! 📁 En <strong>Infoactiva</strong> hacemos 4 cosas grandes:<br><br>📦 Custodia y archivo<br>🖨️ Digitalización<br>🤖 Software a medida<br>🔒 Seguridad documental<br><br>¿Cuál te interesa? 😊`
    },

    // ===== UBICACIONES =====
    {
      keywords: ['ubicacion','ubicación','donde quedan','dónde quedan','donde estan','dónde están','sucursal','sucursales','ciudades','oficina','oficinas','direccion','dirección','localizacion','localización'],
      priority: 10,
      response: `📍 Estamos en 3 ciudades de Bolivia:<br><br>🟠 <strong>Santa Cruz</strong> · 78960752<br>🔵 <strong>La Paz</strong> · 77231547<br>🟢 <strong>Cochabamba</strong> · 75838069<br><br>¿A cuál te queda más cerca? 😊`
    },
    {
      keywords: ['almacenes','depositos','depósitos','donde guardan','dónde guardan','donde almacenan','dónde almacenan'],
      priority: 10,
      response: `Nuestros almacenes están en las 3 ciudades donde operamos: <strong>Santa Cruz, La Paz y Cochabamba</strong>.<br><br>¿Quieres el contacto de alguna? 😊`
    },

    // ===== CONTACTO =====
    {
      keywords: ['contacto','telefono','teléfono','whatsapp','celular','numero','número','llamar','email','correo','comunicarme','escribir'],
      priority: 9,
      response: `📞 ¡Hablemos! 💬 <a href="https://wa.me/59178960751" target="_blank">WhatsApp general: +591 78960751</a><br><br>O por sucursal:<br>🟠 SC: 78960752 · 🔵 LP: 77231547 · 🟢 CBBA: 75838069`
    },

    // ===== COTIZACIÓN =====
    {
      keywords: ['cotiza','cotizacion','cotización','precio','precios','costo','costos','cuanto cuesta','cuánto cuesta','cuanto sale','cuánto sale','tarifa','presupuesto','cuanto cobran','cuánto cobran','pago','pagar','vale','cobran'],
      priority: 20,
      intent: 'quote',
      response: `¡Vamos con esa cotización! 💰<br><br>Para darte un número exacto necesito saber: <strong>volumen</strong>, <strong>frecuencia de consulta</strong> y si quieres <strong>digitalización</strong>.<br><br><strong>¿Te conecto con un asesor por WhatsApp ahora mismo?</strong><br><br><a href="https://wa.me/59178960751?text=Hola%2C%20quisiera%20una%20cotizaci%C3%B3n" target="_blank" class="chatbot-cta-link">✅ Sí, quiero cotizar</a><br><br>O responde "<strong>sí</strong>" 😉`
    },

    // ===== EMPRESA =====
    {
      keywords: ['quienes son','quiénes son','sobre infoactiva','sobre ustedes','empresa','nosotros','historia','infoactiva'],
      priority: 6,
      response: `🏢 Somos una empresa boliviana de <strong>gestión documental</strong> con +15 años de experiencia. Estamos en La Paz, Cochabamba y Santa Cruz.<br><br>¿Qué te gustaría saber? 😊`
    },

    // ===== HORARIOS =====
    {
      keywords: ['horario','horarios','hora','atienden','abren','cierran','cuando atienden','cuándo atienden','abierto','disponible'],
      priority: 7,
      response: `🕐 Lunes a Viernes de <strong>8:30 a 18:30</strong>, sábados de <strong>9:00 a 13:00</strong>.<br><br>Pero por WhatsApp nos escribes <strong>24/7</strong> 😉`
    },

    // ===== AGRADECIMIENTOS =====
    {
      keywords: ['gracias','thanks','agradezco','agradecido','muy amable','agradecida','mil gracias','te agradezco'],
      priority: 5,
      response: `¡Con mucho gusto! 😊 Para eso estoy.<br><br>Si necesitas algo más, aquí sigo. ¡Que tengas excelente día! ☀️`
    },

    // ===== DESPEDIDAS =====
    {
      keywords: ['adios','adiós','chao','hasta luego','nos vemos','bye','me voy','hasta pronto','chau','me despido'],
      priority: 5,
      response: `¡Nos vemos! 👋 Fue un gusto ayudarte.<br><br>Si más adelante necesitas algo, escríbenos al toque por <a href="https://wa.me/59178960751" target="_blank">WhatsApp</a>.<br><br>¡Que tengas lindo día! ☀️🧡`
    },

    // ===== AYUDA =====
    {
      keywords: ['ayuda','ayudar','ayudame','ayúdame','asistencia','necesito','requiero','quisiera','pueden ayudarme','me pueden ayudar'],
      priority: 5,
      response: `¡Claro que sí! 🤝 Estoy aquí para eso.<br><br>Cuéntame qué necesitas: servicios, cotización, ubicaciones o seguridad. ¿Por dónde empezamos? 😊`
    },

    // ===== QUEJAS =====
    {
      keywords: ['queja','reclamo','problema','malo','pesimo','pésimo','no funciona','no sirve','error','reclamar','quejarme'],
      priority: 7,
      response: `Uy, lamento escuchar eso 😔<br><br>Escríbenos directo y lo resolvemos al toque:<br><br>💬 <a href="https://wa.me/59178960751" target="_blank">WhatsApp: 78960751</a><br>📧 <a href="contacto.html">Formulario</a><br><br>Te atendemos personalmente, palabra.`
    },

    // ===== ELOGIOS =====
    {
      keywords: ['excelente','buenisimo','buenísimo','genial','perfecto','muy bueno','increible','increíble','maravilloso','bacán','bacan','chévere','chevere'],
      priority: 4,
      response: `¡Qué alegría leer eso! 🌟 Gracias por la buena onda.<br><br>¿Hay algo más en lo que te pueda ayudar? 😊`
    },

    // ===== AFIRMACIONES =====
    {
      keywords: ['si','sí','ok','okay','dale','claro','por favor','porfavor','porfa','obvio','correcto','afirmativo','de una','deuna'],
      priority: 2,
      response: `¡De una! 👍 Cuéntame, ¿qué necesitas?<br><br>📁 Servicios · 💰 Cotizar · 📍 Ubicaciones · 🔒 Seguridad`
    },

    // ===== NEGACIONES =====
    {
      keywords: ['no','nop','nel','para nada','no gracias','no por ahora'],
      priority: 2,
      response: `Sin problema 👍 Quedo atento por si más adelante necesitas algo.<br><br>¡Que estés bien! ☀️`
    },

    // ===== SEGUIMIENTO GENÉRICO =====
    {
      keywords: ['cuales son los beneficios','cuáles son los beneficios','que beneficios','qué beneficios','beneficios','ventajas','para que sirve','para qué sirve'],
      priority: 3,
      response: `¿Beneficios de cuál servicio? 😊 Cuéntame un poquito más y te doy los detalles exactos.`
    },

    // ===== FAQ: REQUISITOS =====
    {
      keywords: ['requisitos','necesito para','como empiezo','cómo empiezo','como contrato','cómo contrato','empezar','contratar'],
      priority: 6,
      response: `📝 <strong>¿Cómo empezamos?</strong><br><br>1️⃣ Nos escribes<br>2️⃣ Evaluamos tu caso<br>3️⃣ Te cotizamos<br>4️⃣ Coordinamos la recolección<br><br>📞 <a href="https://wa.me/59178960751" target="_blank">Empezar ahora</a>`
    },

    // ===== FAQ: TIEMPO =====
    {
      keywords: ['cuanto tiempo','cuánto tiempo','demora','tarda','plazo','tiempo de entrega','cuando estara','cuándo estará'],
      priority: 6,
      response: `⏱️ Depende del volumen y tipo de proyecto:<br><br>📦 Custodia: inmediato<br>🖨️ Digitalización: según volumen<br>📋 Organización: 1-3 semanas<br><br>Contáctanos para un plazo exacto: <a href="https://wa.me/59178960751" target="_blank">WhatsApp</a>`
    },

    // ===== FAQ: CONFIDENCIALIDAD =====
    {
      keywords: ['datos personales','privacidad','gdpr','confidencialidad','nda','acuerdo','contrato'],
      priority: 6,
      response: `🔐 <strong>Confidencialidad garantizada</strong><br><br>Trabajamos con NDA, protocolos certificados y personal verificado.<br><br>Más info: <a href="seguridad.html">Seguridad</a>`
    },

    // ===== FAQ: RECOLECCIÓN =====
    {
      keywords: ['recoleccion','recolección','recogen','recoger','recojo','retiran','retiro','traslado','transporte'],
      priority: 6,
      response: `🚚 ¡Sí, recogemos! Embalaje profesional, transporte custodiado e inventario al llegar.<br><br>📞 Coordinemos: <a href="https://wa.me/59178960751" target="_blank">WhatsApp</a>`
    },

    // ===== FAQ: CONSULTA DE DOCUMENTOS =====
    {
      keywords: ['consultar documento','consultar documentos','pedir documento','solicitar documento','acceso','consultas','prestamo','préstamo'],
      priority: 6,
      response: `📄 Pides cualquier documento cuando lo necesites:<br><br>💬 Por WhatsApp o email<br>⚡ Respuesta en horas<br>📦 Entrega física o digital<br><br>Más info: <a href="custodia.html">Custodia</a>`
    },

    // ===== FAQ: PAGO =====
    {
      keywords: ['forma de pago','formas de pago','como pago','cómo pago','transferencia','efectivo','factura','facturación'],
      priority: 6,
      response: `💳 Aceptamos transferencia, efectivo y facturación oficial.<br><br>Los detalles se acuerdan en la cotización.<br><br>📞 <a href="https://wa.me/59178960751" target="_blank">Consultar</a>`
    },

    // ===== FAQ: CAPACIDAD =====
    {
      keywords: ['capacidad','cuanto pueden','cuánto pueden','volumen','cuantas cajas','cuántas cajas','cuantos documentos','cuántos documentos'],
      priority: 6,
      response: `📊 Manejamos cualquier tamaño: desde 10 cajas hasta miles, y medios magnéticos ilimitados.<br><br>Contáctanos para evaluar tu caso: <a href="https://wa.me/59178960751" target="_blank">WhatsApp</a>`
    },

    // ===== FAQ: CLIENTES =====
    {
      keywords: ['clientes','quienes son sus clientes','quiénes son sus clientes','con quien trabajan','con quién trabajan','trabajan con'],
      priority: 6,
      response: `🏢 Trabajamos con bancos, gobierno, hidrocarburos, sector salud y empresas privadas.<br><br>Más info: <a href="quienes-somos.html">Quiénes Somos</a>`
    },

    // ===== FAQ: CERTIFICACIONES =====
    {
      keywords: ['certificacion','certificación','iso','certificados','normas','estandares','estándares'],
      priority: 6,
      response: `🏆 Contamos con procesos certificados, estándares internacionales y +15 años de experiencia.<br><br>Más info: <a href="seguridad.html">Seguridad</a>`
    },

    // ===== FAQ: DIFERENCIA =====
    {
      keywords: ['diferencia','por que elegirlos','por qué elegirlos','por que ustedes','por qué ustedes'],
      priority: 6,
      response: `⭐ <strong>¿Por qué elegirnos?</strong><br><br>🏆 +15 años<br>🔒 Seguridad certificada<br>📍 3 sucursales<br>⚡ Respuesta rápida<br><br>Más info: <a href="quienes-somos.html">Conócenos</a>`
    }
  ];

  // ============================================================
  // NORMALIZAR
  // ============================================================
  function normalize(text) {
    return String(text || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[¿?¡!.,;:()"']/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // ============================================================
  // MATCHING INTELIGENTE (prioridad + score)
  // ============================================================
  function findInKnowledgeBase(query) {
    const q = normalize(query);
    if (!q) return null;

    const qWords = q.split(' ');
    let best = null;
    let bestScore = 0;

    for (const item of KNOWLEDGE_BASE) {
      let score = 0;
      const priority = item.priority || 1;

      for (const kw of item.keywords) {
        const kwNorm = normalize(kw);
        if (!kwNorm) continue;

        const isMultiWord = kwNorm.includes(' ');

        if (isMultiWord && q.includes(kwNorm)) {
          // Frase larga → match fuerte
          score += kwNorm.length * 3 + priority * 2;
        } else if (!isMultiWord) {
          if (qWords.includes(kwNorm)) {
            score += kwNorm.length * 2 + priority;
          } else if (kwNorm.length >= 4 && q.includes(kwNorm)) {
            score += kwNorm.length + priority;
          }
        }
      }

      if (score > bestScore) {
        bestScore = score;
        best = item;
      }
    }

    return bestScore > 0 ? best : null;
  }

  // ============================================================
  // BÚSQUEDA PARCIAL
  // ============================================================
  function findPartialMatch(query) {
    const words = normalize(query).split(/\s+/).filter(w => w.length > 3);
    if (words.length === 0) return null;

    for (const word of words) {
      for (const item of KNOWLEDGE_BASE) {
        for (const kw of item.keywords) {
          const kwNorm = normalize(kw);
          if (kwNorm.length > 4 && (word.includes(kwNorm) || kwNorm.includes(word))) {
            return item;
          }
        }
      }
    }
    return null;
  }

  // ============================================================
  // RESPUESTA POR DEFECTO
  // ============================================================
  function getDefaultResponse() {
    const defaults = [
      `Mmm, esa no me la sé de memoria 🤔 pero mi equipo sí.<br><br>¿Te paso el WhatsApp para que te respondan al toque?`,
      `Uy, me agarraste desprevenido 😅 ¿Quieres que te conecte con un asesor humano?`,
      `No tengo esa respuesta exacta, pero no te dejo colgado 🙌 ¿Te paso el WhatsApp del equipo?`
    ];
    return defaults[Math.floor(Math.random() * defaults.length)];
  }

  // ============================================================
  // COTIZACIÓN
  // ============================================================
  let waitingForQuoteConfirmation = false;

  const YES_WORDS = ['si','sí','claro','dale','ok','okay','de una','deuna','por favor','porfavor','porfa','afirmativo','correcto','vamos','perfecto','listo','acepto','obvio'];
  const NO_WORDS  = ['no','nop','nel','para nada','no gracias','despues','después','luego','mas tarde','más tarde','ahora no','todavia no','todavía no','no por ahora'];

  function detectQuoteIntent(text) {
    const n = normalize(text);
    if (!n) return { isYes: false, isNo: false };
    const match = (list) => list.some(w => {
      const wN = normalize(w);
      return n === wN || n.startsWith(wN + ' ') || n.endsWith(' ' + wN) || n.includes(' ' + wN + ' ');
    });
    return { isYes: match(YES_WORDS), isNo: match(NO_WORDS) };
  }

  function openWhatsAppQuote() {
    const msg = encodeURIComponent('Hola, quisiera una cotización sobre los servicios de Infoactiva. Vengo del chat web.');
    window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  }

  // ============================================================
  // DOM
  // ============================================================
  let chatHistory = [];
  let isProcessing = false;

  const widget       = document.getElementById('chatbotWidget');
  const toggle       = document.getElementById('chatbotToggle');
  const closeBtn     = document.getElementById('chatbotClose');
  const clearBtn     = document.getElementById('chatbotClear');
  const body         = document.getElementById('chatbotBody');
  const input        = document.getElementById('chatbotInput');
  const sendBtn      = document.getElementById('chatbotSend');
  const quickReplies = document.getElementById('chatbotQuickReplies');

  if (!widget || !body) return;

  function escapeHTML(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
  function scrollToBottom() { body.scrollTop = body.scrollHeight; }

  // ============================================================
  // RENDER
  // ============================================================
  function addMessage(role, content) {
    const msg = document.createElement('div');
    msg.className = `chatbot-message ${role === 'user' ? 'user' : 'bot'}`;
    const avatarIcon = role === 'user' ? 'fa-user' : 'fa-robot';

    msg.innerHTML = `
      <div class="chatbot-msg-avatar"><i class="fas ${avatarIcon}"></i></div>
      <div class="chatbot-msg-content">${content}</div>
    `;
    body.appendChild(msg);
    scrollToBottom();

    chatHistory.push({ role: role === 'user' ? 'user' : 'assistant', content });
    if (chatHistory.length > CONFIG.MAX_HISTORY * 2) {
      chatHistory = chatHistory.slice(-CONFIG.MAX_HISTORY * 2);
    }

    if (role === 'bot' && window.Voice && typeof window.Voice.speak === 'function') {
      window.Voice.speak(content);
    }
  }

  function showTyping() {
    if (document.getElementById('chatbotTypingIndicator')) return;
    const typing = document.createElement('div');
    typing.className = 'chatbot-message bot';
    typing.id = 'chatbotTypingIndicator';
    typing.innerHTML = `
      <div class="chatbot-msg-avatar"><i class="fas fa-robot"></i></div>
      <div class="chatbot-typing"><span></span><span></span><span></span></div>
    `;
    body.appendChild(typing);
    scrollToBottom();
  }

  function hideTyping() {
    const t = document.getElementById('chatbotTypingIndicator');
    if (t) t.remove();
  }

  // ============================================================
  // ASK AI (4 capas)
  // ============================================================
  async function askAI(userMessage) {
    if (CONFIG.FALLBACK_FIRST) {
      const quickMatch = findInKnowledgeBase(userMessage);
      if (quickMatch) return quickMatch;
    }

    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), CONFIG.TIMEOUT_MS);

      const res = await fetch(CONFIG.API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatHistory.slice(-CONFIG.MAX_HISTORY), { role: 'user', content: userMessage }],
          systemPrompt: SYSTEM_PROMPT
        }),
        signal: controller.signal
      });

      clearTimeout(tid);
      const data = await res.json();

      if (res.ok && data.reply && data.reply.trim() !== 'Sin respuesta') {
        return { response: data.reply };
      }
    } catch (err) {}

    const exact = findInKnowledgeBase(userMessage);
    if (exact) return exact;

    const partial = findPartialMatch(userMessage);
    if (partial) return partial;

    return { response: getDefaultResponse() };
  }

  // ============================================================
  // ENVIAR MENSAJE
  // ============================================================
  async function sendMessage(text) {
    if (isProcessing || !text || !text.trim()) return;
    isProcessing = true;
    if (sendBtn) sendBtn.disabled = true;
    if (quickReplies) quickReplies.style.display = 'none';

    addMessage('user', escapeHTML(text));
    if (input) { input.value = ''; input.style.height = 'auto'; }

    showTyping();
    await new Promise(r => setTimeout(r, CONFIG.TYPING_DELAY));

    let reply;

    // --- Confirmación de cotización pendiente ---
    if (waitingForQuoteConfirmation) {
      const { isYes, isNo } = detectQuoteIntent(text);

      if (isYes) {
        reply = `¡Perfecto! 🎉 Te llevo a nuestro <strong>WhatsApp</strong>...<br><br>Si no se abre, toca aquí:<br><br>💬 <a href="https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=Hola%2C%20quisiera%20una%20cotizaci%C3%B3n" target="_blank">Abrir WhatsApp</a><br><br>¡Te atienden al toque! ⚡`;
        hideTyping();
        addMessage('bot', reply);
        waitingForQuoteConfirmation = false;
        setTimeout(() => openWhatsAppQuote(), CONFIG.WHATSAPP_REDIRECT_DELAY);
        isProcessing = false;
        if (sendBtn) sendBtn.disabled = false;
        return;
      }

      if (isNo) {
        reply = `¡Sin problema! 👍 Cuando lo necesites, aquí estoy.<br><br>¿Te ayudo con algo más mientras? 😊`;
        waitingForQuoteConfirmation = false;
        hideTyping();
        addMessage('bot', reply);
        isProcessing = false;
        if (sendBtn) sendBtn.disabled = false;
        if (input) input.focus();
        return;
      }

      waitingForQuoteConfirmation = false;
    }

    // --- Flujo normal ---
    const match = await askAI(text);
    const item = match && match.response ? match : { response: match };
    const responseText = item.response || '';

    // Ejecutar acción de voz si aplica
    if (item.action === 'voice_on' && window.Voice && window.Voice.enable) {
      window.Voice.enable();
    }
    if (item.action === 'voice_off' && window.Voice && window.Voice.disable) {
      window.Voice.disable();
    }

    hideTyping();
    addMessage('bot', responseText);

    if (typeof responseText === 'string' && responseText.includes('¿Te conecto con un asesor')) {
      waitingForQuoteConfirmation = true;
    }

    isProcessing = false;
    if (sendBtn) sendBtn.disabled = false;
    if (input) input.focus();
  }

  // ============================================================
  // BIENVENIDA (saludo según hora)
  // ============================================================
  function showWelcome() {
    const hora = new Date().getHours();
    let saludo = '¡Hola!';
    if (hora < 12) saludo = '¡Buenos días!';
    else if (hora < 19) saludo = '¡Buenas tardes!';
    else saludo = '¡Buenas noches!';

    const welcome = `${saludo} 👋 Soy <strong>${BOT.nombre}</strong>, tu asistente de Infoactiva.<br><br>Estoy aquí para ayudarte con lo que necesites 😊<br><br>¿Sobre qué te gustaría saber hoy?<ul><li>📁 Nuestros servicios</li><li>💰 Cotizar un proyecto</li><li>📍 Ubicaciones y contactos</li><li>🔒 Cómo protegemos tu info</li></ul>`;
    addMessage('bot', welcome);
  }

  // ============================================================
  // EVENTOS
  // ============================================================
  toggle?.addEventListener('click', () => {
    widget.classList.toggle('open');
    if (widget.classList.contains('open')) setTimeout(() => input?.focus(), 300);
  });

  closeBtn?.addEventListener('click', () => widget.classList.remove('open'));

  clearBtn?.addEventListener('click', () => {
    if (!confirm('¿Iniciar una nueva conversación?')) return;
    body.innerHTML = '';
    chatHistory = [];
    waitingForQuoteConfirmation = false;
    if (window.Voice && window.Voice.stopSpeaking) window.Voice.stopSpeaking();
    showWelcome();
  });

  sendBtn?.addEventListener('click', () => sendMessage(input.value));

  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input.value); }
  });

  input?.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 100) + 'px';
  });

  quickReplies?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-msg]');
    if (btn) sendMessage(btn.dataset.msg);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && widget.classList.contains('open')) widget.classList.remove('open');
  });

  // ============================================================
  // MÓDULO DE VOZ
  // ============================================================
  const Voice = (function () {
    const synth = window.speechSynthesis;
    let ttsEnabled = false;
    let recognition = null;
    let isListening = false;

    const voiceBtn = document.getElementById('chatbotVoice');
    const micBtn   = document.getElementById('chatbotMic');

    function getSpanishVoice() {
      if (!synth) return null;
      const voices = synth.getVoices();
      return voices.find(v => /es[-_]MX|es[-_]US|es[-_]419/i.test(v.lang))
          || voices.find(v => /es[-_]AR|es[-_]CO|es[-_]CL|es[-_]PE/i.test(v.lang))
          || voices.find(v => /^es/i.test(v.lang)) || null;
    }

    function cleanText(html) {
      const d = document.createElement('div'); d.innerHTML = html;
      return (d.textContent || d.innerText || '').replace(/\s+/g, ' ').trim();
    }

    function speak(text) {
      if (!ttsEnabled || !synth) return;
      const clean = cleanText(text);
      if (!clean) return;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(clean);
      const v = getSpanishVoice();
      if (v) u.voice = v;
      u.lang = v?.lang || 'es-MX';
      u.rate = 1; u.pitch = 1; u.volume = 1;
      synth.speak(u);
    }

    function stopSpeaking() { if (synth) synth.cancel(); }

    function enable() {
      ttsEnabled = true;
      voiceBtn?.classList.add('active');
      if (voiceBtn) voiceBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    }

    function disable() {
      ttsEnabled = false;
      voiceBtn?.classList.remove('active');
      if (voiceBtn) voiceBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
      stopSpeaking();
    }

    function toggleTTS() { if (ttsEnabled) disable(); else enable(); }

    function initRecognition() {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) return null;
      const rec = new SR();
      rec.lang = 'es-MX';
      rec.continuous = false;
      rec.interimResults = true;
      rec.onstart = () => { isListening = true; micBtn?.classList.add('listening'); };
      rec.onresult = (e) => {
        let finalTxt = '', interim = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const t = e.results[i][0].transcript;
          if (e.results[i].isFinal) finalTxt += t; else interim += t;
        }
        if (input) {
          input.value = (finalTxt || interim).trim();
          if (finalTxt.trim()) setTimeout(() => sendMessage(finalTxt.trim()), 400);
        }
      };
      rec.onerror = () => { isListening = false; micBtn?.classList.remove('listening'); };
      rec.onend   = () => { isListening = false; micBtn?.classList.remove('listening'); };
      return rec;
    }

    function toggleListening() {
      if (!recognition) recognition = initRecognition();
      if (!recognition) { alert('Tu navegador no soporta reconocimiento de voz. Prueba Chrome.'); return; }
      if (isListening) recognition.stop();
      else try { recognition.start(); } catch (e) {}
    }

    function init() {
      if (synth) { synth.onvoiceschanged = () => synth.getVoices(); synth.getVoices(); }
      voiceBtn?.addEventListener('click', toggleTTS);
      micBtn?.addEventListener('click', toggleListening);
    }

    return { init, speak, stopSpeaking, toggleTTS, enable, disable };
  })();

  window.Voice = Voice;
  Voice.init();

  // ============================================================
  // INIT
  // ============================================================
  document.addEventListener('DOMContentLoaded', () => {
    chatHistory = [];
    waitingForQuoteConfirmation = false;
    isProcessing = false;
    body.innerHTML = '';

    let welcomeShown = false;
    toggle?.addEventListener('click', () => {
      if (!welcomeShown && widget.classList.contains('open')) {
        welcomeShown = true;
        setTimeout(showWelcome, 400);
      }
    });

    if (widget.classList.contains('open')) {
      welcomeShown = true;
      showWelcome();
    }
  });

})();