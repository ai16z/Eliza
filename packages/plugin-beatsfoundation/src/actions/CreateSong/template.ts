export const createSongTemplate = `
Given the conversation context, extract the song creation parameters.
Return a JSON object with the following structure:
{
    "prompt": string (required),
    "lyrics": string (optional),
    "genre": string (optional),
    "mood": string (optional),
    "isInstrumental": boolean (optional)
}
`;