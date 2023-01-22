import { AnnotationData } from "../types/main";
import Highlighting from "./Highlighting";

export function AnnotationForm(props: {
  annotation: AnnotationData;
  new?: boolean;
  onSave: (annotation: AnnotationData) => void;
  onCancel: () => void;
}) {
  return (
    <div>
      {props.annotation.highlighting?.map((h, i) => (
        <Highlighting
          text={props.annotation.text}
          highlighting={h}
          new={props.new ?? false}
          top={h.isTop}
          key={i}
          onCancel={props.onCancel}
          onSave={(text) => {
            let annotation = props.annotation;
            annotation.text = text;
            props.onSave(annotation);
          }}
        />
      ))}
    </div>
  );
}
