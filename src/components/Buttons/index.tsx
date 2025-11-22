interface Props {
  text: string;
  color: string;
  onClick?: () => void;
}

export function Button({ text, color, onClick }: Props) {
  return (
    <button 
      style={{ 
        backgroundColor: color, 
        color: 'white', 
        border: 'none', 
        padding: '10px 20px', 
        margin: '5px',
        borderRadius: '5px',
        cursor: 'pointer'
      }} 
      onClick={onClick}
    >
      {text}
    </button>
  );
}