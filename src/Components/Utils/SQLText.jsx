import CodeEditor from '@uiw/react-textarea-code-editor'

export default function SQLText(props) {
    return (
        <CodeEditor
            value={props.value}
            readOnly="true"
            language="sql"
        />
    )
}