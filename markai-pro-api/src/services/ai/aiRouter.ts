import { openai } from '../../config/openai'
import { anthropic } from '../../config/anthropic'
import { env } from '../../config/env'
import { AIGenerationResult } from '../../types/ai.types'

export const generateCompletion = async (
  system: string,
  user: string,
  options: { model?: string; maxTokens?: number; jsonMode?: boolean } = {}
): Promise<AIGenerationResult> => {
  const start = Date.now()
  const model = options.model ?? env.OPENAI_MODEL_PRIMARY

  if (env.AI_PROVIDER === 'anthropic' || (env.AI_PROVIDER === 'auto' && model.startsWith('claude'))) {
    return generateAnthropic(system, user, options, start)
  }
  return generateOpenAI(system, user, options, start, model)
}

const generateOpenAI = async (
  system: string,
  user: string,
  options: { maxTokens?: number; jsonMode?: boolean },
  start: number,
  model: string
): Promise<AIGenerationResult> => {
  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    max_tokens: options.maxTokens ?? 4096,
    ...(options.jsonMode ? { response_format: { type: 'json_object' } } : {}),
  })

  const content = response.choices[0]?.message?.content ?? ''
  return {
    content,
    inputTokens: response.usage?.prompt_tokens ?? 0,
    outputTokens: response.usage?.completion_tokens ?? 0,
    model,
    latencyMs: Date.now() - start,
  }
}

const generateAnthropic = async (
  system: string,
  user: string,
  options: { maxTokens?: number },
  start: number
): Promise<AIGenerationResult> => {
  const response = await anthropic.messages.create({
    model: env.ANTHROPIC_MODEL,
    system,
    messages: [{ role: 'user', content: user }],
    max_tokens: options.maxTokens ?? 4096,
  })

  const content = response.content[0]?.type === 'text' ? response.content[0].text : ''
  return {
    content,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    model: env.ANTHROPIC_MODEL,
    latencyMs: Date.now() - start,
  }
}

export const streamCompletion = async function* (
  system: string,
  user: string,
  model?: string
): AsyncGenerator<string> {
  const stream = await openai.chat.completions.create({
    model: model ?? env.OPENAI_MODEL_PRIMARY,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    stream: true,
    max_tokens: 4096,
  })

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content
    if (delta) yield delta
  }
}
