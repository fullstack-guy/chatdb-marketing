import { ReactElement, useEffect, useRef } from "react";
import { RenderEditCellProps } from "react-data-grid";

function TextEditor<TRow, TSummaryRow = unknown>({
  row,
  column,
  onRowChange,
  onClose,
}: RenderEditCellProps<TRow, TSummaryRow>): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowChange({ ...row, [column.key]: event.target.value });
  };

  const handleBlur = () => {
    onClose(true);
  };

  return (
    <input
      ref={inputRef}
      className="h-full w-full border-2 border-gray-300 px-2 focus:border-blue-500 focus:outline-none"
      value={row[column.key] as unknown as string}
      onChange={handleInputChange}
      onBlur={handleBlur}
    />
  );
}

export default TextEditor;
