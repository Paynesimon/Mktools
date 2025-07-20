// 监听输入字数
const inputElement = document.getElementById('input');
const wordCountElement = document.getElementById('word-count');

inputElement.addEventListener('input', function() {
    const length = this.value.length;
    wordCountElement.textContent = `${length}/200`;
    
    // 超过字数时显示警告
    if (length > 200) {
        wordCountElement.style.color = '#e74c3c';
        this.value = this.value.substring(0, 200);
        wordCountElement.textContent = '200/200';
    } else {
        wordCountElement.style.color = '#7f8c8d';
    }
});

async function generate() {
    const input = inputElement.value.trim();
    const resultElement = document.getElementById('result');
    const generateBtn = document.getElementById('generate-btn');
    
    // 输入验证
    if (!input) {
        resultElement.textContent = '请输入文案主题或需求';
        resultElement.classList.add('error');
        return;
    }
    
    // 准备生成
    resultElement.textContent = '';
    resultElement.classList.remove('error');
    generateBtn.disabled = true;
    generateBtn.textContent = '生成中...';
    resultElement.innerHTML = '<span class="loading"></span> 正在生成文案，请稍候...';
    
    try {
        // 调用后端API
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: input })
        });
        
        const data = await response.json();
        
        if (response.ok && data.content) {
            // 成功生成文案
            resultElement.textContent = data.content;
            // 为文案添加适当的换行
            resultElement.innerHTML = resultElement.textContent.replace(/\n/g, '<br>');
        } else {
            // 处理API返回的错误
            resultElement.textContent = data.error || '生成失败，请尝试其他主题';
            resultElement.classList.add('error');
        }
    } catch (error) {
        // 处理网络错误
        console.error('生成错误:', error);
        resultElement.textContent = '网络错误，请检查连接后重试';
        resultElement.classList.add('error');
    } finally {
        // 恢复按钮状态
        generateBtn.disabled = false;
        generateBtn.textContent = '生成文案';
    }
}