import type { NotificationDto } from "../../../lib/signalR/types";

type Resolver = (n: NotificationDto) => string | null;

const byEntityType: Record<string, Resolver> = {
  ConstructionSite: (n) =>
    n.entityId ? `/app/constructionSites/${n.entityId}/details` : null,

  VehicleRegistrationEmployee: (n) =>
    n.entityId ? `/app/vehicle-registrations/${n.entityId}/details` : null,

  VehicleBusinessTrip: (n) =>
    n.entityId ? `/app/vehicle-business-trips/${n.entityId}/details` : null,

  Tool: (n) => (n.entityId ? `/app/tools/${n.entityId}/details` : null),

  Vehicle: (n) => (n.entityId ? `/app/vehicles/${n.entityId}/details` : null),
};

export const getNavigationPath = (n: NotificationDto): string | null => {
  if (n.entityType && byEntityType[n.entityType]) {
    const p = byEntityType[n.entityType](n);
    if (p) return p;
  }

  if (n.actionUrl) {
    const url = n.actionUrl.replace(/^\//, "");

    const routes: Array<{
      pattern: RegExp;
      getPath: (match: RegExpMatchArray) => string;
    }> = [
      {
        pattern: /^construction-sites\/(\d+)$/,
        getPath: (m) => `/app/constructionSites/${m[1]}/details`,
      },

      {
        pattern: /^vehicles\/(\d+)$/,
        getPath: (m) => `/app/vehicles/${m[1]}/details`,
      },
    ];

    for (const r of routes) {
      const match = url.match(r.pattern);
      if (match) return r.getPath(match);
    }
  }

  return null;
};
