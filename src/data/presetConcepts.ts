import { ConceptData } from '../types';

export const PRESET_CONCEPTS: ConceptData[] = [
  {
    concept: "Neural Networks & Perceptrons",
    tagline: "The atomic unit of deep learning: combining weighted inputs into decisions",
    category: "Deep Learning Foundations",
    simpleExplanation: "Imagine you're trying to decide whether to attend an outdoor music festival. You weigh several factors: Is the weather nice? Are your best friends going? Is the ticket affordable? Each factor has a different personal importance (a 'weight'). You sum up all these considerations, add your natural baseline mood (a 'bias'), and if the total crosses your decision threshold, you decide: 'Yes, I'm going!' An artificial neuron (perceptron) does exactly this with numbers, calculating weighted sums and passing them through an activation function.",
    underTheHood: "A single perceptron takes an input vector x = [x₁, x₂, ..., xₙ], multiplies each element by a learnable weight vector w = [w₁, w₂, ..., wₙ], adds a scalar bias b, and applies a non-linear activation function σ(z): ŷ = σ(∑ wᵢxᵢ + b). Without non-linear activation functions (like ReLU or Sigmoid), stacking 1,000 neural layers would collapse into just one giant linear equation: y = W_final · x. Non-linearities allow neural networks to bend space and approximate arbitrary complex functions.",
    realWorldExample: {
      title: "Credit Card Fraud Detection in Milliseconds",
      story: "When you swipe your card at a store 5,000 miles from home at 3 AM, a banking neural network evaluates dozens of signals: location velocity, transaction size, merchant category, device fingerprint. Each neuron in the hidden layers checks patterns (e.g., rapid sequence of small test charges), firing high activation into the output neuron: 'Flag Transaction'.",
      analogy: "Like a jury where 12 jurors debate evidence: each juror gives specific testimony different weight, and only when the combined conviction exceeds reasonable doubt is the verdict delivered."
    },
    simulatorType: "neural_network",
    keyTakeaways: [
      "Weights determine the influence of each input feature; biases shift the activation threshold.",
      "Non-linear activation functions (ReLU, Sigmoid, Tanh) allow networks to solve non-linear problems.",
      "Deep networks stack millions of these simple linear + non-linear equations into universal function approximators."
    ],
    quiz: [
      {
        id: 1,
        question: "Why can't a multi-layer neural network solve non-linear problems without non-linear activation functions?",
        options: [
          "Without non-linearities, any combination of linear layers collapses into a single equivalent linear transformation",
          "The computer would run out of floating point precision",
          "Backpropagation only works with integer numbers",
          "Weights can only be positive if there is no activation function"
        ],
        correctIndex: 0,
        explanation: "Mathematically, the composition of linear functions is always linear: W₂(W₁x + b₁) + b₂ = (W₂W₁)x + (W₂b₁ + b₂). Non-linear activations are essential to bend and warp decision boundaries."
      },
      {
        id: 2,
        question: "What does the 'bias' term (b) in a neuron represent physically?",
        options: [
          "The speed of the GPU during training",
          "An offset that shifts the activation threshold regardless of the input values",
          "A penalty added to punish incorrect classifications",
          "The learning rate multiplier"
        ],
        correctIndex: 1,
        explanation: "Just like the y-intercept (b) in the line equation y = mx + b, a bias allows the decision boundary to shift away from the origin (0, 0)."
      },
      {
        id: 3,
        question: "What is the mathematical definition of the standard ReLU activation function?",
        options: [
          "f(x) = 1 / (1 + e^(-x))",
          "f(x) = max(0, x)",
          "f(x) = x²",
          "f(x) = tanh(x)"
        ],
        correctIndex: 1,
        explanation: "Rectified Linear Unit (ReLU) outputs x if x > 0, and 0 otherwise. Its simple derivative (1 or 0) solves vanishing gradients in deep networks."
      }
    ],
    suggestedQuestions: [
      "What is the vanishing gradient problem, and why did ReLU fix it?",
      "How does the perceptron learning rule differ from modern gradient descent?",
      "Can a single perceptron solve the XOR problem? Why or why not?"
    ]
  },
  {
    concept: "Sorting Algorithms",
    tagline: "The bedrock of computer science: ordering data with algorithmic efficiency",
    category: "Foundational Algorithms",
    simpleExplanation: "Imagine you're handed a messy deck of 52 playing cards and asked to put them in order. How would you do it? You could scan for the smallest card and move it to the front over and over (Selection Sort), compare neighboring pairs and bubble high cards to the end (Bubble Sort), or pick a card in the middle as a benchmark and divide the deck into 'smaller' and 'larger' piles (Quick Sort). Sorting algorithms are systematic strategies to arrange disordered data into structured sequences.",
    underTheHood: "Sorting algorithms are benchmarked by their Time Complexity (Big O) and Space Complexity. Elementary algorithms like Bubble Sort and Insertion Sort take O(n²) comparisons in the average/worst case. Divide-and-conquer algorithms like Merge Sort and Quick Sort achieve O(n log n). Quick Sort chooses a 'pivot' element, partitions the array so all elements smaller than the pivot go to the left and larger go to the right, and recursively repeats this on both sub-arrays.",
    realWorldExample: {
      title: "Real-Time Search Engine Query Rankings",
      story: "When you search for 'quantum computing breakthrough', Google indexes billions of documents, calculates relevance scores, and must deliver the top 10 ranked links in under 120 milliseconds. Optimized hybrid sorting algorithms (like TimSort or Radix Sort variants) sort massive score arrays at lightning speed.",
      analogy: "Like organizing an encyclopedia bookshelf: sorting by volume index makes finding any subject take seconds, whereas searching through a pile of unorganized books would take hours."
    },
    simulatorType: "sorting",
    keyTakeaways: [
      "Divide-and-conquer algorithms (O(n log n)) scale dramatically better than naive comparison algorithms (O(n²)).",
      "In-place sorting (like Quick Sort) saves RAM compared to auxiliary buffer sorting (like Merge Sort).",
      "Real-world languages often use hybrid algorithms like TimSort (Python/Java), blending Insertion Sort and Merge Sort."
    ],
    quiz: [
      {
        id: 1,
        question: "What is the average time complexity of Quick Sort on an array of n items?",
        options: [
          "O(n)",
          "O(n log n)",
          "O(n²)",
          "O(log n)"
        ],
        correctIndex: 1,
        explanation: "Quick Sort splits the problem in half roughly log(n) times and performs O(n) partitioning work at each level, yielding O(n log n) average time."
      },
      {
        id: 2,
        question: "Why is Merge Sort preferred over Quick Sort for sorting linked lists?",
        options: [
          "Linked lists don't allow fast random indexing, but sequential merging works in O(1) extra space",
          "Quick Sort cannot compare numbers",
          "Merge Sort runs in O(1) time",
          "Linked lists can only hold sorted numbers"
        ],
        correctIndex: 0,
        explanation: "Merge Sort can merge two linked lists by simply rewiring pointers without requiring contiguous array access or extra allocation."
      },
      {
        id: 3,
        question: "What constitutes the 'worst-case' scenario for naive Quick Sort (choosing the first element as pivot)?",
        options: [
          "An array containing completely random numbers",
          "An already sorted or reverse-sorted array",
          "An array containing only negative numbers",
          "An array with an odd number of elements"
        ],
        correctIndex: 1,
        explanation: "If the array is already sorted, picking the first element creates unbalanced partitions of size 0 and n-1, degrading recursion depth to n and runtime to O(n²)."
      }
    ],
    suggestedQuestions: [
      "What is TimSort, and why do Python and Java use it as their default sort?",
      "Can comparison-based sorting ever beat O(n log n) theoretically?",
      "How does Counting Sort achieve O(n) time complexity?"
    ]
  },
  {
    concept: "Transformers & Self-Attention",
    tagline: "The architectural revolution powering ChatGPT, Gemini, and Generative AI",
    category: "Deep Learning & NLP",
    simpleExplanation: "Imagine reading a long sentence where the word 'bank' appears. Does it mean a financial institution, or the grassy edge of a river? In older AI models (like RNNs), words were read one-by-one like a ticker tape, and by the end of the sentence, the model had already forgotten the beginning. The Transformer architecture processes all words in a sentence at once. Through 'Self-Attention', every word simultaneously looks at all other words, scoring how relevant they are to each other.",
    underTheHood: "For each input token, the model projects embeddings into Query (Q), Key (K), and Value (V) matrices. The attention weight between token i and token j is calculated by taking the dot product Qᵢ · Kⱼ^T, dividing by √d_k to stabilize variance, and applying a softmax: Attention(Q, K, V) = softmax(Q·K^T / √d_k) · V. Multi-Head Attention repeats this across 8 to 96 parallel heads, letting the model simultaneously capture syntactic grammar, semantic reference, and long-range dependencies.",
    realWorldExample: {
      title: "Contextual Code Generation with Gemini & GitHub Copilot",
      story: "When you write code in Python, a function definition 200 lines above dictates the valid arguments for a method call you are typing right now. Self-attention links the current line directly across hundreds of tokens of context to auto-complete the exact parameter names without losing focus.",
      analogy: "Like a round-table diplomatic summit where every ambassador has an ear-piece that dynamically amplifies the voices of the colleagues talking about topics directly affecting their own nation."
    },
    simulatorType: "attention",
    keyTakeaways: [
      "Allows full parallel training on modern GPU clusters, unlike sequential RNN architectures.",
      "Calculates dynamic pairwise affinity scores between all tokens across the context window.",
      "Powers everything from LLMs to Vision Transformers (ViT) and text-to-image diffusion models."
    ],
    quiz: [
      {
        id: 1,
        question: "What is the primary computational bottleneck of standard full self-attention with sequence length N?",
        options: [
          "O(N) linear memory",
          "O(N²) quadratic time and memory complexity",
          "O(2^N) exponential time",
          "O(log N) logarithmic time"
        ],
        correctIndex: 1,
        explanation: "Every token compares itself against every other token in the sequence, producing an N×N attention matrix that scales quadratically with context length."
      },
      {
        id: 2,
        question: "Why do Transformers require Positional Encodings?",
        options: [
          "Because attention calculations are permutation-invariant and do not inherently know the order of words",
          "To translate text into English",
          "To compress the weights onto disk",
          "To speed up GPU clock rates"
        ],
        correctIndex: 0,
        explanation: "Because self-attention operates on all tokens simultaneously as a set, 'cat ate mouse' and 'mouse ate cat' would yield identical attention matrices without positional vectors added to token embeddings."
      },
      {
        id: 3,
        question: "What does the Value (V) vector represent in the attention mechanism?",
        options: [
          "The price of training the model",
          "The actual contextual representation or content that gets aggregated and weighted by the attention scores",
          "The loss gradient computed by the optimizer",
          "The token index in the dictionary"
        ],
        correctIndex: 1,
        explanation: "Query and Key determine the attention weights (the importance or 'recipe'), while the Values are the actual information vectors that get mixed together according to those weights."
      }
    ],
    suggestedQuestions: [
      "How do FlashAttention and linear attention algorithms bypass the O(N²) memory wall?",
      "What is the difference between an Encoder-only, Decoder-only, and Encoder-Decoder model?",
      "How does RoPE (Rotary Position Embedding) work compared to sinusoidal embeddings?"
    ]
  },
  {
    concept: "Gradient Descent & Optimization",
    tagline: "How machine learning models navigate complex mathematical valleys to learn",
    category: "Mathematical Optimization",
    simpleExplanation: "Imagine you're blindfolded on a foggy mountain peak and your goal is to reach the lowest lake in the valley. You cannot see the landscape. What do you do? You feel the slope beneath your boots. Whichever direction slopes downwards most steeply, you take a cautious step in that direction. You repeat this step over and over until the ground feels flat. In machine learning, the mountain is the 'Loss Function' (measuring errors), and each step downhill updates the model's weights to make fewer mistakes.",
    underTheHood: "Given a parameter vector θ and an objective loss function J(θ), gradient descent computes the vector of partial derivatives ∇J(θ) with respect to each parameter. Parameters are updated using the update rule: θ_{t+1} = θ_t - α · ∇J(θ_t), where α is the Learning Rate. If α is too small, convergence takes forever; if α is too large, the updates oscillate wildly and diverge. Modern optimizers (Adam, RMSProp) incorporate momentum: m_t = β₁m_{t-1} + (1-β₁)g_t to glide past flat saddle points and local minima.",
    realWorldExample: {
      title: "Training Autonomous Drone Navigation",
      story: "A delivery drone's neural flight controller begins with randomized weights that would crash the drone instantly. By running simulations and calculating the gradient of navigation error (distance from target waypoint + obstacle collisions), gradient descent tunes 500,000 motor command parameters until flight is silky smooth.",
      analogy: "Like tuning a guitar string by turning the peg bit by bit, listening to whether the note gets closer to pitch, until the dissonance completely disappears."
    },
    simulatorType: "gradient_descent",
    keyTakeaways: [
      "The gradient points in the direction of steepest ascent; stepping in the opposite direction minimizes loss.",
      "Learning rate is the most critical hyperparameter: too high leads to divergence, too low causes stagnation.",
      "Stochastic Gradient Descent (SGD) uses random mini-batches of data, introducing helpful noise to escape local traps."
    ],
    quiz: [
      {
        id: 1,
        question: "What happens if the learning rate α is set excessively high during gradient descent?",
        options: [
          "The model converges to the global minimum instantaneously",
          "The parameters can overshoot the valley floor and oscillate with increasing magnitude, causing loss to explode to NaN",
          "The training loss becomes negative",
          "The weights are automatically reset to zero"
        ],
        correctIndex: 1,
        explanation: "An excessively large step size jumps clear over the valley and lands higher on the opposite slope, compounding errors until calculations overflow."
      },
      {
        id: 2,
        question: "What is the primary advantage of Stochastic Gradient Descent (SGD) over Batch Gradient Descent?",
        options: [
          "SGD calculates the gradient on small subsets (mini-batches), requiring far less memory and updating weights frequently",
          "SGD completely eliminates the need for derivatives",
          "SGD is only capable of finding exact analytical solutions",
          "SGD runs exclusively on quantum processors"
        ],
        correctIndex: 0,
        explanation: "Batch gradient descent must process all 10 million training examples before taking a single step. SGD takes thousands of iterative steps using small mini-batches (e.g. 64 or 128 samples)."
      },
      {
        id: 3,
        question: "What role does 'momentum' play in advanced optimizers like Adam and SGD with Momentum?",
        options: [
          "It accumulates velocity in directions of persistent gradient, helping blast through flat plateaus and dampen oscillations",
          "It decreases the number of layers in the neural network",
          "It converts the neural network into a decision tree",
          "It measures the weight of the server rack"
        ],
        correctIndex: 0,
        explanation: "Much like a heavy ball rolling downhill gathers momentum to roll right through small humps and shallow potholes, momentum prevents optimizers from getting stuck on flat saddle surfaces."
      }
    ],
    suggestedQuestions: [
      "Why is the Adam optimizer considered the standard default for deep learning?",
      "What is a saddle point, and why is it more common than local minima in high dimensions?",
      "How does learning rate scheduling (cosine decay or warmup) improve final generalization?"
    ]
  },
  {
    concept: "A* Pathfinding & Search",
    tagline: "The gold-standard heuristic algorithm powering GPS navigation and game AI",
    category: "Graph Theory & Search",
    simpleExplanation: "If you want to navigate from New York to Los Angeles, exploring roads heading northeast towards Boston would be a foolish waste of time. Dijkstra's algorithm explores roads in all directions equally like an expanding puddle of water. A* (A-Star) search is much smarter: it combines the actual distance already traveled with an educated estimate (heuristic) of how far remains to Los Angeles, keeping the exploration focused like a directional spotlight straight toward the destination.",
    underTheHood: "A* assigns each node n an evaluation function score: f(n) = g(n) + h(n), where g(n) is the exact known cost from the start node to n, and h(n) is an admissible heuristic estimate of the cost from n to the goal (such as Euclidean or Manhattan distance). A priority queue always expands the node with the lowest f(n). Because the heuristic is admissible (it never overestimates the true remaining distance), A* is mathematically guaranteed to find the shortest possible path while visiting a fraction of the nodes.",
    realWorldExample: {
      title: "Real-Time GPS Route Recalculation in Google Maps",
      story: "When a highway exit is suddenly blocked by an accident ahead, your GPS navigation reroutes your commute across local street networks. A* evaluates hundreds of connected intersections in milliseconds, favoring routes pointing toward your destination that have favorable speed limits.",
      analogy: "Like a bloodhound tracking a scent: instead of sniffing every blade of grass in a 360-degree circle, it follows the scent trail that points directly toward the target."
    },
    simulatorType: "pathfinding",
    keyTakeaways: [
      "Balances path cost so far g(n) with estimated remaining cost h(n).",
      "Admissibility guarantee: If h(n) never overestimates the real cost, A* is mathematically optimal.",
      "Dramatically prunes the search space compared to uninformed breadth-first search or Dijkstra."
    ],
    quiz: [
      {
        id: 1,
        question: "What does it mean for an A* heuristic h(n) to be 'admissible'?",
        options: [
          "It must always return a whole integer",
          "It must never overestimate the true minimum cost to reach the goal",
          "It must be approved by the network administrator",
          "It can only be computed using Euclidean distance"
        ],
        correctIndex: 1,
        explanation: "An admissible heuristic guarantees optimality. If h(n) ever overestimated the cost, A* might skip the true shortest path thinking it was too expensive."
      },
      {
        id: 2,
        question: "What happens to the A* algorithm if the heuristic h(n) is set to 0 for all nodes?",
        options: [
          "The algorithm crashes with a division by zero error",
          "A* degenerates into standard Dijkstra's algorithm, exploring uniformly in all directions",
          "It becomes a Depth-First Search",
          "It finds the path in O(1) time"
        ],
        correctIndex: 1,
        explanation: "When h(n) = 0, f(n) = g(n), which means nodes are evaluated solely by distance traveled from the start—this is the exact definition of Dijkstra's algorithm."
      },
      {
        id: 3,
        question: "Which heuristic is best suited for 4-directional grid movement (up, down, left, right)?",
        options: [
          "Manhattan distance: |x₁ - x₂| + |y₁ - y₂|",
          "Euclidean distance: √((x₁ - x₂)² + (y₁ - y₂)²)",
          "Chebyshev distance: max(|x₁ - x₂|, |y₁ - y₂|)",
          "Cosines similarity"
        ],
        correctIndex: 0,
        explanation: "When movement is restricted to 4 cardinal directions without diagonals, Manhattan distance exactly mirrors grid moves without underestimating, yielding maximum pruning."
      }
    ],
    suggestedQuestions: [
      "What is the difference between an admissible heuristic and a consistent (monotonic) heuristic?",
      "How does Jump Point Search (JPS) optimize A* for uniform grid maps in video games?",
      "Can A* be applied to continuous 3D environments for robotic arms?"
    ]
  },
  {
    concept: "Convolutional Neural Networks (CNNs)",
    tagline: "Translational-invariant vision models that revolutionized visual computing",
    category: "Computer Vision",
    simpleExplanation: "When you look at a photograph of a dog, you immediately recognize it whether the dog is standing on the left side, the right side, or peeking from the top corner. Traditional neural networks would have to re-learn what a dog ear looks like at every single pixel coordinate! CNNs solve this using small sliding math filters called 'kernels'. These kernels scan across the image like a magnifying glass, detecting local edges, curves, and textures no matter where they show up.",
    underTheHood: "A CNN stacks convolutional layers, activation functions (ReLU), and downsampling layers (Max Pooling). In a 2D convolution, a small matrix (e.g. 3x3) performs element-wise multiplications with image pixel patches, summing them into a new 2D grid called a 'Feature Map'. Early layers learn low-level spatial gradients (Sobel-like edge filters). Deep layers synthesize these primitives into complex semantic detectors (noses, text characters, car wheels).",
    realWorldExample: {
      title: "Automated Cancer Detection in Radiographic Scans",
      story: "Radiologists analyze CT scans containing hundreds of megabytes of volumetric tissue data. Specialized 3D CNNs scan across the tissue layers, spotting micro-calcifications and subtle nodule borders that are easily overlooked by tired human eyes, triaging urgent cases for immediate biopsy.",
      analogy: "Like a master detective dusting a crime scene with fingerprint powder: using the exact same fingerprint brush across every surface in the room to find matching swirls."
    },
    simulatorType: "convolution",
    keyTakeaways: [
      "Parameter sharing drastically cuts the number of weights compared to fully-connected dense layers.",
      "Translation invariance allows feature detection independent of the object's spatial position.",
      "Pooling layers downsample feature maps, increasing the receptive field of subsequent deeper layers."
    ],
    quiz: [
      {
        id: 1,
        question: "If an input image is 32x32 and you apply a 3x3 filter with stride 1 and NO padding, what is the output size?",
        options: [
          "32x32",
          "30x30",
          "28x28",
          "16x16"
        ],
        correctIndex: 1,
        explanation: "Output dimension formula is (W - F + 2P)/S + 1 = (32 - 3 + 0)/1 + 1 = 30. The border loses 1 pixel on each side."
      },
      {
        id: 2,
        question: "What is the primary role of 1x1 convolutions (as used in GoogLeNet / ResNet)?",
        options: [
          "To blur the image",
          "To change or reduce channel depth (dimensionality reduction) while adding non-linearity with minimal computational cost",
          "To rotate the image 90 degrees",
          "To detect diagonal edges only"
        ],
        correctIndex: 1,
        explanation: "1x1 convolutions act as cross-channel pooling, letting architectures shrink hundreds of feature channels down to 64 before heavy 3x3 or 5x5 filters."
      },
      {
        id: 3,
        question: "What structural innovation allowed ResNet to train networks with over 150 layers without vanishing gradients?",
        options: [
          "Residual skip connections: f(x) + x",
          "Removing all activation functions",
          "Replacing all weights with random constants",
          "Using exclusively 1x1 filters"
        ],
        correctIndex: 0,
        explanation: "Skip connections allow gradients to flow directly backwards through the identity mapping without being repeatedly multiplied by small weight matrices."
      }
    ],
    suggestedQuestions: [
      "How do dilated (atrous) convolutions increase receptive fields without increasing parameter count?",
      "Why are Vision Transformers (ViT) replacing CNNs in modern large-scale benchmarks?",
      "What is the difference between Object Detection (YOLO) and Semantic Segmentation (U-Net)?"
    ]
  }
];
