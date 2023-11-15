import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import axios from "axios"

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(join(__dirname, 'dist')));

// 用于解析JSON格式的请求体
app.use(express.json());

// 用于解析URL编码的请求体（例如，来自HTML表单的数据）
app.use(express.urlencoded({ extended: true }));


app.post("/serverAxios", async (req, resp) => {
    let data = req.body;
    try {
        let res = await axios({
            method: data.method || "get",
            url: data.url,
            data: data.data || {},
            headers: data.headers || {}
        })

        resp.send(res.data)
    }catch (e) {
        resp.send(e.message)
    }
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});