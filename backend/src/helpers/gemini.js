const logger = require('../config/logger');

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-latest';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const GEMINI_TIMEOUT_MS = 15000;

const ANALYSIS_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    root_causes: { type: 'array', items: { type: 'string' } },
    affected_modules: { type: 'array', items: { type: 'string' } },
    severity_recommendation: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
    debugging_recommendations: { type: 'array', items: { type: 'string' } },
  },
  required: ['summary', 'root_causes', 'affected_modules', 'severity_recommendation', 'debugging_recommendations'],
};

const buildPrompt = ({ title, description, reproduction_steps, severity }) =>
  `
You are a senior software engineer helping a QA team triage a newly submitted bug report.

Bug title: ${title}
Bug description: ${description}
Reproduction steps: ${reproduction_steps || 'Not provided.'}
Reporter-assigned severity: ${severity}

Analyze this bug report and return a JSON object with exactly these fields:
- summary: a concise one-to-two sentence summary of the bug.
- root_causes: an array of 2-4 likely root causes, most likely first.
- affected_modules: an array of 1-4 short names of application modules/areas likely affected.
- severity_recommendation: your own severity assessment ("low", "medium", "high", or "critical"), independent of the reporter's severity.
- debugging_recommendations: an array of 2-5 concrete, actionable debugging steps for a developer.

Base your analysis only on the information given above. Do not invent specifics that aren't implied by the report.
`.trim();

const parseAnalysis = (raw_text) => {
  const parsed = JSON.parse(raw_text);

  const to_string_array = (value) => (Array.isArray(value) ? value.filter((item) => typeof item === 'string') : []);

  return {
    summary: typeof parsed.summary === 'string' ? parsed.summary : null,
    root_causes: to_string_array(parsed.root_causes),
    affected_modules: to_string_array(parsed.affected_modules),
    severity_recommendation: typeof parsed.severity_recommendation === 'string' ? parsed.severity_recommendation : null,
    debugging_recommendations: to_string_array(parsed.debugging_recommendations),
  };
};

const generateBugAnalysis = async ({ title, description, reproduction_steps, severity }) => {
  if (!process.env.GEMINI_API_KEY) {
    logger.error('Gemini Analysis Error: GEMINI_API_KEY is not configured.');
    return null;
  }

  const controller = new AbortController();
  const timeout_id = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: buildPrompt({ title, description, reproduction_steps, severity }) }],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: ANALYSIS_RESPONSE_SCHEMA,
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const error_body = await response.text();
      throw new Error(`Gemini API responded with status ${response.status}: ${error_body}`);
    }

    const payload = await response.json();
    const raw_text = payload?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!raw_text) {
      throw new Error('Gemini API response did not contain any content.');
    }

    return parseAnalysis(raw_text);
  } catch (error) {
    logger.error(`Gemini Analysis Error: ${error.message}`);
    return null;
  } finally {
    clearTimeout(timeout_id);
  }
};

module.exports = { generateBugAnalysis };
