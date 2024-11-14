import { useQuery, useMutation } from '@tanstack/react-query';
import { liveApi } from '@apis/live';
import type { Live, LiveDetail, UpdateLiveRequest, SortType } from '@/types/live';

export const liveKeys = {
  all: ['lives'] as const,
  sorted: (sort: SortType) => [...liveKeys.all, { sort }] as const,
  detail: (channelId: string) => [...liveKeys.all, 'detail', channelId] as const,
};

export const useLives = (sort: SortType) => {
  return useQuery<Live[]>({
    queryKey: liveKeys.sorted(sort),
    queryFn: () => liveApi.getLives(sort),
  });
};

export const useLiveDetail = (channelId: string) => {
  return useQuery<LiveDetail>({
    queryKey: liveKeys.detail(channelId),
    queryFn: () => liveApi.getLiveByChannelId(channelId),
    enabled: !!channelId,
  });
};

export const useUpdateLive = () => {
  return useMutation({
    mutationFn: ({ channelId, updateData }: { channelId: string; updateData: UpdateLiveRequest }) =>
      liveApi.updateLive(channelId, updateData),
  });
};
