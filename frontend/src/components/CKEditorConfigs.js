export const editorConfigs = {
  minimal: {
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
    },
    placeholder: 'Start typing...'
  },

  basic: {
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        'underline',
        '|',
        'bulletedList',
        'numberedList',
        '|',
        'link',
        'blockQuote',
        '|',
        'undo',
        'redo'
      ]
    },
    heading: {
      options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
      ]
    },
    placeholder: 'Enter your content...'
  },

  full: {
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        '|',
        'fontSize',
        'fontColor',
        'fontBackgroundColor',
        '|',
        'bulletedList',
        'numberedList',
        'todoList',
        '|',
        'outdent',
        'indent',
        '|',
        'link',
        'blockQuote',
        'insertTable',
        '|',
        'undo',
        'redo'
      ],
      shouldNotGroupWhenFull: true
    },
    heading: {
      options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
        { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' }
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
        21
      ]
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
        defaultProtocol: 'https://'
      }
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells'
      ]
    },
    placeholder: 'Write your amazing content here...'
  }
};