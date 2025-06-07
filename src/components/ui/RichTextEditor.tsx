import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = "Start writing your content...",
  height = 400 
}) => {
  const editorRef = useRef<any>(null);

  return (
    <Editor
      apiKey="qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc" // Free API key for demo
      onInit={(evt, editor) => editorRef.current = editor}
      value={value}
      onEditorChange={(content) => onChange(content)}
      init={{
        height: height,
        menubar: false,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        placeholder: placeholder,
        branding: false,
        promotion: false,
        setup: (editor) => {
          editor.on('init', () => {
            editor.getContainer().style.transition = 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out';
          });
          editor.on('focus', () => {
            editor.getContainer().style.borderColor = '#3b82f6';
            editor.getContainer().style.boxShadow = '0 0 0 1px #3b82f6';
          });
          editor.on('blur', () => {
            editor.getContainer().style.borderColor = '#d1d5db';
            editor.getContainer().style.boxShadow = 'none';
          });
        }
      }}
    />
  );
};

export default RichTextEditor;