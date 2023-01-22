/**
 * Highlighting is an areas that determines highlighted area
 */
export class HighlightingData {
  top: number = 0;
  left: number = 0;
  right: number = 0;
  bottom: number = 0;
  width: number = 0;
  height: number = 0;
  isTop: boolean = false;
}

/**
 * Annotation data is a combination of text, selection and highlighting
 */
export class AnnotationData {
  id: string = "";
  text: string = "";
  selection: SelectionData = new SelectionData();
  highlighting?: HighlightingData[] = [];
}

/**
 * Custom type for store selection
 */
export class SelectionData {
  startNode: number[];
  endNode: number[];
  startTextOffset: number;
  endTextOffset: number;

  constructor(
    startNode: number[] = [],
    endNode: number[] = [],
    startTextOffset: number = 0,
    endTextOffset: number = 0
  ) {
    this.startNode = startNode;
    this.endNode = endNode;
    this.startTextOffset = startTextOffset;
    this.endTextOffset = endTextOffset;
  }

  /**
   * Checks if the selection is empty
   * @returns True, if selection is empty, otherwise false
   */
  public isEmpty() {
    if (
      this.startNode.length !== this.endNode.length ||
      this.startTextOffset !== this.endTextOffset
    )
      return false;

    for (let i = 0; i < this.startNode.length; i++) {
      const x = this.startNode[i];
      const y = this.endNode[i];
      if (x === y) continue;
      return false;
    }

    return true;
  }
}
