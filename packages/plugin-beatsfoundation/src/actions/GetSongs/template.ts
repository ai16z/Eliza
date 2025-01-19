export const getSongsTemplate = `
Given the conversation context, extract any pagination parameters for retrieving songs.
Return a JSON object with the following optional structure:
{
    "limit": number (optional),
    "offset": number (optional)
}
`;