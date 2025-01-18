// base-templates.ts
export const paginationParamsTemplate = `
Extract pagination parameters:
- Pagination: {{pagination}} (PaginationOption?) - Optional pagination configuration
  - Key: {{pagination.key}} (string?) - Optional pagination key
  - Offset: {{pagination.offset}} (number?) - Optional offset
  - Limit: {{pagination.limit}} (number?) - Optional limit
  - Reverse: {{pagination.reverse}} (boolean?) - Optional reverse order flag
`;

export const addressParamsTemplate = `
Extract address parameters:
- Address: {{address}} (string) - Account address
`;

export const timeRangeParamsTemplate = `
Extract time range parameters:
- Start Time: {{startTime}} (number?) - Optional start timestamp
- End Time: {{endTime}} (number?) - Optional end timestamp
`;

export const denomParamTemplate = `
Extract denomination parameters:
- Denom: {{denom}} (string) - Token denomination
`;

export const standardResponseTemplate = `
Extract standard response structure:
- Success: {{success}} (boolean) - Operation success status
- Result: {{result}} (T) - Response data of generic type T
`;
