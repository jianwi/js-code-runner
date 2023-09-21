import React, {useEffect, useState, useRef} from 'react'
import ReactDOM from 'react-dom/client'
import {bitable, HostContainerSize} from '@lark-base-open/js-sdk';
import {Alert, AlertProps, Button, Select, Form} from 'antd';
import axios from "axios";
import {initI18n} from './i18n'
import {useTranslation} from "react-i18next";
import * as monaco from 'monaco-editor';

// @ts-ignore
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
// @ts-ignore
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

self.MonacoEnvironment = {
    getWorker(_, label) {
        if (label === 'typescript' || label === 'javascript') {
            return new tsWorker()
        }
        return new editorWorker()
    }
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
)

function App() {
    const [load, setLoad] = useState(false);
    const [loadErr, setLoadErr] = useState<any>(null)
    useEffect(() => {
        const timer = setTimeout(() => {
            initI18n('en');
            setTimeout(() => {
                setLoadErr(<LoadErr/>)

            }, 1000)
        }, 5000)
        bitable.bridge.getLanguage().then((lang) => {
            clearTimeout(timer)
            initI18n(lang as any);
            setLoad(true);
        });
        return () => clearTimeout(timer)
    }, [])

    if (load) {
        return <LoadApp/>
    }

    return loadErr
}

function LoadErr() {
    const {t} = useTranslation();
    return <div>
        {t('load_error.1')}
        <a target='_blank' href='https://bytedance.feishu.cn/docx/HazFdSHH9ofRGKx8424cwzLlnZc'>{t('load.guide')}</a>
    </div>

}

function LoadApp() {
    const {t} = useTranslation();
    const [logs, setLogs] = useState("")
    const [errorLogs, setErrorLogs] = useState("")

    let templates = [
        {
            title: t("getActiveTable"),
            code: ["async function main(){", "    const table = await bitable.base.getActiveTable();", "    const tableName = await table.getName();", "    console.log(tableName)", "}"].join("\n")
        },
        {
            title: t("getActiveTableRecordList"),
            code: ["async function main(){", "    const table = await bitable.base.getActiveTable();", "    const {recordIdList} = await table.getRecordList();", "    console.log(recordIdList)", "}"].join("\n")
        },
        {
            title: t("getActiveTableFieldList"),
            code: ["async function main(){", "    const table = await bitable.base.getActiveTable();", "    const fields = await table.getFieldMetaList();", "    console.log(fields)", "}"].join("\n")
        },
        {
            title: t("httpExample"),
            code: ["async function main(){", "    let r = await axios.post(\"https://base-translator-api.replit.app/cell_translate\",{", "                q: \"测试脚本\",", "                from: \"zh\",", "                to: \"en\"", "            },{", "                headers:{", "                    \"Content-Type\":\"application/x-www-form-urlencoded\"", "                }", "            })", "            console.log(r.data)", "}"].join("\n")
        },
        {
            title: t("addRecord"),
            code: ["async function main(){", "   let table = await bitable.base.getActiveTable();", "    let fields = await table.getFieldMetaList();", "    let fieldId = fields[0].id;", "    await table.addRecord({", "        fields: {", `            [fieldId]: \"${t('addNewLine')}\"`, "        }", "    })", `    console.log(\"${t('success')}\")`, "}"].join("\n")
        }
    ]

    const container = useRef(null);
    const editorRef:any = useRef(null);

    useEffect(() => {
        if (!container.current) return;
        if (editorRef.current) {
            return;
        }
        let editor = monaco.editor.create(container.current, {
            value: templates[0].code,
            language: "javascript",
            minimap: {
                enabled: false
            },
            formatOnPaste: true,
            formatOnType: true,
            folding: true,
        });
        editorRef.current = editor
    }, [])


    let log = function (...args: any) {
        setLogs((prevState) => {
            return prevState + args.map((item: any) => {
                return typeof item === "object" ? JSON.stringify(item) : item
            }).join("") + "\n"
        })
    }


    return <div>
        <div>
            <Form.Item label={t("example")}>
                <Select style={{width: "100%"}}
                        onChange={(value) => {
                            editorRef.current.setValue(value)
                        }}
                        defaultValue={templates[0].code}
                >
                    {templates.map(item => {
                        return <Select.Option key={item.title} value={item.code}>{item.title}</Select.Option>
                    })
                    }
                </Select>
            </Form.Item>
        </div>

        <div style={{
            width: "100%",
            height: "190px",
            overflow: "hidden",
        }} ref={container}></div>

        <Button
            type="primary"
            style={{
                marginTop: "10px"
            }}
            onClick={() => {
            let code = editorRef.current.getValue()
            console.info("运行", code)
            setLogs("")

            let codeText = `
                console.log = log;
                
                ${code}
                
                if (typeof main === "function") {
                    main()
                }
                `

            try {
                let fn = new Function("bitable", "log", "axios", codeText)
                fn(bitable, log, axios)
            } catch (e: any) {
                setErrorLogs(e.message)
            }
        }}>{t('run')}</Button>

        <div style={{
            marginTop: "10px"
        }}></div>
        {
            logs && <div style={{
                backgroundColor: "#f5f5f5",
                padding: "5px 10px",
                width: "fit-content"
            }}>
                <pre>{logs}</pre>
            </div>
        }

        {
            errorLogs && <Alert message={errorLogs} type="error"/>
        }
    </div>
}