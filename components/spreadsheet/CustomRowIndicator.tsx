import React, { useCallback } from "react";
import classNames from "classnames";
import { useContextMenu, Menu, Item, Separator } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";

const RowIndicator = ({
  row,
  label = row + 1,
  selected,
  onSelect,
  onInsertAbove,
  onInsertBelow,
  onDelete,
}) => {
  const MENU_ID = `row-menu-${row}`;

  const { show } = useContextMenu({
    id: MENU_ID,
  });

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      onSelect(row, event.shiftKey);
    },
    [onSelect, row]
  );

  const displayMenu = (e) => {
    show({ event: e, props: { row } });
    e.preventDefault();
  };

  const handleItemClick = ({ event, props, triggerEvent, data, id }) => {
    const { row } = props;
    switch (id) {
      case "insert-above":
        onInsertAbove(row);
        break;
      case "insert-below":
        onInsertBelow(row);
        break;
      case "delete":
        onDelete(row);
        break;
    }
  };

  return (
    <th
      className={classNames("Spreadsheet__header", {
        "Spreadsheet__header--selected": selected,
      })}
      onClick={handleClick}
      onContextMenu={displayMenu}
      tabIndex={0}
    >
      {label}
      <Menu id={MENU_ID}>
        <Item id="insert-above" onClick={handleItemClick}>
          Insert row above
        </Item>
        <Item id="insert-below" onClick={handleItemClick}>
          Insert row below
        </Item>
        <Separator />
        <Item id="delete" onClick={handleItemClick}>
          Delete row
        </Item>
      </Menu>
    </th>
  );
};

export default RowIndicator;
