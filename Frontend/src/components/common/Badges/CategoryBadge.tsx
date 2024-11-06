import { Link } from 'react-router-dom';

interface CategoryBadgeProps {
  category: string;
  categoryId: string;
  className?: string;
}

export default function CategoryBadge({ category, categoryId, className }: CategoryBadgeProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Link to={`/category/${categoryId}`} onClick={handleClick}>
      <div
        className={`${className} inline-block cursor-pointer rounded-full bg-lico-orange-2 px-2.5 pb-[1px] pt-[3px] font-bold transition-colors hover:bg-lico-orange-1`}
      >
        {category}
      </div>
    </Link>
  );
}