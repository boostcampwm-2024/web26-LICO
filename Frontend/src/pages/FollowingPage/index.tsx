import ChannelGrid from '@components/channel/ChannelGrid';
import OfflineGrid from './OfflineGrid';
import { useFollow } from '@/hooks/useFollow';

export default function FollowingPage() {
  const { follows, isLoadingFollows } = useFollow();

  const followedChannels =
    follows?.map(follow => ({
      id: follow.channelId,
      title: follow.livesName,
      streamerName: follow.usersNickname,
      category: follow.categoriesName,
      categoryId: follow.categoriesId,
      profileImgUrl: follow.usersProfileImage,
      thumbnailUrl: '/api/placeholder/400/320',
      viewers: 0,
      isLive: follow.onAir,
      createdAt: new Date().toISOString(),
    })) ?? [];

  const liveChannels = followedChannels.filter(channel => channel.isLive);
  const offlineChannels = followedChannels.filter(channel => !channel.isLive);

  if (isLoadingFollows) {
    return (
      <div className="p-12">
        <div className="mb-3 px-4 font-bold text-2xl text-lico-gray-1">팔로잉</div>
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="font-bold text-lico-gray-2">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (followedChannels.length === 0) {
    return (
      <div className="p-12">
        <div className="mb-3 px-4 font-bold text-2xl text-lico-gray-1">팔로잉</div>
        <div className="flex min-h-[300px] items-center justify-center font-bold text-lico-gray-2">
          아직 팔로우한 채널이 없습니다
        </div>
      </div>
    );
  }

  return (
    <div className="p-12">
      <div className="mb-4 px-4 font-bold text-2xl text-lico-gray-1">팔로잉</div>

      <div className="mb-4">
        <div className="mb-4 flex items-center gap-2 px-4 font-bold text-xl">
          <p className="text-lico-gray-1">라이브</p>
          <span className="text-lico-orange-2">{liveChannels.length}</span>
        </div>
        <ChannelGrid channels={liveChannels} />
      </div>

      <div className="px-4">
        <div className="mb-4 flex items-center gap-2 font-bold text-xl">
          <p className="text-lico-gray-1">오프라인</p>
          <span className="text-lico-orange-2">{offlineChannels.length}</span>
        </div>
        <OfflineGrid channels={offlineChannels} />
      </div>
    </div>
  );
}
