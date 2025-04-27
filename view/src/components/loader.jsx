const Loader = () => {
  return (
    <div className="flex justify-center items-center bg-transparent backdrop:blur-md">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
        width="180"
        height="180"
        style={{
          shapeRendering: "auto",
          display: "block",
        }}
      >
        <g>
          <path
            stroke="none"
            fill="#070101"
            d="M29 50A21 21 0 0 0 71 50A21 22.5 0 0 1 29 50"
          >
            <animateTransform
              values="0 50 50.75;360 50 50.75"
              keyTimes="0;1"
              repeatCount="indefinite"
              dur="0.826s"
              type="rotate"
              attributeName="transform"
            ></animateTransform>
          </path>
        </g>
      </svg>
    </div>
  );
};

export default Loader;
