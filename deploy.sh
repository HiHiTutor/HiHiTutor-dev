#!/bin/bash

# Exit on error
set -e

# 顯示部署開始訊息
echo "開始部署 HiHiTutor..."

# 檢查環境變數文件
check_env_files() {
    local frontend_dir=$1
    if [ ! -f "$frontend_dir/.env.local" ]; then
        echo "錯誤: $frontend_dir/.env.local 文件不存在"
        echo "請確保已經設置了正確的環境變數"
        exit 1
    fi
}

# 安裝依賴並建置
build_frontend() {
    local frontend_dir=$1
    echo "正在建置 $frontend_dir..."
    cd $frontend_dir
    npm install
    npm run build
    if [ $? -ne 0 ]; then
        echo "錯誤: $frontend_dir 建置失敗"
        exit 1
    fi
    cd ..
}

# 主要部署流程
main() {
    # 檢查環境變數文件
    check_env_files "admin-frontend"
    check_env_files "user-frontend"

    # 建置前端
    build_frontend "admin-frontend"
    build_frontend "user-frontend"

    echo "建置完成！"
    echo "請使用以下命令部署到 Vercel:"
    echo "vercel admin-frontend --prod"
    echo "vercel user-frontend --prod"
}

# 執行主要部署流程
main

echo "✅ Deployment completed successfully!" 