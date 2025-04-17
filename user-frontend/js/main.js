document.addEventListener('DOMContentLoaded', function() {
    // 模擬推薦導師數據
    const featuredTutors = [
        {
            id: 1,
            name: '王老師',
            subject: '數學',
            level: '小學至初中',
            price: '$200/小時',
            rating: 4.8,
            experience: '5年',
            location: '九龍灣',
            status: '可補習'
        },
        {
            id: 2,
            name: '陳老師',
            subject: '英文',
            level: '小學至高中',
            price: '$250/小時',
            rating: 4.9,
            experience: '8年',
            location: '太古',
            status: '可補習'
        },
        {
            id: 3,
            name: '李老師',
            subject: '中文',
            level: '小學至初中',
            price: '$180/小時',
            rating: 4.7,
            experience: '3年',
            location: '沙田',
            status: '可補習'
        },
        {
            id: 4,
            name: '張老師',
            subject: '物理',
            level: '高中',
            price: '$300/小時',
            rating: 4.9,
            experience: '6年',
            location: '銅鑼灣',
            status: '可補習'
        },
        {
            id: 5,
            name: '黃老師',
            subject: '化學',
            level: '高中',
            price: '$280/小時',
            rating: 4.8,
            experience: '4年',
            location: '觀塘',
            status: '可補習'
        },
        {
            id: 6,
            name: '林老師',
            subject: '生物',
            level: '高中',
            price: '$260/小時',
            rating: 4.7,
            experience: '5年',
            location: '將軍澳',
            status: '可補習'
        }
    ];

    // 模擬最新個案數據
    const latestCases = [
        {
            id: 1,
            subject: '數學補習',
            level: '小學四年級',
            location: '九龍灣',
            budget: '$150-200/小時',
            frequency: '每週一次',
            postDate: '2024-04-15',
            requirements: '有耐心，善於解釋',
            status: '急需'
        },
        {
            id: 2,
            subject: '英文會話',
            level: '初中二年級',
            location: '太古',
            budget: '$200-250/小時',
            frequency: '每週兩次',
            postDate: '2024-04-14',
            requirements: '需要外籍教師或高級會話能力',
            status: '急需'
        },
        {
            id: 3,
            subject: '中文作文',
            level: '小學六年級',
            location: '沙田',
            budget: '$180-220/小時',
            frequency: '每週一次',
            postDate: '2024-04-13',
            requirements: '需要有寫作比賽經驗',
            status: '急需'
        },
        {
            id: 4,
            subject: 'DSE 物理',
            level: '中六',
            location: '銅鑼灣',
            budget: '$250-300/小時',
            frequency: '每週兩次',
            postDate: '2024-04-13',
            requirements: '有補習經驗，精通DSE考試',
            status: '急需'
        },
        {
            id: 5,
            subject: 'DSE 化學',
            level: '中五',
            location: '觀塘',
            budget: '$220-280/小時',
            frequency: '每週一次',
            postDate: '2024-04-12',
            requirements: '有補習經驗，善於教授實驗題',
            status: '急需'
        },
        {
            id: 6,
            subject: 'DSE 生物',
            level: '中四',
            location: '將軍澳',
            budget: '$200-260/小時',
            frequency: '每週一次',
            postDate: '2024-04-12',
            requirements: '有補習經驗，能用圖解方式教學',
            status: '急需'
        }
    ];

    // 熱門科目數據（這裡可以替換為後台數據）
    const hotTopics = [
        { name: '數學補習', count: 1250 },
        { name: '英文會話', count: 980 },
        { name: '普通話', count: 850 },
        { name: 'DSE 物理', count: 720 },
        { name: '鋼琴課程', count: 680 }
    ];

    // 渲染推薦導師
    function renderFeaturedTutors(tutors = featuredTutors) {
        const container = document.getElementById('featured-tutors');
        container.innerHTML = ''; // 清空現有內容
        tutors.forEach(tutor => {
            const tutorCard = document.createElement('div');
            tutorCard.className = 'bg-white border-2 border-green-500 rounded-lg p-4 relative';
            tutorCard.innerHTML = `
                <div class="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    ${tutor.status}
                </div>
                <div class="flex items-center mb-3">
                    <div class="w-12 h-12 bg-gray-200 rounded-full mr-3"></div>
                    <div>
                        <h3 class="font-bold">${tutor.name}</h3>
                        <div class="text-sm text-gray-600">${tutor.location}</div>
                    </div>
                </div>
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-600">科目：</span>
                        <span>${tutor.subject}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">年級：</span>
                        <span>${tutor.level}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">經驗：</span>
                        <span>${tutor.experience}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">收費：</span>
                        <span class="font-bold text-green-600">${tutor.price}</span>
                    </div>
                </div>
                <button class="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors">
                    聯絡導師
                </button>
            `;
            container.appendChild(tutorCard);
        });
    }

    // 渲染最新個案
    function renderLatestCases(cases = latestCases) {
        const container = document.getElementById('latest-cases');
        container.innerHTML = ''; // 清空現有內容
        cases.forEach(case_ => {
            const caseCard = document.createElement('div');
            caseCard.className = 'bg-white border-2 border-orange-500 rounded-lg p-4 relative';
            caseCard.innerHTML = `
                <div class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    ${case_.status}
                </div>
                <h3 class="font-bold text-lg mb-2">${case_.subject}</h3>
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-600">年級：</span>
                        <span>${case_.level}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">地區：</span>
                        <span>${case_.location}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">時薪：</span>
                        <span class="font-bold text-orange-600">${case_.budget}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">頻率：</span>
                        <span>${case_.frequency}</span>
                    </div>
                    <div class="mt-2">
                        <span class="text-gray-600">要求：</span>
                        <p class="text-gray-800 mt-1">${case_.requirements}</p>
                    </div>
                </div>
                <button class="mt-4 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors">
                    申請教授
                </button>
            `;
            container.appendChild(caseCard);
        });
    }

    // 渲染熱門科目
    function renderHotTopics() {
        const hotTopicsContainer = document.getElementById('hotTopics');
        if (!hotTopicsContainer) return;

        const topicsHTML = hotTopics
            .sort((a, b) => b.count - a.count)
            .map(topic => `
                <a href="#" class="hot-topic-tag">
                    ${topic.name}
                </a>
            `)
            .join('');

        hotTopicsContainer.innerHTML = topicsHTML;
    }

    // 初始化頁面
    renderFeaturedTutors();
    renderLatestCases();
    renderHotTopics();

    // 處理"顯示更多"按鈕點擊事件
    document.querySelectorAll('button').forEach(button => {
        if (button.textContent === '顯示更多') {
            button.addEventListener('click', function() {
                const parentSection = this.closest('div').parentElement;
                if (parentSection.querySelector('#featured-tutors')) {
                    window.location.href = '/tutors';
                } else if (parentSection.querySelector('#latest-cases')) {
                    window.location.href = '/cases';
                }
            });
        }
    });

    // 導出函數供其他模組使用
    window.tutorApp = {
        featuredTutors,
        latestCases,
        renderFeaturedTutors,
        renderLatestCases
    };
}); 