import AceEditor from "react-ace";
import { Resizable } from "re-resizable";
import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/theme-chrome";
import "ace-builds/src-noconflict/ext-language_tools";

const Queryarea = ({ annotations, onChange }) => {
  return (
    <Resizable
      className="resizable-container"
      defaultSize={{
        width: "100%",
        height: 400
      }}
      minWidth={100}
      minHeight={100}
      maxWidth={"100%"}
      maxHeight={"100%"}
      enable={{ right: true, bottom: true }}

    >
      <AceEditor
        fontSize={24}
        style={{ border: '1px solid #ddd' }}
        mode="sql"
        theme="chrome"
        onChange={onChange}
        annotations={annotations}
        width="100%"
        height="100%"
        showPrintMargin={false}
        highlightActiveLine
        focus={true}
        placeholder=""
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true
        }}
      />

    </Resizable>
  );
};

export default Queryarea;
