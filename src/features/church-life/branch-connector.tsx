/** The path starts at the shared spine and lands horizontally at the card edge. */
export function BranchConnector() {
  return (
    <svg
      className="board-connector"
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 48 32"
      preserveAspectRatio="none"
    >
      <path
        d="M0 0 C0 18 10 28 28 28 H48"
        pathLength="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
