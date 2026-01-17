/**
 * Helper function to map notification actionUrl to frontend route
 * Add new notification types here as needed
 */
export const getNavigationPath = (actionUrl: string): string | null => {
  const routes: Array<{
    pattern: RegExp;
    getPath: (match: RegExpMatchArray) => string;
  }> = [
    {
      pattern: /construction-sites\/(\d+)/,
      getPath: (match) => `/app/constructionSites/${match[1]}/details`,
    },
    {
      pattern: /vehicle-business-trips\/(\d+)/,
      getPath: (match) => `/app/vehicle-business-trips/${match[1]}/edit`,
    },
    // Add more notification types here as needed
  ];

  for (const route of routes) {
    const match = actionUrl.match(route.pattern);
    if (match) {
      return route.getPath(match);
    }
  }

  return null;
};
