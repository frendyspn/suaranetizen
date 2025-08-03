import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import DecoupledEditor from '@ckeditor/ckeditor5-build-classic';

const CKEditor5Component = ({ 
  data = '', 
  onChange = () => {}, 
  placeholder = 'Start typing...', 
  height = '400px',
  disabled = false,
  mode = 'full'
}) => {
  const [error, setError] = useState(null);

  const getConfig = (mode) => {
    const baseConfig = {
      placeholder: placeholder,
      language: 'en'
    };

    switch (mode) {
      case 'minimal':
        return {
          ...baseConfig,
          toolbar: {
            items: [
              'bold',
              'italic',
              '|',
              'bulletedList',
              'numberedList',
              '|',
              'link',
              '|',
              'undo',
              'redo'
            ]
          }
        };

      case 'basic':
        return {
          ...baseConfig,
          toolbar: {
            items: [
              'heading',
              '|',
              'bold',
              'italic',
              'underline',
              'strikethrough',
              '|',
              'bulletedList',
              'numberedList',
              '|',
              'link',
              'blockQuote',
              'insertTable',
              '|',
              'undo',
              'redo'
            ]
          }
        };

      case 'full':
      default:
        return {
          ...baseConfig,
          toolbar: {
            items: [
              'heading',
              '|',
              'fontSize',
              'fontFamily',
              '|',
              'bold',
              'italic',
              'underline',
              'strikethrough',
              'highlight',
              '|',
              'fontColor',
              'fontBackgroundColor',
              '|',
              'alignment',
              '|',
              'numberedList',
              'bulletedList',
              '|',
              'outdent',
              'indent',
              '|',
              'todoList',
              'link',
              'blockQuote',
              'imageInsert',
              'insertTable',
              'mediaEmbed',
              'codeBlock',
              '|',
              'horizontalLine',
              'pageBreak',
              'specialCharacters',
              '|',
              'undo',
              'redo',
              '|',
              'findAndReplace',
              'selectAll'
            ],
            shouldNotGroupWhenFull: false
          },
          heading: {
            options: [
              { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
              { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
              { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
              { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
              { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
              { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
              { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
            ]
          },
          fontSize: {
            options: [
              9,
              11,
              13,
              'default',
              17,
              19,
              21,
              27,
              35
            ],
            supportAllValues: true
          },
          fontFamily: {
            options: [
              'default',
              'Arial, Helvetica, sans-serif',
              'Courier New, Courier, monospace',
              'Georgia, serif',
              'Lucida Sans Unicode, Lucida Grande, sans-serif',
              'Tahoma, Geneva, sans-serif',
              'Times New Roman, Times, serif',
              'Trebuchet MS, Helvetica, sans-serif',
              'Verdana, Geneva, sans-serif'
            ],
            supportAllValues: true
          },
          fontColor: {
            colors: [
              {
                color: 'hsl(0, 0%, 0%)',
                label: 'Black'
              },
              {
                color: 'hsl(0, 0%, 30%)',
                label: 'Dim grey'
              },
              {
                color: 'hsl(0, 0%, 60%)',
                label: 'Grey'
              },
              {
                color: 'hsl(0, 0%, 90%)',
                label: 'Light grey'
              },
              {
                color: 'hsl(0, 0%, 100%)',
                label: 'White',
                hasBorder: true
              },
              {
                color: 'hsl(0, 75%, 60%)',
                label: 'Red'
              },
              {
                color: 'hsl(30, 75%, 60%)',
                label: 'Orange'
              },
              {
                color: 'hsl(60, 75%, 60%)',
                label: 'Yellow'
              },
              {
                color: 'hsl(90, 75%, 60%)',
                label: 'Light green'
              },
              {
                color: 'hsl(120, 75%, 60%)',
                label: 'Green'
              },
              {
                color: 'hsl(150, 75%, 60%)',
                label: 'Aquamarine'
              },
              {
                color: 'hsl(180, 75%, 60%)',
                label: 'Turquoise'
              },
              {
                color: 'hsl(210, 75%, 60%)',
                label: 'Light blue'
              },
              {
                color: 'hsl(240, 75%, 60%)',
                label: 'Blue'
              },
              {
                color: 'hsl(270, 75%, 60%)',
                label: 'Purple'
              }
            ]
          },
          fontBackgroundColor: {
            colors: [
              {
                color: 'hsl(0, 0%, 100%)',
                label: 'White'
              },
              {
                color: 'hsl(0, 0%, 90%)',
                label: 'Light grey'
              },
              {
                color: 'hsl(0, 0%, 60%)',
                label: 'Grey'
              },
              {
                color: 'hsl(0, 75%, 60%)',
                label: 'Red'
              },
              {
                color: 'hsl(30, 75%, 60%)',
                label: 'Orange'
              },
              {
                color: 'hsl(60, 75%, 60%)',
                label: 'Yellow'
              },
              {
                color: 'hsl(90, 75%, 60%)',
                label: 'Light green'
              },
              {
                color: 'hsl(120, 75%, 60%)',
                label: 'Green'
              },
              {
                color: 'hsl(240, 75%, 60%)',
                label: 'Blue'
              },
              {
                color: 'hsl(270, 75%, 60%)',
                label: 'Purple'
              }
            ]
          },
          link: {
            decorators: {
              addTargetToExternalLinks: true,
              defaultProtocol: 'https://',
              toggleDownloadable: {
                mode: 'manual',
                label: 'Downloadable',
                attributes: {
                  download: 'file'
                }
              }
            }
          },
          image: {
            toolbar: [
              'imageTextAlternative',
              'imageStyle:inline',
              'imageStyle:block',
              'imageStyle:side',
              'linkImage'
            ]
          },
          table: {
            contentToolbar: [
              'tableColumn',
              'tableRow',
              'mergeTableCells',
              'tableCellProperties',
              'tableProperties'
            ]
          },
          codeBlock: {
            languages: [
              { language: 'plaintext', label: 'Plain text' },
              { language: 'c', label: 'C' },
              { language: 'cs', label: 'C#' },
              { language: 'cpp', label: 'C++' },
              { language: 'css', label: 'CSS' },
              { language: 'diff', label: 'Diff' },
              { language: 'html', label: 'HTML' },
              { language: 'java', label: 'Java' },
              { language: 'javascript', label: 'JavaScript' },
              { language: 'php', label: 'PHP' },
              { language: 'python', label: 'Python' },
              { language: 'ruby', label: 'Ruby' },
              { language: 'typescript', label: 'TypeScript' },
              { language: 'xml', label: 'XML' }
            ]
          }
        };
    }
  };

  return (
    <div className="ckeditor5-wrapper">
      <div style={{ minHeight: height }}>
        <CKEditor
          editor={DecoupledEditor}
          config={getConfig(mode)}
          data={data}
          disabled={disabled}
          onReady={editor => {
            console.log('CKEditor5 is ready to use!', editor);
            setError(null);

            // Insert the toolbar before the editable area
            const toolbarContainer = document.querySelector('#toolbar-container');
            if (toolbarContainer) {
              toolbarContainer.appendChild(editor.ui.view.toolbar.element);
            }

            // Set custom height
            const editingView = editor.editing.view;
            editingView.change(writer => {
              writer.setStyle('min-height', height, editingView.document.getRoot());
            });
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            onChange(data);
          }}
          onError={(error, { willEditorRestart }) => {
            console.error('CKEditor5 error:', error);
            setError(error.message);
            
            if (willEditorRestart) {
              console.log('Editor will restart');
            }
          }}
        />
      </div>

      {/* Error State */}
      {error && (
        <div className="alert alert-danger mt-2 d-flex align-items-center">
          <i className="ph ph-warning-circle me-2"></i>
          <div>
            <strong>Editor Error:</strong> {error}
          </div>
        </div>
      )}
    </div>
  );
};

export default CKEditor5Component;