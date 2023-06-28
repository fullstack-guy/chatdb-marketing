import { ReactElement, useEffect, useRef } from 'react';
import { RenderEditCellProps } from 'react-data-grid';

function TextEditor<TRow, TSummaryRow = unknown>({
    row,
    column,
    onRowChange,
    onClose
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
            className="w-full h-full px-2 border-2 border-gray-300 focus:outline-none focus:border-blue-500"
            value={row[column.key] as unknown as string}
            onChange={handleInputChange}
            onBlur={handleBlur}
        />
    );
}

export default TextEditor;
