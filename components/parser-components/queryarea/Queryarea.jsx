import { Resizable } from "re-resizable";
import Editor from '@monaco-editor/react';


const Queryarea = ({ annotations, query, onChange }) => {
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
      enable={{ right: false, bottom: true }}

    >
      <Editor
        height="100%"
        width="100%"
        defaultLanguage="pgsql"
        value={query}
        onChange={onChange}
        options={{
          fontSize: 18,
          acceptSuggestionOnCommitCharacter: true,
          acceptSuggestionOnEnter: "on",
          accessibilitySupport: "auto",
          autoIndent: false,
          automaticLayout: true,
          codeLens: true,
          colorDecorators: true,
          contextmenu: true,
          cursorBlinking: "blink",
          cursorSmoothCaretAnimation: false,
          cursorStyle: "line",
          disableLayerHinting: false,
          disableMonospaceOptimizations: false,
          dragAndDrop: false,
          fixedOverflowWidgets: false,
          folding: true,
          foldingStrategy: "auto",
          fontLigatures: false,
          formatOnPaste: true,
          formatOnType: false,
          hideCursorInOverviewRuler: false,
          highlightActiveIndentGuide: true,
          links: true,
          mouseWheelZoom: false,
          multiCursorMergeOverlapping: true,
          multiCursorModifier: "alt",
          overviewRulerBorder: true,
          overviewRulerLanes: 2,
          quickSuggestions: true,
          quickSuggestionsDelay: 100,
          readOnly: false,
          renderControlCharacters: false,
          renderFinalNewline: true,
          renderIndentGuides: true,
          renderLineHighlight: "all",
          renderWhitespace: "none",
          revealHorizontalRightPadding: 30,
          roundedSelection: true,
          rulers: [],
          scrollBeyondLastColumn: 5,
          scrollBeyondLastLine: true,
          selectOnLineNumbers: true,
          selectionClipboard: true,
          minimap: { enabled: false },
          selectionHighlight: true,
          showFoldingControls: "mouseover",
          smoothScrolling: true,
          suggestOnTriggerCharacters: true,
          wordBasedSuggestions: true,
          wordSeparators: "~!@#$%^&*()-=+[{]}|;:'\",.<>/?",
          wordWrap: "off",
          wordWrapBreakAfterCharacters: "\t})]?|&,;",
          wordWrapBreakBeforeCharacters: "{([+",
          wordWrapBreakObtrusiveCharacters: ".",
          wordWrapColumn: 80,
          wordWrapMinified: true,
          wrappingIndent: "none",
        }}
      />
    </Resizable>
  );
};

export default Queryarea;
