import { openrouter, CATEGORY_MODELS } from '../../config/openrouter'
import { env } from '../../config/env'
import { AIGenerationResult } from '../../types/ai.types'

const tryModel = async (
  model: string,
  system: string,
  user: string,
  options: { maxTokens?: number; jsonMode?: boolean }
): Promise<AIGenerationResult> => {
  const start = Date.now()
  const response = await openrouter.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    max_tokens: options.maxTokens ?? 4096,
    ...(options.jsonMode ? { response_format: { type: 'json_object' } } : {}),
  })
  return {
    content: response.choices[0]?.message?.content ?? '',
    inputTokens: response.usage?.prompt_tokens ?? 0,
    outputTokens: response.usage?.completion_tokens ?? 0,
    model,
    latencyMs: Date.now() - start,
  }
}

export const generateCompletion = async (
  system: string,
  user: string,
  options: { category?: string; maxTokens?: number; jsonMode?: boolean } = {}
): Promise<AIGenerationResult> => {
  const models = CATEGORY_MODELS[options.category ?? 'default'] ?? CATEGORY_MODELS.default

  for (const model of models) {
    try {
      const result = await tryModel(model, system, user, options)
      if (result.content) {
        console.log(`✅ AI [${model}] responded (${result.latencyMs}ms)`)
        return result
      }
    } catch (err: any) {
      console.warn(`⚠️ Model [${model}] failed: ${err?.message} — trying next...`)
    }
  }

  throw new Error('All AI models failed. Please try again later.')
}

export const streamCompletion = async function* (
  system: string,
  user: string,
  category?: string
): AsyncGenerator<string> {
  const models = CATEGORY_MODELS[category ?? 'default'] ?? CATEGORY_MODELS.default

  for (const model of models) {
    try {
      const stream = await openrouter.chat.completions.create({
        model,
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
      return
    } catch (err: any) {
      console.warn(`⚠️ Stream model [${model}] failed: ${err?.message} — trying next...`)
    }
  }

  throw new Error('All AI stream models failed. Please try again later.')
}
