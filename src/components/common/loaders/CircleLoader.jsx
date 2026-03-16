const loader = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent white overlay
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999, // Ensure the loader is on top
};

const spinner = {
  width: "250px",
  height: "150px",
  animation: "rotation 0.75s linear infinite",
  borderRadius: "100em",
  backgroundColor: "transparent", // Set SVG background color to transparent
};

const CircleLoader = () => {
  return (
    <div style={loader}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66 66" height="100px" width="100px" style={spinner} className="spinner">
        <circle stroke="url(#gradient)" r="20" cy="33" cx="33" strokeWidth="1" fill="transparent" className="path"></circle>
        <linearGradient id="gradient">
          <stop stopOpacity="1" stopColor="#fe0000" offset="0%"></stop>
          <stop stopOpacity="0" stopColor="#af3dff" offset="100%"></stop>
        </linearGradient>
      </svg>
      <style>{`
         .path {
           stroke-dasharray: 100;
           stroke-dashoffset: 20;
           stroke-linecap: round;
         }
 
         @keyframes rotation {
           to {
             transform: rotate(360deg);
           }
         }
       `}</style>
    </div>
  );
};

export default CircleLoader;
