import { BrandVoice } from '@prisma/client'

export const buildFinalPrompt = (
  baseSystemPrompt: string,
  userPrompt: string,
  brandVoice: BrandVoice | null
): { system: string; user: string } => {
  let system = baseSystemPrompt
  if (brandVoice?.systemPrompt) {
    system += `\n\n─── BRAND VOICE REQUIREMENTS ───\n${brandVoice.systemPrompt}\n\nThese brand voice guidelines OVERRIDE default tone. Apply them to every sentence.`
  }
  return { system, user: userPrompt }
}

export const generateBrandVoiceSystemPrompt = (voice: BrandVoice): string => {
  const traits: string[] = []

  if (voice.formalCasual < 30) traits.push('formal, professional, structured')
  else if (voice.formalCasual > 70) traits.push('casual, conversational, relaxed')
  else traits.push('balanced — professional yet approachable')

  if (voice.seriousPlayful > 70) traits.push('playful, uses humour and wit')
  if (voice.reservedBold > 70) traits.push('bold, confident, makes strong statements')
  if (voice.traditionalInno > 70) traits.push('forward-thinking, innovative, uses modern references')
  if (voice.technicalSimple < 30) traits.push('technical, uses industry terminology')
  else if (voice.technicalSimple > 70) traits.push('simple language, avoids jargon, explains clearly')

  return [
    `Tone: ${traits.join(', ')}`,
    voice.wordsToUse.length > 0 ? `Words and phrases to USE: ${voice.wordsToUse.join(', ')}` : '',
    voice.wordsToAvoid.length > 0 ? `Words and phrases to AVOID: ${voice.wordsToAvoid.join(', ')}` : '',
  ].filter(Boolean).join('\n')
}
