const CircularProgress = ({ percent }) => {
  const radius = 18;
  const stroke = 3;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const strokeDashoffset =
    circumference - (percent / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2}>
      {/* background */}
      <circle
        stroke="#444"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />

      {/* progress */}
      <circle
        stroke="#25D366"
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference + " " + circumference}
        style={{ strokeDashoffset }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />

      {/* percent text */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize="10"
        fill="#fff"
      >
        {percent}%
      </text>
    </svg>
  );
};
export default CircularProgress;