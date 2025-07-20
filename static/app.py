from flask import Flask, request, jsonify, send_from_directory
import requests
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # 处理跨域问题

# 配置AI API
AI_API_KEY = "你的API密钥"  # 替换为实际的API密钥
AI_API_URL = "https://api.doubao.com/chat/completions"  # 替换为实际的API地址

# 静态文件路由
@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('static', path)

# AI文案生成接口
@app.route('/api/generate', methods=['POST'])
def generate_content():
    try:
        data = request.json
        prompt = data.get('prompt', '')
        
        if not prompt:
            return jsonify({"error": "请输入文案主题或需求"}), 400
        
        # 调用AI API
        response = requests.post(
            AI_API_URL,
            headers={
                "Authorization": f"Bearer {AI_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "ernie-bot",  # 根据实际使用的模型调整
                "messages": [
                    {"role": "system", "content": "你是一个专业的文案生成助手，能根据用户提供的主题或需求，生成有创意、吸引人的文案。"},
                    {"role": "user", "content": prompt}
                ],
                "max_tokens": 500
            }
        )
        
        response_data = response.json()
        
        # 处理API响应
        if response.status_code == 200 and "choices" in response_data:
            content = response_data["choices"][0]["message"]["content"]
            return jsonify({"content": content})
        else:
            error_msg = response_data.get("error", {}).get("message", "生成失败")
            return jsonify({"error": error_msg}), response.status_code
            
    except Exception as e:
        print(f"服务器错误: {str(e)}")
        return jsonify({"error": "服务器内部错误"}), 500

if __name__ == '__main__':
    # 创建static目录（如果不存在）
    if not os.path.exists('static'):
        os.makedirs('static')
    
    app.run(debug=True, host='0.0.0.0', port=5000)