export type ReadingLevel = "simple" | "normal";

export type TranslateOptions = {
  keepTerms: boolean;
  highlight: boolean;
  readingLevel: ReadingLevel;
};

export type TranslationMeta = {
  usedTwoLayer: boolean;
  usedGuardrail: boolean;
};

export type TranslationResult = {
  plain: string;
  xReady: string;
  newbie: string;
  meta?: TranslationMeta;
};

const glossary: Record<string, string> = {
  blockchain: "a shared public ledger that records transactions",
  block: "a batch of transactions grouped together",
  hash: "a unique digital fingerprint of data",
  node: "a computer that runs the network software",
  wallet: "an app or device that stores your crypto access keys",
  "seed phrase": "a secret list of words that recovers a wallet",
  "private key": "the secret code that controls your funds",
  "public key": "the shareable code that receives funds",
  "smart contract": "self-running code that enforces an agreement",
  token: "a digital asset issued on a blockchain",
  coin: "a native asset of a blockchain",
  "layer 2": "a scaling network built on top of a main chain",
  "execution layer": "the part of a chain where transactions are processed",
  rollup: "a layer 2 that bundles transactions to save fees",
  "shared sequencer": "a coordinator that orders transactions for multiple rollups",
  sequencer: "a service that orders and batches transactions",
  mainnet: "the live public blockchain",
  testnet: "a practice blockchain for testing",
  gas: "the fee paid to process a transaction",
  "gas fee": "the fee paid to process a transaction",
  staking: "locking tokens to help run the network",
  validator: "a participant that confirms transactions",
  "validator set": "the group of validators running the network",
  "proof of stake": "a method where validators lock tokens to secure the chain",
  "proof of work": "a method where miners use computing power to secure the chain",
  miner: "a participant who secures the chain with computing power",
  airdrop: "free tokens sent to users",
  "liquidity pool": "a shared pool of tokens used for trading",
  liquidity: "how easy it is to buy or sell without big price moves",
  "yield farming": "moving funds between pools to earn rewards",
  dex: "a decentralized exchange with no central operator",
  cex: "a centralized exchange run by a company",
  bridge: "a tool that moves assets between blockchains",
  oracle: "a service that brings real-world data on-chain",
  "rug pull": "a scam where creators abandon a project and take funds",
  "account abstraction": "smart contracts that make wallets easier to use",
  "data availability layer": "a network that stores transaction data for verification",
  mint: "to create new tokens",
  burn: "to permanently remove tokens",
  faucet: "a site that gives small test tokens",
  whale: "a holder with a very large balance",
  dao: "a group that makes decisions using on-chain votes",
  mev: "extra value that can be extracted by reordering transactions",
  slippage: "the gap between expected and actual trade price",
  "market cap": "price multiplied by total supply",
  volatility: "how fast the price moves up and down",
  finality: "the point when a transaction cannot be reversed",
  modular: "designed as separate parts that work together",
  permissionless: "open to anyone without approval"
};

const rewritePatterns: Array<{ pattern: RegExp; replace: string }> = [
  {
    pattern: /zk-native execution layer with parallelized prover architecture/gi,
    replace:
      "a blockchain designed to process many private transactions at once. It does this by running proofs in parallel instead of one-by-one."
  },
  { pattern: /gm\b/gi, replace: "good morning" },
  { pattern: /ngmi\b/gi, replace: "not going to make it" },
  { pattern: /wagmi\b/gi, replace: "we are going to make it" },
  { pattern: /dyor\b/gi, replace: "do your own research" },
  { pattern: /fomo\b/gi, replace: "fear of missing out" },
  { pattern: /fud\b/gi, replace: "fear, uncertainty, and doubt" },
  { pattern: /ape in\b/gi, replace: "buy quickly without much research" },
  { pattern: /paper hands/gi, replace: "selling too early" },
  { pattern: /diamond hands/gi, replace: "holding through volatility" },
  { pattern: /rekt/gi, replace: "lost a lot of money" },
  { pattern: /wen\b/gi, replace: "when" },
  { pattern: /airdrop hunting/gi, replace: "chasing free token giveaways" },
  { pattern: /blue chip/gi, replace: "large, established project" },
  { pattern: /"?to the moon"?/gi, replace: "expecting a huge price jump" },
  { pattern: /bagholder/gi, replace: "someone holding after a big drop" }
];

const fillerPhrases = [
  "basically",
  "essentially",
  "actually",
  "literally",
  "kind of",
  "sort of",
  "you know",
  "just",
  "like"
];

const ambiguousTerms = [
  "modular",
  "agent",
  "ai",
  "rollup",
  "intent",
  "account abstraction",
  "restaking",
  "staking",
  "oracle",
  "bridge",
  "l2",
  "layer 2",
  "layer-2",
  "sequencer"
];

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeText = (text: string) =>
  text
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const markText = (text: string) => `[[H]]${text}[[/H]]`;

const applyGlossary = (text: string, options: TranslateOptions) => {
  let output = text;
  const terms = Object.keys(glossary).sort((a, b) => b.length - a.length);

  terms.forEach((term) => {
    const regex = new RegExp(`\\b${escapeRegex(term)}\\b`, "gi");
    output = output.replace(regex, (match) => {
      const definition = glossary[term];
      const highlightedDefinition = options.highlight ? markText(definition) : definition;

      if (options.keepTerms) {
        return match;
      }

      return highlightedDefinition;
    });
  });

  return output;
};

const applyPatterns = (text: string) =>
  rewritePatterns.reduce(
    (result, { pattern, replace }) => result.replace(pattern, replace),
    text
  );

const removeFillers = (text: string) => {
  const fillerRegex = new RegExp(`\\b(${fillerPhrases.join("|")})\\b`, "gi");
  return text.replace(fillerRegex, "").replace(/\s+/g, " ").trim();
};

const splitSentences = (text: string) => {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((line) => line.trim())
    .filter(Boolean);
  return sentences.length ? sentences : [text];
};

const countTechnicalConcepts = (text: string) => {
  const terms = Object.keys(glossary);
  const technicalRegexes = [...terms, ...ambiguousTerms].map(
    (term) => new RegExp(`\\b${escapeRegex(term)}\\b`, "i")
  );
  const uniqueMatches = new Set<string>();

  technicalRegexes.forEach((regex) => {
    const match = text.match(regex);
    if (match) {
      uniqueMatches.add(match[0].toLowerCase());
    }
  });

  return uniqueMatches.size;
};

const applyTwoLayerExplanation = (sentences: string[], enabled: boolean) => {
  if (!enabled) {
    return { sentences, usedTwoLayer: false };
  }

  if (sentences.length >= 2) {
    return { sentences, usedTwoLayer: true };
  }

  const sentence = sentences[0] ?? "";
  const verbSplits: Array<{ pattern: RegExp; verb: string }> = [
    { pattern: /\s+causes\s+/i, verb: "causing" },
    { pattern: /\s+improves\s+/i, verb: "improving" },
    { pattern: /\s+secures\s+/i, verb: "securing" },
    { pattern: /\s+uses\s+/i, verb: "using" }
  ];

  for (const { pattern, verb } of verbSplits) {
    if (pattern.test(sentence)) {
      const [subject, detail] = sentence.split(pattern);
      if (subject && detail) {
        return {
          sentences: [
            subject.trim().replace(/[.!?]?$/, "."),
            `It works by ${verb} ${detail.trim()}`
          ],
          usedTwoLayer: true
        };
      }
    }
  }

  if (/\s+with\s+/i.test(sentence)) {
    const [subject, detail] = sentence.split(/\s+with\s+/i);
    if (subject && detail) {
      return {
        sentences: [
          subject.trim().replace(/[.!?]?$/, "."),
          `It works by using ${detail.trim()}`
        ],
        usedTwoLayer: true
      };
    }
  }

  const pieces = sentence.split(/;\s+|,\s+but\s+|,\s+and\s+|\s+because\s+/i);
  if (pieces.length >= 2) {
    const trimmed = pieces.map((piece) => piece.trim()).filter(Boolean);
    if (trimmed.length >= 2) {
      const twoLayer = [
        `${trimmed[0].replace(/[.!?]?$/, ".")}`,
        `It works by ${trimmed[1]}`
      ];
      return { sentences: twoLayer, usedTwoLayer: true };
    }
  }

  return {
    sentences: [
      sentence.replace(/[.!?]?$/, "."),
      "It works by combining the technical parts into a system."
    ],
    usedTwoLayer: true
  };
};

const applyGuardrailPrefix = (sentences: string[], enabled: boolean) => {
  if (!enabled || sentences.length === 0) {
    return { sentences, usedGuardrail: false };
  }

  const prefix = "Typically, this means ";
  const [first, ...rest] = sentences;
  const guardedFirst = `${prefix}${first.charAt(0).toLowerCase()}${first.slice(1)}`;

  return {
    sentences: [guardedFirst, ...rest],
    usedGuardrail: true
  };
};

const breakLongSentence = (sentence: string, limit: number) => {
  if (sentence.length <= limit) {
    return [sentence];
  }

  const chunks: string[] = [];
  let current = "";

  sentence.split(/,\s+|\s+and\s+/i).forEach((part) => {
    const candidate = current ? `${current}, ${part}` : part;
    if (candidate.length > limit) {
      if (current) {
        chunks.push(current);
      }
      current = part;
    } else {
      current = candidate;
    }
  });

  if (current) {
    chunks.push(current);
  }

  const wrapped: string[] = [];
  chunks.forEach((chunk) => {
    if (chunk.length <= limit) {
      wrapped.push(chunk);
      return;
    }

    const words = chunk.split(/\s+/);
    let line = "";
    words.forEach((word) => {
      const candidate = line ? `${line} ${word}` : word;
      if (candidate.length > limit) {
        if (line) {
          wrapped.push(line);
        }
        line = word;
      } else {
        line = candidate;
      }
    });

    if (line) {
      wrapped.push(line);
    }
  });

  return wrapped;
};

const simplifyText = (text: string, level: ReadingLevel) => {
  const cleaned = removeFillers(text);
  const sentences = splitSentences(cleaned);

  if (level === "normal") {
    return sentences;
  }

  return sentences.flatMap((sentence) => breakLongSentence(sentence, 90));
};

const formatPlain = (sentences: string[]) => sentences.join(" ");

const stripHighlightTokens = (text: string) =>
  text.replace(/\[\[H\]\]|\[\[\/H\]\]/g, "");

const formatForX = (sentences: string[]) => {
  const thoughtLines = sentences.flatMap((sentence) => {
    const pieces = sentence
      .split(/(?<=[.!?])\s+|;\s+|:\s+|,\s+/)
      .map((piece) => piece.trim())
      .filter(Boolean);

    if (!pieces.length) {
      return [];
    }

    return pieces.flatMap((piece) => breakLongSentence(piece, 80));
  });

  return thoughtLines
    .map((line) => line.replace(/[.!?]+$/, ""))
    .filter(Boolean)
    .join("\n\n");
};

const buildNewbieExtras = (text: string) => {
  const extras: string[] = [];
  const lower = text.toLowerCase();

  if (/(gas|fee)/.test(lower)) {
    extras.push("Why it matters: small fees add up, so plan your steps.");
  }

  if (/(risk|rug pull|scam)/.test(lower)) {
    extras.push("Safety tip: double-check sources before you act.");
  }

  if (/volatility|price/.test(lower)) {
    extras.push("Prices can move fast, so size your risk accordingly.");
  }

  if (/bridge/.test(lower)) {
    extras.push("Bridging can take time and extra fees, so be patient.");
  }

  if (extras.length < 2) {
    extras.push("If something feels unclear, start small and learn as you go.");
  }

  return extras.slice(0, 2);
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export const renderHighlightedText = (text: string, highlight: boolean) => {
  const escaped = escapeHtml(text);

  if (!highlight) {
    return escaped.replace(/\[\[H\]\]|\[\[\/H\]\]/g, "").replace(/\n/g, "<br />");
  }

  return escaped
    .replace(/\[\[H\]\](.*?)\[\[\/H\]\]/g, '<mark class="bg-emerald-300/30 text-emerald-200">$1</mark>')
    .replace(/\n/g, "<br />");
};

export const translateText = (text: string, options: TranslateOptions): TranslationResult => {
  const normalized = normalizeText(text);
  const conceptCount = countTechnicalConcepts(normalized);
  const needsGuardrail = ambiguousTerms.some((term) =>
    new RegExp(`\\b${escapeRegex(term)}\\b`, "i").test(normalized)
  );
  const baseGlossary = applyGlossary(normalized, {
    ...options,
    highlight: false
  });
  const baseText = applyPatterns(baseGlossary);
  const baseSentences = simplifyText(baseText, options.readingLevel);
  const { sentences: layeredBase } = applyTwoLayerExplanation(
    baseSentences,
    conceptCount >= 2
  );
  const { sentences: guardedBase } = applyGuardrailPrefix(layeredBase, needsGuardrail);
  const xReady = formatForX(
    guardedBase.map((sentence) => stripHighlightTokens(sentence))
  );

  const plainPatterns = applyPatterns(normalized);
  const plainText = applyGlossary(plainPatterns, {
    ...options,
    keepTerms: false,
    highlight: options.highlight
  });
  const plainSentences = simplifyText(plainText, options.readingLevel);
  const { sentences: layeredPlain, usedTwoLayer } = applyTwoLayerExplanation(
    plainSentences,
    conceptCount >= 2
  );
  const { sentences: guardedPlain, usedGuardrail } = applyGuardrailPrefix(
    layeredPlain,
    needsGuardrail
  );
  const plain = formatPlain(guardedPlain);
  const newbie = [plain, ...buildNewbieExtras(plain)].join("\n\n");

  return { plain, xReady, newbie, meta: { usedTwoLayer, usedGuardrail } };
};

export const translate = (
  text: string,
  options: { readingLevel: ReadingLevel; keepKeyTerms: boolean }
): TranslationResult =>
  translateText(text, {
    readingLevel: options.readingLevel,
    keepTerms: options.keepKeyTerms,
    highlight: true
  });

const devSamples = [
  "ZK-native execution layer with parallelized prover architecture",
  "Modular rollup with shared sequencer design",
  "High MEV environment causes slippage for retail users",
  "Account abstraction improves wallet UX",
  "Data availability layer secures off-chain execution",
  "Permissionless validator set with fast finality"
];

if (process.env.NODE_ENV === "development") {
  devSamples.forEach((sample) => {
    const { plain, xReady, newbie } = translateText(sample, {
      keepTerms: true,
      highlight: false,
      readingLevel: "simple"
    });

    console.log("Jargon to Human sample");
    console.log("Input:", sample);
    console.log("Plain:", plain);
    console.log("X-ready:", xReady);
    console.log("Newbie:", newbie);
  });
}
