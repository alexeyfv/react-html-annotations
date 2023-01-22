import { AnnotationData, SelectionData } from "../types/main";
import { useLayoutEffect, useState } from "react";

import { AnnotationForm } from "./AnnotationForm";
import useResizeObserver from "../hooks/useResizeObserver";
import useSelection from "../hooks/useSelection";

export default function AnnotationList(props: {
  containerId: string;
  annotations: AnnotationData[];
  currentSelection?: SelectionData;
  onSave: (annotation: AnnotationData) => void;
  onCancel: () => void;
}) {
  const { convertSelectionToHighlighting } = useSelection(props.containerId);
  const [annotations, setAnnotations] = useState<AnnotationData[]>(
    props.annotations ?? []
  );

  const [elementSize, setElementSize] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const arr = convertSelectionToHighlighting(props.annotations);
    setAnnotations(arr);
  }, [props.annotations, elementSize]); // eslint-disable-line react-hooks/exhaustive-deps

  useResizeObserver(props.containerId, setElementSize);

  let newAnnotation: AnnotationData = new AnnotationData();
  if (props.currentSelection != null && !props.currentSelection.isEmpty()) {
    newAnnotation = new AnnotationData();
    newAnnotation.selection = props.currentSelection;
    newAnnotation = convertSelectionToHighlighting([newAnnotation])[0];
  }

  return (
    <div style={{ position: "absolute" }}>
      {newAnnotation.selection.isEmpty() ? (
        <></>
      ) : (
        <AnnotationForm
          key="new-annotation"
          annotation={newAnnotation}
          onSave={props.onSave}
          onCancel={props.onCancel}
          new
        />
      )}
      <div>
        {annotations.map((a, i) => (
          <AnnotationForm
            key={i}
            annotation={a}
            onSave={props.onSave}
            onCancel={props.onCancel}
          />
        ))}
      </div>
    </div>
  );
}
