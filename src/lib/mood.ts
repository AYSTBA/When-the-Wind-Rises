const MOOD_EMOJI_MAP: Record<string, string> = {
  "很开心": "😄",
  "开心": "😊",
  "一般": "😐",
  "低落": "😔",
  "很失落": "😞",
}

export function getMoodEmoji(mood: string | null | undefined): string | null {
  if (!mood) return null
  return MOOD_EMOJI_MAP[mood] ?? null
}
