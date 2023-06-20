 
"use client"
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/theme-chrome";
import "ace-builds/src-noconflict/ext-language_tools"
// import "./queryarea.css"


function onChange(newValue) {
  console.log("change", newValue);
}

const Queryarea = () => {
  
  return (
    <AceEditor
    fontSize={24}
    mode="sql"
    theme="chrome"
    onChange={onChange}
    width="100%"
    height="400px"
    showPrintMargin={false}
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
  );
};

export default Queryarea;
