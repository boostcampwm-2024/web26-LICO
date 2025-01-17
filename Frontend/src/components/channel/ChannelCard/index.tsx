import { useNavigate } from 'react-router-dom';
import ChannelThumbnail from '@components/channel/ChannelCard/ChannelThumbnail';
import HoverPreviewPlayer from '@components/channel/ChannelCard/HoverPreviewPlayer';
import { useRef, useState } from 'react';
import ChannelInfo from './ChannelInfo';

export interface ChannelCardProps {
  id: string;
  title: string;
  streamerName: string;
  profileImgUrl: string;
  viewers: number;
  category: string;
  categoryId: number;
  thumbnailUrl: string;
}

export default function ChannelCard({
  id,
  title,
  streamerName,
  viewers,
  category,
  categoryId,
  profileImgUrl,
  thumbnailUrl,
}: ChannelCardProps) {
  const [showPreview, setShowPreview] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
      setShowPreview(true);
    }, 1000);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setShowPreview(false);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('[data-category-badge]')) {
      navigate(`/live/${id}`);
    }
  };

  return (
    <div
      className="relative mb-4 block min-w-60 cursor-pointer"
      aria-label={`${streamerName}의 ${title} 스트림으로 이동`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
    >
      <div className="relative aspect-video">
        <ChannelThumbnail title={title} thumbnailUrl={thumbnailUrl} viewers={viewers} />
        {showPreview && (
          <div className="absolute inset-0 overflow-hidden rounded-xl">
            <HoverPreviewPlayer channelId={id} />
          </div>
        )}
      </div>
      <ChannelInfo
        id={id}
        title={title}
        streamerName={streamerName}
        category={category}
        categoryId={categoryId}
        profileImgUrl={profileImgUrl}
      />
    </div>
  );
}
