import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationsApi } from "../api/notifications.api";
import { notificationsKeys } from "../api/notifications.keys";

export function useReadNotification() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) =>
      NotificationsApi.read(notificationId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: notificationsKeys.all });
    },
  });
}
