import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

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
  const normalized = topic.toLowerCase();
  
  if (normalized.includes('transform') || normalized.includes('attention')) {
    return {
      concept: "Transformers & Self-Attention",
      tagline: "The architecture powering ChatGPT, Gemini, and modern generative AI",
      category: "Deep Learning & NLP",
      simpleExplanation: "Imagine reading a mystery novel. When you read the word 'he', your mind instantly looks back across the previous sentences to connect who 'he' refers to. In older AI models (like RNNs), words were processed strictly one-by-one like a conveyor belt, frequently forgetting the beginning of a paragraph. The Transformer processes all words simultaneously and uses 'Self-Attention'—a dynamic scoring system where every single word assigns attention weights to every other word to understand context instantly.",
      underTheHood: "Transformers convert input tokens into three vectors: Query (Q), Key (K), and Value (V). The attention score is computed using the scaled dot-product formula: Attention(Q, K, V) = softmax(Q·K^T / √d_k) · V. Multi-Head Attention repeats this calculation multiple times across different projection subspaces, enabling the network to jointly attend to information from different representation subspaces (e.g. grammar, sentiment, pronouns) at different positions.",
      realWorldExample: {
        title: "Translating Ambiguous Sentences in Real-Time",
        story: "Consider the sentence: 'The animal didn't cross the street because it was too tired.' If you change 'tired' to 'wide', the meaning of 'it' flips completely from the animal to the street. Older recurrent models often mistranslated this. Transformers compute attention weights directly between 'it' and 'animal' (when 'tired') or 'it' and 'street' (when 'wide'), capturing human-level nuance.",
        analogy: "Like a conference call where everyone speaks at once, but each attendee wears smart acoustic headphones that turn up the volume of the exact participants most relevant to what they are working on."
      },
      simulatorType: "attention",
      keyTakeaways: [
        "Eliminates sequential processing bottlenecks, allowing massive parallel training on modern GPUs.",
        "Self-attention calculates dynamic pairwise relationships between every token in a context window.",
        "Forms the backbone of GPT, Gemini, BERT, Vision Transformers (ViT), and diffusion text encoders."
      ],
      quiz: [
        {
          id: 1,
          question: "What is the primary advantage of Transformers over traditional Recurrent Neural Networks (RNNs)?",
          options: [
            "Transformers require far fewer training parameters",
            "Transformers process tokens simultaneously in parallel rather than sequentially",
            "Transformers do not use any matrix multiplication",
            "Transformers can only work on images rather than text"
          ],
          correctIndex: 1,
          explanation: "Unlike RNNs which must process word 1 before word 2, Transformers ingest the entire sequence at once, allowing massive GPU parallelism and preventing gradient degradation over long sequences."
        },
        {
          id: 2,
          question: "In the self-attention formula Attention(Q, K, V) = softmax(QK^T / √d_k)V, what is the role of √d_k?",
          options: [
            "It rounds the attention scores to integers",
            "It reverses the negative weights to positive",
            "It scales down the dot product magnitudes to prevent softmax gradients from vanishing",
            "It measures the total number of words in the vocabulary"
          ],
          correctIndex: 2,
          explanation: "For large key dimensions (d_k), dot products grow large in magnitude, pushing the softmax function into regions with tiny gradients. Dividing by √d_k stabilizes the gradients."
        },
        {
          id: 3,
          question: "What do Query, Key, and Value represent conceptually in self-attention?",
          options: [
            "Query is what you are looking for; Key is the label/address; Value is the actual content retrieved",
            "Query is the loss function; Key is the weight; Value is the activation",
            "Query is the hardware GPU; Key is the memory cache; Value is the clock speed",
            "Query is the user password; Key is encryption; Value is decrypted text"
          ],
          correctIndex: 0,
          explanation: "Similar to a database or retrieval system, a Query represents what the current token seeks, Keys are tags for all tokens, and the dot-product similarity determines how much of each Value is mixed into the output."
        }
      ],
      suggestedQuestions: [
        "How does Multi-Head Attention differ from Single-Head Attention?",
        "Why do Transformers need Positional Encoding?",
        "What is the quadratic complexity problem in Transformers, and how do modern models solve it?"
      ]
    };
  }

  if (normalized.includes('convolution') || normalized.includes('cnn')) {
    return {
      concept: "Convolutional Neural Networks (CNNs)",
      tagline: "The visual cortex of artificial intelligence",
      category: "Computer Vision",
      simpleExplanation: "When your eyes look at a photograph of a bicycle, you don't evaluate all 2,000,000 pixels at once independently. Instead, your brain first recognizes tiny edges and curves, combines them into circles and spokes, and finally realizes those circles make up wheels on a bicycle frame. CNNs replicate this hierarchical vision using small sliding math filters called 'kernels' that scan across pixels to spot features regardless of where they appear.",
      underTheHood: "A CNN consists of convolutional layers, non-linear activation functions (like ReLU), and pooling layers (like Max Pooling). During convolution, a small weight matrix (e.g. 3x3) slides across the input tensor, computing dot products to produce a 'Feature Map'. Early layers detect low-level primitives (edges, gradients), middle layers detect textures and shapes, and deep layers capture semantic objects.",
      realWorldExample: {
        title: "Autonomous Vehicle Pedestrian Detection",
        story: "Self-driving cars continuously feed high-frame-rate camera feeds into deep CNN architectures (like ResNet or YOLO). Even if a pedestrian is wearing unusual clothing or is standing in the top-left vs center of the frame, the translation invariance of CNN kernels detects the human silhouette within milliseconds.",
        analogy: "Like inspecting a giant mosaic mural through a small magnifying stencil: sliding the stencil across the entire wall lets you catalogue every leaf and brick, and compile a map of the entire scene."
      },
      simulatorType: "convolution",
      keyTakeaways: [
        "Parameter sharing: The same filter is reused across the entire image, drastically reducing required parameters.",
        "Translation invariance: Identifies an object whether it is centered, shifted left, or in a corner.",
        "Hierarchical representation: Progresses from raw edges to complex semantic categories."
      ],
      quiz: [
        {
          id: 1,
          question: "What is the primary benefit of 'parameter sharing' in convolutional layers?",
          options: [
            "It allows the model to output audio as well as images",
            "The same small filter weights are applied across the entire image, drastically cutting memory and weights",
            "It eliminates the need for any backpropagation",
            "It guarantees 100% accuracy on every image"
          ],
          correctIndex: 1,
          explanation: "In a fully connected layer on a 1000x1000 image, millions of weights would be needed per neuron. A 3x3 CNN filter has just 9 weights reused everywhere."
        },
        {
          id: 2,
          question: "What is the primary purpose of a Max Pooling layer in a CNN?",
          options: [
            "To reduce spatial dimensions (downsampling) while preserving dominant features and introducing spatial invariance",
            "To increase the pixel resolution of the image",
            "To convert color images into greyscale",
            "To invert the image upside down"
          ],
          correctIndex: 0,
          explanation: "Max pooling takes the maximum value within a window (e.g. 2x2), cutting spatial dimensions in half, speeding up computation and making feature detection resistant to minor shifts."
        },
        {
          id: 3,
          question: "What do the very first layers of a deep CNN typically learn to detect?",
          options: [
            "Full faces and car models",
            "Simple low-level patterns like edges, corners, color gradients, and lines",
            "Text written inside the image",
            "The time of day the photo was taken"
          ],
          correctIndex: 1,
          explanation: "Empirical visualizations of CNNs show that early layers always converge to Gabor-like edge detectors and directional gradients, which later layers compose into complex shapes."
        }
      ],
      suggestedQuestions: [
        "Why are Vision Transformers (ViT) competing with traditional CNNs today?",
        "How do Stride and Padding affect the output dimensions of a convolution?",
        "What is 1x1 convolution used for in modern architectures?"
      ]
    };
  }

  // Default rich fallback for any general concept
  return {
    concept: topic,
    tagline: `Demystifying ${topic} with intuition, real-world examples, and interactive simulations`,
    category: "Computer Science & AI",
    simpleExplanation: `${topic} is a core foundation of modern computing and artificial intelligence. Rather than treating it as an intimidating black box of formulas, think of it as an elegant solution to an optimization, representation, or decision problem. It establishes precise mathematical rules that allow algorithms to process data, identify patterns, and adapt dynamically without brute-forcing every possible permutation.`,
    underTheHood: `Under the hood, ${topic} relies on structured mathematical primitives: state spaces, objective functions, iterative optimization, and parameter updates. By breaking the overarching challenge into modular subproblems, the system evaluates inputs, propagates signals through structured transformations, and updates its internal state to minimize error or maximize reward.`,
    realWorldExample: {
      title: `How ${topic} Powers Modern Technology`,
      story: `From recommendation systems that curate your daily playlist to autonomous robotics planning trajectories in real time, ${topic} provides the deterministic or probabilistic backbone that makes automated intelligence dependable in production environments.`,
      analogy: "Like a master navigator constantly recalculating the fastest course across a stormy ocean by sensing wind speed and tidal currents, rather than blindly following a rigid pre-drawn map."
    },
    simulatorType: "perceptron",
    keyTakeaways: [
      "Provides structured computational models for learning and inference.",
      "Balances computational complexity against accuracy and generalization.",
      "Serves as an essential building block across machine learning and algorithmic systems."
    ],
    quiz: [
      {
        id: 1,
        question: `What fundamental objective does ${topic} aim to optimize?`,
        options: [
          "Transforming inputs systematically to minimize error or maximize utility",
          "Multiplying arbitrary random numbers without purpose",
          "Replacing all hardware components with software simulators",
          "Preventing code from being stored in memory"
        ],
        correctIndex: 0,
        explanation: "At its core, every machine learning and algorithmic concept seeks to map input signals to desired outputs while optimizing an objective function."
      },
      {
        id: 2,
        question: "Why is generalization critical when implementing this concept?",
        options: [
          "So the system only memorizes the exact training samples",
          "So the algorithm performs accurately on novel, unseen data in production",
          "To force the computer to slow down its clock cycle",
          "To disable all security checks"
        ],
        correctIndex: 1,
        explanation: "A model that only memorizes training examples suffers from overfitting. True intelligence requires generalizing patterns to new instances."
      },
      {
        id: 3,
        question: "Which trade-off is most commonly managed when tuning algorithms like this?",
        options: [
          "Bias vs. Variance (underfitting vs. overfitting)",
          "Monitor refresh rate vs. keyboard color",
          "HTML tags vs. CSS styles",
          "CPU fan noise vs. power cord length"
        ],
        correctIndex: 0,
        explanation: "The bias-variance trade-off is the central dilemma in statistical learning: simpler models risk high bias, while overly complex models risk high variance."
      }
    ],
    suggestedQuestions: [
      `What are the most common failure modes or edge cases in ${topic}?`,
      `How has ${topic} evolved over the past decade in modern AI?`,
      `Can you show a simple Python demonstration of ${topic}?`
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
    const prompt = `You are a world-class computer science and artificial intelligence educator for Neural Playground, an interactive futuristic learning web app.
Explain the following computer science or AI concept: "${topic}" for a "${level}" audience.

Provide a complete, deeply insightful, engaging explanation in valid JSON matching the exact schema.
Choose simulatorType strictly from one of: 'attention', 'convolution', 'gradient_descent', 'perceptron', 'pathfinding', 'generic'.

Required JSON structure:
{
  "concept": "${topic}",
  "tagline": "A punchy, memorable 1-sentence description",
  "category": "E.g. Deep Learning, Algorithms, NLP, Computer Vision, etc.",
  "simpleExplanation": "Clear, jargon-free explanation with intuition first. 2-3 engaging paragraphs.",
  "underTheHood": "The mathematical or algorithmic breakdown of how it actually works step by step.",
  "realWorldExample": {
    "title": "A concrete real-world application (e.g. self-driving, medicine, Spotify)",
    "story": "How this technology solves that specific real problem in industry.",
    "analogy": "An unforgettable physical or everyday life analogy."
  },
  "simulatorType": "attention" | "convolution" | "gradient_descent" | "perceptron" | "pathfinding" | "generic",
  "keyTakeaways": [
    "Takeaway 1",
    "Takeaway 2",
    "Takeaway 3"
  ],
  "quiz": [
    {
      "id": 1,
      "question": "Question text testing intuition or key mechanics",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Clear explanation of why this answer is correct."
    },
    {
      "id": 2,
      "question": "Second question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 1,
      "explanation": "Explanation"
    },
    {
      "id": 3,
      "question": "Third question",
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
        temperature: 0.7,
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
