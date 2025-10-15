const TypingIndicator = () => {
  return (
    <div className="flex gap-1 px-3 py-3 bg-gray-200 rounded-xl self-start">
      <Dot animationDelay={75} />
      <Dot animationDelay={150} />
      <Dot animationDelay={200} />
    </div>
  );
};

type DotProps = {
  animationDelay: number;
};

const Dot = ({ animationDelay }: DotProps) => (
  <div
    className={`w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-${animationDelay}`}
  ></div>
);

export default TypingIndicator;
