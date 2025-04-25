import { useTheme } from '@mui/material';
import { useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "./editor.css"

type EditorProps = {
  editorContent: string;
  setEditorContent: (contant: string) => void;

};

const MyEditor = ({ editorContent, setEditorContent }: EditorProps) => {
  const quillRef = useRef<ReactQuill>(null);
  const theme = useTheme();

  const modules = {
    toolbar: '#custom-toolbar',
  };

  const handleEditorChange = (value: string) => {
    setEditorContent(value);
    enforceHeading1OnFirstLine();
  };

  const enforceHeading1OnFirstLine = () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const firstLine = quill.getLines(0, 1);
    if (firstLine && firstLine[0]) {
      const format = quill.getFormat(0, 1);
      if (format['header'] !== 1) {
        quill.format('header', 1);
      }
    }
  };

  useEffect(() => {
    enforceHeading1OnFirstLine();
  }, []);

  return (

    <div style={{
      width: '100%', maxHeight: '500px', marginTop: '10px',
      borderBottom: '1px solid #ccc',

    }}>
      <div
        id="custom-toolbar"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          border: '1px solid #ccc',

          backgroundColor: theme.palette.background.paper,
          padding: '8px',
        }}
      >
        <select className="ql-header">
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="">Normal</option>
        </select>
        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />
        <button className="ql-blockquote" />
        <button className="ql-link" />
        <select className="ql-align" />
        <select className="ql-color">
          <option value="#d50000" />
          <option value="#00e676" />
          <option value="#82b1ff" />
          <option value="" />
        </select>
        <button className="ql-list" value="ordered" />
        <button className="ql-list" value="bullet" />
      </div>

      <div style={{ maxHeight: '400px', overflowY: 'auto' }} className="no-borders">
        <ReactQuill
          ref={quillRef}
          value={editorContent}
          onChange={handleEditorChange}
          theme="snow"
          modules={modules}
        />
      </div>


    </div>


  );
};

export default MyEditor;
