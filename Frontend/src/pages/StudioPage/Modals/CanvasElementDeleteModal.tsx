import { useRef, useEffect } from 'react';

interface CanvasElementDeleteModalProps {
  show: boolean;
  x: number;
  y: number;
  onDelete: () => void;
  canvasRef: React.ForwardedRef<HTMLCanvasElement> | React.RefObject<HTMLCanvasElement>;
}

export function CanvasElementDeleteModal({ show, x, y, onDelete, canvasRef }: CanvasElementDeleteModalProps) {
  const modalRef = useRef<HTMLButtonElement>(null);

  const getCanvasElement = (): HTMLCanvasElement | null => {
    if (!canvasRef) return null;
    if ('current' in canvasRef) return canvasRef.current;
    return null;
  };

  const getModalPosition = () => {
    const canvas = getCanvasElement();
    if (!canvas) return { x, y };

    const canvasRect = canvas.getBoundingClientRect();
    const modalElement = modalRef.current;
    if (!modalElement) return { x, y };

    const modalRect = modalElement.getBoundingClientRect();
    const modalWidth = modalRect.width;
    const modalHeight = modalRect.height;

    const gridWidth = canvasRect.width / 4;
    const gridHeight = canvasRect.height / 4;

    const relativeX = x - canvasRect.left;
    const relativeY = y - canvasRect.top;

    const gridX = Math.floor(relativeX / gridWidth);
    const gridY = Math.floor(relativeY / gridHeight);

    let modalX = relativeX;
    let modalY = relativeY;

    if (gridX === 3 && gridY === 3) {
      modalX -= modalWidth;
      modalY -= modalHeight;
    } else if (gridX === 3 && gridY >= 0 && gridY <= 2) {
      modalX -= modalWidth;
    } else if (gridX >= 0 && gridX <= 2 && gridY === 3) {
      modalY -= modalHeight;
    } else {
    }

    modalX = Math.max(0, Math.min(modalX, canvasRect.width - modalWidth));
    modalY = Math.max(0, Math.min(modalY, canvasRect.height - modalHeight));

    return { x: modalX, y: modalY };
  };

  useEffect(() => {
    if (!show || !modalRef.current) return;

    const updatePosition = () => {
      if (!modalRef.current) return;

      requestAnimationFrame(() => {
        const { x: modalX, y: modalY } = getModalPosition();
        modalRef.current!.style.left = `${modalX}px`;
        modalRef.current!.style.top = `${modalY}px`;
      });
    };

    updatePosition();

    const canvas = getCanvasElement();
    if (canvas) {
      const resizeObserver = new ResizeObserver(updatePosition);
      resizeObserver.observe(canvas);
      return () => resizeObserver.disconnect();
    }
  }, [show, x, y]);

  if (!show) return null;

  return (
    <button
      ref={modalRef}
      className="absolute z-50 rounded-lg bg-lico-gray-3 px-4 py-2 text-left font-bold text-sm text-lico-orange-2 shadow-lg transition-colors duration-150 hover:bg-lico-gray-2"
      style={{
        visibility: 'hidden',
      }}
      onClick={e => {
        e.stopPropagation();
        onDelete();
      }}
    >
      삭제
      <style>{`
        ${modalRef.current ? (modalRef.current.style.visibility = 'visible') : ''}
      `}</style>
    </button>
  );
}