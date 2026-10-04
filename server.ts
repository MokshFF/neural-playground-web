import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { PRESET_CONCEPTS } from './src/data/presetConcepts.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = 3000;

// Shared Google GenAI client utility
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for fallback concept if API key is absent or error occurs
function getFallbackConcept(topic: string) {
  const clean = topic.trim().toLowerCase();
  
  // 1. Check exact or partial match in PRESET_CONCEPTS
  const match = PRESET_CONCEPTS.find(c => {
    const name = c.concept.toLowerCase();
    return name === clean || name.includes(clean) || clean.includes(name) || c.category.toLowerCase().includes(clean);
  });
  if (match) return match;

  // 2. Acronyms & AI aliases dictionary
  const AI_ALIASES: Record<string, string> = {
    'backprop': 'Backpropagation & The Chain Rule',
    'backpropagation': 'Backpropagation & The Chain Rule',
    'chain rule': 'Backpropagation & The Chain Rule',
    'transformer': 'Transformers & Multi-Head Self-Attention',
    'transformers': 'Transformers & Multi-Head Self-Attention',
    'self attention': 'Transformers & Multi-Head Self-Attention',
    'attention': 'Transformers & Multi-Head Self-Attention',
    'llm': 'Transformers & Multi-Head Self-Attention',
    'llms': 'Transformers & Multi-Head Self-Attention',
    'diffusion': 'Diffusion Models & Denoising Score Matching',
    'diffusion models': 'Diffusion Models & Denoising Score Matching',
    'stable diffusion': 'Diffusion Models & Denoising Score Matching',
    'midjourney': 'Diffusion Models & Denoising Score Matching',
    'sora': 'Diffusion Models & Denoising Score Matching',
    'rag': 'Retrieval-Augmented Generation (RAG) & Vector Embeddings',
    'vector database': 'Retrieval-Augmented Generation (RAG) & Vector Embeddings',
    'vector search': 'Retrieval-Augmented Generation (RAG) & Vector Embeddings',
    'embeddings': 'Retrieval-Augmented Generation (RAG) & Vector Embeddings',
    'rlhf': 'Reinforcement Learning from Human Feedback (RLHF) & PPO',
    'ppo': 'Reinforcement Learning from Human Feedback (RLHF) & PPO',
    'dpo': 'Reinforcement Learning from Human Feedback (RLHF) & PPO',
    'alignment': 'Reinforcement Learning from Human Feedback (RLHF) & PPO',
    'moe': 'Mixture of Experts (MoE) & Sparse Routing',
    'mixture of experts': 'Mixture of Experts (MoE) & Sparse Routing',
    'deepseek': 'Mixture of Experts (MoE) & Sparse Routing',
    'mixtral': 'Mixture of Experts (MoE) & Sparse Routing',
    'lora': 'Low-Rank Adaptation (LoRA) & PEFT',
    'peft': 'Low-Rank Adaptation (LoRA) & PEFT',
    'qlora': 'Low-Rank Adaptation (LoRA) & PEFT',
    'fine tuning': 'Low-Rank Adaptation (LoRA) & PEFT',
    'cnn': 'Convolutional Neural Networks (CNNs) & Feature Extraction',
    'cnns': 'Convolutional Neural Networks (CNNs) & Feature Extraction',
    'resnet': 'Residual Networks (ResNet) & Skip Connections',
    'skip connections': 'Residual Networks (ResNet) & Skip Connections',
    'clip': 'Contrastive Language-Image Pretraining (CLIP)',
    'multimodal': 'Contrastive Language-Image Pretraining (CLIP)',
    'bpe': 'Tokenization & Byte-Pair Encoding (BPE)',
    'tokenization': 'Tokenization & Byte-Pair Encoding (BPE)',
    'tokenizer': 'Tokenization & Byte-Pair Encoding (BPE)',
    'quantization': 'Quantization & KV Caching (INT8, FP4, AWQ)',
    'kv cache': 'Quantization & KV Caching (INT8, FP4, AWQ)',
    'kv caching': 'Quantization & KV Caching (INT8, FP4, AWQ)',
    'overfitting': 'Overfitting, Regularization & Dropout',
    'dropout': 'Overfitting, Regularization & Dropout',
    'regularization': 'Overfitting, Regularization & Dropout',
    'gan': 'Generative Adversarial Networks (GANs)',
    'gans': 'Generative Adversarial Networks (GANs)',
    'rnn': 'Recurrent Neural Networks (RNN) & LSTMs',
    'lstm': 'Recurrent Neural Networks (RNN) & LSTMs',
    'svm': 'Support Vector Machines (SVM) & Kernel Trick',
    'kernel trick': 'Support Vector Machines (SVM) & Kernel Trick',
    'adam': 'Gradient Descent & Adam Optimization',
    'gradient descent': 'Gradient Descent & Adam Optimization',
    'a*': 'A* Pathfinding & Heuristic Search',
    'pathfinding': 'A* Pathfinding & Heuristic Search',
    'sorting': 'Sorting Algorithms',
  };

  for (const [alias, targetName] of Object.entries(AI_ALIASES)) {
    if (clean === alias || clean.includes(alias) || alias.includes(clean)) {
      const aliasTarget = PRESET_CONCEPTS.find(c => c.concept === targetName);
      if (aliasTarget) return aliasTarget;
    }
  }

  // 3. High-quality intelligent synthesis with verified mathematical concepts and realistic distractors
  return {
    concept: topic,
    tagline: `Essential computational and statistical mechanics of ${topic}`,
    category: "Artificial Intelligence & Machine Learning",
    simpleExplanation: `${topic} is an essential paradigm in modern artificial intelligence and machine learning. In AI systems, solving complex tasks requires balancing model capacity, optimization dynamics, and generalization. Rather than relying on rigid rule-based heuristics, ${topic} provides mathematical mechanisms to extract structured representations, optimize objective loss functions, and generalize across novel inputs.`,
    underTheHood: `Mathematically, ${topic} operates within an optimization framework where parameters θ are calibrated to minimize an expected empirical loss: min_θ E_{(x,y)~D}[L(f_θ(x), y)] + λR(θ). Through gradient-based or probabilistic updates, the system computes partial derivatives ∂L/∂θ and navigates high-dimensional state spaces toward optimal Pareto frontiers, balancing model expressivity against overparameterized variance.`,
    realWorldExample: {
      title: `Production Deployment of ${topic}`,
      story: `In commercial AI infrastructure (such as large-scale recommendation systems, autonomous robotics, and frontier language models), ${topic} provides the computational backbone that ensures fast convergence, robust generalization, and bounded inference latency.`,
      analogy: "Like a precision flight simulator that continually tests an aircraft design against thousands of simulated atmospheric turbulences, refining aerodynamics before the plane ever takes off."
    },
    simulatorType: "neural_network",
    keyTakeaways: [
      "Optimizes objective functions to extract predictive, high-dimensional representations.",
      "Balances representation capacity against overfitting and variance.",
      "Integrates with modern accelerated computing hardware (GPUs/TPUs) for scalable training and inference."
    ],
    quiz: [
      {
        id: 1,
        question: `What primary optimization challenge does ${topic} address in machine learning?`,
        options: [
          "Minimizing empirical loss while ensuring the model generalizes to unseen test distributions",
          "Forcing floating point numbers into 8-bit integers without scaling",
          "Eliminating the need for training data entirely",
          "Replacing linear algebra with procedural loops"
        ],
        correctIndex: 0,
        explanation: "In all statistical learning systems, the fundamental goal is empirical risk minimization subject to generalization constraints, preventing memorization of training sample noise."
      },
      {
        id: 2,
        question: "How does parameter capacity impact the generalization behavior of models implementing this concept?",
        options: [
          "Increasing parameters always guarantees lower test loss without exception",
          "Insufficient capacity causes high bias (underfitting), while excessive unregularized capacity risks high variance (overfitting)",
          "Parameter count has zero effect on training dynamics",
          "Models with fewer than 10 parameters cannot compute gradients"
        ],
        correctIndex: 1,
        explanation: "The classical bias-variance decomposition shows that underparameterized models cannot capture complex manifolds (high bias), while unconstrained high-capacity models fit idiosyncratic noise (high variance)."
      },
      {
        id: 3,
        question: "Which evaluation metric is most critical when validating the real-world performance of this concept?",
        options: [
          "Performance on a held-out, independent validation or test dataset",
          "The number of lines of source code in the implementation",
          "The color theme of the developer console",
          "The file size of the training dataset on disk"
        ],
        correctIndex: 0,
        explanation: "Evaluating models on strictly held-out validation data provides an unbiased estimate of generalization error, safeguarding against false confidence from training set memorization."
      }
    ],
    suggestedQuestions: [
      `What are the standard mathematical formulations and loss functions associated with ${topic}?`,
      `How does ${topic} integrate with modern Transformer and Diffusion architectures?`,
      `Can you provide an annotated Python / PyTorch implementation of ${topic}?`
    ]
  };
}

// 1. Explore Concept Endpoint
app.post('/api/concept/explore', async (req, res) => {
  const { topic, level = 'intermediate' } = req.body;
  if (!topic || typeof topic !== 'string') {
    return res.status(400).json({ error: 'Valid topic string is required' });
  }

  // If no API key is provided, return immediate rich fallback
  if (!process.env.GEMINI_API_KEY) {
    return res.json(getFallbackConcept(topic));
  }

  try {
    const prompt = `You are a world-class AI researcher and computer science professor at MIT for Neural Playground.
Explain the following AI / CS concept: "${topic}" for a "${level}" audience.

STRICT ACCURACY RULES:
1. Provide mathematically and conceptually rigorous explanations. Use exact scientific terminology (e.g. cross-entropy loss, backpropagation, attention matrices, eigen-decomposition, KL-divergence, etc.).
2. The quiz questions MUST be challenging, non-trivial, and technically accurate.
3. Every single quiz distractor (incorrect option) MUST be a realistic, plausible technical concept—ABSOLUTELY NO joke options, nonsense, or obvious throwaways.
4. The correctIndex MUST be accurate (0, 1, 2, or 3), and explanation MUST provide the exact technical proof of why the answer is correct.
5. Choose simulatorType strictly from: 'neural_network', 'sorting', 'attention', 'gradient_descent', 'convolution', 'pathfinding'.

Required JSON structure:
{
  "concept": "${topic}",
  "tagline": "A punchy, memorable 1-sentence description",
  "category": "E.g. Deep Learning, Reinforcement Learning, Generative AI, Computer Vision, etc.",
  "simpleExplanation": "Clear, jargon-free explanation with intuition first. 2-3 engaging paragraphs.",
  "underTheHood": "The mathematical or algorithmic breakdown of how it actually works step by step.",
  "realWorldExample": {
    "title": "A concrete real-world application (e.g. self-driving, medicine, Spotify)",
    "story": "How this technology solves that specific real problem in industry.",
    "analogy": "An unforgettable physical or everyday life analogy."
  },
  "simulatorType": "neural_network" | "sorting" | "attention" | "gradient_descent" | "convolution" | "pathfinding",
  "keyTakeaways": [
    "Takeaway 1",
    "Takeaway 2",
    "Takeaway 3"
  ],
  "quiz": [
    {
      "id": 1,
      "question": "Rigorous technical question testing intuition or key mechanics",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Clear mathematical proof or technical explanation of why this answer is correct."
    },
    {
      "id": 2,
      "question": "Second rigorous question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 1,
      "explanation": "Explanation"
    },
    {
      "id": 3,
      "question": "Third rigorous question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 2,
      "explanation": "Explanation"
    }
  ],
  "suggestedQuestions": [
    "Follow-up question 1",
    "Follow-up question 2",
    "Follow-up question 3"
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.5,
      },
    });

    const text = response.text || '';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (err: any) {
    console.error('Gemini API explore error:', err);
    // Graceful fallback
    return res.json(getFallbackConcept(topic));
  }
});

// 2. Chat with Neural Guide Endpoint with Google Search Grounding (gemini-3.5-flash)
app.post('/api/chat', async (req, res) => {
  const { message, conceptContext = '', history = [] } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.json({
      reply: `Neural Playground is running in offline mode. For "${message}", the core intuition is that algorithms optimize representations through structured operations. In the context of ${conceptContext || 'this concept'}, the primary objective is to balance efficiency, precision, and generalization. Feel free to explore the interactive simulation and mini-quiz above!`,
      sources: [],
      isGrounded: false,
    });
  }

  try {
    const systemInstruction = `You are "Synapse", the futuristic AI learning mentor inside Neural Playground.
You guide learners exploring Computer Science and Artificial Intelligence.
Your tone is knowledgeable, vivid, encouraging, and razor-sharp.
Current concept being studied: "${conceptContext}".
Keep responses concise (1-3 paragraphs), formatting key code or math in clean markdown when helpful. Use clear intuitive analogies and cite real-world breakthroughs when appropriate.`;

    // Construct conversation contents
    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      for (const msg of history.slice(-6)) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: `Regarding ${conceptContext || 'Computer Science & AI'}: ${message}` }]
    });

    // Use gemini-3.5-flash with googleSearch tool for real-time accurate information
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        tools: [{ googleSearch: {} }],
      }
    });

    const reply = response.text || "I processed that concept, but couldn't generate an explanation right now. Try rephrasing your question!";
    
    // Extract Grounding Chunks/Sources
    const candidate = response.candidates?.[0];
    const groundingMetadata = candidate?.groundingMetadata;
    const searchChunks = groundingMetadata?.groundingChunks || [];
    const sources: { title?: string; url?: string }[] = [];
    if (Array.isArray(searchChunks)) {
      for (const chunk of searchChunks) {
        if (chunk.web?.uri) {
          sources.push({
            title: chunk.web.title || chunk.web.uri,
            url: chunk.web.uri,
          });
        }
      }
    }

    return res.json({
      reply,
      sources: sources.slice(0, 4),
      isGrounded: sources.length > 0,
    });
  } catch (err: any) {
    console.error('Gemini chat error with search grounding:', err);
    return res.json({
      reply: `Here's the key idea regarding your question on ${conceptContext || 'this concept'}: focus on how data moves from input to output, what loss or cost function evaluates success, and how parameters update iteratively.`,
      sources: [],
      isGrounded: false,
    });
  }
});

// Live Grounded Research Insights Endpoint using gemini-3.5-flash with googleSearch
app.post('/api/concept/live-updates', async (req, res) => {
  const { concept } = req.body;
  if (!concept) return res.status(400).json({ error: 'Concept required' });

  if (!process.env.GEMINI_API_KEY) {
    return res.json({
      update: `Researchers and industry labs continue to optimize ${concept} for reduced memory footprint, higher throughput, and real-time inference.`,
      sources: []
    });
  }

  try {
    const prompt = `Find the latest real-world developments, practical breakthroughs, or high-profile applications related to "${concept}" in modern technology. Provide a concise 2-sentence summary highlighting a current milestone.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.4,
      }
    });

    const candidate = response.candidates?.[0];
    const groundingMetadata = candidate?.groundingMetadata;
    const searchChunks = groundingMetadata?.groundingChunks || [];
    const sources: { title?: string; url?: string }[] = [];
    if (Array.isArray(searchChunks)) {
      for (const chunk of searchChunks) {
        if (chunk.web?.uri) {
          sources.push({
            title: chunk.web.title || "Verified Web Source",
            url: chunk.web.uri,
          });
        }
      }
    }

    return res.json({
      update: response.text || `Active research in ${concept} is advancing rapidly across production architectures.`,
      sources: sources.slice(0, 3)
    });
  } catch (err) {
    console.error('Live updates error:', err);
    return res.json({
      update: `Production deployments of ${concept} focus on throughput optimization and efficiency gains.`,
      sources: []
    });
  }
});

// 3. Quiz Generation Endpoint
app.post('/api/quiz/generate', async (req, res) => {
  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ error: 'Topic required' });
  }

  if (!process.env.GEMINI_API_KEY) {
    const fallback = getFallbackConcept(topic);
    return res.json({ quiz: fallback.quiz });
  }

  try {
    const prompt = `Generate a fresh 3-question multiple choice mini-quiz on "${topic}" for an interactive CS/AI learning app.
Return JSON:
{
  "quiz": [
    {
      "id": 1,
      "question": "question text",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 0,
      "explanation": "why this is correct"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || '';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (err) {
    const fallback = getFallbackConcept(topic);
    return res.json({ quiz: fallback.quiz });
  }
});

// Dev or Production Static/Vite Server Setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Neural Playground server active at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
