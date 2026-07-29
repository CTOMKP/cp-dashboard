"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { creatorKeys } from "@/lib/queryKeys";
import { creatorService } from "@/services/creatorService";

export function useRequestPayoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: {
      walletAddress: string;
      amount: number;
      note?: string;
    }) => creatorService.requestPayout(body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: creatorKeys.all });
    },
  });
}
