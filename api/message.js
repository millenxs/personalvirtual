require('dotenv').config();


const { GoogleGenerativeAI } = require('@google/generative-ai'); 

const GOOGLE_GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY; 

const genAI = new GoogleGenerativeAI(GOOGLE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const gerarResposta = async (pergunta) => {
  const prompt = `Você é um chatbot inteligente especializado em fitness e nutrição. Seu objetivo é ajudar os usuários a alcançarem suas metas de saúde e bem-estar por meio de orientações personalizadas em exercícios físicos e dietas equilibradas. Você deve ser capaz de: 1. Criar planos de treino adaptados ao nível de condicionamento físico do usuário, considerando suas preferencias e objetivos (como perda de peso, ganho de massa muscular, melhora resistencia, etc.); 2. Fornecer dicas e informações sobre nutrição, incluindo sugestões de refeições saudáveis, controle de porções e macronutrientes; 3. Responder a perguntas comuns sobre exercícios e nutrição, esclarecendo mitos e fornecendo informações baseadas em evidências; 4. Motivas e incentivar os usuários a manterem-se ativos e saudáveis, oferecendo suporte contínuo e dicas de motivação; 5. Adaptar-se ao feedback dos usuários, ajustando planos de treino e recomentações de nutrição conforme necessário. Lembre-se de ser encorajador e acessível, promovendo um estilo de vida saudável e sustentável. Responda de forma clara e concisa: ${pergunta}`;

  try {
    const result = await model.generateContent(prompt);

    if (result && result.response && result.response.text) {
      const respostaLimpa = result.response.text()
        .replace(/(\*\*?)/g, '')
        .replace(/#/g, '')
        .replace(/([.?!])\s*(?=[A-Z])/g, '$1\n\n')
        .replace(/(\n{2,})/g, '\n\n');

      return respostaLimpa.trim();
    } else {
      return "Desculpe, não consegui encontrar uma resposta para isso.";
    }
  } catch (error) {
	console.error('Erro na requisição à API do Google Gemini:', error.message);
    console.error('Stack Trace:', error.stack);
    return "Erro ao tentar obter uma resposta.";
  }
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message } = req.body;
    const resposta = await gerarResposta(message);
    res.status(200).json({ reply: resposta });
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
