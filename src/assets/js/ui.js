
window.addEventListener("DOMContentLoaded", () => {
    uiBase.init();
});

const uiBase = {
    init() {
        // 현재 객체 내의 모든 메서드 순회
        for (const key in this) {
            if (typeof this[key] === "function" && key !== "init") {
                this[key]();
            }
        }
    },
    navToggle() {
        const header_nav_toggle = document.querySelectorAll(".header_nav_toggle");
        if (!!header_nav_toggle) {
            header_nav_toggle.forEach((item) => {
                const thisItem = item;
                const thisTarget = thisItem.querySelector(".nav_toggle_target");
                thisTarget.addEventListener("click", (e) => {
                    e.preventDefault();
                    thisItem.classList.toggle("active");
                    e.stopPropagation();
                });
            });
            document.addEventListener("click", (e) => {
                header_nav_toggle.forEach((item) => {
                    const thisItem = item;
                    const toggleTarget = thisItem.querySelector(".nav_toggle_target");
                    if (!toggleTarget.contains(e.target)) {
                        item.classList.remove("active");
                    }
                });
            });
        }
    },
    searchKeyword() {
        const marquee = document.getElementById("keywordMarquee");
        const content = marquee.querySelector(".top_search_keyword_list");

        // 텍스트 복제
        const clone = content.cloneNode(true);
        marquee.appendChild(clone);

        // 총 너비 계산
        const totalWidth = content.offsetWidth * 2 + 50;
        const speed = 100; // 픽셀당 이동 속도 (낮을수록 빠름)
        const duration = totalWidth / speed;

        // 애니메이션 시간 적용
        marquee.style.animationDuration = `${duration}s`;
    },
    searchForm() {
        const top_search_field = document.querySelector(".top_search_field");
        const top_search_input = top_search_field.querySelector(".top_search_input");
        const btn_search_reset = top_search_field.querySelector(".btn_search_reset");
        let input_value_length = 0;
        if (!!top_search_input) {
            top_search_input.addEventListener("input", (e) => {
                input_value_length = e.target.value.length;
                top_search_field.classList.toggle("active",input_value_length)
            });
        }
        if (!!btn_search_reset) {
            btn_search_reset.addEventListener("click", (e) => {
                top_search_input.focus();
                top_search_field.classList.remove("active");
            });
        }
    },
    setVhProperty() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
}


