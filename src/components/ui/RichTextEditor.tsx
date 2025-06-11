import React, { useRef, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useAuth } from '../../context/AuthContext';

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
  const { user } = useAuth();

  // Keep session alive during long editing sessions
  useEffect(() => {
    const keepAliveInterval = setInterval(async () => {
      if (user) {
        try {
          // Ping the server to keep session alive
          await fetch('/api/keepalive', { 
            method: 'POST',
            credentials: 'include'
          }).catch(() => {
            // Ignore errors, this is just a keepalive
          });
        } catch (error) {
          // Ignore errors
        }
      }
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => clearInterval(keepAliveInterval);
  }, [user]);

  return (
    <Editor
      apiKey="5fbc9ctdnmft4yuocrtwcc41kzf9a6plgxtclgnlq0vvpb3q" // Free API key for demo
      onInit={(evt, editor) => editorRef.current = editor}
      value={value}
      onEditorChange={(content) => onChange(content)}
      init={{
        height: height,
        menubar: false,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount', 'autosave'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        placeholder: placeholder,
        branding: false,
        promotion: false,
        autosave_ask_before_unload: true,
        autosave_interval: '30s',
        autosave_prefix: 'tinymce-autosave-{path}{query}-{id}-',
        autosave_restore_when_empty: false,
        autosave_retention: '2m',
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