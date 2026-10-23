import { useEffect, useMemo, useRef, useState } from 'react';
import { api, auth, image } from '@appdeploy/client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import BuiltInTools from './components/BuiltInTools';
import {
  ArrowUpRight,
  PackageOpen,
  BookOpen,
  Check,
  ChevronDown,
  Code2,
  Compass,
  Copy,
  Download,
  Globe,
  Languages,
  Loader2,
  Menu,
  MessageCircle,
  PanelLeftClose,
  Paperclip,
  PenLine,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';

type Language = 'en' | 'fr' | 'ar';
type Mode =
  | 'assistant'
  | 'research'
  | 'writing'
  | 'study'
  | 'coding'
  | 'planning';
type SourceLink = {
  title: string;
  url: string;
  snippet: string;
  domain: string;
  publishedAt?: string;
};
type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
  sources?: SourceLink[];
};
type Conversation = {
  id: string;
  title: string;
  updatedAt: number;
  messages: ChatMessage[];
};

const storageKey = 'elrouji.conversations.v1';
const languageKey = 'elrouji.language.v1';
const activeKey = 'elrouji.active.v1';

const copy = {
  en: {
    newChat: 'New chat',
    searchChats: 'Search chats',
    recent: 'Recent conversations',
    workspace: 'Workspace',
    assistant: 'Assistant',
    research: 'Research',
    writing: 'Writing',
    study: 'Study & learn',
    coding: 'Coding',
    planning: 'Planning',
    madeFor: 'Made for Algeria',
    tagline: 'Your AI partner for ideas, work, and everyday life.',
    connected: 'AI connected',
    checking: 'Checking connection',
    offline: 'Connection unavailable',
    welcomeEyebrow: 'YOUR IDEAS. YOUR TOOLS. REAL RESULTS.',
    greeting: 'What shall we make possible today?',
    intro:
      'Ask in Arabic, Darija, French, or English. Start with a question, or choose a task below.',
    quickStart: 'Start with a task',
    researchTitle: 'Explore a topic',
    researchDesc: 'Break down a complex question',
    writeTitle: 'Write something',
    writeDesc: 'Draft, rewrite, or translate',
    studyTitle: 'Learn step by step',
    studyDesc: 'Understand a concept clearly',
    planTitle: 'Build a plan',
    planDesc: 'Turn a goal into next steps',
    inputPlaceholder: 'Message EL-Rouji…',
    send: 'Send message',
    enterHint: 'Enter to send · Shift + Enter for a new line',
    privateNote: 'Your chat history is saved in this browser on this device.',
    syncedNote: 'Your conversations are synced to your account and this browser.',
    localOnly: 'Local history',
    syncEnabled: 'Cloud sync enabled',
    signInSync: 'Sign in to sync',
    signIn: 'Sign in',
    signOut: 'Sign out',
    syncInfo: 'Sign in to sync your conversations across devices. Until then, your history stays in this browser.',
    syncSuccess: 'Your conversations are synced',
    accountProblem: 'Could not sync conversations. Please try again.',
    accountBusy: 'Connecting account…',
    signedInAs: 'Signed in as',
    about: 'About this build',
    close: 'Close',
    preferences: 'Preferences',
    language: 'Language',
    dataTitle: 'Your data',
    dataBody:
      'Sign in to your EL-Rouji account to sync conversations across devices. Local history remains available in this browser.',
    clearHistory: 'Clear all local history',
    clearConfirm: 'Delete all conversations saved in this browser?',
    cleared: 'Local history cleared',
    cancel: 'Cancel',
    export: 'Export chat',
    copy: 'Copy',
    copied: 'Copied to clipboard',
    deleted: 'Conversation deleted',
    noHistory: 'No saved conversations yet',
    noSearch: 'No conversations match that search',
    historyTitle: 'Your conversations',
    assistantName: 'EL-Rouji',
    you: 'You',
    thinking: 'EL-Rouji is thinking…',
    genericError:
      'I could not reach the AI service just now. Please try again.',
    emptyError: 'Write a message first.',
    rightTitle: 'An AI partner for the Algerian people',
    rightBody:
      'A multilingual companion for learning, work, creativity, and everyday problem-solving.',
    languagesTitle: 'Speak your language',
    languagesBody: 'Arabic · Algerian Darija · French · English',
    capabilitiesTitle: 'Core assistant is active',
    capability1: 'Ask questions and draft content',
    capability2: 'Explain topics and help with code',
    capability3: 'Plan projects and compare options',
    notConnectedTitle: 'Not connected yet',
    notConnectedBody:
      'Third-party app integrations and scheduled tasks still need separate integration work. Research mode checks live web sources when configured.',
    safetyTitle: 'Designed with care',
    safetyBody:
      'EL-Rouji should be clear about uncertainty and never pretend a tool ran when it did not.',
    buildLabel: 'FIRST RELEASE · CORE ASSISTANT',
    newConversation: 'Start a new conversation',
    modeLabel: 'Mode',
    messageFrom: 'Message',
    confirmDelete: 'Delete this conversation?',
    confirmSignOut: 'Sign out of EL-Rouji?',
    accountConnected: 'Account connected',
    cloudSync: 'Cloud sync',
    webResearchReady: 'Live web search ready · source links included',
    webResearchSetup: 'Web search needs a Tavily key. You can also paste a public page URL to analyze one page.',
    researchUnavailable: 'Live web search is not configured yet. Store TAVILY_API_KEY in the secure app settings.',
    sourcesLabel: 'Sources',
    attachFile: 'Attach an image or text file',
    removeAttachment: 'Remove attachment',
    unsupportedFile: 'Use PNG, JPG, WebP images or TXT, MD, CSV, JSON files.',
    fileTooLarge: 'Images must be under 8 MB; text files under 120 KB.',
    fileAnalysisUnavailable: 'I could not analyze that attachment. Check the file type and try again.',
    imageDefault: 'Describe the image and identify its key details.',
    documentDefault: 'Summarize this file and extract the key points.',
    researching: 'Searching the web and checking sources…',
  },
  fr: {
    newChat: 'Nouvelle discussion',
    searchChats: 'Rechercher',
    recent: 'Discussions récentes',
    workspace: 'Espace de travail',
    assistant: 'Assistant',
    research: 'Recherche',
    writing: 'Rédaction',
    study: 'Étudier',
    coding: 'Programmation',
    planning: 'Planification',
    madeFor: 'Pensé pour l’Algérie',
    tagline: 'Votre partenaire IA pour les idées, le travail et le quotidien.',
    connected: 'IA connectée',
    checking: 'Vérification…',
    offline: 'Connexion indisponible',
    welcomeEyebrow: 'VOS IDÉES. VOS OUTILS. DES RÉSULTATS CONCRETS.',
    greeting: 'Que pouvons-nous accomplir aujourd’hui ?',
    intro:
      'Posez vos questions en arabe, en darija, en français ou en anglais. Choisissez une tâche pour commencer.',
    quickStart: 'Commencer par une tâche',
    researchTitle: 'Explorer un sujet',
    researchDesc: 'Clarifier une question complexe',
    writeTitle: 'Rédiger un texte',
    writeDesc: 'Écrire, reformuler ou traduire',
    studyTitle: 'Apprendre pas à pas',
    studyDesc: 'Comprendre un concept',
    planTitle: 'Créer un plan',
    planDesc: 'Transformer un objectif en étapes',
    inputPlaceholder: 'Écrivez à EL-Rouji…',
    send: 'Envoyer',
    enterHint: 'Entrée pour envoyer · Maj + Entrée pour un retour à la ligne',
    privateNote:
      'Vos discussions sont enregistrées dans ce navigateur sur cet appareil.',
    syncedNote: 'Vos discussions sont synchronisées avec votre compte et ce navigateur.',
    localOnly: 'Historique local',
    syncEnabled: 'Synchronisation cloud activée',
    signInSync: 'Connectez-vous pour synchroniser',
    signIn: 'Se connecter',
    signOut: 'Se déconnecter',
    syncInfo: 'Connectez-vous pour retrouver vos discussions sur plusieurs appareils. Sans connexion, elles restent dans ce navigateur.',
    syncSuccess: 'Vos discussions sont synchronisées',
    accountProblem: 'Impossible de synchroniser les discussions. Réessayez.',
    accountBusy: 'Connexion au compte…',
    signedInAs: 'Connecté en tant que',
    about: 'À propos de cette version',
    close: 'Fermer',
    preferences: 'Préférences',
    language: 'Langue',
    dataTitle: 'Vos données',
    dataBody:
      'Connectez-vous à votre compte EL-Rouji pour synchroniser vos discussions entre vos appareils. L’historique local reste disponible dans ce navigateur.',
    clearHistory: 'Effacer tout l’historique local',
    clearConfirm:
      'Supprimer toutes les discussions enregistrées dans ce navigateur ?',
    cleared: 'Historique local effacé',
    cancel: 'Annuler',
    export: 'Exporter la discussion',
    copy: 'Copier',
    copied: 'Copié',
    deleted: 'Discussion supprimée',
    noHistory: 'Aucune discussion enregistrée',
    noSearch: 'Aucune discussion trouvée',
    historyTitle: 'Vos discussions',
    assistantName: 'EL-Rouji',
    you: 'Vous',
    thinking: 'EL-Rouji réfléchit…',
    genericError: 'Le service IA est momentanément inaccessible. Réessayez.',
    emptyError: 'Écrivez un message avant l’envoi.',
    rightTitle: 'Un partenaire IA pour le peuple algérien',
    rightBody:
      'Un compagnon multilingue pour apprendre, travailler, créer et résoudre les problèmes du quotidien.',
    languagesTitle: 'Parlez votre langue',
    languagesBody: 'Arabe · Darija algérienne · Français · Anglais',
    capabilitiesTitle: 'Assistant principal actif',
    capability1: 'Répondre et rédiger des contenus',
    capability2: 'Expliquer des sujets et aider en code',
    capability3: 'Planifier et comparer des options',
    notConnectedTitle: 'Pas encore connecté',
    notConnectedBody:
      'Les intégrations d’applications tierces et les tâches planifiées nécessitent encore du travail. Le mode Recherche consulte le web en direct lorsqu’il est configuré.',
    safetyTitle: 'Conçu avec soin',
    safetyBody:
      'EL-Rouji doit signaler ses incertitudes et ne jamais prétendre avoir exécuté un outil qui ne l’a pas été.',
    buildLabel: 'PREMIÈRE VERSION · ASSISTANT PRINCIPAL',
    newConversation: 'Démarrer une discussion',
    modeLabel: 'Mode',
    messageFrom: 'Message',
    confirmDelete: 'Supprimer cette discussion ?',
    confirmSignOut: 'Se déconnecter de EL-Rouji ?',
    accountConnected: 'Compte connecté',
    cloudSync: 'Synchronisation cloud',
    webResearchReady: 'Recherche web active · liens des sources inclus',
    webResearchSetup: 'La recherche web nécessite une clé Tavily. Vous pouvez aussi coller l’URL d’une page publique.',
    researchUnavailable: 'La recherche web n’est pas configurée. Ajoutez TAVILY_API_KEY dans les paramètres sécurisés.',
    sourcesLabel: 'Sources',
    attachFile: 'Joindre une image ou un fichier texte',
    removeAttachment: 'Retirer la pièce jointe',
    unsupportedFile: 'Formats acceptés : images PNG/JPG/WebP ou fichiers TXT/MD/CSV/JSON.',
    fileTooLarge: 'Images : moins de 8 Mo ; fichiers texte : moins de 120 Ko.',
    fileAnalysisUnavailable: 'Impossible d’analyser cette pièce jointe. Vérifiez le format puis réessayez.',
    imageDefault: 'Décrivez cette image et ses détails principaux.',
    documentDefault: 'Résumez ce fichier et extrayez les idées clés.',
    researching: 'Recherche web et vérification des sources…',
  },
  ar: {
    newChat: 'محادثة جديدة',
    searchChats: 'ابحث في المحادثات',
    recent: 'المحادثات الأخيرة',
    workspace: 'مساحة العمل',
    assistant: 'المساعد',
    research: 'البحث',
    writing: 'الكتابة',
    study: 'التعلّم',
    coding: 'البرمجة',
    planning: 'التخطيط',
    madeFor: 'صُمّم للجزائر',
    tagline: 'شريكك الذكي للأفكار والعمل والحياة اليومية.',
    connected: 'الذكاء الاصطناعي متصل',
    checking: 'جارٍ التحقق من الاتصال',
    offline: 'الاتصال غير متاح',
    welcomeEyebrow: 'أفكارك. أدواتك. نتائج حقيقية.',
    greeting: 'ماذا يمكننا إنجازه اليوم؟',
    intro:
      'اسأل بالعربية أو الدارجة الجزائرية أو الفرنسية أو الإنجليزية. اختر مهمة للبدء.',
    quickStart: 'ابدأ بمهمة',
    researchTitle: 'استكشف موضوعًا',
    researchDesc: 'حلّل سؤالًا معقدًا',
    writeTitle: 'اكتب شيئًا',
    writeDesc: 'اكتب أو حسّن أو ترجم',
    studyTitle: 'تعلّم خطوة بخطوة',
    studyDesc: 'افهم فكرة بوضوح',
    planTitle: 'أنشئ خطة',
    planDesc: 'حوّل هدفًا إلى خطوات',
    inputPlaceholder: 'اكتب إلى EL-Rouji…',
    send: 'إرسال',
    enterHint: 'Enter للإرسال · Shift + Enter لسطر جديد',
    privateNote: 'يُحفظ سجل المحادثات في هذا المتصفح وعلى هذا الجهاز.',
    syncedNote: 'تتم مزامنة المحادثات مع حسابك وهذا المتصفح.',
    localOnly: 'سجل محلي',
    syncEnabled: 'المزامنة السحابية مفعّلة',
    signInSync: 'سجّل الدخول للمزامنة',
    signIn: 'تسجيل الدخول',
    signOut: 'تسجيل الخروج',
    syncInfo: 'سجّل الدخول لمزامنة محادثاتك بين أجهزتك. قبل ذلك، تبقى المحادثات محفوظة في هذا المتصفح.',
    syncSuccess: 'تمت مزامنة محادثاتك',
    accountProblem: 'تعذرت مزامنة المحادثات. حاول مجددًا.',
    accountBusy: 'جارٍ ربط الحساب…',
    signedInAs: 'مسجّل الدخول باسم',
    about: 'حول هذه النسخة',
    close: 'إغلاق',
    preferences: 'التفضيلات',
    language: 'اللغة',
    dataTitle: 'بياناتك',
    dataBody:
      'سجّل الدخول إلى حساب EL-Rouji لمزامنة المحادثات بين أجهزتك. سيبقى السجل المحلي متاحًا في هذا المتصفح.',
    clearHistory: 'مسح السجل المحلي',
    clearConfirm: 'هل تريد حذف جميع المحادثات المحفوظة في هذا المتصفح؟',
    cleared: 'تم مسح السجل المحلي',
    cancel: 'إلغاء',
    export: 'تصدير المحادثة',
    copy: 'نسخ',
    copied: 'تم النسخ',
    deleted: 'تم حذف المحادثة',
    noHistory: 'لا توجد محادثات محفوظة بعد',
    noSearch: 'لا توجد محادثات مطابقة',
    historyTitle: 'محادثاتك',
    assistantName: 'EL-Rouji',
    you: 'أنت',
    thinking: 'يفكر EL-Rouji…',
    genericError: 'تعذّر الاتصال بخدمة الذكاء الاصطناعي الآن. حاول مرة أخرى.',
    emptyError: 'اكتب رسالة أولاً.',
    rightTitle: 'شريك ذكاء اصطناعي للشعب الجزائري',
    rightBody:
      'مساعد متعدد اللغات للتعلّم والعمل والإبداع وحل مشكلات الحياة اليومية.',
    languagesTitle: 'تحدّث بلغتك',
    languagesBody: 'العربية · الدارجة الجزائرية · الفرنسية · الإنجليزية',
    capabilitiesTitle: 'المساعد الأساسي نشط',
    capability1: 'الإجابة عن الأسئلة وكتابة المحتوى',
    capability2: 'شرح المواضيع والمساعدة في البرمجة',
    capability3: 'تخطيط المشاريع ومقارنة الخيارات',
    notConnectedTitle: 'لم يتم الربط بعد',
    notConnectedBody:
      'لا تزال تكاملات التطبيقات الخارجية والمهام المجدولة بحاجة إلى العمل. يستخدم وضع البحث مصادر الويب المباشرة عند إعداد الخدمة.',
    safetyTitle: 'مصمّم بمسؤولية',
    safetyBody:
      'يجب أن يوضح EL-Rouji حدود معرفته وألا يدّعي تشغيل أدوات لم تُستخدم.',
    buildLabel: 'الإصدار الأول · المساعد الأساسي',
    newConversation: 'ابدأ محادثة جديدة',
    modeLabel: 'الوضع',
    messageFrom: 'رسالة',
    confirmDelete: 'حذف هذه المحادثة؟',
    confirmSignOut: 'تسجيل الخروج من EL-Rouji؟',
    accountConnected: 'الحساب متصل',
    cloudSync: 'المزامنة السحابية',
    webResearchReady: 'البحث المباشر في الويب متاح · روابط المصادر مرفقة',
    webResearchSetup: 'يحتاج البحث إلى مفتاح Tavily. يمكنك أيضًا لصق رابط صفحة عامة لتحليلها.',
    researchUnavailable: 'لم يتم إعداد البحث المباشر بعد. أضف TAVILY_API_KEY في إعدادات التطبيق الآمنة.',
    sourcesLabel: 'المصادر',
    attachFile: 'إرفاق صورة أو ملف نصي',
    removeAttachment: 'إزالة المرفق',
    unsupportedFile: 'استخدم صور PNG/JPG/WebP أو ملفات TXT/MD/CSV/JSON.',
    fileTooLarge: 'يجب أن تكون الصور أقل من 8 ميغابايت والملفات النصية أقل من 120 كيلوبايت.',
    fileAnalysisUnavailable: 'تعذر تحليل الملف المرفق. تحقق من نوع الملف وحاول مجددًا.',
    imageDefault: 'صف الصورة وحدد تفاصيلها الأساسية.',
    documentDefault: 'لخّص الملف واستخرج أهم النقاط.',
    researching: 'جارٍ البحث في الويب والتحقق من المصادر…',
  },
};

const modeNames: Record<Language, Record<Mode, string>> = {
  en: {
    assistant: 'Assistant',
    research: 'Research',
    writing: 'Writing',
    study: 'Study',
    coding: 'Coding',
    planning: 'Planning',
  },
  fr: {
    assistant: 'Assistant',
    research: 'Recherche',
    writing: 'Rédaction',
    study: 'Étude',
    coding: 'Code',
    planning: 'Planification',
  },
  ar: {
    assistant: 'المساعد',
    research: 'البحث',
    writing: 'الكتابة',
    study: 'التعلّم',
    coding: 'البرمجة',
    planning: 'التخطيط',
  },
};

const modeIcons = {
  assistant: Sparkles,
  research: Search,
  writing: PenLine,
  study: BookOpen,
  coding: Code2,
  planning: Compass,
};

const starterPrompts: Record<
  Language,
  Array<{ mode: Mode; title: string; desc: string; prompt: string }>
> = {
  en: [
    {
      mode: 'research',
      title: 'Explore a topic',
      desc: 'Understand the key ideas',
      prompt:
        'Help me understand this topic clearly. Separate established facts from uncertainty: ',
    },
    {
      mode: 'writing',
      title: 'Write something',
      desc: 'Draft or improve a text',
      prompt: 'Help me write a clear, polished text about: ',
    },
    {
      mode: 'study',
      title: 'Learn step by step',
      desc: 'Make a difficult idea simple',
      prompt: 'Teach me this step by step, with a simple example: ',
    },
    {
      mode: 'planning',
      title: 'Build a plan',
      desc: 'Turn a goal into action',
      prompt: 'Help me turn this goal into a realistic step-by-step plan: ',
    },
  ],
  fr: [
    {
      mode: 'research',
      title: 'Explorer un sujet',
      desc: 'Comprendre les idées clés',
      prompt:
        'Aidez-moi à comprendre ce sujet. Distinguez les faits établis des incertitudes : ',
    },
    {
      mode: 'writing',
      title: 'Rédiger un texte',
      desc: 'Écrire ou améliorer',
      prompt: 'Aidez-moi à rédiger un texte clair et soigné sur : ',
    },
    {
      mode: 'study',
      title: 'Apprendre pas à pas',
      desc: 'Simplifier une idée difficile',
      prompt:
        'Expliquez-moi ce sujet étape par étape avec un exemple simple : ',
    },
    {
      mode: 'planning',
      title: 'Créer un plan',
      desc: 'Passer de l’objectif à l’action',
      prompt: 'Aidez-moi à transformer cet objectif en étapes concrètes : ',
    },
  ],
  ar: [
    {
      mode: 'research',
      title: 'استكشف موضوعًا',
      desc: 'افهم الأفكار الأساسية',
      prompt:
        'ساعدني على فهم هذا الموضوع بوضوح، وميّز بين الحقائق وما هو غير مؤكّد: ',
    },
    {
      mode: 'writing',
      title: 'اكتب شيئًا',
      desc: 'اكتب نصًا أو حسّنه',
      prompt: 'ساعدني في كتابة نص واضح وجيد حول: ',
    },
    {
      mode: 'study',
      title: 'تعلّم خطوة بخطوة',
      desc: 'بسّط فكرة صعبة',
      prompt: 'اشرح لي هذا الموضوع خطوة بخطوة مع مثال بسيط: ',
    },
    {
      mode: 'planning',
      title: 'أنشئ خطة',
      desc: 'حوّل الهدف إلى خطوات',
      prompt: 'ساعدني في تحويل هذا الهدف إلى خطة عملية خطوة بخطوة: ',
    },
  ],
};

function makeId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
    return crypto.randomUUID();
  return String(Date.now()) + Math.random().toString(36).slice(2);
}

function readConversations(): Conversation[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is Conversation =>
          item &&
          typeof item.id === 'string' &&
          typeof item.title === 'string' &&
          Array.isArray(item.messages)
      )
      .slice(0, 40);
  } catch {
    return [];
  }
}

function upsertConversation(
  list: Conversation[],
  id: string,
  messages: ChatMessage[]
): Conversation[] {
  const firstUserMessage =
    messages.find(message => message.role === 'user')?.content || 'New chat';
  const title =
    firstUserMessage.length > 44
      ? firstUserMessage.slice(0, 44).trimEnd() + '…'
      : firstUserMessage;
  const conversation: Conversation = {
    id,
    title,
    updatedAt: Date.now(),
    messages,
  };
  return [conversation, ...list.filter(item => item.id !== id)].slice(0, 40);
}

function App() {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem(languageKey);
    return saved === 'fr' || saved === 'ar' ? saved : 'en';
  });
  const [conversations, setConversations] =
    useState<Conversation[]>(readConversations);
  const [activeId, setActiveId] = useState<string | null>(() =>
    localStorage.getItem(activeKey)
  );
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('assistant');
  const [activeView, setActiveView] = useState<'chat' | 'tools'>('chat');
  const [isSending, setIsSending] = useState(false);
  const [connection, setConnection] = useState<
    'checking' | 'ready' | 'offline'
  >('checking');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyQuery, setHistoryQuery] = useState('');
  const [toast, setToast] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [webSearchReady, setWebSearchReady] = useState(false);
  const [account, setAccount] = useState<{ userId: string; name?: string; email?: string } | null>(null);
  const [accountBusy, setAccountBusy] = useState(false);
  const [cloudReady, setCloudReady] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const t = copy[language];
  const activeConversation = conversations.find(item => item.id === activeId);
  const messages = activeConversation?.messages ?? [];
  const isArabic = language === 'ar';
  const privateNote = account ? t.syncedNote : t.privateNote;

  const connectAccount = async (
    signedInAccount: { userId: string; name?: string; email?: string },
    localConversations: Conversation[],
    notify = false
  ) => {
    const response = await api.get('/api/conversations');
    const remote = Array.isArray(response.data?.conversations)
      ? (response.data.conversations as Conversation[])
      : [];
    const remoteById = new Map(remote.map(conversation => [conversation.id, conversation]));
    const mergedById = new Map<string, Conversation>();

    for (const conversation of remote) mergedById.set(conversation.id, conversation);
    for (const conversation of localConversations) {
      const previous = mergedById.get(conversation.id);
      if (!previous || conversation.updatedAt > previous.updatedAt) {
        mergedById.set(conversation.id, conversation);
      }
    }

    const merged = [...mergedById.values()]
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 40);
    setConversations(merged);
    setAccount(signedInAccount);
    setCloudReady(true);

    const localToUpload = merged.filter(conversation => {
      const remoteConversation = remoteById.get(conversation.id);
      const localConversation = localConversations.find(item => item.id === conversation.id);
      return localConversation &&
        (!remoteConversation || localConversation.updatedAt > remoteConversation.updatedAt);
    });
    const results = await Promise.all(
      localToUpload.map(conversation =>
        api.put('/api/conversations/' + encodeURIComponent(conversation.id), conversation)
          .then(() => true)
          .catch(() => false)
      )
    );
    if (notify) {
      setToast(results.some(result => !result) ? t.accountProblem : t.syncSuccess);
    } else if (results.some(result => !result)) {
      setToast(t.accountProblem);
    }
  };

  const saveCloudConversation = async (conversation: Conversation) => {
    if (!account || !cloudReady) return;
    try {
      await api.put('/api/conversations/' + encodeURIComponent(conversation.id), conversation);
    } catch {
      setToast(t.accountProblem);
    }
  };

  const signInAndSync = async () => {
    setAccountBusy(true);
    try {
      const result = await auth.signIn();
      await connectAccount(result.user, conversations, true);
    } catch {
      setToast(t.accountProblem);
    } finally {
      setAccountBusy(false);
    }
  };

  const signOutAccount = async () => {
    if (!window.confirm(t.confirmSignOut)) return;
    setAccountBusy(true);
    try {
      await auth.signOut();
      setAccount(null);
      setCloudReady(false);
      setToast(t.localOnly);
    } catch {
      setToast(t.accountProblem);
    } finally {
      setAccountBusy(false);
    }
  };

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem(languageKey, language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (activeId) localStorage.setItem(activeKey, activeId);
    else localStorage.removeItem(activeKey);
  }, [activeId]);

  useEffect(() => {
    let mounted = true;
    if (!auth.isSignedIn()) {
      setAccountBusy(false);
      return () => { mounted = false; };
    }
    setAccountBusy(true);
    auth.getUser()
      .then(async signedInAccount => {
        if (!mounted || !signedInAccount) return;
        try {
          await connectAccount(signedInAccount, conversations, false);
        } catch {
          if (mounted) setToast(t.accountProblem);
        } finally {
          if (mounted) setAccountBusy(false);
        }
      })
      .catch(() => {
        if (mounted) setAccountBusy(false);
      });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    api
      .get('/api/health')
      .then(response => {
        if (mounted && response.data?.ok === true) {
          setConnection('ready');
          setWebSearchReady(response.data?.capabilities?.webResearch === true);
        } else if (mounted) {
          setConnection('offline');
          setWebSearchReady(false);
        }
      })
      .catch(() => {
        if (mounted) setConnection('offline');
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length, isSending]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const filteredConversations = useMemo(() => {
    const query = historyQuery.trim().toLowerCase();
    if (!query) return conversations;
    return conversations.filter(
      conversation =>
        conversation.title.toLowerCase().includes(query) ||
        conversation.messages.some(message =>
          message.content.toLowerCase().includes(query)
        )
    );
  }, [conversations, historyQuery]);

  const startNewChat = () => {
    setActiveView('chat');
    setActiveId(null);
    setInput('');
    setMode('assistant');
    setSidebarOpen(false);
  };

  const selectMode = (nextMode: Mode) => {
    setActiveView('chat');
    setMode(nextMode);
    setSidebarOpen(false);
  };

  const addMessage = (id: string, nextMessages: ChatMessage[]) => {
    setConversations(previous =>
      upsertConversation(previous, id, nextMessages)
    );
  };

  const selectAttachment = (file: File | null) => {
    if (!file) return;
    const filename = file.name.toLowerCase();
    const isImage = /\.(png|jpe?g|webp)$/.test(filename);
    const isTextDocument = /\.(txt|md|csv|json)$/.test(filename);
    if (!isImage && !isTextDocument) {
      setToast(t.unsupportedFile);
      return;
    }
    if (file.size > (isImage ? 8 * 1024 * 1024 : 120 * 1024)) {
      setToast(t.fileTooLarge);
      return;
    }
    setPendingFile(file);
  };

  const sendMessage = async () => {
    const text = input.trim();
    const selectedFile = pendingFile;
    if ((!text && !selectedFile) || isSending) {
      if (!text && !selectedFile) setToast(t.emptyError);
      return;
    }

    const conversationId = activeId || makeId();
    const existingMessages = conversations.find(item => item.id === conversationId)?.messages ?? [];
    const taskPrompt = text || (selectedFile
      ? (/\.(png|jpe?g|webp)$/i.test(selectedFile.name) ? t.imageDefault : t.documentDefault)
      : '');
    const userContent = selectedFile ? 'Attachment: ' + selectedFile.name + '\n' + taskPrompt : taskPrompt;
    const userMessage: ChatMessage = { id: makeId(), role: 'user', content: userContent, createdAt: Date.now() };
    const nextMessages = [...existingMessages, userMessage];
    setActiveId(conversationId);
    addMessage(conversationId, nextMessages);
    setInput('');
    setPendingFile(null);
    setIsSending(true);

    try {
      let response: { data: any };
      if (selectedFile) {
        if (/\.(png|jpe?g|webp)$/i.test(selectedFile.name)) {
          const desiredMimeType = /\.png$/i.test(selectedFile.name)
            ? 'image/png'
            : /\.webp$/i.test(selectedFile.name) ? 'image/webp' : 'image/jpeg';
          const prepared = await image.resizeIfNeeded(selectedFile, {
            maxDimension: 1600,
            maxPixels: 2000000,
            quality: 0.82,
            mimeType: desiredMimeType,
          });
          if (prepared.bytes > 6 * 1024 * 1024) throw new Error('Prepared image exceeds supported size.');
          response = await api.post('/api/analyze-image', {
            imageData: prepared.data,
            mimeType: prepared.mimeType,
            filename: selectedFile.name,
            question: taskPrompt,
            language,
          });
        } else {
          const content = await selectedFile.text();
          if (content.length > 100000) throw new Error('Text file exceeds supported size.');
          response = await api.post('/api/analyze-document', {
            filename: selectedFile.name,
            content,
            question: taskPrompt,
            language,
          });
        }
      } else if (mode === 'research') {
        response = await api.post('/api/research', { query: taskPrompt, language });
      } else {
        response = await api.post('/api/chat', {
          messages: nextMessages.slice(-16).map(message => ({ role: message.role, content: message.content })),
          language,
          mode,
        });
      }

      const reply = typeof response.data?.reply === 'string' && response.data.reply.trim()
        ? response.data.reply.trim() : t.genericError;
      const sources: SourceLink[] = Array.isArray(response.data?.sources)
        ? response.data.sources.filter((source: SourceLink) =>
            source && typeof source.title === 'string' &&
            typeof source.url === 'string' && /^https?:\/\//i.test(source.url)
          ).slice(0, 8)
        : [];
      const assistantMessage: ChatMessage = {
        id: makeId(),
        role: 'assistant',
        content: reply,
        createdAt: Date.now(),
        ...(sources.length ? { sources } : {}),
      };
      const finalMessages = [...nextMessages, assistantMessage];
      setConversations(previous => {
        const saved = previous.find(item => item.id === conversationId);
        return upsertConversation(previous, conversationId, [...(saved?.messages ?? nextMessages), assistantMessage]);
      });
      void saveCloudConversation(upsertConversation(conversations, conversationId, finalMessages)[0]);
    } catch {
      const failureText = mode === 'research' && !webSearchReady
        ? t.researchUnavailable
        : selectedFile ? t.fileAnalysisUnavailable : t.genericError;
      const errorMessage: ChatMessage = { id: makeId(), role: 'assistant', content: failureText, createdAt: Date.now() };
      const failedMessages = [...nextMessages, errorMessage];
      setConversations(previous => {
        const saved = previous.find(item => item.id === conversationId);
        return upsertConversation(previous, conversationId, [...(saved?.messages ?? nextMessages), errorMessage]);
      });
      void saveCloudConversation(upsertConversation(conversations, conversationId, failedMessages)[0]);
    } finally {
      setIsSending(false);
    }
  };

  const useStarter = (starter: { mode: Mode; prompt: string }) => {
    setActiveView('chat');
    setMode(starter.mode);
    setInput(starter.prompt);
    setSidebarOpen(false);
  };

  const deleteConversation = (id: string) => {
    if (!window.confirm(t.confirmDelete)) return;
    setConversations(previous => previous.filter(item => item.id !== id));
    if (account && cloudReady) {
      void api.delete('/api/conversations/' + encodeURIComponent(id))
        .catch(() => setToast(t.accountProblem));
    }
    if (activeId === id) setActiveId(null);
    setToast(t.deleted);
  };

  const clearHistory = () => {
    if (!window.confirm(t.clearConfirm)) return;
    if (account && cloudReady) {
      void Promise.all(
        conversations.map(conversation =>
          api.delete('/api/conversations/' + encodeURIComponent(conversation.id))
        )
      ).catch(() => setToast(t.accountProblem));
    }
    setConversations([]);
    setActiveId(null);
    setSettingsOpen(false);
    setToast(t.cleared);
  };

  const exportConversation = () => {
    if (!activeConversation) return;
    const text =
      '# ' +
      activeConversation.title +
      '\n\n' +
      activeConversation.messages
        .map(
          message =>
            (message.role === 'user' ? t.you : t.assistantName) +
            ':\n' +
            message.content
        )
        .join('\n\n---\n\n');
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'el-rouji-conversation.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyMessage = async (message: ChatMessage) => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedId(message.id);
      setToast(t.copied);
      window.setTimeout(() => setCopiedId(null), 1500);
    } catch {
      setToast('Copy is not available in this browser.');
    }
  };

  const modeEntries: Array<{ key: Mode; icon: typeof Sparkles }> = [
    { key: 'assistant', icon: Sparkles },
    { key: 'research', icon: Search },
    { key: 'writing', icon: PenLine },
    { key: 'study', icon: BookOpen },
    { key: 'coding', icon: Code2 },
    { key: 'planning', icon: Compass },
  ];

  return (
    <div
      className={'app-shell' + (isArabic ? ' is-rtl' : '')}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <aside className={'sidebar' + (sidebarOpen ? ' sidebar-open' : '')}>
        <div className="brand-row">
          <div className="brand-mark" aria-hidden="true">
            <Sparkles size={22} />
          </div>
          <div className="brand-wordmark">
            <span>EL-</span>Rouji
          </div>
          <button
            className="icon-button sidebar-close"
            aria-label={t.close}
            onClick={() => setSidebarOpen(false)}
          >
            <PanelLeftClose size={18} />
          </button>
        </div>
        <div className="brand-subline">
          <span className="algeria-dot" /> {t.madeFor}
        </div>

        <button className="new-chat-button" onClick={startNewChat}>
          <Plus size={18} strokeWidth={2.4} />
          <span>{t.newChat}</span>
          <span className="new-chat-shortcut">⌘ K</span>
        </button>

        <label className="history-search">
          <Search size={16} />
          <input
            value={historyQuery}
            onChange={event => setHistoryQuery(event.target.value)}
            placeholder={t.searchChats}
            aria-label={t.searchChats}
          />
        </label>

        <div className="side-section-label">{t.workspace}</div>
        <nav className="mode-nav" aria-label={t.workspace}>
          {modeEntries.map(({ key, icon: Icon }) => (
            <button
              key={key}
              className={'nav-item' + (mode === key ? ' nav-item-active' : '')}
              onClick={() => selectMode(key)}
            >
              <Icon size={17} />
              <span>{modeNames[language][key]}</span>
              {key === 'assistant' && <span className="nav-dot" />}
            </button>
          ))}
        </nav>

        <button
          className={'nav-item toolbox-nav-item' + (activeView === 'tools' ? ' nav-item-active' : '')}
          onClick={() => {
            setActiveView('tools');
            setSidebarOpen(false);
          }}
        >
          <PackageOpen size={17} />
          <span>{language === 'fr' ? 'Outils intégrés' : language === 'ar' ? 'الأدوات المدمجة' : 'Built-in Tools'}</span>
          {activeView === 'tools' && <span className="nav-dot" />}
        </button>

        <div className="side-history-heading">
          <span>{t.recent}</span>
          <span className="history-count">{filteredConversations.length}</span>
        </div>
        <div className="history-list">
          {filteredConversations.length === 0 ? (
            <div className="empty-history">
              {historyQuery ? t.noSearch : t.noHistory}
            </div>
          ) : (
            filteredConversations.map(conversation => (
              <div
                className={
                  'history-item' +
                  (activeId === conversation.id ? ' history-item-active' : '')
                }
                key={conversation.id}
              >
                <button
                  className="history-select"
                  onClick={() => {
                    setActiveId(conversation.id);
                    setActiveView('chat');
                    setSidebarOpen(false);
                  }}
                >
                  <MessageCircle size={15} />
                  <span>{conversation.title}</span>
                </button>
                <button
                  className="history-delete"
                  aria-label={t.confirmDelete}
                  onClick={() => deleteConversation(conversation.id)}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="sidebar-bottom">
          <div className="local-storage-note">
            <ShieldCheck size={16} />
            <span>{account ? t.syncEnabled : t.localOnly}</span>
            <span className="tiny-green-dot" />
          </div>
          <button className="profile-row" onClick={() => setSettingsOpen(true)}>
            <div className="profile-avatar">ER</div>
            <div className="profile-copy">
              <strong>{account?.name || 'EL-Rouji'}</strong>
              <span>{account ? t.syncEnabled : t.signInSync}</span>
            </div>
            <Settings size={16} />
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          className="mobile-scrim"
          aria-label={t.close}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-start">
            <button
              className="icon-button mobile-menu"
              aria-label={t.workspace}
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={19} />
            </button>
            <div className="breadcrumb">
              <span>EL-Rouji</span>
              <ChevronDown size={14} />
              <strong>
                {activeConversation
                  ? activeConversation.title
                  : modeNames[language][mode]}
              </strong>
            </div>
          </div>
          <div className="topbar-end">
            <div className={'connection-pill ' + connection}>
              <span className="connection-dot" />
              {connection === 'ready'
                ? t.connected
                : connection === 'offline'
                  ? t.offline
                  : t.checking}
            </div>
            <label className="language-picker" title={t.language}>
              <Languages size={16} />
              <select
                aria-label={t.language}
                value={language}
                onChange={event => setLanguage(event.target.value as Language)}
              >
                <option value="en">EN</option>
                <option value="fr">FR</option>
                <option value="ar">عربي</option>
              </select>
              <ChevronDown size={13} />
            </label>
            <button
              className="quiet-action account-top-action"
              onClick={() => setSettingsOpen(true)}
              disabled={accountBusy}
              title={account ? t.accountConnected : t.signInSync}
            >
              {accountBusy ? <Loader2 size={14} className="spin" /> : <ShieldCheck size={14} />}
              <span>{account ? t.cloudSync : t.signInSync}</span>
            </button>
            {activeConversation && (
              <button
                className="quiet-action export-action"
                onClick={exportConversation}
              >
                <Download size={15} />
                <span>{t.export}</span>
              </button>
            )}
            <button
              className="icon-button settings-top"
              aria-label={t.preferences}
              onClick={() => setSettingsOpen(true)}
            >
              <Settings size={18} />
            </button>
          </div>
        </header>

        <div className="content-scroll">
          {activeView === 'tools' ? (
            <BuiltInTools
              language={language}
              onUsePrompt={(nextMode, prompt) => {
                setMode(nextMode);
                setInput(prompt);
                setActiveView('chat');
                setSidebarOpen(false);
              }}
              onOpenAttachment={() => {
                setActiveView('chat');
                fileInputRef.current?.click();
              }}
            />
          ) : messages.length === 0 ? (
            <section className="welcome-view">
              <div className="welcome-orbit">
                <div className="orbit-ring orbit-ring-one" />
                <div className="orbit-ring orbit-ring-two" />
                <div className="welcome-logo">
                  <Sparkles size={34} />
                </div>
                <span className="orbit-dot orbit-dot-one" />
                <span className="orbit-dot orbit-dot-two" />
              </div>
              <div className="welcome-eyebrow">
                <span className="eyebrow-line" />
                {t.welcomeEyebrow}
                <span className="eyebrow-line" />
              </div>
              <h1>{t.greeting}</h1>
              <p className="welcome-intro">{t.intro}</p>
              <div className="starter-heading">
                <span>{t.quickStart}</span>
                <span className="starter-heading-line" />
              </div>
              <div className="starter-grid">
                {starterPrompts[language].map((starter, index) => {
                  const Icon = modeIcons[starter.mode];
                  return (
                    <button
                      key={starter.mode}
                      className={'starter-card starter-' + index}
                      onClick={() => useStarter(starter)}
                    >
                      <span className="starter-icon">
                        <Icon size={19} />
                      </span>
                      <span className="starter-text">
                        <strong>{starter.title}</strong>
                        <small>{starter.desc}</small>
                      </span>
                      <ArrowUpRight size={16} className="starter-arrow" />
                    </button>
                  );
                })}
              </div>
              <div className="welcome-footnote">
                <ShieldCheck size={14} />
                <span>{privateNote}</span>
              </div>
            </section>
          ) : (
            <section className="chat-view" aria-label={t.historyTitle}>
              <div className="chat-heading">
                <div className="chat-heading-icon">
                  <Sparkles size={17} />
                </div>
                <div>
                  <span className="chat-heading-kicker">
                    {modeNames[language][mode]}
                  </span>
                  <h1>{activeConversation?.title || t.newConversation}</h1>
                </div>
              </div>
              <div className="messages-list">
                {messages.map(message => (
                  <div
                    className={
                      'message-row' +
                      (message.role === 'user'
                        ? ' message-user'
                        : ' message-assistant')
                    }
                    key={message.id}
                  >
                    {message.role === 'assistant' && (
                      <div className="message-avatar">
                        <Sparkles size={16} />
                      </div>
                    )}
                    <div className="message-body">
                      <div className="message-meta">
                        <strong>
                          {message.role === 'user' ? t.you : t.assistantName}
                        </strong>
                        <span>·</span>
                        <time>
                          {new Date(message.createdAt).toLocaleTimeString(
                            language,
                            { hour: '2-digit', minute: '2-digit' }
                          )}
                        </time>
                      </div>
                      <div className="message-text markdown-content">
                        {message.role === 'assistant' ? (
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                        ) : message.content}
                      </div>
                      {message.sources && message.sources.length > 0 && (
                        <div className="source-list">
                          <div className="source-list-heading">{t.sourcesLabel}</div>
                          {message.sources.map((source, index) => (
                            <a className="source-card" key={source.url + index} href={source.url} target="_blank" rel="noopener noreferrer">
                              <span className="source-number">{index + 1}</span>
                              <span className="source-details">
                                <strong>{source.title}</strong>
                                <small>{source.domain}{source.publishedAt ? ' · ' + source.publishedAt : ''}</small>
                                {source.snippet && <span>{source.snippet}</span>}
                              </span>
                              <ArrowUpRight size={14} className="source-open-icon" />
                            </a>
                          ))}
                        </div>
                      )}
                      {message.role === 'assistant' && (
                        <div className="message-tools">
                          <button onClick={() => copyMessage(message)}>
                            <Copy size={13} />
                            {copiedId === message.id ? t.copied : t.copy}
                          </button>
                        </div>
                      )}
                    </div>
                    {message.role === 'user' && (
                      <div className="user-avatar">You</div>
                    )}
                  </div>
                ))}
                {isSending && (
                  <div className="message-row message-assistant">
                    <div className="message-avatar">
                      <Sparkles size={16} />
                    </div>
                    <div className="message-body">
                      <div className="message-meta">
                        <strong>{t.assistantName}</strong>
                      </div>
                      <div className="thinking-pill">
                        <Loader2 size={14} className="spin" />
                        {t.thinking}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            </section>
          )}
        </div>

        <div className="composer-region">
          {mode === 'research' && (
            <div className={'research-status ' + (webSearchReady ? 'research-ready' : 'research-setup')}>
              <Globe size={14} />
              <span>{webSearchReady ? t.webResearchReady : t.webResearchSetup}</span>
            </div>
          )}
          <div className="active-mode-row">
            <span className="active-mode-label">{t.modeLabel}</span>
            {modeEntries.map(({ key, icon: Icon }) => (
              <button
                key={key}
                className={
                  'mode-chip' + (mode === key ? ' mode-chip-active' : '')
                }
                onClick={() => selectMode(key)}
              >
                <Icon size={13} />
                <span>{modeNames[language][key]}</span>
              </button>
            ))}
          </div>
          <input
            ref={fileInputRef}
            className="hidden-file-input"
            type="file"
            accept="image/png,image/jpeg,image/webp,.txt,.md,.csv,.json"
            onChange={event => {
              selectAttachment(event.currentTarget.files?.[0] ?? null);
              event.currentTarget.value = '';
            }}
          />
          <div className="composer-box">
            {pendingFile && (
              <div className="attachment-preview">
                <span className="attachment-preview-icon"><Paperclip size={14} /></span>
                <span className="attachment-filename">{pendingFile.name}</span>
                <button type="button" className="icon-button" aria-label={t.removeAttachment} title={t.removeAttachment} onClick={() => setPendingFile(null)}>
                  <X size={14} />
                </button>
              </div>
            )}
            <textarea
              value={input}
              onChange={event => setInput(event.target.value)}
              onKeyDown={event => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  void sendMessage();
                }
              }}
              placeholder={t.inputPlaceholder}
              aria-label={t.messageFrom}
              rows={2}
              maxLength={6000}
            />
            <div className="composer-bottom">
              <div className="composer-hint">
                <button type="button" className="attach-button" aria-label={t.attachFile} title={t.attachFile} onClick={() => fileInputRef.current?.click()} disabled={isSending}>
                  <Paperclip size={15} />
                </button>
                <span className="composer-sparkle"><Sparkles size={14} /></span>
                <span>{mode === 'research' ? (webSearchReady ? t.webResearchReady : t.webResearchSetup) : t.enterHint}</span>
              </div>
              <div className="composer-actions">
                <span className="char-count">{input.length}/6000</span>
                <button
                  className="send-button"
                  onClick={() => void sendMessage()}
                  disabled={isSending || (input.trim().length === 0 && !pendingFile)}
                  aria-label={t.send}
                  title={t.send}
                >
                  {isSending ? (
                    <Loader2 size={17} className="spin" />
                  ) : (
                    <Send size={17} />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="composer-disclaimer">
            {privateNote} <span>·</span> EL-Rouji AI can make mistakes.
          </div>
        </div>
      </main>

      <aside className="right-panel">
        <div className="right-topline">
          <span className="right-topline-dot" /> {t.buildLabel}
        </div>
        <section className="algeria-card">
          <div className="algeria-card-top">
            <div className="flag-mark">
              <span />
              <span />
            </div>
            <div className="national-label">
              ALGERIA <span>•</span> EL-ROUJI
            </div>
          </div>
          <h2>{t.rightTitle}</h2>
          <p>{t.rightBody}</p>
          <div className="algeria-wave">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </section>

        <section className="right-section">
          <div className="section-heading">
            <div className="section-heading-icon">
              <Languages size={16} />
            </div>
            <h3>{t.languagesTitle}</h3>
          </div>
          <p className="right-section-copy">{t.languagesBody}</p>
          <div className="language-badges">
            <span>العربية</span>
            <span>Français</span>
            <span>English</span>
            <span>Darija</span>
          </div>
        </section>

        <section className="right-section capabilities-section">
          <div className="section-heading">
            <div className="section-heading-icon green">
              <Check size={16} />
            </div>
            <h3>{t.capabilitiesTitle}</h3>
          </div>
          <ul className="capability-list">
            <li>
              <Check size={15} />
              <span>{t.capability1}</span>
            </li>
            <li>
              <Check size={15} />
              <span>{t.capability2}</span>
            </li>
            <li>
              <Check size={15} />
              <span>{t.capability3}</span>
            </li>
          </ul>
        </section>

        <section className="integration-note">
          <div className="integration-note-icon">
            <Globe size={16} />
          </div>
          <div>
            <strong>{t.notConnectedTitle}</strong>
            <p>{t.notConnectedBody}</p>
          </div>
        </section>

        <section className="care-card">
          <div className="care-icon">
            <ShieldCheck size={17} />
          </div>
          <div>
            <strong>{t.safetyTitle}</strong>
            <p>{t.safetyBody}</p>
          </div>
        </section>

        <div className="right-footer">
          <div className="footer-brand-mark">
            <Sparkles size={18} />
          </div>
          <div>
            <strong>EL-Rouji</strong>
            <span>{t.tagline}</span>
          </div>
        </div>
      </aside>

      {settingsOpen && (
        <div className="modal-backdrop" onClick={() => setSettingsOpen(false)}>
          <section
            className="settings-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
            onClick={event => event.stopPropagation()}
          >
            <div className="modal-top">
              <div className="modal-title-icon">
                <Settings size={20} />
              </div>
              <button
                className="icon-button"
                aria-label={t.close}
                onClick={() => setSettingsOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <h2 id="settings-title">{t.preferences}</h2>
            <p className="modal-intro">{t.about} · EL-Rouji</p>
            <label className="setting-row">
              <span>
                <strong>{t.language}</strong>
                <small>English · Français · العربية</small>
              </span>
              <select
                value={language}
                onChange={event => setLanguage(event.target.value as Language)}
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="ar">العربية</option>
              </select>
            </label>
            <div className="settings-data-block">
              <div className="settings-data-icon">
                <ShieldCheck size={17} />
              </div>
              <div>
                <strong>{t.dataTitle}</strong>
                <p>{account ? t.syncedNote : t.syncInfo}</p>
              </div>
            </div>
            <div className="account-settings-row">
              <div className="account-settings-copy">
                <strong>{account ? t.accountConnected : t.signInSync}</strong>
                <p>{account ? (account.email || account.name || account.userId) : t.syncInfo}</p>
              </div>
              <button
                className="account-auth-button"
                onClick={() => void (account ? signOutAccount() : signInAndSync())}
                disabled={accountBusy}
              >
                {accountBusy ? <Loader2 size={14} className="spin" /> : account ? <X size={14} /> : <ShieldCheck size={14} />}
                {accountBusy ? t.accountBusy : account ? t.signOut : t.signIn}
              </button>
            </div>
            <div className="settings-connection">
              <span className={'connection-dot ' + connection} />
              <div>
                <strong>
                  {connection === 'ready'
                    ? t.connected
                    : connection === 'offline'
                      ? t.offline
                      : t.checking}
                </strong>
                <small>API status check</small>
              </div>
            </div>
            <button className="danger-button" onClick={clearHistory}>
              <Trash2 size={16} />
              {t.clearHistory}
            </button>
            <button
              className="modal-cancel"
              onClick={() => setSettingsOpen(false)}
            >
              {t.close}
            </button>
          </section>
        </div>
      )}

      {toast && (
        <div className="toast" role="status">
          <Check size={15} />
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;
