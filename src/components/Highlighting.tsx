import { CSSProperties, useState } from "react";

import { HighlightingData } from "../types/main";

type modes = "edit" | "highlighting" | "tooltip";

export default function Highlighting(props: {
  highlighting: HighlightingData;
  text: string;
  new: boolean;
  top: boolean;
  onSave: (text: string) => void;
  onCancel: () => void;
}) {
  const [mode, setMode] = useState<modes>(() => {
    if (props.new && props.top) return "edit";
    if (props.new) return "highlighting";
    return "tooltip";
  });
  const [showTooltip, setShowTooltip] = useState(false);
  const [text, setText] = useState("");
  switch (mode) {
    case "edit": {
      return (
        <div>
          <div style={stylePopup(props.highlighting)}>
            <div className="m-3">
              <div className="input-group">
                <input
                  className="form-control"
                  defaultValue={props.text}
                  onChange={(e) => setText(e.target.value)}
                />
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    props.onSave(text);
                    setMode("tooltip");
                  }}
                >
                  Save
                </button>
                <button
                  className="btn btn-light"
                  onClick={() => {
                    props.onCancel();
                    setMode("tooltip");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
          <div style={styleHighlighting(props.highlighting, props.new)} />
        </div>
      );
    }
    case "highlighting": {
      return <div style={styleHighlighting(props.highlighting, props.new)} />;
    }
    case "tooltip": {
      return (
        <div>
          {showTooltip ? (
            <div style={stylePopup(props.highlighting)}>
              <div className="m-3">
                <div className="input-group">
                  <input className="form-control" defaultValue={props.text} />
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
          <div
            style={styleHighlighting(props.highlighting, props.new)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => {
              setShowTooltip(false);
              setMode("edit");
            }}
          />
        </div>
      );
    }
  }
}

const stylePopup = (h: HighlightingData) => {
  const width = 400;
  const height = 65;
  const mb = 10;
  const s: CSSProperties = {
    background: "white",
    position: "absolute",
    textAlign: "center",
    border: "1px solid #d2d2d2",
    borderRadius: "0.5rem",
    top: `${h.top - mb - height}px`,
    left: `${h.left - (width - h.width) / 2}px`,
    width: `${width}px`,
  };
  return s;
};

const styleHighlighting = (h: HighlightingData, isNew: boolean) => {
  const color = isNew ? "red" : "darkgreen";
  const s: CSSProperties = {
    position: "absolute",
    border: `1.5px solid ${color}`,
    borderRadius: "5px",
    padding: "2px",
    top: `${h.top}px`,
    left: `${h.left - 2}px`,
    width: `${h.width + 4}px`,
    height: `${h.height}px`,
  };
  return s;
};
