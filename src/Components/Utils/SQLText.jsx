import CodeEditor from '@uiw/react-textarea-code-editor'

export default function SQLText(props) {
    return (
        <CodeEditor
            value={props?.value}
            name={props?.name}
            readOnly={props.editable ? false : true}
            language="sql"
        />
    )
}