export const config = {
  apiBaseUrl: window.PUNTO_CLUB_API_BASE_URL ?? "",
  companyId: window.PUNTO_CLUB_COMPANY_ID ?? "1",
  environmentName: window.PUNTO_CLUB_ENVIRONMENT ?? "production",
  useMockApi: window.PUNTO_CLUB_USE_MOCK_API === true,
};
