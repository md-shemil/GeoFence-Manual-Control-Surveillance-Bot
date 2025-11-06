import React from "react";

const ControlPanel = ({
  videoStream,
  isVideoConnected,
  videoUrl,
  isConnected,
  handleMouseDown,
  handleMouseUp,
  handleTouchStart,
  handleTouchEnd,
  handleStopClick,
}) => {
  // Reusable button style
  const buttonStyle = (color, disabled) => ({
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    border: "none",
    fontSize: "24px",
    fontWeight: "600",
    color: "white",
    backgroundColor: disabled ? "#9CA3AF" : color,
    boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "transform 0.1s ease-in-out, background 0.2s",
  });

  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: "#f3f4f6",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: "24px",
    padding: "24px",
    fontFamily: "Inter, sans-serif",
  };

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const titleStyle = {
    fontSize: "18px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "16px",
    alignSelf: "flex-start",
  };

  const videoBoxStyle = {
    width: "100%",
    height: "400px",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
  };

  const statusText = {
    fontSize: "14px",
    marginTop: "8px",
    color: isConnected ? "#16a34a" : "#ca8a04",
    fontWeight: "500",
  };

  return (
    <div style={containerStyle}>
      {/* ===== VIDEO SECTION ===== */}
      <div style={{ ...cardStyle, flex: 1 }}>
        <h2 style={titleStyle}>Live Camera Feed</h2>
        <div style={videoBoxStyle}>
          {videoStream && isVideoConnected ? (
            <img
              src={videoStream}
              alt="Live Video Feed"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div style={{ textAlign: "center", color: "#6b7280" }}>
              <div style={{ fontSize: "48px", marginBottom: "8px" }}>📹</div>
              <p style={{ fontWeight: "500" }}>
                {isVideoConnected
                  ? "Connecting to video stream..."
                  : "Live video feed will appear here"}
              </p>
              <small style={{ color: "#9ca3af" }}>
                {videoUrl
                  ? `Stream URL: ${videoUrl}`
                  : "Configure video stream URL in settings"}
              </small>

              {!isVideoConnected && videoUrl && (
                <div
                  style={{
                    marginTop: "8px",
                    color: "#ef4444",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  🔴 Video stream disconnected
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ===== CONTROLLER SECTION ===== */}
      <div style={{ ...cardStyle, width: "340px" }}>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#111827",
            marginBottom: "16px",
          }}
        >
          Vehicle Controls
        </h2>

        {/* Controller Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
          }}
        >
          <div></div>
          <button
            id="forward"
            style={buttonStyle("#3B82F6", !isConnected)}
            onMouseDown={() => handleMouseDown("forward")}
            onMouseUp={() => handleMouseUp("forward")}
            onTouchStart={(e) => handleTouchStart(e, "forward")}
            onTouchEnd={(e) => handleTouchEnd(e, "forward")}
            disabled={!isConnected}
          >
            ⬆
          </button>
          <div></div>

          <button
            id="left"
            style={buttonStyle("#3B82F6", !isConnected)}
            onMouseDown={() => handleMouseDown("left")}
            onMouseUp={() => handleMouseUp("left")}
            onTouchStart={(e) => handleTouchStart(e, "left")}
            onTouchEnd={(e) => handleTouchEnd(e, "left")}
            disabled={!isConnected}
          >
            ⬅
          </button>

          <button
            id="stop"
            style={buttonStyle("#EF4444", !isConnected)}
            onClick={handleStopClick}
            disabled={!isConnected}
          >
            ⏹
          </button>

          <button
            id="right"
            style={buttonStyle("#3B82F6", !isConnected)}
            onMouseDown={() => handleMouseDown("right")}
            onMouseUp={() => handleMouseUp("right")}
            onTouchStart={(e) => handleTouchStart(e, "right")}
            onTouchEnd={(e) => handleTouchEnd(e, "right")}
            disabled={!isConnected}
          >
            ➡
          </button>

          <div></div>
          <button
            id="backward"
            style={buttonStyle("#3B82F6", !isConnected)}
            onMouseDown={() => handleMouseDown("backward")}
            onMouseUp={() => handleMouseUp("backward")}
            onTouchStart={(e) => handleTouchStart(e, "backward")}
            onTouchEnd={(e) => handleTouchEnd(e, "backward")}
            disabled={!isConnected}
          >
            ⬇
          </button>
          <div></div>
        </div>

        {/* Connection Status */}
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <span style={statusText}>
            {isConnected ? "🟢 Connected" : "⚠️ Vehicle not connected"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
