import { useState } from 'react';
import { evaluate } from 'mathjs';
import {
  ArrowRight,
  BookOpen,
  Calculator,
  Code2,
  FileText,
  Globe,
  Languages,
  Lightbulb,
  PenLine,
  RefreshCw,
  Sparkles,
  Upload,
  WandSparkles,
} from 'lucide-react';

type Language = 'en' | 'fr' | 'ar';
type Mode = 'assistant' | 'research' | 'writing' | 'study' | 'coding' | 'planning';

type BuiltInToolsProps = {
  language: Language;
  onUsePrompt: (mode: Mode, prompt: string) => void;
  onOpenAttachment: () => void;
};

const copy = {
  en: {
    eyebrow: 'BUILT INTO EL-ROUJI',
    title: 'Your tools, all in one place.',
    subtitle: 'Practical packages for writing, learning, research, and everyday work.',
    local: 'Runs locally',
    ai: 'AI-assisted',
    pickLanguage: 'Translate into',
    english: 'English',
    french: 'French',
    arabic: 'Arabic',
    writer: 'Writing studio',
    writerDesc: 'Draft, rewrite, polish, or change the tone of any text.',
    translator: 'Translator',
    translatorDesc: 'Translate while preserving meaning, tone, and context.',
    summarizer: 'Smart summarizer',
    summarizerDesc: 'Turn long text into key points and takeaways.',
    flashcards: 'Study cards',
    flashcardsDesc: 'Generate question-and-answer flashcards for a topic.',
    code: 'Code helper',
    codeDesc: 'Explain code, find bugs, or ask for a refactor.',
    research: 'Web research',
    researchDesc: 'Ask a question and get a source-linked research summary.',
    files: 'File & image reader',
    filesDesc: 'Ask questions about an image or supported text file.',
    planner: 'Plan builder',
    plannerDesc: 'Break a goal into steps, milestones, and risks.',
    useTool: 'Use tool',
    openReader: 'Choose file',
    targetPrompt: 'Translate the text below into',
    preserve: 'Preserve its meaning and tone. Return the translation first, then note any ambiguous phrases.',
    writerPrompt: 'Act as my writing editor. Improve clarity, flow, and correctness while keeping my meaning. Ask only if essential context is missing. Text or goal:\n\n',
    summarizePrompt: 'Summarize the text below in clear sections: key idea, important points, and next actions if relevant. Do not add facts not present in the text. Text:\n\n',
    flashcardsPrompt: 'Create 10 useful study flashcards for this topic. Format as a Markdown table with Question and Answer columns, then add a short review quiz. Topic:\n\n',
    codePrompt: 'Review the code I provide. Explain what it does, identify likely bugs or security risks, and suggest a minimal corrected version. State assumptions; do not invent test results. Code and goal:\n\n',
    researchPrompt: 'Research this question using current web sources. Compare the strongest evidence, cite the numbered sources, mention disagreements and uncertainty, and do not invent citations. Question:\n',
    plannerPrompt: 'Build a practical plan for this goal. Include ordered steps, milestones, likely blockers, and the first action I can take today. Goal and constraints:\n\n',
    calculatorTitle: 'Calculator',
    calculatorDesc: 'A private, local calculator for arithmetic, powers, and common functions.',
    expression: 'Expression',
    expressionPlaceholder: 'Try: sqrt(81) + 4',
    calculate: 'Calculate',
    result: 'Result',
    calcError: 'That expression is not supported. Try a simple numeric expression with functions such as sqrt, sin, cos, abs, or log.',
    calcTip: 'Supports arithmetic, brackets, powers, pi, e, and common numeric functions. It does not send calculations to the AI.',
    quickTip: 'Choosing an AI tool opens a prepared prompt in chat. Nothing is sent until you press Send.',
  },
  fr: {
    eyebrow: 'INTÉGRÉ À EL-ROUJI',
    title: 'Vos outils, au même endroit.',
    subtitle: 'Des outils pratiques pour écrire, apprendre, rechercher et travailler.',
    local: 'Local',
    ai: 'Assisté par IA',
    pickLanguage: 'Traduire vers',
    english: 'Anglais',
    french: 'Français',
    arabic: 'Arabe',
    writer: 'Atelier d’écriture',
    writerDesc: 'Rédiger, reformuler, corriger ou changer le ton d’un texte.',
    translator: 'Traducteur',
    translatorDesc: 'Traduire en préservant le sens, le ton et le contexte.',
    summarizer: 'Résumé intelligent',
    summarizerDesc: 'Transformer un long texte en idées essentielles.',
    flashcards: 'Fiches de révision',
    flashcardsDesc: 'Créer des cartes question-réponse pour un sujet.',
    code: 'Assistant code',
    codeDesc: 'Expliquer du code, rechercher des bugs ou le refactoriser.',
    research: 'Recherche web',
    researchDesc: 'Obtenir une synthèse avec des liens vers les sources.',
    files: 'Lecteur de fichiers et images',
    filesDesc: 'Poser des questions sur une image ou un fichier texte accepté.',
    planner: 'Créateur de plan',
    plannerDesc: 'Découper un objectif en étapes, jalons et risques.',
    useTool: 'Utiliser',
    openReader: 'Choisir un fichier',
    targetPrompt: 'Traduisez le texte ci-dessous vers',
    preserve: 'Préservez son sens et son ton. Donnez d’abord la traduction, puis signalez les passages ambigus.',
    writerPrompt: 'Agissez comme mon éditeur. Améliorez la clarté, le style et la correction sans modifier le sens. Texte ou objectif :\n\n',
    summarizePrompt: 'Résumez le texte en sections claires : idée principale, points importants et prochaines actions si utile. N’ajoutez pas de faits absents du texte. Texte :\n\n',
    flashcardsPrompt: 'Créez 10 fiches de révision utiles sur ce sujet. Utilisez un tableau Markdown avec les colonnes Question et Réponse, puis un petit quiz. Sujet :\n\n',
    codePrompt: 'Analysez le code fourni. Expliquez son fonctionnement, repérez les bugs probables ou risques de sécurité, puis proposez une correction minimale. N’inventez pas de résultats de test. Code et objectif :\n\n',
    researchPrompt: 'Recherchez cette question à partir de sources web récentes. Comparez les éléments les plus solides, citez les sources numérotées et signalez les désaccords et incertitudes. Question :\n',
    plannerPrompt: 'Créez un plan pratique pour cet objectif : étapes ordonnées, jalons, obstacles probables et première action à faire aujourd’hui. Objectif et contraintes :\n\n',
    calculatorTitle: 'Calculatrice',
    calculatorDesc: 'Calcul local et privé : opérations, puissances et fonctions courantes.',
    expression: 'Expression',
    expressionPlaceholder: 'Exemple : sqrt(81) + 4',
    calculate: 'Calculer',
    result: 'Résultat',
    calcError: 'Expression non prise en charge. Essayez une expression numérique avec sqrt, sin, cos, abs ou log.',
    calcTip: 'Accepte les opérations, parenthèses, puissances, pi, e et des fonctions numériques. Aucun calcul n’est envoyé à l’IA.',
    quickTip: 'Un outil IA prépare le message dans le chat. Rien n’est envoyé avant votre clic sur Envoyer.',
  },
  ar: {
    eyebrow: 'أدوات مدمجة في EL-Rouji',
    title: 'أدواتك في مكان واحد.',
    subtitle: 'أدوات عملية للكتابة والتعلّم والبحث والعمل اليومي.',
    local: 'يعمل محليًا',
    ai: 'بمساعدة الذكاء الاصطناعي',
    pickLanguage: 'الترجمة إلى',
    english: 'الإنجليزية',
    french: 'الفرنسية',
    arabic: 'العربية',
    writer: 'استوديو الكتابة',
    writerDesc: 'اكتب النصوص وحسّنها وصححها وغيّر أسلوبها.',
    translator: 'المترجم',
    translatorDesc: 'ترجمة مع الحفاظ على المعنى والأسلوب والسياق.',
    summarizer: 'التلخيص الذكي',
    summarizerDesc: 'حوّل النصوص الطويلة إلى أهم النقاط.',
    flashcards: 'بطاقات الدراسة',
    flashcardsDesc: 'أنشئ بطاقات أسئلة وأجوبة للمراجعة.',
    code: 'مساعد البرمجة',
    codeDesc: 'اشرح الشيفرة وابحث عن الأخطاء واقترح تحسينات.',
    research: 'البحث في الويب',
    researchDesc: 'احصل على ملخص بحث مع روابط المصادر.',
    files: 'قارئ الملفات والصور',
    filesDesc: 'اسأل عن صورة أو ملف نصي مدعوم.',
    planner: 'مخطط المهام',
    plannerDesc: 'قسّم الهدف إلى خطوات ومراحل ومخاطر.',
    useTool: 'استخدم الأداة',
    openReader: 'اختر ملفًا',
    targetPrompt: 'ترجم النص التالي إلى',
    preserve: 'حافظ على المعنى والأسلوب. اعرض الترجمة أولًا ثم اذكر العبارات الملتبسة إن وجدت.',
    writerPrompt: 'تصرّف كمحرر نصوص. حسّن الوضوح والأسلوب والصحة مع الحفاظ على المعنى. النص أو الهدف:\n\n',
    summarizePrompt: 'لخّص النص في أقسام واضحة: الفكرة الأساسية، النقاط المهمة، والخطوات التالية عند الحاجة. لا تضف معلومات غير موجودة في النص. النص:\n\n',
    flashcardsPrompt: 'أنشئ 10 بطاقات مراجعة مفيدة لهذا الموضوع في جدول Markdown بعمودي السؤال والإجابة، ثم أضف اختبارًا قصيرًا. الموضوع:\n\n',
    codePrompt: 'راجع الشيفرة التي أقدمها. اشرح عملها وحدد الأخطاء المحتملة ومخاطر الأمان واقترح تصحيحًا بسيطًا. لا تدّعِ إجراء اختبارات لم تُجرَ. الشيفرة والهدف:\n\n',
    researchPrompt: 'ابحث عن هذا السؤال باستخدام مصادر ويب حديثة. قارن الأدلة، واستشهد بالمصادر المرقمة، واذكر الاختلافات وما هو غير مؤكد. السؤال:\n',
    plannerPrompt: 'أنشئ خطة عملية لهذا الهدف تتضمن خطوات مرتبة ومراحل وعوائق محتملة وأول إجراء يمكنني القيام به اليوم. الهدف والقيود:\n\n',
    calculatorTitle: 'الآلة الحاسبة',
    calculatorDesc: 'حساب محلي وخاص للعمليات والأسس والدوال الشائعة.',
    expression: 'العملية الحسابية',
    expressionPlaceholder: 'جرّب: sqrt(81) + 4',
    calculate: 'احسب',
    result: 'النتيجة',
    calcError: 'هذه العملية غير مدعومة. جرّب تعبيرًا رقميًا بسيطًا مثل sqrt أو sin أو cos أو abs أو log.',
    calcTip: 'تدعم العمليات والأقواس والأسس وpi وe والدوال الشائعة. لا يتم إرسال الحسابات إلى الذكاء الاصطناعي.',
    quickTip: 'اختيار أداة ذكاء اصطناعي يجهّز رسالة في المحادثة. لن يتم إرسال شيء حتى تضغط على إرسال.',
  },
};

const functionNames = new Set([
  'sqrt', 'abs', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
  'log', 'log10', 'exp', 'floor', 'ceil', 'round', 'min', 'max', 'pow', 'mod', 'pi', 'e',
]);

function calculate(expression: string) {
  const trimmed = expression.trim();
  if (!trimmed || trimmed.length > 140) throw new Error('invalid');
  if (!/^[0-9A-Za-z_\s.+\-*/^()%!,]+$/.test(trimmed)) throw new Error('invalid');
  const names = trimmed.match(/[A-Za-z_][A-Za-z_0-9]*/g) || [];
  if (names.some(name => !functionNames.has(name.toLowerCase()))) throw new Error('invalid');
  const result = evaluate(trimmed);
  if (typeof result !== 'number' || !Number.isFinite(result)) throw new Error('invalid');
  return result;
}

function BuiltInTools({ language, onUsePrompt, onOpenAttachment }: BuiltInToolsProps) {
  const t = copy[language];
  const [targetLanguage, setTargetLanguage] = useState<'English' | 'French' | 'Arabic'>(
    language === 'fr' ? 'English' : 'French'
  );
  const [expression, setExpression] = useState('sqrt(81) + 4');
  const [calcResult, setCalcResult] = useState('');
  const [calcError, setCalcError] = useState(false);
  const rtl = language === 'ar';

  const runCalculation = () => {
    try {
      const result = calculate(expression);
      setCalcResult(result.toLocaleString(undefined, { maximumFractionDigits: 10 }));
      setCalcError(false);
    } catch {
      setCalcResult(t.calcError);
      setCalcError(true);
    }
  };

  const tools = [
    {
      id: 'writer',
      icon: PenLine,
      title: t.writer,
      description: t.writerDesc,
      tag: t.ai,
      activate: () => onUsePrompt('writing', t.writerPrompt),
    },
    {
      id: 'translator',
      icon: Languages,
      title: t.translator,
      description: t.translatorDesc,
      tag: t.ai,
      activate: () => onUsePrompt(
        'writing',
        t.targetPrompt + ' ' + targetLanguage + '. ' + t.preserve + '\n\nText to translate:\n'
      ),
    },
    {
      id: 'summarizer',
      icon: FileText,
      title: t.summarizer,
      description: t.summarizerDesc,
      tag: t.ai,
      activate: () => onUsePrompt('writing', t.summarizePrompt),
    },
    {
      id: 'flashcards',
      icon: BookOpen,
      title: t.flashcards,
      description: t.flashcardsDesc,
      tag: t.ai,
      activate: () => onUsePrompt('study', t.flashcardsPrompt),
    },
    {
      id: 'code',
      icon: Code2,
      title: t.code,
      description: t.codeDesc,
      tag: t.ai,
      activate: () => onUsePrompt('coding', t.codePrompt),
    },
    {
      id: 'research',
      icon: Globe,
      title: t.research,
      description: t.researchDesc,
      tag: t.ai,
      activate: () => onUsePrompt('research', t.researchPrompt),
    },
    {
      id: 'files',
      icon: Upload,
      title: t.files,
      description: t.filesDesc,
      tag: t.ai,
      activate: onOpenAttachment,
    },
    {
      id: 'planner',
      icon: Lightbulb,
      title: t.planner,
      description: t.plannerDesc,
      tag: t.ai,
      activate: () => onUsePrompt('planning', t.plannerPrompt),
    },
  ];

  return (
    <section className={'toolbox-view' + (rtl ? ' toolbox-rtl' : '')} dir={rtl ? 'rtl' : 'ltr'}>
      <header className="toolbox-header">
        <div className="toolbox-icon"><PackageOpenFallback /></div>
        <div>
          <div className="toolbox-eyebrow"><Sparkles size={13} />{t.eyebrow}</div>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
      </header>

      <div className="toolbox-toolbar">
        <div className="toolbox-toolbar-label"><Languages size={14} />{t.pickLanguage}</div>
        <select value={targetLanguage} onChange={event => setTargetLanguage(event.target.value as 'English' | 'French' | 'Arabic')}>
          <option value="English">{t.english}</option>
          <option value="French">{t.french}</option>
          <option value="Arabic">{t.arabic}</option>
        </select>
      </div>

      <div className="toolbox-grid">
        {tools.map(tool => {
          const Icon = tool.icon;
          return (
            <button type="button" key={tool.id} className="toolbox-card" onClick={tool.activate}>
              <span className="toolbox-card-top">
                <span className={'toolbox-card-icon toolbox-icon-' + tool.id}><Icon size={19} /></span>
                <span className="toolbox-card-tag">{tool.tag}</span>
              </span>
              <strong>{tool.title}</strong>
              <span className="toolbox-card-description">{tool.description}</span>
              <span className="toolbox-card-action">{tool.id === 'files' ? t.openReader : t.useTool}<ArrowRight size={14} /></span>
            </button>
          );
        })}
      </div>

      <section className="calculator-panel">
        <div className="calculator-heading">
          <span className="calculator-icon"><Calculator size={19} /></span>
          <div>
            <h2>{t.calculatorTitle}</h2>
            <p>{t.calculatorDesc}</p>
          </div>
          <span className="local-badge"><RefreshCw size={11} />{t.local}</span>
        </div>
        <div className="calculator-form">
          <label>
            <span>{t.expression}</span>
            <input
              value={expression}
              onChange={event => {
                setExpression(event.target.value);
                setCalcResult('');
                setCalcError(false);
              }}
              onKeyDown={event => {
                if (event.key === 'Enter') runCalculation();
              }}
              placeholder={t.expressionPlaceholder}
              maxLength={140}
            />
          </label>
          <button type="button" className="calculate-button" onClick={runCalculation}>{t.calculate}</button>
        </div>
        {calcResult && (
          <div className={'calculator-result' + (calcError ? ' calculator-error' : '')}>
            <span>{calcError ? '!' : '='}</span>
            <div><small>{calcError ? '' : t.result}</small><strong>{calcResult}</strong></div>
          </div>
        )}
        <p className="calculator-tip">{t.calcTip}</p>
      </section>

      <div className="toolbox-bottom-note"><WandSparkles size={15} /><span>{t.quickTip}</span></div>
    </section>
  );
}

function PackageOpenFallback() {
  return <span className="package-fallback"><Sparkles size={25} /></span>;
}

export default BuiltInTools;
