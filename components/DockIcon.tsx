import Image from 'next/image'

interface DockIconProps {
  app: { id: string; name: string };
  onClick: () => void;
  isHovered: boolean;
  setHovered: () => void;
  clearHovered: () => void;
}

export default function DockIcon({ app, onClick, isHovered, setHovered, clearHovered }: DockIconProps) {
  return (
    <button 
      onClick={onClick}
      onMouseEnter={setHovered}
      onMouseLeave={clearHovered}
      className="focus:outline-none transform transition-all duration-200 ease-in-out"
      style={{
        transform: isHovered ? 'scale(1.2)' : 'scale(1)',
      }}
    >
      <Image 
        src={`/media/${app.id}.png`} 
        alt={app.name} 
        width={64} 
        height={64} 
        className="rounded-lg"
      />
    </button>
  )
}