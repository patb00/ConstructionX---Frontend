import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { NotificationsApi } from "../api/notifications.api";
import { notificationsKeys } from "../api/notifications.keys";
import type { CreateNotificationRequest } from "..";

export function useCreateNotification() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
 
  return useMutation({
    mutationFn: (req: CreateNotificationRequest) => NotificationsApi.create(req),
    onSuccess: (data: any) => {
      enqueueSnackbar(data?.messages?.[0] || data?.messages, {
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: notificationsKeys.all,
      });
    },
    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
