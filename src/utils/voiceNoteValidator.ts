function isVoiceNote(text: string): boolean {
  const pattern = /event_voice_note_/;

  return pattern.test(text);
}

export { isVoiceNote };
