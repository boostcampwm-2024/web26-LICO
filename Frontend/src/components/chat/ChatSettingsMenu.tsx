import { RiRobot2Line } from 'react-icons/ri';
import { BsBoxArrowUpRight } from 'react-icons/bs';
import { MdAccessTime } from 'react-icons/md';

import Toggle from '@components/common/Toggle';

interface ChatSettingsMenuProps {
  onClose?: () => void;
  position?: {
    top: string;
    right: string;
  };
  cleanBotEnabled: boolean;
  onCleanBotChange: (enabled: boolean) => void;
  timestampEnabled: boolean;
  onTimestampToggleChange: (enabled: boolean) => void;
  onClickPopupChat: () => void;
}

function ChatSettingsMenu({
  onClose,
  position = { top: '50px', right: '8px' },
  cleanBotEnabled,
  onCleanBotChange,
  timestampEnabled,
  onTimestampToggleChange,
  onClickPopupChat,
}: ChatSettingsMenuProps) {
  return (
    <>
      <button aria-label="채팅세팅메뉴 닫기" type="button" className="fixed inset-0" onClick={onClose} />
      <div
        className="absolute z-50 min-w-[252px] rounded-lg border border-lico-gray-3 bg-lico-gray-5 p-1 shadow-lg"
        style={{
          top: position.top,
          right: position.right,
        }}
      >
        <div className="flex w-full items-center justify-between rounded-md px-3 py-2 hover:bg-lico-gray-4">
          <div className="flex items-center gap-3 font-bold text-lg text-lico-gray-2">
            <RiRobot2Line size={18} />
            <span>클린봇</span>
          </div>
          <Toggle checked={cleanBotEnabled} onChange={onCleanBotChange} />
        </div>

        <div className="flex w-full items-center justify-between rounded-md px-3 py-2 hover:bg-lico-gray-4">
          <div className="flex items-center gap-3 font-bold text-lg text-lico-gray-2">
            <MdAccessTime size={18} />
            <span>타임스탬프</span>
          </div>
          <Toggle checked={timestampEnabled} onChange={onTimestampToggleChange} />
        </div>

        <button
          type="button"
          onClick={onClickPopupChat}
          className="flex w-full items-center justify-between rounded-md px-3 py-2 hover:bg-lico-gray-4"
        >
          <div className="flex items-center gap-3 font-bold text-lg text-lico-gray-2">
            <BsBoxArrowUpRight size={16} />
            <span>채팅창 팝업</span>
          </div>
        </button>
      </div>
    </>
  );
}

export default ChatSettingsMenu;
