import { Response } from 'express'
import { countWords, estimateTokens } from '../../utils/helpers'

export const streamAIResponse = async (
  res: Response,
  generateFn: () => AsyncGenerator<string>,
  onComplete: (fullText: string, tokens: number) => Promise<void>
): Promise<void> => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no')
  res.flushHeaders()

  let fullText = ''

  const send = (obj: object) => {
    res.write(`data: ${JSON.stringify(obj)}\n\n`)
    if (typeof (res as unknown as { flush?: () => void }).flush === 'function') {
      (res as unknown as { flush: () => void }).flush()
    }
  }

  try {
    for await (const chunk of generateFn()) {
      fullText += chunk
      send({ type: 'chunk', data: chunk })
    }

    const tokens = estimateTokens(fullText)
    await onComplete(fullText, tokens)

    send({
      type: 'done',
      metadata: {
        wordCount: countWords(fullText),
        tokens,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    send({
      type: 'error',
      message: error instanceof Error ? error.message : 'Generation failed',
    })
  } finally {
    res.end()
  }
}
