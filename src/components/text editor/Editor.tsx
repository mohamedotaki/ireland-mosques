import { Button } from '@mui/material';
import React, { useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

type EditorProps = {
  editorContent: string;
  setEditorContent: React.Dispatch<React.SetStateAction<string>>;
};

const MyEditor = ({ editorContent, setEditorContent }: EditorProps) => {
  const quillRef = useRef<ReactQuill>(null);

  // Define modules (custom toolbar configuration)
  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }/* , { 'font': [] } */],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['bold', 'italic', 'underline'],
      ['link'/* , 'image' */],
      [{ 'color': ["#d50000", "#00e676", "#82b1ff"] }, { 'background': [] }],
      ['blockquote'/* , 'code-block' */],
    ],
  };

  // Handle content changes
  const handleEditorChange = (value: string) => {
    setEditorContent(value);
    enforceHeading1OnFirstLine();
  };

  // Ensure the first line is always Heading 1
  const enforceHeading1OnFirstLine = () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    // Get the first block element (first line or paragraph)
    const firstLine = quill.getLines(0, 1); // Get the first line/paragraph
    if (firstLine && firstLine[0]) {
      const format = quill.getFormat(0, 1);
      // If it's not already Heading 1, apply it
      if (format['header'] !== 1) {
/*         const range = quill.getSelection();
 */        quill.format('header', 1); // Set first line to Heading 1
      }
    }
  };
  // Ensure the first line is Heading 1 when the component loads
  useEffect(() => {
    enforceHeading1OnFirstLine();
  }, []);

  // Handle form submission
  /*   const handleSubmit = () => {
      console.log('Editor Content:', editorContent);
    }; */

  return (
    <div style={{ width: '100%', marginTop: '10px' }}>
      <ReactQuill
        ref={quillRef}
        value={editorContent}
        onChange={handleEditorChange}
        theme="snow"
        modules={modules}
      />
      <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
        <Button variant="contained" sx={{ mt: 1 }}>Post</Button>

      </div>
    </div>
  );
};

export default MyEditor;
