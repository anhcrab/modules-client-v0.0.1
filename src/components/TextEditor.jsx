import { useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote',],
        [
            { list: 'ordered' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' },
        ],
        ['link', 'image', 'video',],
    ],
}

const TextEditor = ({ value, setValue, height, placeholder, type }) => {
    return (
        <ReactQuill
            theme="snow"
            value={type === 'detail' ? value.detail : value.summary}
            onChange={e => type === 'detail' ? setValue({ ...value, detail: e }): setValue({...value, summary: e})}
            modules={modules}
            style={{
                display: 'inline-block',
                width: '100%',
                height: `${height}px`,
                marginBottom: '50px',
                transition: 'all 0.3s',
            }}
            placeholder={placeholder}
        />
    );
}


export default TextEditor

