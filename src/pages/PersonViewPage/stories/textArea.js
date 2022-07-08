
import React, { useState, useRef } from "react";
import {
  Editor,
  EditorState,
  ContentState,
  CompositeDecorator,
  convertToRaw,
} from "draft-js";

const Decorated = ({ children }) => {
  return <span className="bg-maroon-500 text-white">{children}</span>;
};

function findWithRegex(contentBlock, callback) {
  const text = contentBlock.getText();
  callback(500, text.length > 500 ? text.length : 501);
}

function handleStrategy(contentBlock, callback) {
  findWithRegex(contentBlock, callback);
}

const createDecorator = () =>
  new CompositeDecorator([
    {
      strategy: handleStrategy,
      component: Decorated,
    },
  ]);


function TextArea(props) {
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(
      ContentState.createFromText(props.value),
      createDecorator()
    )
  );

  const editor = useRef(null);

  function focusEditor() {
    editor.current.focus();
  }

  const onChnage = (editState) => {
    const blocks = convertToRaw(editState.getCurrentContent()).blocks;
    let value = blocks
      .map((block) => block.text)
      .join("\n");
    setEditorState(editState);
    props.formik.setFieldValue(props.name, value !== "\n" ? value : "")
  };

  return (
    <div onClick={focusEditor}>
      <Editor ref={editor} editorState={editorState} onChange={onChnage} placeholder={props.placeholder} />
    </div>
  );
}
TextArea.defaultProps = {
  placeholder: "Tell your story..."
}
export default TextArea;
