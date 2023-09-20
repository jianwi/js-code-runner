import React, {useEffect, useState} from 'react'
import ReactDOM from 'react-dom/client'
import {bitable, HostContainerSize} from '@lark-base-open/js-sdk';
import {Alert, AlertProps, Button, Select, Form} from 'antd';
import axios from "axios";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <LoadApp/>
    </React.StrictMode>
)

let templates = [
    {
        title: "获取多维表格名称",
        code: `async function main(){
    const table = await bitable.base.getActiveTable();
    const tableName = await table.getName();
    console.log(tableName)
}
        `
    },
    {
        title: "获取多维表格所有记录",
        code: ` async function main(){
            const table = await bitable.base.getActiveTable();
            const {recordIdList} = await table.getRecordList();
            console.log(recordIdList)
        }
    `
    },
    {
        title: "获取多维表格所有字段",
        code: ` async function main(){
            const table = await bitable.base.getActiveTable();
            const fields = await table.getFieldMetaList();
            console.log(fields)
            }`
    },
    {
        title: "http请求",
        code: `async function main(){
     let r = await axios.post("https://base-translator-api.replit.app/cell_translate",{
                q: "测试脚本",
                from: "zh",
                to: "en"
            },{
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                }
            })
            console.log(r.data)
}`
    },
    {
        title: "当前表格添加一行",
        code: `async function main(){
       let table = await bitable.base.getActiveTable();
           let fields = await table.getFieldMetaList();
           let fieldId = fields[0].id;
           await table.addRecord({
               fields: {
                   [fieldId]: "新加的一行"
               }
           })
           console.log("添加成功")
}`
    }
]

function LoadApp() {
    const [logs, setLogs] = useState("")
    const [errorLogs, setErrorLogs] = useState("")
    const [code, setCode] = useState(templates[0].code)

    let log = function (...args: any) {
        setLogs((prevState) => {
            return prevState + args.map((item: any) => {
                return typeof item === "object" ? JSON.stringify(item) : item
            }).join("") + "\n"
        })
    }

    useEffect(() => {
        const fn = async () => {


        };

        fn();
    }, []);

    return <div>
        <h5 style={{
            textAlign: "center"
        }}>js code runner</h5>

        <div>
            <Form.Item label={"示例代码"}>
                <Select style={{width: "100%"}}
                        onChange={(value) => {
                            setCode(value)
                        }}
                        defaultValue={templates[0].code}
                >
                    {templates.map(item => {
                        return <Select.Option value={item.code}>{item.title}</Select.Option>
                    })
                    }
                </Select>
            </Form.Item>
        </div>

        <div style={
            {
                display: "flex",
                alignItems: "center"
            }
        }>
      <textarea style={{
          padding: "10px"
      }}
                value={code}
                rows={10} cols={50} onChange={(res) => {
          console.info(res.target.value)
          setCode(res.target.value)
      }}>{code}</textarea>
            <div style={{marginLeft: "10px"}}></div>
            <Button onClick={() => {
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
                } catch (e) {
                    setErrorLogs(e.message)
                }
            }}>运行</Button>
        </div>

        <div style={{
            marginTop: "10px"
        }}></div>
        {
            logs && <div style={{
                backgroundColor: "#f5f5f5",
                padding: "5px 10px",
                width:"fit-content"
            }}><pre>{logs}</pre>
            </div>
        }

        {
            errorLogs && <Alert message={errorLogs} type="error"/>
        }
    </div>
}