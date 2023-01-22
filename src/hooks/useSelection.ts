import { AnnotationData, HighlightingData, SelectionData } from "../types/main";

/**
 * Provides mechanism for selection data
 * @param id Root node id
 */
export default function useSelection(id: string) {
  /**
   * Gets selection and highlighting from DOM
   * @returns Selection and highlighting
   */
  const getSelectionAndHighlighting = () => _getSelectionAndHighlighting(id);

  /**
   * Converts selection range to the custom selection type
   * @param r Selection range
   * @returns Custom selection type
   */
  const serialize = (r: Range) => _serialize(id, r);
  /**
   * Converts custom selection type to selection range
   * @param s Custom selection type
   * @returns Selection range
   */
  const deserialize = (s: SelectionData) => _deserialize(id, s);
  /**
   * Converts selections to highlightings
   * @param annotations Array of annotations with selections
   * @returns Array of annotations with selections and highlightings
   */
  const convertSelectionToHighlighting = (annotations: AnnotationData[]) =>
    _convertSelectionToHighlighting(id, annotations);
  return {
    getSelectionAndHighlighting,
    convertSelectionToHighlighting,
    serialize,
    deserialize,
  };
}

const _convertSelectionToHighlighting = (
  id: string,
  annotations: AnnotationData[]
) => {
  const s = window.getSelection();
  if (s == null) return annotations;
  const arr = [...annotations];
  for (let i = 0; i < arr.length; i++) {
    const a = arr[i];
    const range = _deserialize(id, a.selection);
    s.empty();
    s.addRange(range);
    const { highlighting } = _getSelectionAndHighlighting(id);
    a.highlighting = highlighting;
  }
  s.empty();
  return arr;
};

const _getSelectionAndHighlighting = (id: string) => {
  const root = document.getElementById(id);
  const s = window.getSelection();
  if (root == null || s == null || s.rangeCount === 0) {
    return {
      selection: new SelectionData(),
      highlighting: [],
    };
  }

  const range = s.getRangeAt(0);
  if (range == null)
    return {
      selection: new SelectionData(),
      highlighting: [],
    };

  // Convert selection to custom format
  const selection = _serialize(id, range);

  // Get selection rectangles and root element rectangle
  const selectionRectangles = Array.from(range.getClientRects());
  const rootRectangle = root.getBoundingClientRect();

  let index = 0;
  let min = -1;

  // Calculate highlighting relative area
  const highlighting: HighlightingData[] = selectionRectangles.map(
    (rect, i) => {
      // Calculate the highest area for displaying popup
      if (min === -1 || min > rect.top - rootRectangle.top) {
        index = i;
        min = rect.top - rootRectangle.top;
      }

      // Calculate relative position
      let area = new HighlightingData();
      area.top = rect.top - rootRectangle.top;
      area.left = rect.left - rootRectangle.left;
      area.bottom = rect.bottom - rootRectangle.bottom;
      area.right = rect.right - rootRectangle.right;
      area.width = rect.width;
      area.height = rect.height;
      return area;
    }
  );

  // Set flag for the highest area
  if (highlighting.length > 0) highlighting[index].isTop = true;

  return { selection: selection, highlighting: highlighting };
};

const _serialize = (id: string, r: Range): SelectionData =>
  new SelectionData(
    _getAddress(id, r.startContainer),
    _getAddress(id, r.endContainer),
    r.startOffset,
    r.endOffset
  );

const _deserialize = (id: string, selection: SelectionData): Range => {
  const root = document.getElementById(id);
  const range = new Range();
  if (root == null) return range;
  const startNode = _getNode([...selection.startNode], root);
  const endNode = _getNode([...selection.endNode], root);
  range.setStart(startNode, selection.startTextOffset);
  range.setEnd(endNode, selection.endTextOffset);
  return range;
};

const _getNode = (address: number[], n: Node): Node => {
  const i = address.pop();
  if (i == null || n.childNodes == null) return n;
  return _getNode(address, n.childNodes[i]);
};

const _getAddress = (id: string, n: Node, address: number[] = []): number[] => {
  // If node is a root node, then we finished, otherwise continue to search
  if ((n as Element).id === id) return address;

  const p = n.parentNode;
  if (p == null) return address;

  // Iterate through children to determine the index of the node
  for (let i = 0; i < p.childNodes.length; i++) {
    if (p.childNodes[i] !== n) continue;
    address.push(i);
    break;
  }

  return _getAddress(id, p, address);
};
