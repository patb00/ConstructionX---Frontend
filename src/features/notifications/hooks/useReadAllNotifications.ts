import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationsApi } from "../api/notifications.api";
import { notificationsKeys } from "../api/notifications.keys";

export function useReadAllNotifications() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => NotificationsApi.readAll(),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: notificationsKeys.all });
    },
  });
}
