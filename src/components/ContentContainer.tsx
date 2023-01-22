import { AnnotationData, SelectionData } from "../types/main";

import AnnotationsList from "./AnnotationList";
import useLocalStorage from "../hooks/useLocalStorage";
import useSelection from "../hooks/useSelection";
import { useState } from "react";
import { v4 } from "uuid";

export default function ContentContainer(props: {
  content: string;
  isHtml: boolean;
  containerId: string;
}) {
  const [selectionData, setSelectionData] = useState<SelectionData>(
    new SelectionData()
  );
  const [restore, save] = useLocalStorage<AnnotationData[]>("data", []);
  const { getSelectionAndHighlighting } = useSelection(props.containerId);
  const [annotations, setAnnotations] = useState<AnnotationData[]>(restore());

  return (
    <div
      id={props.containerId}
      onMouseUp={() => {
        const { selection } = getSelectionAndHighlighting();
        if (selection.isEmpty()) return;
        setSelectionData(selection);
      }}
    >
      <AnnotationsList
        containerId={props.containerId}
        annotations={annotations}
        currentSelection={selectionData}
        onSave={(annotation) => {
          if (annotation.id === "") {
            annotation.id = v4();
            const arr = [...annotations, annotation];
            save(arr);
            setAnnotations(arr);
          } else {
            let arr = [...annotations];
            const i = arr.findIndex((a) => a.id === annotation.id);
            arr[i] = annotation;
            save(arr);
            setAnnotations(arr);
          }
        }}
        onCancel={() => setSelectionData(new SelectionData())}
      />
      {props.isHtml ? (
        <div dangerouslySetInnerHTML={{ __html: props.content }}></div>
      ) : (
        <div>{props.content}</div>
      )}
    </div>
  );
}
