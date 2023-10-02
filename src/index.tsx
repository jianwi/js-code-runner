import React, {useEffect, useState, useRef} from 'react'
import ReactDOM from 'react-dom/client'
import {bitable, HostContainerSize} from '@lark-base-open/js-sdk';
import {Alert, AlertProps, Button, Select, Form, message} from 'antd';
import axios from "axios";
import {initI18n} from './i18n'
import {useTranslation} from "react-i18next";
import * as monaco from 'monaco-editor';
import suggestion from "./suggest"

// @ts-ignore
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
// @ts-ignore
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'


function loadESModule(src: string) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.type = 'module'
        script.src = src
        script.onload = resolve
        script.onerror = reject
        document.head.appendChild(script)
    })
}

function loadModule(src: string) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = src
        script.onload = resolve
        script.onerror = reject
        document.head.appendChild(script)
    })
}



self.MonacoEnvironment = {
    getWorker(_, label) {
        if (label === 'typescript' || label === 'javascript') {
            return new tsWorker()
        }
        return new editorWorker()
    }
}
monaco.languages.typescript.javascriptDefaults.addExtraLib(suggestion, 'bitable.ts')

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
            title: t("hello world"),
            code: ["console.log(\"hello world\")","","// 加载模块",'await loadModule("https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.min.js")','$("body").append("<div>hello world，操作dom</div>")'].join("\n")
        },
        {
            title: t("getActiveTable"),
            code: ["const table = await bitable.base.getActiveTable();", "const tableName = await table.getName();", "console.log(tableName)"].join("\n")
        },
        {
            title: t("getActiveTableRecordList"),
            code: ["const table = await bitable.base.getActiveTable();", "const {recordIdList} = await table.getRecordList();", "console.log(recordIdList)"].join("\n")
        },
        {
            title: t("getActiveTableFieldList"),
            code: ["async function main(){", "    const table = await bitable.base.getActiveTable();", "    const fields = await table.getFieldMetaList();", "    console.log(fields)", "}"].join("\n")
        },
        {
            title: t("httpExample"),
            code: ["await loadModule('https://cdn.bootcdn.net/ajax/libs/axios/1.5.0/axios.min.js')","let r = await axios.post(\"https://base-translator-api.replit.app/cell_translate\",{", "                q: \"测试脚本\",", "                from: \"zh\",", "                to: \"en\"", "            },{", "                headers:{", "                    \"Content-Type\":\"application/x-www-form-urlencoded\"", "                }", "            })", "console.log(r.data)"].join("\n")
        },
        {
            title: t("addRecord"),
            code: ["async function main(){", "   let table = await bitable.base.getActiveTable();", "    let fields = await table.getFieldMetaList();", "    let fieldId = fields[0].id;", "    await table.addRecord({", "        fields: {", `            [fieldId]: \"${t('addNewLine')}\"`, "        }", "    })", `    console.log(\"${t('success')}\")`, "}"].join("\n")
        }
    ]

    let [templateCodes, setTemplateCodes] = useState(templates.map((item,index) => {
        let code = localStorage.getItem("code" + index) || item.code
        return {
            title: item.title,
            code: code
        }
    }))

    const container = useRef(null);
    const editorRef: any = useRef(null);

    const [currentCodeIndex, setCurrentCodeIndex] = useState(0)
    const [buttonStatus, setButtonStatus] = useState(false)


    useEffect(() => {
        if (!container.current) return;
        if (editorRef.current) {
            return;
        }
        let editor = monaco.editor.create(container.current, {
            value: templateCodes[currentCodeIndex].code,
            language: "javascript",
            minimap: {
                enabled: false
            },
            formatOnPaste: true,
            formatOnType: true,
            folding: true,
        });
        editorRef.current = editor

        window.onkeydown = function (e) {
            // console.log(e.ctrlKey,e.metaKey, e.keyCode)
            // 保存代码
            if ((e.ctrlKey || e.metaKey)&& e.keyCode == 83) {
                e.preventDefault()
                localStorage.setItem("code" + currentCodeIndex, editorRef.current.getValue())
                message.success(t('save_success'))
            }

        }
    }, [])

    useEffect(() => {
        if (templateCodes[currentCodeIndex].code != templates[currentCodeIndex].code) {
            // console.log(templateCodes[currentCodeIndex].code, templates[currentCodeIndex].code)
            setButtonStatus(true)
        }else {
            setButtonStatus(false)
        }
        if (editorRef.current){
            // @ts-ignore
            window.listener && window.listener.dispose()
            let code = templateCodes[currentCodeIndex].code
            editorRef.current.setValue(code)
            editorRef.current.focus()

            // @ts-ignore
            window.listener = editorRef.current.onDidChangeModelContent(() => {
                setErrorLogs("")
                setLogs("")
                // 如何和模板一样，就不保存了
                if (editorRef.current.getValue() == templates[currentCodeIndex].code) {
                    // console.log("和模板一样，不保存")
                    setButtonStatus(false)
                    return;
                }
                // 保存代码到本地
                localStorage.setItem("code" + currentCodeIndex, editorRef.current.getValue())
                setButtonStatus(true)
                templateCodes[currentCodeIndex].code = editorRef.current.getValue()
                setTemplateCodes([...templateCodes])
            })
        }
    }, [currentCodeIndex])

    let log = function (...args: any) {
        setLogs((prevState) => {
            return prevState + args.map((item: any) => {
                return typeof item === "object" ? JSON.stringify(item) : item
            }).join("") + "\n"
        })
    }


    return <div>
        <div style={{
            fontSize: "14px",
            borderLeft: "3px solid #1890ff",
            paddingLeft: "10px",
            marginBottom: "10px",
            color: "#333",
        }}>
            {t("description")}  <a target="_blank"
                                   style={{
                                       textDecoration: "none"
                                   }}
                                          href="https://lark-base-team.github.io/js-sdk-docs/">{t('js_doc')}</a>
        </div>
        <div style={{fontSize: "14px"}}>
            <Form.Item style={{height: "15px"}} label={t("example")}>
                <Select size={'small'} style={{width: "100%"}}
                        onChange={(value) => {
                            setCurrentCodeIndex(value)
                        }}
                        defaultValue={0}
                >
                    {templates.map((item,index) => {
                        return <Select.Option key={item.title} value={index}>{item.title}</Select.Option>
                    })
                    }
                </Select>
            </Form.Item>
        </div>

        <div style={{
            width: "100%",
            height: "220px",
            overflow: "hidden",
            border: "1px solid #e8e8e8"
        }} ref={container}></div>

        <Button
            type="primary"
            style={{
                marginTop: "5px"
            }}
            onClick={() => {
                let code = editorRef.current.getValue()
                console.info("运行", code)
                setLogs("")

                let codeText = `
                console.log = log;
                
                async function run(){
                    ${code}
                    
                    
                    ;if (typeof main === "function") {
                        main()
                    }
                }
                run();
                `

                try {
                    let fn = new Function("bitable", "log", "loadESModule", "loadModule", codeText)
                    fn(bitable, log, loadModule, loadESModule)
                } catch (e: any) {
                    setErrorLogs(e.message)
                }
            }}>{t('run')}</Button>

        {
            buttonStatus && <Button
                onClick={() => {
                    editorRef.current.setValue(templates[currentCodeIndex].code)
                    setButtonStatus(false)
                }}
                style={{
                marginLeft: "8px"
            }} type={'primary'} danger>{t('reset')}</Button>
        }

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
        <div style={{
            marginTop: "20px",
            fontSize: "12px",
        }}>
        </div>
    </div>
}