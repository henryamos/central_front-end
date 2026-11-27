/** Keep the connection visible while a second stroke traces it to the card. */
export function BranchConnector() {
  const curve = "M0 0 V4 C0 18 10 28 26 28 H48";
  return (
    <svg
      className="board-connector"
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 48 32"
      preserveAspectRatio="none"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
    >
      <path d={curve} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <path
        className="connector-trace"
        d={curve}
        pathLength="1"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx="48" cy="28" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
