document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('input[type="text"]');
    let searchTimeout;

    // 搜尋功能
    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        const searchTerm = e.target.value.toLowerCase();
        
        // 使用防抖動來優化性能
        searchTimeout = setTimeout(() => {
            // 搜尋導師
            const filteredTutors = window.tutorApp.featuredTutors.filter(tutor => {
                return tutor.name.toLowerCase().includes(searchTerm) ||
                       tutor.subject.toLowerCase().includes(searchTerm) ||
                       tutor.level.toLowerCase().includes(searchTerm) ||
                       tutor.location.toLowerCase().includes(searchTerm);
            });
            
            // 搜尋個案
            const filteredCases = window.tutorApp.latestCases.filter(case_ => {
                return case_.subject.toLowerCase().includes(searchTerm) ||
                       case_.level.toLowerCase().includes(searchTerm) ||
                       case_.location.toLowerCase().includes(searchTerm) ||
                       case_.requirements.toLowerCase().includes(searchTerm);
            });

            // 更新顯示結果
            window.tutorApp.renderFeaturedTutors(filteredTutors);
            window.tutorApp.renderLatestCases(filteredCases);

            // 更新搜尋結果計數
            updateSearchResults(filteredTutors.length, filteredCases.length);
        }, 300);
    });

    // 添加搜尋建議功能
    const suggestions = [
        '數學', '英文', '中文',
        '小學', '初中', '高中',
        '九龍灣', '太古', '沙田',
        '會話', '作文', '補習',
        'DSE', '物理', '化學', '生物'
    ];

    function createSuggestionsList() {
        const suggestionContainer = document.createElement('div');
        suggestionContainer.id = 'search-suggestions';
        suggestionContainer.className = 'hidden absolute z-10 w-full bg-white border rounded-lg shadow-lg mt-1';
        searchInput.parentNode.appendChild(suggestionContainer);
        return suggestionContainer;
    }

    const suggestionContainer = createSuggestionsList();

    searchInput.addEventListener('focus', function() {
        const currentTerm = this.value.toLowerCase();
        showSuggestions(currentTerm);
    });

    function showSuggestions(term) {
        const filteredSuggestions = suggestions.filter(s => 
            s.toLowerCase().includes(term)
        ).slice(0, 5);

        if (filteredSuggestions.length > 0) {
            suggestionContainer.innerHTML = filteredSuggestions
                .map(s => `<div class="suggestion-item p-2 hover:bg-gray-100 cursor-pointer">${s}</div>`)
                .join('');
            suggestionContainer.classList.remove('hidden');
        } else {
            suggestionContainer.classList.add('hidden');
        }
    }

    // 點擊建議項目
    suggestionContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('suggestion-item')) {
            searchInput.value = e.target.textContent;
            suggestionContainer.classList.add('hidden');
            // 觸發搜尋
            searchInput.dispatchEvent(new Event('input'));
        }
    });

    // 點擊外部時隱藏建議
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !suggestionContainer.contains(e.target)) {
            suggestionContainer.classList.add('hidden');
        }
    });

    // 更新搜尋結果計數
    function updateSearchResults(tutorCount, caseCount) {
        const tutorSection = document.querySelector('#featured-tutors').parentElement;
        const caseSection = document.querySelector('#latest-cases').parentElement;

        // 更新導師區段標題
        const tutorTitle = tutorSection.querySelector('h2');
        tutorTitle.textContent = `推薦導師 (${tutorCount})`;

        // 更新個案區段標題
        const caseTitle = caseSection.querySelector('h2');
        caseTitle.textContent = `最新補習個案 (${caseCount})`;
    }
}); 